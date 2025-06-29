import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export async function GET() {
  try {
    const supabase = createServerClient()

    const { data: testimonials, error } = await supabase
      .from("testimonials")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json({
      success: true,
      testimonials: testimonials || [],
      total: testimonials?.length || 0,
    })
  } catch (error) {
    console.error("Testimonials API error:", error)
    return NextResponse.json({
      success: false,
      testimonials: [],
      total: 0,
      error: "Failed to fetch testimonials",
    })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const supabase = createServerClient()

    // Validate required fields
    if (!data.name || !data.text || !data.rating) {
      return NextResponse.json(
        {
          success: false,
          message: "Ime, tekst i ocena su obavezni",
        },
        { status: 400 },
      )
    }

    // Validate rating
    if (data.rating < 1 || data.rating > 5) {
      return NextResponse.json(
        {
          success: false,
          message: "Ocena mora biti između 1 i 5",
        },
        { status: 400 },
      )
    }

    const { data: testimonial, error } = await supabase
      .from("testimonials")
      .insert([
        {
          name: data.name.trim(),
          text: data.text.trim(),
          rating: Number.parseInt(data.rating),
          service: data.service?.trim() || null,
          location: data.location?.trim() || null,
          is_featured: data.is_featured || false,
          is_published: data.is_published !== false, // Default to true
          created_at: new Date().toISOString(),
        },
      ])
      .select()

    if (error) throw error

    return NextResponse.json({
      success: true,
      message: "Recenzija je uspešno dodana!",
      testimonial: testimonial[0],
    })
  } catch (error) {
    console.error("Testimonial creation error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Greška pri dodavanju recenzije",
      },
      { status: 500 },
    )
  }
}
