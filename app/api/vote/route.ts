import { NextRequest, NextResponse } from 'next/server';
import { Pool } from '@neondatabase/serverless';

export async function POST(req: NextRequest) {
  // 1. Conectar
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  try {
    const body = await req.json();
    // Logs para ver qué llega (míralo en Vercel Logs)
    console.log("Recibido voto:", body);

    const { pollId, optionId } = body;
    const ip = req.headers.get('x-forwarded-for') ?? 'unknown';

    // 2. Guardar directamente (sin comprobaciones complejas por ahora)
    // Asegúrate de que tu tabla en Neon tiene estas columnas: poll_id, option_id, ip_address
    const query = 'INSERT INTO votes (poll_id, option_id, ip_address) VALUES ($1, $2, $3)';
    const values = [pollId, optionId, ip];

    await pool.query(query, values);

    return NextResponse.json({ success: true });

  } catch (error: any) {
    // Este log es clave: te dirá en Vercel Logs qué falla exactamente
    console.error('ERROR SQL:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    await pool.end();
  }
}
