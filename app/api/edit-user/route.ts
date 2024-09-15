import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function PUT(req: NextRequest) {
  try {
    const formData = await req.formData();

    const id = Number(formData.get("id"));
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const passwordConfirm = formData.get("passwordConfirm") as string;
    const photoFile = formData.get("photo") as File;

    if (isNaN(id) || !name || !email) {
      return NextResponse.json(
        { message: "ID, nome e e-mail são obrigatórios" },
        { status: 400 },
      );
    }

    const updateData: {
      name?: string;
      email?: string;
      password?: string;
      photo?: Buffer | null;
    } = {
      name,
      email,
    };

    if (password) {
      if (password !== passwordConfirm) {
        return NextResponse.json(
          { message: "As senhas não coincidem!" },
          { status: 400 },
        );
      }
      updateData.password = await bcrypt.hash(password, 10);
    }

    let photoBuffer: Buffer | null = null;
    if (photoFile) {
      const arrayBuffer = await photoFile.arrayBuffer();
      photoBuffer = Buffer.from(arrayBuffer);
      updateData.photo = photoBuffer;
    }

    const updatedUser = await prisma.users.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error("Erro interno do servidor:", error);

    return NextResponse.json(
      { message: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
