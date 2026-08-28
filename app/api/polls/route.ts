export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { Pool } from "@neondatabase/serverless";
import { ENCUESTAS_ACTIVAS } from "@/lib/polls-data";

// La definición vive en lib/polls-data para que /api/vote valide contra
// exactamente las mismas opciones que se muestran.
const POLLS_DATA = ENCUESTAS_ACTIVAS;

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
