import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"
import { deleteImage } from "@/lib/upload"
import { revalidatePath, revalidateTag } from "next/cache"

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = createServerClient()

    console.log("Deleting photo with ID:", params.id)

    // Get photo details first (to delete from storage)
    const { data: photo, error: fetchError } = await supabase
      .from("gallery_photos")
      .select("image_url")
      .eq("id", params.id)
      .single()

    if (fetchError) {
      console.error("Error fetching photo:", fetchError)
      return NextResponse.json(
        {
          success: false,
          message: "Fotografija nije pronađena",
        },
        { status: 404 },
      )
    }

    console.log("Photo to delete:", photo)

    // Delete from database first
    const { error: deleteError } = await supabase.from("gallery_photos").delete().eq("id", params.id)

    if (deleteError) {
      console.error("Database delete error:", deleteError)
      throw new Error("Greška pri brisanju iz baze podataka")
    }

    // Delete from storage (if it's a Supabase storage URL)
    if (photo?.image_url && photo.image_url.includes("supabase")) {
      try {
        await deleteImage(photo.image_url)
        console.log("Image deleted from storage successfully")
      } catch (storageError) {
        console.error("Storage delete error:", storageError)
        // Log but don't fail the request if storage delete fails
        console.warn("Failed to delete image from storage, but database record was removed")
      }
    }

    // 🚀 AUTOMATIC CACHE INVALIDATION
    try {
      // Revalidate all gallery-related pages immediately
      revalidatePath("/", "layout")
      revalidatePath("/")
      revalidatePath("/admin/dashboard")
      revalidatePath("/api/gallery")

      // Revalidate tagged cache
      revalidateTag("gallery")
      revalidateTag("photos")

      console.log("✅ Cache invalidated successfully")
    } catch (cacheError) {
      console.error("❌ Cache invalidation failed:", cacheError)
      // Don't fail the request if cache invalidation fails
    }

    return NextResponse.json({
      success: true,
      message: "Fotografija je uspešno obrisana i cache je ažuriran",
      cache_invalidated: true,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Delete API error:", error)
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Greška pri brisanju fotografije",
      },
      { status: 500 },
    )
  }
}
