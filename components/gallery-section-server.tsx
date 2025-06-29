import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ImageIcon } from "lucide-react"
import { GalleryClient } from "./gallery-client"
import { getGalleryPhotos } from "@/lib/gallery"

export async function GallerySection() {
  // Fetch photos server-side for faster initial load
  const photos = await getGalleryPhotos()

  return (
    <section id="gallery" className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h3 className="text-3xl font-bold text-slate-900 mb-4">Naši radovi</h3>
          <p className="text-lg text-slate-600">
            Pogledajte primere naših profesionalnih vodoinstalaterskih radova i popravki
          </p>
          {photos.length > 0 && (
            <Badge variant="outline" className="mt-2">
              {photos.length} {photos.length === 1 ? "fotografija" : "fotografija"}
            </Badge>
          )}
        </div>

        {photos.length === 0 ? (
          <Card className="max-w-md mx-auto">
            <CardContent className="p-8 text-center">
              <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Nema fotografija</h4>
              <p className="text-gray-600">Fotografije će biti dodane uskoro.</p>
            </CardContent>
          </Card>
        ) : (
          <GalleryClient initialPhotos={photos} />
        )}
      </div>
    </section>
  )
}
