import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export async function GET() {
  try {
    const supabase = createServerClient()

    // Check database records
    const { data: dbPhotos, error: dbError } = await supabase
      .from("gallery_photos")
      .select("*")
      .order("created_at", { ascending: false })

    if (dbError) {
      throw dbError
    }

    // Check storage files
    const { data: storageFiles, error: storageError } = await supabase.storage
      .from("vodoinstalater-zekic-galerija")
      .list("gallery", { limit: 100 })

    if (storageError) {
      console.error("Storage error:", storageError)
    }

    return NextResponse.json({
      success: true,
      debug: {
        database: {
          count: dbPhotos?.length || 0,
          photos: dbPhotos || [],
        },
        storage: {
          count: storageFiles?.length || 0,
          files: storageFiles?.map((f) => f.name) || [],
        },
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("Debug error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Debug failed",
      },
      { status: 500 },
    )
  }
}
