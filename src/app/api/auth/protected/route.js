import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

export async function GET(request) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "No token provided" }), {
        status: 401,
      });
    }

    // Extract and verify JWT
    const token = authHeader.split(" ")[1];

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
       console.log("🔓 Decoded token:", decoded)
    } catch (err) {
      console.error("JWT verification error:", err);
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 403,
      });
    }

    console.log("Looking for user with ID:", decoded.userId)


    // ✅ Fetch only the logged-in user's data
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, name: true, email: true, role: true },
    });

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    //Role-based access check (Only ADMIN allowed)
    if (user.role !== "admin") {
      return new Response(
        JSON.stringify({ error: "Access denied: Admins only" }),
        { status: 403 }
      );
    }

    // Success response
    return new Response(
      JSON.stringify({ message: "Protected admin data 🚀", user }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Protected route error:", err);
    return new Response(JSON.stringify({ error: "Something went wrong" }), {
      status: 500,
    });
  }
}
