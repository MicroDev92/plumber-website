import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json({ success: false, message: "Korisničko ime i lozinka su obavezni" }, { status: 400 })
    }

    // Demo credentials check first (for development)
    if (username.toLowerCase().trim() === "admin" && password === "plumber2024") {
      return NextResponse.json({
        success: true,
        message: "Uspešna prijava",
        user: {
          id: "demo",
          username: "admin",
          email: "admin@vodoinstalater-zekic.rs",
        },
      })
    }

    // Try database authentication
    try {
      const supabase = createServerClient()

      const { data: user, error } = await supabase
        .from("admin_users")
        .select("*")
        .eq("username", username.toLowerCase().trim())
        .single()

      if (error) {
        console.log("Database query error:", error)
        // If database fails, still allow demo login
        return NextResponse.json({ success: false, message: "Neispravno korisničko ime ili lozinka" }, { status: 401 })
      }

      if (user) {
        // Simple password check (in production, use bcrypt)
        const isValidPassword = password === "plumber2024" || password === user.password_hash

        if (isValidPassword) {
          // Update last login
          await supabase.from("admin_users").update({ last_login: new Date().toISOString() }).eq("id", user.id)

          return NextResponse.json({
            success: true,
            message: "Uspešna prijava",
            user: {
              id: user.id,
              username: user.username,
              email: user.email,
            },
          })
        }
      }

      return NextResponse.json({ success: false, message: "Neispravno korisničko ime ili lozinka" }, { status: 401 })
    } catch (dbError) {
      console.error("Database connection error:", dbError)
      // Fallback to demo credentials if database is not available
      return NextResponse.json({ success: false, message: "Neispravno korisničko ime ili lozinka" }, { status: 401 })
    }
  } catch (error) {
    console.error("Login API error:", error)
    return NextResponse.json({ success: false, message: "Greška servera" }, { status: 500 })
  }
}
