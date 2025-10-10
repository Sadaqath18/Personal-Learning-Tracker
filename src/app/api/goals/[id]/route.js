import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

function getUserFromToken(req) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) return null;
  const token = authHeader.split(" ")[1];
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
}

// ✅ Update goal by ID (partial updates allowed)
export async function PUT(req, { params }) {
  try {
    const user = getUserFromToken(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params; // keep await if your runtime requires it
    const body = await req.json();
    const { title, description, status } = body ?? {};

    // Build partial update payload
    const data = {};

    if (typeof title !== "undefined") {
      const t = String(title).trim();
      if (!t) {
        return NextResponse.json(
          { error: "Title cannot be empty" },
          { status: 400 }
        );
      }
      data.title = t;
    }

    if (typeof description !== "undefined") {
      data.description = description?.toString().trim() || null;
    }

    if (typeof status !== "undefined") {
      const allowed = ["pending", "in-progress", "completed"];
      if (!allowed.includes(status)) {
        return NextResponse.json(
          { error: "Invalid status" },
          { status: 400 }
        );
      }
      data.status = status;
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        { error: "No fields to update" },
        { status: 400 }
      );
    }

    const goalId = parseInt(id, 10);
    const existing = await prisma.goal.findUnique({
      where: { id: goalId },
      select: { id: true, userId: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "Goal not found" }, { status: 404 });
    }
    if (existing.userId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updatedGoal = await prisma.goal.update({
      where: { id: goalId },
      data,
    });

    return NextResponse.json({ goal: updatedGoal });
  } catch (e) {
    console.error("PUT /api/goals/[id] error:", e);
    return NextResponse.json(
      { error: "Failed to update goal" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    const user = getUserFromToken(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const goalId = parseInt(id, 10);

    const existing = await prisma.goal.findUnique({
      where: { id: goalId },
      select: { id: true, userId: true },
    });
    if (!existing) {
      return NextResponse.json({ error: "Goal not found" }, { status: 404 });
    }
    if (existing.userId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.goal.delete({ where: { id: goalId } });
    return NextResponse.json({ message: "Goal deleted successfully" });
  } catch (e) {
    console.error("DELETE /api/goals/[id] error:", e);
    return NextResponse.json(
      { error: "Failed to delete goal" },
      { status: 500 }
    );
  }
}