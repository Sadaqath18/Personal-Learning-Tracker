export const runtime = "nodejs";
import { NextResponse } from "next/server";
export async function GET() {
  try {
    const u = new URL(process.env.DATABASE_URL || "");
    return NextResponse.json({
      ok: true,
      host: u.hostname,
      user: u.username,
      port: u.port,
      params: u.search,
      hasPassword: !!u.password,
    });
  } catch (e) {
    return NextResponse.json(
      { ok: false, message: String(e) },
      { status: 500 }
    );
  }
}
