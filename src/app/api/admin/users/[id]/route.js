export const runtime = "nodejs";

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

function getUserFromAuth(request) {
  const auth = request.headers.get("authorization");
  if (!auth) return null;
  const token = auth.split(" ")[1];
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
}

async function ensureAdmin(request) {
  const decoded = getUserFromAuth(request);
  if (!decoded)
    return {
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };

  const dbUser = await prisma.user.findUnique({
    where: { id: decoded.id },
    select: { role: true },
  });

  if (!dbUser || dbUser.role !== "admin") {
    return {
      error: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }

  return { decoded };
}

// PUT -> change role
export async function PUT(request, ctx) {
  const { error } = await ensureAdmin(request);
  if (error) return error;

  const { id } = await ctx.params;
  try {
    const { role } = await request.json();
    if (!["user", "admin"].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    const updated = await prisma.user.update({
      where: { id: parseInt(id, 10) },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ user: updated });
  } catch (e) {
    return NextResponse.json(
      { error: "Failed to update role" },
      { status: 500 }
    );
  }
}

//delete user (and their data)
export async function DELETE(request, ctx) {
  const { error } = await ensureAdmin(request);
  if (error) return error;

  const { id } = await ctx.params;
  const userId = parseInt(id, 10);

  try {
    // Delete dependent data first (SQLite FK safety). If you set onDelete: Cascade on tokens, they’ll be removed with user.
    await prisma.$transaction([
      prisma.goal.deleteMany({ where: { userId } }),
      prisma.passwordResetToken?.deleteMany
        ? prisma.passwordResetToken.deleteMany({ where: { userId } })
        : prisma.user.findFirst(), // no-op if model missing
    ]);

    await prisma.user.delete({ where: { id: userId } });

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
