import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import fs from 'fs/promises';
import path from 'path';

const questionsFilePath = path.join(process.cwd(), 'data', 'questions.json');

const questionSchema = z.object({
  question: z.string().min(10, 'La pregunta debe tener al menos 10 caracteres').max(500, 'La pregunta no puede tener más de 500 caracteres'),
  userName: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = questionSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: validation.error.format() }, { status: 400 });
    }

    const { question, userName } = validation.data;

    let questions = [];
    try {
      const fileContent = await fs.readFile(questionsFilePath, 'utf-8');
      questions = JSON.parse(fileContent);
    } catch (error) {
      // If the file doesn't exist or is empty, we'll start with an empty array
    }

    const newQuestion = {
      id: Date.now(),
      question,
      userName: userName || 'Anónimo',
      createdAt: new Date().toISOString(),
      answered: false,
    };

    questions.push(newQuestion);

    await fs.writeFile(questionsFilePath, JSON.stringify(questions, null, 2));

    return NextResponse.json({ message: 'Pregunta enviada con éxito' }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al enviar la pregunta' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const fileContent = await fs.readFile(questionsFilePath, 'utf-8');
    const questions = JSON.parse(fileContent);
    const unansweredQuestions = questions.filter(q => !q.answered);
    return NextResponse.json(unansweredQuestions);
  } catch (error) {
    return NextResponse.json([]);
  }
}
