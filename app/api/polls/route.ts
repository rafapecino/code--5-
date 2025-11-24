import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const pollsFilePath = path.join(process.cwd(), 'data', 'polls.json');

export async function GET() {
  try {
    const fileContent = await fs.readFile(pollsFilePath, 'utf-8');
    const polls = JSON.parse(fileContent);
    const activePoll = polls.find(p => p.status === 'open');

    if (!activePoll) {
      return NextResponse.json({ error: 'No hay encuestas activas' }, { status: 404 });
    }

    return NextResponse.json([activePoll]);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al obtener la encuesta' }, { status: 500 });
  }
}
