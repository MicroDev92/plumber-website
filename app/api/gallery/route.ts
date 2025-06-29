import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

// Disable caching for this API route in production
export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET() {
  try {
    const supabase = createServerClient()

    console.log("Fetching photos from database (no cache)...")

    const { data: photos, error } = await supabase
      .from("gallery_photos")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Database error:", error)
      throw error
    }

    console.log(`Fetched ${photos?.length || 0} photos from database`)

    return NextResponse.json(
      {
        success: true,
        photos: photos || [],
        total: photos?.length || 0,
        timestamp: new Date().toISOString(),
        cached: false,
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          "CDN-Cache-Control": "no-store",
          "Vercel-CDN-Cache-Control": "no-store",
        },
      },
    )
  } catch (error) {
    console.error("Gallery API error:", error)

    return NextResponse.json(
      {
        success: true,
        photos: [],
        total: 0,
        error: "Database error - showing empty gallery",
        timestamp: new Date().toISOString(),
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          "CDN-Cache-Control": "no-store",
          "Vercel-CDN-Cache-Control": "no-store",
        },
      },
    )
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
