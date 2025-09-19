import { NextResponse } from "next/server"

export function middleware(req) {
  const token = req.cookies.get("token")?.value || null

  const { pathname } = req.nextUrl

  // Protect dashboard routes
  if (pathname.startsWith("/dashboard")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url))
    }
  }

  return NextResponse.next()
}

// Apply only on these routes
export const config = {
  matcher: ["/dashboard/:path*"],
}
