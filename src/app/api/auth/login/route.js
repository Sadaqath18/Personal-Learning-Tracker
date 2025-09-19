import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    console.log("👉 Incoming request body:", { email, password });

    // find user in db
    const user = await prisma.user.findUnique({ where: { email } });
    console.log("🔍 User found in DB:", user);

    if (!user) {
      return new Response(JSON.stringify({ error: "Invalid credentials" }), {
        status: 401,
      });
    }

    // compare password with bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log("✅ Password match?", isPasswordValid);

    if (!isPasswordValid) {
      return new Response(JSON.stringify({ error: "Invalid credentials" }), {
        status: 401,
      });
    }

    // generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    console.log("🎫 Token generated:", token);

    return new Response(JSON.stringify({ token }), { status: 200 });
  } catch (err) {
    console.error("Login Error:", err);
    return new Response(JSON.stringify({ error: "Something went wrong" }), {
      status: 500,
    });
  }
}
