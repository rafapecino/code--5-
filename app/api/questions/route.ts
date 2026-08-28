import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Pool } from "@neondatabase/serverless";
import { containsProfanity } from "@/lib/profanity";
import { comprobarLimite, ipDe } from "@/lib/rate-limit";

// Esquema de validación
const questionSchema = z.object({
  question: z
    .string()
    .min(10, "La pregunta debe tener al menos 10 caracteres")
    .max(500, "La pregunta no puede tener más de 500 caracteres"),
  userName: z.string().optional(),
});

/** Días que se conserva una pregunta antes de borrarse sola. */
const TTL_DIAS = Number(process.env.QUESTIONS_TTL_DAYS ?? 15);

/**
 * Preguntas más recientes que nunca se borran por antigüedad. Evita que el
 * debate se quede vacío si pasa una temporada sin participación: aunque todas
 * hayan caducado, siempre quedan estas a la vista.
 */
const MINIMO_A_CONSERVAR = Number(process.env.QUESTIONS_KEEP_LAST ?? 5);

/**
 * Borra las preguntas caducadas, salvo las N más recientes.
 *
 * Se ejecuta al leer el listado en vez de con un cron: la sección se visita a
 * diario, así que la limpieza ocurre sola y no hay que mantener un job aparte.
 * Nunca hace fallar la petición: si el borrado da error, se registra y se
 * devuelven las preguntas igualmente.
 */
async function limpiarCaducadas(pool: Pool) {
  if (!Number.isFinite(TTL_DIAS) || TTL_DIAS <= 0) return;
  try {
    const { rowCount } = await pool.query(
      `DELETE FROM questions
        WHERE created_at < NOW() - ($1 || ' days')::interval
          -- Una pregunta contestada por Manuel es contenido del canal: no
          -- caduca, para no tirar la respuesta con ella.
          AND answer_text IS NULL
          AND id NOT IN (
            SELECT id FROM questions ORDER BY created_at DESC LIMIT $2
          )`,
      [TTL_DIAS, MINIMO_A_CONSERVAR],
    );
    if (rowCount) {
      console.log(`Preguntas caducadas borradas: ${rowCount}`);
    }
  } catch (error) {
    console.error("Error limpiando preguntas caducadas:", error);
  }
}

/**
 * Freno a la fuerza bruta sobre el token: 10 intentos fallidos por IP cada
 * 15 minutos. Sin esto, el token se podía probar sin límite.
 */
function adminPermitido(req: NextRequest): boolean {
  return comprobarLimite(`admin:${ipDe(req)}`, 10, 900).permitido;
}

/** Comparación en tiempo constante, para no filtrar el token carácter a carácter. */
function tokenValido(recibido: string | null): boolean {
  const esperado = process.env.ADMIN_TOKEN;
  // Sin ADMIN_TOKEN configurado, el borrado manual queda desactivado.
  if (!esperado || !recibido) return false;
  if (recibido.length !== esperado.length) return false;
  let diff = 0;
  for (let i = 0; i < esperado.length; i++) {
    diff |= esperado.charCodeAt(i) ^ recibido.charCodeAt(i);
  }
  return diff === 0;
}

// POST: Guardar nueva pregunta
export async function POST(req: NextRequest) {
  // Sin esto, un script podía llenar el debate con cientos de preguntas.
  const limite = comprobarLimite(`preguntas:${ipDe(req)}`, 3, 600);
  if (!limite.permitido) {
    return NextResponse.json(
      {
        error: {
          question: {
            _errors: [
              "Has enviado varias preguntas seguidas. Espera unos minutos antes de mandar otra.",
            ],
          },
        },
      },
      { status: 429, headers: { "Retry-After": String(limite.reintentarEn) } },
    );
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  try {
    const body = await req.json();
    const validation = questionSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.format() },
        { status: 400 },
      );
    }

    const { question, userName } = validation.data;

    // Filtro de contenido ofensivo: no guardamos preguntas ni nombres con
    // lenguaje obsceno/ofensivo. Se rechaza antes de tocar la base de datos.
    if (containsProfanity(question) || containsProfanity(userName || "")) {
      return NextResponse.json(
        {
          error: {
            question: {
              _errors: [
                "Tu mensaje contiene lenguaje ofensivo y no se puede publicar. Reformúlalo, por favor.",
              ],
            },
          },
        },
        { status: 400 },
      );
    }

    const finalUserName = userName || "Anónimo";

    // Guardar en Neon
    await pool.query(
      "INSERT INTO questions (question_text, user_name) VALUES ($1, $2)",
      [question, finalUserName],
    );

    return NextResponse.json(
      { message: "Pregunta enviada con éxito" },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error POST questions:", error);
    return NextResponse.json(
      { error: "Error al enviar la pregunta" },
      { status: 500 },
    );
  } finally {
    await pool.end();
  }
}

// GET: Leer preguntas no respondidas
export async function GET() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  try {
    await limpiarCaducadas(pool);

    // Seleccionamos solo las NO respondidas, ordenadas por fecha (más recientes primero)
    const result = await pool.query(`
      SELECT id, question_text as question, user_name as "userName", created_at as "createdAt",
             is_answered as answered, answer_text as answer, answered_at as "answeredAt"
      FROM questions
      WHERE is_answered = FALSE
      ORDER BY created_at DESC
    `);

    // Red de seguridad: ocultamos cualquier pregunta/nombre ofensivo que
    // pudiera haberse colado antes de existir el filtro.
    const safe = result.rows.filter(
      (r: { question?: string; userName?: string }) =>
        !containsProfanity(r.question || "") &&
        !containsProfanity(r.userName || ""),
    );

    return NextResponse.json(safe);
  } catch (error) {
    console.error("Error GET questions:", error);
    // Devolver array vacío en caso de error para no romper el frontend
    return NextResponse.json([]);
  } finally {
    await pool.end();
  }
}

/**
 * DELETE: borrado manual de una pregunta concreta.
 * Requiere la cabecera `x-admin-token` con el valor de ADMIN_TOKEN.
 */
export async function DELETE(req: NextRequest) {
  if (!adminPermitido(req)) {
    return NextResponse.json({ error: "Demasiados intentos" }, { status: 429 });
  }
  if (!tokenValido(req.headers.get("x-admin-token"))) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const id = Number(new URL(req.url).searchParams.get("id"));
  if (!Number.isInteger(id) || id <= 0) {
    return NextResponse.json({ error: "Id no válido" }, { status: 400 });
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  try {
    const { rowCount } = await pool.query("DELETE FROM questions WHERE id = $1", [id]);
    if (!rowCount) {
      return NextResponse.json({ error: "La pregunta ya no existe" }, { status: 404 });
    }
    return NextResponse.json({ deleted: id });
  } catch (error) {
    console.error("Error DELETE question:", error);
    return NextResponse.json({ error: "No se pudo borrar" }, { status: 500 });
  } finally {
    await pool.end();
  }
}

/**
 * PATCH: publica (o edita) la respuesta de Manuel Pecino a una pregunta.
 * Enviar `answer` vacío retira la respuesta. Requiere `x-admin-token`.
 *
 * Responder no marca la pregunta como respondida en `is_answered`: esa bandera
 * la oculta del listado, y aquí lo que queremos justo es lo contrario, que la
 * respuesta se vea debajo de la pregunta.
 */
export async function PATCH(req: NextRequest) {
  if (!adminPermitido(req)) {
    return NextResponse.json({ error: "Demasiados intentos" }, { status: 429 });
  }
  if (!tokenValido(req.headers.get("x-admin-token"))) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const id = Number(new URL(req.url).searchParams.get("id"));
  if (!Number.isInteger(id) || id <= 0) {
    return NextResponse.json({ error: "Id no válido" }, { status: 400 });
  }

  let answer: string;
  try {
    answer = String((await req.json())?.answer ?? "").trim();
  } catch {
    return NextResponse.json({ error: "Cuerpo no válido" }, { status: 400 });
  }

  if (answer.length > 1000) {
    return NextResponse.json(
      { error: "La respuesta no puede pasar de 1000 caracteres" },
      { status: 400 },
    );
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  try {
    const { rowCount } = await pool.query(
      `UPDATE questions
          SET answer_text = $2,
              answered_at = CASE WHEN $2::text IS NULL THEN NULL ELSE NOW() END
        WHERE id = $1`,
      [id, answer === "" ? null : answer],
    );
    if (!rowCount) {
      return NextResponse.json(
        { error: "La pregunta ya no existe" },
        { status: 404 },
      );
    }
    return NextResponse.json({ id, answer: answer === "" ? null : answer });
  } catch (error) {
    console.error("Error PATCH question:", error);
    return NextResponse.json(
      { error: "No se pudo guardar la respuesta" },
      { status: 500 },
    );
  } finally {
    await pool.end();
  }
}
