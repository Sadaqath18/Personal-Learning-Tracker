import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

// Middleware function to extract user from token
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

// Updating the goal
export async function PUT(req, { params }) {
  try {
    const user = getUserFromToken(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const body = await req.json();
    const { title, description, status } = body;

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const updatedGoal = await prisma.goal.update({
      where: {
        id: parseInt(id),
        userId: user.id,
      },
      data: {
        title,
        description: description || null,
        status,
      },
    });

    return NextResponse.json({ goal: updatedGoal });
  } catch (err) {
    console.error("Error updating goal:", err);

    // Handle specific Prisma errors
    if (err.code === "P2025") {
      return NextResponse.json({ error: "Goal not found" }, { status: 404 });
    }

    return NextResponse.json(
      { error: "Failed to update the goal" },
      { status: 500 }
    );
  }
}

// Deleting goal
export async function DELETE(req, { params }) {
  try {
    const user = getUserFromToken(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const deletedGoal = await prisma.goal.delete({
      where: {
        id: parseInt(id),
        userId: user.id,
      },
    });

    return NextResponse.json({
      message: "Goal deleted successfully",
      goal: deletedGoal,
    });
  } catch (err) {
    console.error("Error deleting goal:", err);

    // Handle specific Prisma errors
    if (err.code === "P2025") {
      return NextResponse.json({ error: "Goal not found" }, { status: 404 });
    }

    return NextResponse.json(
      { error: "Failed to delete goal" },
      { status: 500 }
    );
  }
}
