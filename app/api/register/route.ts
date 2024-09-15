import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, Prisma } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, photo } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Nome, email e senha são obrigatórios" },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.users.create({
      data: {
        name,
        email,
        password: hashedPassword,
        photo,
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error("Erro interno do servidor:", error);

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { message: "Email já está em uso" },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { message: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
