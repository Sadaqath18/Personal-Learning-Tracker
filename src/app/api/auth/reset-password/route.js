import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export async function POST(request) {
  try {
    const { token, password } = await request.json();
    if (!token || !password) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const record = await prisma.passwordResetToken.findUnique({ where: { tokenHash } });

    if (!record || record.usedAt || record.expiresAt < new Date()) {
      return NextResponse.json({ error: "Reset link is invalid or has expired" }, { status: 400 });
    }

    const hash = await bcrypt.hash(password, 10);
    await prisma.user.update({
      where: { id: record.userId },
      data: { password: hash },
    });

    await prisma.passwordResetToken.update({
      where: { tokenHash },
      data: { usedAt: new Date() },
    });

    await prisma.passwordResetToken.deleteMany({
      where: { userId: record.userId, usedAt: null, tokenHash: { not: tokenHash } },
    });

    return NextResponse.json({ message: "Password has been reset successfully" });
  } catch (e) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}