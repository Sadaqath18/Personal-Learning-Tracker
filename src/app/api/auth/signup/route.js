export const runtime = "nodejs";

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();
    const n = (name || "").trim();
    const e = (email || "").trim().toLowerCase();
    const p = (password || "").trim();

    if (!e || !p) {
      return NextResponse.json(
        { error: "Email and password required" },
        { status: 400 }
      );
    }
    if (n && (n.length < 2 || n.length > 60)) {
      return NextResponse.json(
        { error: "Name must be between 2 and 60 characters" },
        { status: 400 }
      );
    }
    if (p.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    // Check if user exists
    const existing = await prisma.user.findUnique({ where: { email: e } });
    if (existing) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      );
    }

    // Create
    const hash = await bcrypt.hash(p, 10);
    const user = await prisma.user.create({
      data: {
        email: e,
        password: hash,
        name: n || null,
        role: "user",
      },
      select: { id: true, name: true, email: true, role: true },
    });

    // Sign token (optional)
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error("JWT_SECRET missing in env");
      return NextResponse.json(
        { error: "Server misconfiguration" },
        { status: 500 }
      );
    }
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      secret,
      { expiresIn: "1h" }
    );

    return NextResponse.json({ user, token }, { status: 201 });
  } catch (error) {
    // Prisma duplicate guard (race)
    if (error?.code === "P2002") {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      );
    }
    console.error("Signup Error:", error);
    return NextResponse.json({ error: "Signup failed" }, { status: 500 });
  }
}
