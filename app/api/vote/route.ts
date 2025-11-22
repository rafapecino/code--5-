import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { z } from 'zod';

const pollsFilePath = path.join(process.cwd(), 'data', 'polls.json');
const votedIpsFilePath = path.join(process.cwd(), 'data', 'voted-ips.json');

const voteSchema = z.object({
  pollId: z.number(),
  optionId: z.number(),
});

async function getVotedIps(): Promise<Record<string, number[]>> {
  try {
    const fileContent = await fs.readFile(votedIpsFilePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    return {};
  }
}

async function saveVotedIps(votedIps: Record<string, number[]>) {
  await fs.writeFile(votedIpsFilePath, JSON.stringify(votedIps, null, 2));
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') ?? req.ip ?? 'unknown';
    
    const body = await req.json();
    const validation = voteSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: validation.error.format() }, { status: 400 });
    }

    const { pollId, optionId } = validation.data;

    const votedIps = await getVotedIps();
    if (votedIps[ip]?.includes(pollId)) {
      return NextResponse.json({ error: 'Ya has votado en esta encuesta.' }, { status: 403 });
    }

    const fileContent = await fs.readFile(pollsFilePath, 'utf-8');
    let polls = JSON.parse(fileContent);

    const pollIndex = polls.findIndex(p => p.id === pollId);
    if (pollIndex === -1) {
      return NextResponse.json({ error: 'Encuesta no encontrada' }, { status: 404 });
    }

    const poll = polls[pollIndex];
    const optionIndex = poll.options.findIndex(o => o.id === optionId);
    if (optionIndex === -1) {
      return NextResponse.json({ error: 'Opción no encontrada' }, { status: 404 });
    }

    polls[pollIndex].options[optionIndex].votes += 1;

    await fs.writeFile(pollsFilePath, JSON.stringify(polls, null, 2));

    if (!votedIps[ip]) {
      votedIps[ip] = [];
    }
    votedIps[ip].push(pollId);
    await saveVotedIps(votedIps);

    return NextResponse.json(polls[pollIndex]);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al procesar el voto' }, { status: 500 });
  }
}
