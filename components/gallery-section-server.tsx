import { createServerClient } from "@/lib/supabase"
import { GalleryClient } from "./gallery-client"

export async function GallerySectionServer() {
  try {
    const supabase = createServerClient()
    const { data: photos, error } = await supabase
      .from("gallery_photos")
      .select("*")
      .eq("is_published", true)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching gallery photos:", error)
      return <GalleryClient photos={[]} />
    }

    return <GalleryClient photos={photos || []} />
  } catch (error) {
    console.error("Gallery server error:", error)
    return <GalleryClient photos={[]} />
  }
}

// Export with both names for compatibility
export { GallerySectionServer as GallerySection }
