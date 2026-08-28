export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { Pool } from "@neondatabase/serverless";

/**
 * Encuesta activa.
 *
 * Los votos viven en la tabla `votes` referenciados por `poll_id`, así que
 * para cerrar una encuesta y abrir otra basta con subir el `id`: los votos de
 * la anterior se conservan en la base de datos como histórico, pero dejan de
 * contarse aquí y el recuento arranca de cero. El navegador también recuerda
 * el voto por `poll_id`, de modo que quien ya votó la anterior puede votar
 * esta.
 *
 * Historial:
 *   id 1 — cerrada (Márquez / Bagnaia / Martín / Acosta), 457 votos.
 */
const POLLS_DATA = [
  {
    id: 2,
    question: "¿Quién ganará el campeonato 2026?",
    options: [
      { id: 1, text: "Jorge Martín", votes: 0 },
      { id: 2, text: "Ai Ogura", votes: 0 },
      { id: 3, text: "Marc Márquez", votes: 0 },
      { id: 4, text: "Di Giannantonio", votes: 0 },
      { id: 5, text: "Raúl Fernández", votes: 0 },
    ],
  },
];

export async function GET() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  try {
    // Solo contamos los votos de las encuestas que siguen activas.
    const activeIds = POLLS_DATA.map((p) => p.id);
    const result = await pool.query(
      `SELECT poll_id, option_id, COUNT(*)::int AS count
         FROM votes
        WHERE poll_id = ANY($1::int[])
        GROUP BY poll_id, option_id`,
      [activeIds],
    );

    const polls = POLLS_DATA.map((poll) => ({
      ...poll,
      options: poll.options.map((option) => {
        const row = result.rows.find(
          (r) => Number(r.poll_id) === poll.id && Number(r.option_id) === option.id,
        );
        return { ...option, votes: row ? Number(row.count) : 0 };
      }),
    }));

    return NextResponse.json(polls);
  } catch (error) {
    console.error("Error fetching polls:", error);
    // Si la base de datos falla, al menos se muestra la encuesta a cero.
    return NextResponse.json(POLLS_DATA);
  } finally {
    await pool.end();
  }
}
