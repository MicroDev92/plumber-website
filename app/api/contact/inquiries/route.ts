import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export async function GET() {
  try {
    const supabase = createServerClient()

    const { data: inquiries, error } = await supabase
      .from("contact_inquiries")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ success: false, message: "Greška pri učitavanju upita" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      inquiries: inquiries || [],
    })
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json({ success: false, message: "Greška servera" }, { status: 500 })
  }
}
