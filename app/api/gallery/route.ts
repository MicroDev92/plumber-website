import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export async function GET() {
  try {
    const supabase = createServerClient()

    console.log("Fetching photos from database...")

    const { data: photos, error } = await supabase
      .from("gallery_photos")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Database error:", error)
      throw error
    }

    console.log(`Fetched ${photos?.length || 0} photos from database`)

    return NextResponse.json({
      success: true,
      photos: photos || [],
      total: photos?.length || 0,
    })
  } catch (error) {
    console.error("Gallery API error:", error)

    // Return sample photos as fallback
    const fallbackPhotos = [
      {
        id: "sample-1",
        title: "Ugradnja kupatila",
        description: "Kompletna renovacija kupatila",
        image_url: "/placeholder.svg?height=300&width=400",
        created_at: new Date().toISOString(),
      },
      {
        id: "sample-2",
        title: "Kuhinjske instalacije",
        description: "Ugradnja novog sudopera",
        image_url: "/placeholder.svg?height=300&width=400",
        created_at: new Date().toISOString(),
      },
    ]

    return NextResponse.json({
      success: true,
      photos: fallbackPhotos,
      total: fallbackPhotos.length,
      fallback: true,
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
