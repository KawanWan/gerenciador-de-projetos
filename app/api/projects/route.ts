import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { name, description, userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 },
      );
    }

    const project = await prisma.projects.create({
      data: {
        name,
        description,
        users: {
          connect: { id: userId },
        },
      },
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function PUT(req: Request) {
  const { projectId, name, description } = await req.json();

  if (!projectId || isNaN(Number(projectId))) {
    return new Response(JSON.stringify({ error: "Invalid project ID" }), {
      status: 400,
    });
  }

  try {
    const updatedProject = await prisma.projects.update({
      where: { id: Number(projectId) },
      data: {
        name,
        description,
      },
    });
    return new Response(JSON.stringify(updatedProject), { status: 200 });
  } catch (error) {
    console.error("Error updating project:", error);
    return new Response(JSON.stringify({ error: "Failed to update project" }), {
      status: 500,
    });
  }
}

export async function DELETE(req: Request) {
  const url = new URL(req.url);
  const projectId = parseInt(url.searchParams.get("projectId") || "");

  try {
    await prisma.projects.delete({
      where: { id: projectId },
    });
    return new Response(null, { status: 204 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to delete project" }), {
      status: 500,
    });
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const userId = parseInt(url.searchParams.get("userId") || "");

  try {
    const projects = await prisma.projects.findMany({
      where: {
        users: {
          some: {
            id: userId,
          },
        },
      },
    });
    return new Response(JSON.stringify(projects), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch projects" }), {
      status: 500,
    });
  }
}
