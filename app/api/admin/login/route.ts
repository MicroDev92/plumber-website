import { type NextRequest, NextResponse } from "next/server"

// Demo credentials - in production, use proper authentication
const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "plumber2024",
}

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    console.log("🔐 Admin login attempt:", { username })

    // Validate credentials
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      console.log("✅ Admin login successful")

      return NextResponse.json(
        {
          success: true,
          message: "Uspešna prijava",
          user: { username },
        },
        {
          status: 200,
          headers: {
            "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
        },
      )
    } else {
      console.log("❌ Admin login failed - invalid credentials")

      return NextResponse.json(
        {
          success: false,
          message: "Neispravno korisničko ime ili lozinka",
        },
        { status: 401 },
      )
    }
  } catch (error) {
    console.error("💥 Admin login error:", error)

    return NextResponse.json(
      {
        success: false,
        message: "Greška servera",
      },
      { status: 500 },
    )
  }
}
