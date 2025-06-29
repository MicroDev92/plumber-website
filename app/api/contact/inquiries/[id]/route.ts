import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { status } = await request.json()
    const supabase = createServerClient()

    const { error } = await supabase
      .from("contact_inquiries")
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.id)

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ success: false, message: "Greška pri ažuriranju upita" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Status upita je uspešno ažuriran",
    })
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json({ success: false, message: "Greška servera" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createServerClient()

    const { error } = await supabase.from("contact_inquiries").delete().eq("id", params.id)

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ success: false, message: "Greška pri brisanju upita" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Upit je uspešno obrisan",
    })
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json({ success: false, message: "Greška servera" }, { status: 500 })
  }
}
