import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    // Simple demo authentication
    // In production, you would validate against a database with hashed passwords
    if (username === "admin" && password === "plumber2024") {
      return NextResponse.json({
        success: true,
        message: "Uspešna prijava",
        user: { username: "admin", role: "admin" },
      })
    } else {
      return NextResponse.json({ success: false, message: "Neispravni podaci za prijavu" }, { status: 401 })
    }
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ success: false, message: "Greška servera" }, { status: 500 })
  }
}
