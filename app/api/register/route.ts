import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, Prisma } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const photoFile = formData.get("photo") as File;

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Nome, email e senha são obrigatórios" },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let photoBuffer: Buffer | null = null;

    if (photoFile) {
      const arrayBuffer = await photoFile.arrayBuffer();
      photoBuffer = Buffer.from(arrayBuffer);
    }

    const user = await prisma.users.create({
      data: {
        name,
        email,
        password: hashedPassword,
        photo: photoBuffer,
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
