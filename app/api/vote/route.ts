import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { Pool } from '@neondatabase/serverless';

// Esquema de validación
const voteSchema = z.object({
  pollId: z.number(),
  optionId: z.number(),
  // Opcional: Si quieres guardar el texto de la opción también
  optionText: z.string().optional() 
});

export async function POST(req: NextRequest) {
  // Conexión a Neon usando la variable de entorno DATABASE_URL
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  try {
    const body = await req.json();
    const validation = voteSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 });
    }

    const { pollId, optionId } = validation.data;
    
    // Obtener IP del usuario para evitar votos dobles
    const ip = req.headers.get('x-forwarded-for') ?? 'unknown';

    // 1. Comprobar si esta IP ya ha votado en esta encuesta
    // (Asumiendo que guardamos poll_id e ip en la base de datos)
    const checkVote = await pool.query(
      'SELECT id FROM votes WHERE ip_address = $1 AND poll_id = $2',
      [ip, pollId]
    );

    if (checkVote.rows.length > 0) {
       return NextResponse.json({ error: 'Ya has votado en esta encuesta' }, { status: 403 });
    }

    // 2. Guardar el voto
    // Necesitamos insertar en la tabla 'votes'. 
    // Asegúrate de tener estas columnas en tu tabla Neon: poll_id, option_id, ip_address
    await pool.query(
      'INSERT INTO votes (poll_id, option_id, ip_address) VALUES ($1, $2, $3)',
      [pollId, optionId, ip]
    );

    // 3. (Opcional) Deberías devolver los resultados actualizados.
    // Esto requiere hacer un SELECT COUNT... GROUP BY option_id
    // Por ahora devolvemos éxito para que no de error.
    return NextResponse.json({ success: true, message: "Voto registrado" });

  } catch (error) {
    console.error('Error en base de datos:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  } finally {
    // Cerrar conexión (importante en serverless)
    await pool.end();
  }
}
