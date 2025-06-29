import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

export async function POST() {
  try {
    const supabase = createServerClient()

    console.log("Starting complete cleanup...")

    // 1. Get all database records
    const { data: dbPhotos, error: dbError } = await supabase.from("gallery_photos").select("*")

    if (dbError) {
      throw new Error(`Database error: ${dbError.message}`)
    }

    console.log("Database photos found:", dbPhotos?.length || 0)

    // 2. Get all storage files
    const { data: storageFiles, error: storageError } = await supabase.storage
      .from("vodoinstalater-zekic-galerija")
      .list("gallery", { limit: 1000 })

    if (storageError) {
      console.warn("Storage list error:", storageError)
    }

    console.log("Storage files found:", storageFiles?.length || 0)

    // 3. Delete ALL storage files (clean slate)
    if (storageFiles && storageFiles.length > 0) {
      const filesToDelete = storageFiles.map((file) => `gallery/${file.name}`)

      const { error: deleteError } = await supabase.storage.from("vodoinstalater-zekic-galerija").remove(filesToDelete)

      if (deleteError) {
        console.error("Storage delete error:", deleteError)
      } else {
        console.log("Deleted all storage files:", filesToDelete)
      }
    }

    // 4. Delete ALL database records (clean slate)
    if (dbPhotos && dbPhotos.length > 0) {
      const { error: dbDeleteError } = await supabase
        .from("gallery_photos")
        .delete()
        .neq("id", "00000000-0000-0000-0000-000000000000") // Delete all

      if (dbDeleteError) {
        console.error("Database delete error:", dbDeleteError)
      } else {
        console.log("Deleted all database records")
      }
    }

    // 5. Force cache refresh
    revalidatePath("/")
    revalidatePath("/admin/dashboard")
    revalidatePath("/api/gallery")

    return NextResponse.json({
      success: true,
      message: "Complete cleanup successful - gallery is now empty",
      cleaned: {
        database: dbPhotos?.length || 0,
        storage: storageFiles?.length || 0,
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Complete cleanup error:", error)
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Cleanup failed",
      },
      { status: 500 },
    )
  }
}
