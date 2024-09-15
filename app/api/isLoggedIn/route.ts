import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

export async function POST(req: NextRequest) {
  const { cookieToken } = await req.json();
  let user = null;

  if (cookieToken) {
    try {
      const decoded = jwt.verify(
        cookieToken,
        process.env.JWT_SECRET as string,
      ) as jwt.JwtPayload;
      const id = decoded.id;

      user = await prisma.users.findUnique({
        where: {
          id: id,
        },
      });
    } catch (error) {
      return NextResponse.json(
        { message: "Token inválido ou expirado" },
        { status: 401 },
      );
    }
  }

  return NextResponse.json(user);
}
