import { createServerClient } from "@/lib/supabase"
import { GallerySection } from "./gallery-section"

async function getGalleryPhotosServer() {
  try {
    const supabase = createServerClient()

    const { data: photos, error } = await supabase
      .from("gallery_photos")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(6)

    if (error) {
      console.error("Gallery fetch error:", error)
      return []
    }

    return photos || []
  } catch (error) {
    console.error("Gallery server error:", error)
    return []
  }
}

export async function GallerySectionServer() {
  const photos = await getGalleryPhotosServer()
  return <GallerySection initialPhotos={photos} />
}
