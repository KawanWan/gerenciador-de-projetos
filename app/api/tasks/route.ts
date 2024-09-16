import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const url = new URL(request.url);
  const projectId = parseInt(url.searchParams.get("projectId") || "");

  if (isNaN(projectId)) {
    return new Response(JSON.stringify({ error: "Invalid projectId" }), {
      status: 400,
    });
  }

  try {
    const tasks = await prisma.tasks.findMany({
      where: { projectId: projectId },
    });
    return new Response(JSON.stringify(tasks), { status: 200 });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch tasks" }), {
      status: 500,
    });
  }
}

export async function POST(request: Request) {
  try {
    const { name, description, userId, dueDate, projectId } =
      await request.json();

    if (!name || !description || !userId || !dueDate || !projectId) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400 },
      );
    }

    const user = await prisma.users.findFirst({
      where: { id: Number(userId) },
    });

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    const newTask = await prisma.tasks.create({
      data: {
        name,
        description,
        status: "PENDING",
        dueDate: new Date(dueDate),
        projectId: projectId,
        userId: user.id,
      },
    });

    return new Response(JSON.stringify(newTask), { status: 201 });
  } catch (error) {
    console.error("Error adding task:", error);
    return new Response(JSON.stringify({ error: "Failed to add task" }), {
      status: 500,
    });
  }
}

export async function PUT(req: NextRequest) {
  const url = new URL(req.nextUrl);
  const taskId = url.searchParams.get("taskId");
  if (!taskId)
    return NextResponse.json({ error: "Task ID required" }, { status: 400 });

  const data = await req.json();
  const { name, description, selectedUserId, dueDate, status, projectId } =
    data;

  try {
    const updatedTask = await prisma.tasks.update({
      where: { id: Number(taskId) },
      data: {
        name,
        description,
        userId: selectedUserId,
        dueDate: new Date(dueDate),
        status,
        projectId: projectId,
      },
    });
    return NextResponse.json(updatedTask);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  const taskId = req.nextUrl.searchParams.get("taskId");
  if (!taskId)
    return NextResponse.json({ error: "Task ID required" }, { status: 400 });

  try {
    await prisma.tasks.delete({
      where: { id: Number(taskId) },
    });
    return NextResponse.json({ message: "Task deleted" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete task" },
      { status: 500 },
    );
  }
}
