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

//list all users with goals count
export async function GET(request) {
  const auth = await ensureAdmin(request);
  if (auth.error) return auth.error;

  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: { select: { goals: true } },
      },
    });
    return NextResponse.json({ users });
  } catch (e) {
    return NextResponse.json(
      { error: "Failed to load users" },
      { status: 500 }
    );
  }
}
