import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    console.log("🔐 Admin login attempt received")

    const { username, password } = await request.json()

    console.log("👤 Username:", username)
    console.log("🔑 Password length:", password?.length)

    // Simple demo authentication
    // In production, you would validate against a database with hashed passwords
    if (username === "admin" && password === "plumber2024") {
      console.log("✅ Login successful")

      const response = NextResponse.json({
        success: true,
        message: "Uspešna prijava",
        user: {
          username: "admin",
          role: "admin",
          loginTime: new Date().toISOString(),
        },
      })

      // Set secure headers for mobile compatibility
      response.headers.set("Cache-Control", "no-cache, no-store, must-revalidate")
      response.headers.set("Pragma", "no-cache")
      response.headers.set("Expires", "0")

      return response
    } else {
      console.log("❌ Invalid credentials")
      return NextResponse.json(
        {
          success: false,
          message: "Neispravni podaci za prijavu",
        },
        { status: 401 },
      )
    }
  } catch (error) {
    console.error("🚨 Login error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Greška servera",
      },
      { status: 500 },
    )
  }
}
