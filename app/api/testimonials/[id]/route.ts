import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const data = await request.json()
    const supabase = createServerClient()

    const { data: testimonial, error } = await supabase
      .from("testimonials")
      .update({
        name: data.name?.trim(),
        text: data.text?.trim(),
        rating: data.rating ? Number.parseInt(data.rating) : undefined,
        service: data.service?.trim() || null,
        location: data.location?.trim() || null,
        is_featured: data.is_featured,
        is_published: data.is_published,
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.id)
      .select()

    if (error) throw error

    return NextResponse.json({
      success: true,
      message: "Recenzija je ažurirana!",
      testimonial: testimonial[0],
    })
  } catch (error) {
    console.error("Testimonial update error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Greška pri ažuriranju recenzije",
      },
      { status: 500 },
    )
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = createServerClient()

    const { error } = await supabase.from("testimonials").delete().eq("id", params.id)

    if (error) throw error

    return NextResponse.json({
      success: true,
      message: "Recenzija je obrisana!",
    })
  } catch (error) {
    console.error("Testimonial delete error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Greška pri brisanju recenzije",
      },
      { status: 500 },
    )
  }
}
