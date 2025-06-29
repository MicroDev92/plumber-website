import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export async function POST() {
  try {
    const supabase = createServerClient()

    console.log("Starting storage cleanup...")

    // Get all files in storage
    const { data: storageFiles, error: storageError } = await supabase.storage
      .from("vodoinstalater-zekic-galerija")
      .list("gallery", {
        limit: 1000,
      })

    if (storageError) {
      throw new Error(`Storage list error: ${storageError.message}`)
    }

    // Get all image URLs from database
    const { data: dbPhotos, error: dbError } = await supabase.from("gallery_photos").select("image_url")

    if (dbError) {
      throw new Error(`Database error: ${dbError.message}`)
    }

    const dbImagePaths = new Set(
      dbPhotos
        ?.map((photo) => {
          if (photo.image_url?.includes("vodoinstalater-zekic-galerija")) {
            const urlParts = photo.image_url.split("/")
            const bucketIndex = urlParts.findIndex((part) => part === "vodoinstalater-zekic-galerija")
            return urlParts.slice(bucketIndex + 1).join("/")
          }
          return null
        })
        .filter(Boolean) || [],
    )

    console.log("Database image paths:", Array.from(dbImagePaths))
    console.log(
      "Storage files:",
      storageFiles?.map((f) => `gallery/${f.name}`),
    )

    // Find orphaned files (in storage but not in database)
    const orphanedFiles =
      storageFiles?.filter((file) => {
        const fullPath = `gallery/${file.name}`
        return !dbImagePaths.has(fullPath)
      }) || []

    console.log("Orphaned files found:", orphanedFiles.length)

    if (orphanedFiles.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No orphaned files found",
        cleaned: 0,
      })
    }

    // Delete orphaned files
    const filesToDelete = orphanedFiles.map((file) => `gallery/${file.name}`)

    const { error: deleteError } = await supabase.storage.from("vodoinstalater-zekic-galerija").remove(filesToDelete)

    if (deleteError) {
      throw new Error(`Delete error: ${deleteError.message}`)
    }

    console.log("Successfully cleaned up orphaned files:", filesToDelete)

    return NextResponse.json({
      success: true,
      message: `Successfully cleaned up ${orphanedFiles.length} orphaned files`,
      cleaned: orphanedFiles.length,
      files: filesToDelete,
    })
  } catch (error) {
    console.error("Cleanup error:", error)
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Cleanup failed",
      },
      { status: 500 },
    )
  }
}
