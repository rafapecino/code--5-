import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { Pool } from '@neondatabase/serverless';

// Esquema de validación
const questionSchema = z.object({
  question: z.string().min(10, 'La pregunta debe tener al menos 10 caracteres').max(500, 'La pregunta no puede tener más de 500 caracteres'),
  userName: z.string().optional(),
});

// POST: Guardar nueva pregunta
export async function POST(req: NextRequest) {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  try {
    const body = await req.json();
    const validation = questionSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: validation.error.format() }, { status: 400 });
    }

    const { question, userName } = validation.data;
    const finalUserName = userName || 'Anónimo';

    // Guardar en Neon
    await pool.query(
      'INSERT INTO questions (question_text, user_name) VALUES ($1, $2)',
      [question, finalUserName]
    );

    return NextResponse.json({ message: 'Pregunta enviada con éxito' }, { status: 201 });

  } catch (error) {
    console.error('Error POST questions:', error);
    return NextResponse.json({ error: 'Error al enviar la pregunta' }, { status: 500 });
  } finally {
    await pool.end();
  }
}

// GET: Leer preguntas no respondidas
export async function GET() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  try {
    // Seleccionamos solo las NO respondidas, ordenadas por fecha (más recientes primero)
    const result = await pool.query(`
      SELECT id, question_text as question, user_name as "userName", created_at as "createdAt", is_answered as answered
      FROM questions 
      WHERE is_answered = FALSE 
      ORDER BY created_at DESC
    `);

    return NextResponse.json(result.rows);

  } catch (error) {
    console.error('Error GET questions:', error);
    // Devolver array vacío en caso de error para no romper el frontend
    return NextResponse.json([]);
  } finally {
    await pool.end();
  }
}
