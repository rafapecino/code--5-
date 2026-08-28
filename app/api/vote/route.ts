import { NextRequest, NextResponse } from "next/server";
import { Pool } from "@neondatabase/serverless";
import { z } from "zod";
import { comprobarLimite, ipDe } from "@/lib/rate-limit";
import { ENCUESTAS_ACTIVAS } from "@/lib/polls-data";

/**
 * Registrar un voto.
 *
 * Antes esta ruta insertaba en la base de datos cualquier cosa que le
 * llegara: se podía votar en bucle sin límite y con `pollId`/`optionId`
 * inventados, lo que permitía falsear el resultado y llenar la tabla de
 * basura. Ahora se valida contra las encuestas reales y se comprueba que esa
 * IP no haya votado ya.
 */
const esquema = z.object({
  pollId: z.number().int().positive(),
  optionId: z.number().int().positive(),
});

export async function POST(req: NextRequest) {
  const ip = ipDe(req);

  // Freno grueso: aunque cambie de encuesta, nadie dispara 20 votos seguidos.
  const limite = comprobarLimite(`vote:${ip}`, 20, 3600);
  if (!limite.permitido) {
    return NextResponse.json(
      { error: "Demasiados votos seguidos. Inténtalo más tarde." },
      { status: 429, headers: { "Retry-After": String(limite.reintentarEn) } },
    );
  }

  let datos: z.infer<typeof esquema>;
  try {
    datos = esquema.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "Datos no válidos" }, { status: 400 });
  }

  // La opción tiene que existir de verdad en una encuesta abierta.
  const encuesta = ENCUESTAS_ACTIVAS.find((p) => p.id === datos.pollId);
  const opcion = encuesta?.options.find((o) => o.id === datos.optionId);
  if (!encuesta || !opcion) {
    return NextResponse.json(
      { error: "Esa encuesta o esa opción no existen" },
      { status: 400 },
    );
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  try {
    // Un voto por IP y encuesta. No es infalible (IPs compartidas, móviles que
    // rotan), pero corta el voto repetido desde el mismo sitio.
    const yaVoto = await pool.query(
      "SELECT 1 FROM votes WHERE poll_id = $1 AND ip_address = $2 LIMIT 1",
      [datos.pollId, ip],
    );
    if (yaVoto.rowCount) {
      return NextResponse.json(
        { error: "Ya has votado en esta encuesta" },
        { status: 403 },
      );
    }

    await pool.query(
      "INSERT INTO votes (poll_id, option_id, ip_address) VALUES ($1, $2, $3)",
      [datos.pollId, datos.optionId, ip],
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error registrando voto:", error);
    // Sin detalles del error al cliente: no damos pistas sobre la base de datos.
    return NextResponse.json(
      { error: "No se pudo registrar el voto" },
      { status: 500 },
    );
  } finally {
    await pool.end();
  }
}
