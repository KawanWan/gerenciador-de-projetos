import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import prisma from "../../../lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email e senha são obrigatórios" },
        { status: 400 },
      );
    }

    console.log("Email:", email);

    const user = await prisma.users.findUnique({
      where: { email: email },
    });

    console.log("User from DB:", user);

    if (!user) {
      return NextResponse.json(
        { message: "Usuário não encontrado" },
        { status: 401 },
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json(
        { message: "Usuário ou senha incorretos" },
        { status: 401 },
      );
    }

    const jwtSecret = process.env.JWT_SECRET;
    const jwtExpiresIn = process.env.JWT_EXPIRES_IN || "1h";

    if (!jwtSecret) {
      return NextResponse.json(
        { message: "Erro interno: chave secreta não definida" },
        { status: 500 },
      );
    }

    const token = jwt.sign({ id: user.id }, jwtSecret, {
      expiresIn: jwtExpiresIn,
    });

    return NextResponse.json({ user, token });
  } catch (error) {
    console.error("Error in login:", error);
    return NextResponse.json(
      { message: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
