import jwt from "jsonwebtoken"

export async function GET(request) {
  try {
    const cookieHeader = request.headers.get("cookie")
    const refreshToken = cookieHeader
      ?.split(";")
      .find((c) => c.trim().startsWith("refreshToken="))
      ?.split("=")[1]

    if (!refreshToken) {
      return new Response(JSON.stringify({ error: "No refresh token" }), { status: 401 })
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)

    // New access token
    const newAccessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    )

    return new Response(JSON.stringify({ message: "Token refreshed" }), {
      status: 200,
      headers: {
        "Set-Cookie": `accessToken=${newAccessToken}; HttpOnly; Path=/; Max-Age=900; Secure; SameSite=Strict`,
        "Content-Type": "application/json",
      },
    })
  } catch (error) {
    console.error("Refresh error:", error)
    return new Response(JSON.stringify({ error: "Invalid refresh token" }), { status: 401 })
  }
}
