import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

// ✅ Get all goals of logged-in user
export async function GET(req) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const goals = await prisma.goal.findMany({
      where: { userId: decoded.userId },
      select: { id: true, title: true, description: true, status: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ goals });
  } catch (err) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

// ✅ Create new goal
export async function POST(req) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { title, description } = await req.json();

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const goal = await prisma.goal.create({
      data: {
        title,
        description: description || null,
        userId: decoded.id,
      },
    });

    return NextResponse.json({ goal });
  } catch (err) {
    console.error("🔥 Error in POST /api/goals:", err);
    return NextResponse.json(
      { error: err.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
