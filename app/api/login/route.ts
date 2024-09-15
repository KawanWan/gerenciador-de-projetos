import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import prisma from "../../../lib/prisma";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  const user = await prisma.users.findUnique({
    where: {
      email: email,
    },
  });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return NextResponse.json(
      { message: "Usuário ou senha incorretos" },
      { status: 401 },
    );
  }

  const jwtSecret = process.env.JWT_SECRET;
  const jwtExpiresIn = process.env.JWT_EXPIRES_IN || "1h"; // Valor padrão caso não esteja definido no .env

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
}
