import { createServerClient } from "./supabase"

export interface Photo {
  id: string
  title: string
  description: string
  image_url: string
  created_at: string
  alt_text?: string
  is_featured?: boolean
}

export async function getGalleryPhotos(): Promise<Photo[]> {
  try {
    const supabase = createServerClient()

    const { data: photos, error } = await supabase
      .from("gallery_photos")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) throw error

    return photos || []
  } catch (error) {
    console.error("Gallery fetch error:", error)
    // Return empty array instead of placeholder photos
    return []
  }
}
