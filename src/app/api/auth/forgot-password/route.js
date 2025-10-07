import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";

export async function POST(request) {
  try {
    const { email } = await request.json();
    // Always return 200 to prevent email enumeration
    if (!email) return NextResponse.json({ message: "If the email exists, we sent a reset link." });

    const user = await prisma.user.findUnique({
      where: { email: String(email).toLowerCase() },
      select: { id: true, email: true },
    });

    if (user) {
      const rawToken = crypto.randomBytes(32).toString("hex");
      const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
      const expiresAt = new Date(Date.now() + 1000 * 60 * 15); // 15 minutes

      await prisma.passwordResetToken.create({
        data: { tokenHash, userId: user.id, expiresAt },
      });

      const baseUrl = process.env.APP_URL || "http://localhost:3000";
      const resetUrl = `${baseUrl}/reset-password?token=${rawToken}`;

      // TODO: send resetUrl via email (Resend/SendGrid/Nodemailer)
      if (process.env.NODE_ENV !== "production") {
        console.log("Password reset link:", resetUrl);
      }
    }

    return NextResponse.json({ message: "If the email exists, we sent a reset link." });
  } catch (e) {
    return NextResponse.json({ message: "If the email exists, we sent a reset link." });
  }
}