import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export async function GET() {
  try {
    const supabase = createServerClient()

    const { data: photos, error } = await supabase
      .from("gallery_photos")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json({
      success: true,
      photos: photos || [],
    })
  } catch (error) {
    console.error("Gallery API error:", error)

    // Return demo photos as fallback
    return NextResponse.json({
      success: true,
      photos: [
        {
          id: 1,
          title: "Ugradnja kupatila",
          description: "Kompletna renovacija kupatila",
          image_url: "/placeholder.svg?height=300&width=400",
        },
        {
          id: 2,
          title: "Kuhinjske instalacije",
          description: "Ugradnja novog sudopera",
          image_url: "/placeholder.svg?height=300&width=400",
        },
      ],
    })
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.json()
    const supabase = createServerClient()

    const { data, error } = await supabase
      .from("gallery_photos")
      .insert([
        {
          title: formData.title,
          description: formData.description,
          image_url: formData.image_url || "/placeholder.svg?height=300&width=400",
          alt_text: formData.title,
          created_at: new Date().toISOString(),
        },
      ])
      .select()

    if (error) throw error

    return NextResponse.json({
      success: true,
      message: "Fotografija je uspešno dodana!",
      photo: data[0],
    })
  } catch (error) {
    console.error("Gallery upload error:", error)

    return NextResponse.json(
      {
        success: false,
        message: "Greška pri dodavanju fotografije.",
      },
      { status: 500 },
    )
  }
}
