import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    console.log("🔐 Admin login attempt:", { username })

    // Demo credentials for development
    const validCredentials = [
      { username: "admin", password: "plumber2024" },
      { username: "vodoinstaler", password: "zekic2024" },
    ]

    const isValid = validCredentials.some((cred) => cred.username === username && cred.password === password)

    if (isValid) {
      console.log("✅ Login successful for:", username)

      return NextResponse.json(
        {
          success: true,
          message: "Uspešna prijava",
          user: { username },
        },
        {
          status: 200,
          headers: {
            "Cache-Control": "no-store, no-cache, must-revalidate",
            Pragma: "no-cache",
          },
        },
      )
    } else {
      console.log("❌ Invalid credentials for:", username)

      return NextResponse.json(
        {
          success: false,
          message: "Neispravno korisničko ime ili lozinka",
        },
        { status: 401 },
      )
    }
  } catch (error) {
    console.error("❌ Login API error:", error)

    return NextResponse.json(
      {
        success: false,
        message: "Greška na serveru",
      },
      { status: 500 },
    )
  }
}
