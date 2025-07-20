"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Lightbox } from "@/components/ui/lightbox"
import { ImageIcon, Loader2, Expand, RefreshCw } from "lucide-react"
import Image from "next/image"

interface Photo {
  id: string
  title: string
  description: string
  image_url: string
  created_at: string
}

export function GallerySection() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastFetch, setLastFetch] = useState<number>(0)

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // 🚀 FIXED: Simple useEffect without problematic dependencies
  useEffect(() => {
    fetchPhotos()
  }, []) // Only run once on mount

  const fetchPhotos = async (silent = false) => {
    try {
      if (!silent) {
        setIsLoading(true)
        setError(null)
      }

      // Simple fetch without aggressive cache busting
      const response = await fetch("/api/gallery", {
        cache: "no-store",
      })

      const result = await response.json()

      console.log("Gallery API response:", result)

      if (result.success) {
        setPhotos(result.photos || [])
        setLastFetch(Date.now())
      } else {
        setError("Greška pri učitavanju fotografija")
        setPhotos([])
      }
    } catch (err) {
      console.error("Gallery fetch error:", err)
      if (!silent) {
        setError("Greška pri učitavanju fotografija")
        setPhotos([])
      }
    } finally {
      if (!silent) {
        setIsLoading(false)
      }
    }
  }

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index)
    setLightboxOpen(true)
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % photos.length)
  }

  const previousImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + photos.length) % photos.length)
  }

  // Convert photos to lightbox format
  const lightboxImages = photos.map((photo) => ({
    id: photo.id,
    src: photo.image_url || "/placeholder.svg?height=800&width=1200",
    alt: photo.title,
    title: photo.title,
    description: photo.description,
  }))

  return (
    <>
      <section id="gallery" className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-4 mb-4">
              <h3 className="text-3xl font-bold text-slate-900">Naši radovi</h3>
              <Button variant="outline" size="sm" onClick={() => fetchPhotos()} disabled={isLoading} className="ml-2">
                <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
              </Button>
            </div>
            <p className="text-lg text-slate-600">
              Pogledajte primere naših profesionalnih vodoinstalaterskih radova i popravki
            </p>
            {photos.length > 0 && (
              <Badge variant="outline" className="mt-2">
                {photos.length} {photos.length === 1 ? "fotografija" : "fotografija"}
              </Badge>
            )}
            {lastFetch > 0 && !isLoading && (
              <p className="text-xs text-gray-500 mt-2">
                Poslednje ažuriranje: {new Date(lastFetch).toLocaleTimeString("sr-RS")}
              </p>
            )}
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">Učitavanje fotografija...</span>
            </div>
          ) : error ? (
            <Card className="max-w-md mx-auto">
              <CardContent className="p-8 text-center">
                <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Greška pri učitavanju</h4>
                <p className="text-gray-600 mb-4">{error}</p>
                <Button onClick={() => fetchPhotos()} variant="outline">
                  Pokušaj ponovo
                </Button>
              </CardContent>
            </Card>
          ) : photos.length === 0 ? (
            <Card className="max-w-md mx-auto">
              <CardContent className="p-8 text-center">
                <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Nema fotografija</h4>
                <p className="text-gray-600">Fotografije će biti dodane uskoro.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {photos.map((photo, index) => (
                <div
                  key={photo.id}
                  className="relative group overflow-hidden rounded-lg cursor-pointer"
                  onClick={() => openLightbox(index)}
                >
                  <Image
                    src={photo.image_url || "/placeholder.svg"}
                    alt={photo.title}
                    width={400}
                    height={300}
                    className="w-full h-64 object-cover transition-transform group-hover:scale-105"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = "/placeholder.svg?height=300&width=400"
                    }}
                  />

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity text-center text-white p-4">
                      <Expand className="h-8 w-8 mx-auto mb-2" />
                      <h4 className="font-semibold text-lg mb-1">{photo.title}</h4>
                      <p className="text-sm text-gray-200 mb-2">{photo.description}</p>
                      <p className="text-xs text-gray-300">Kliknite za veći prikaz</p>
                    </div>
                  </div>

                  {/* Corner expand icon */}
                  <div className="absolute top-2 right-2 bg-black/50 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Expand className="h-4 w-4 text-white" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {photos.length > 0 && (
        <Lightbox
          images={lightboxImages}
          currentIndex={currentImageIndex}
          isOpen={lightboxOpen}
          onClose={closeLightbox}
          onNext={nextImage}
          onPrevious={previousImage}
        />
      )}
    </>
  )
}
