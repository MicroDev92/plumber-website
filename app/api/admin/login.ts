import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export async function POST(request: Request) {
    try {
        const { username, password } = await request.json()

        if (!username || !password) {
            return NextResponse.json({ success: false, message: "Korisničko ime i lozinka su obavezni" }, { status: 400 })
        }

        const supabase = createServerClient()

        // Try to find user in database
        const { data: user, error } = await supabase
            .from("admin_users")
            .select("*")
            .eq("username", username.toLowerCase().trim())
            .single()

        if (error || !user) {
            console.log("User not found in database:", username)
            return NextResponse.json({ success: false, message: "Neispravno korisničko ime ili lozinka" }, { status: 401 })
        }

        // Simple password check (in production, use bcrypt)
        // For now, we'll check against the demo password
        const isValidPassword = password === "plumber2024" || password === user.password_hash

        if (!isValidPassword) {
            return NextResponse.json({ success: false, message: "Neispravno korisničko ime ili lozinka" }, { status: 401 })
        }

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
    } catch (error) {
        console.error("Login API error:", error)
        return NextResponse.json({ success: false, message: "Greška servera" }, { status: 500 })
    }
}
