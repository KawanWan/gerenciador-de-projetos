import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { projectId, name, description, status, userId } =
      await request.json();

    if (!projectId || !name || !description || !status) {
      return NextResponse.json({ message: "Dados inválidos" }, { status: 400 });
    }

    const newTask = await prisma.tasks.create({
      data: {
        projectId,
        name,
        description,
        status,
        dueDate: new Date(),
        userId: userId || undefined,
      },
    });

    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    console.error("Error adding task:", error);
    return NextResponse.json(
      { message: "Erro ao adicionar tarefa" },
      { status: 500 },
    );
  }
}
