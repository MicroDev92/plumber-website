import { NextResponse } from "next/server"
import { uploadImage } from "@/lib/upload"
import { createServerClient } from "@/lib/supabase"
import { revalidatePath, revalidateTag } from "next/cache"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const title = formData.get("title") as string
    const description = formData.get("description") as string

    console.log("Upload request received:", {
      fileName: file?.name,
      fileSize: file?.size,
      title,
      description,
    })

    if (!file || !title || !description) {
      return NextResponse.json(
        {
          success: false,
          message: "Nedostaju obavezna polja (slika, naslov, opis)",
        },
        { status: 400 },
      )
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        {
          success: false,
          message: "Datoteka mora biti slika (JPG, PNG, WebP)",
        },
        { status: 400 },
      )
    }

    // Upload image to Supabase Storage
    console.log("Starting image upload...")
    const imageUrl = await uploadImage(file)
    console.log("Image uploaded successfully:", imageUrl)

    // Save to database
    const supabase = createServerClient()
    const { data, error } = await supabase
      .from("gallery_photos")
      .insert([
        {
          title: title.trim(),
          description: description.trim(),
          image_url: imageUrl,
          alt_text: title.trim(),
          is_featured: false,
          created_at: new Date().toISOString(),
        },
      ])
      .select()

    if (error) {
      console.error("Database error:", error)
      throw new Error(`Greška pri čuvanju u bazu: ${error.message}`)
    }

    console.log("Photo saved to database:", data[0])

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

      console.log("✅ Cache invalidated successfully after upload")
    } catch (cacheError) {
      console.error("❌ Cache invalidation failed:", cacheError)
      // Don't fail the request if cache invalidation fails
    }

    return NextResponse.json({
      success: true,
      message: "Fotografija je uspešno dodana i cache je ažuriran!",
      photo: data[0],
      cache_invalidated: true,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Upload API error:", error)

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Greška pri dodavanju fotografije.",
      },
      { status: 500 },
    )
  }
}
