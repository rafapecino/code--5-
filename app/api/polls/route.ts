export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { Pool } from '@neondatabase/serverless';

const POLLS_DATA = [
  {
    id: 1,
    question: "¿Quién ganará el campeonato 2025?",
    options: [
      { id: 1, text: "Marc Márquez", votes: 0 },
      { id: 2, text: "Pecco Bagnaia", votes: 0 },
      { id: 3, text: "Jorge Martín", votes: 0 },
      { id: 4, text: "Pedro Acosta", votes: 0 }
    ]
  }
];

export async function GET() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  try {
    // Consulta a base de datos
    const result = await pool.query(`
      SELECT poll_id, option_id, COUNT(*) as count 
      FROM votes 
      GROUP BY poll_id, option_id
    `);
    
    // LOG PARA DEPURAR EN VERCEL (Mira esto en los logs si sigue fallando)
    console.log("Votos encontrados en DB:", result.rows);

    const polls = POLLS_DATA.map(poll => {
      const newOptions = poll.options.map(option => {
        // CORRECCIÓN AQUÍ: Usar Number() para asegurar que comparamos números
        const dbVote = result.rows.find(r => 
          Number(r.poll_id) === poll.id && Number(r.option_id) === option.id
        );
        
        return {
          ...option,
          votes: dbVote ? parseInt(dbVote.count) : 0
        };
      });
      return { ...poll, options: newOptions };
    });

    return NextResponse.json(polls);

  } catch (error) {
    console.error('Error fetching polls:', error);
    return NextResponse.json(POLLS_DATA); 
  } finally {
    await pool.end();
  }
}
