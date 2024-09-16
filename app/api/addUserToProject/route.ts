import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { projectId, email } = await request.json();

    if (!projectId || !email) {
      return NextResponse.json(
        { message: "Missing projectId or email" },
        { status: 400 },
      );
    }

    const parsedProjectId = parseInt(projectId, 10);

    if (isNaN(parsedProjectId)) {
      return NextResponse.json(
        { message: "Invalid projectId" },
        { status: 400 },
      );
    }

    await prisma.projects.update({
      where: { id: parsedProjectId },
      data: {
        users: {
          connect: { email },
        },
      },
    });

    return NextResponse.json({ message: "User added to project successfully" });
  } catch (error) {
    console.error("Error adding user to project:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
