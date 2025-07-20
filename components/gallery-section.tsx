"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Lightbox } from "@/components/ui/lightbox"
import { Camera, Eye } from "lucide-react"

interface Photo {
  id: string
  title: string
  description: string
  image_url: string
  created_at: string
}

export function GallerySection() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [visiblePhotos, setVisiblePhotos] = useState(6)

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await fetch("/api/gallery")
        if (response.ok) {
          const data = await response.json()
          setPhotos(data.photos || [])
        }
      } catch (error) {
        console.error("Error fetching photos:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPhotos()
  }, [])

  const loadMore = () => {
    setVisiblePhotos((prev) => prev + 6)
  }

  if (loading) {
    return (
      <section id="gallery" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Galerija radova</h2>
            <p className="text-xl text-gray-600">Pogledajte naše završene projekte</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-64"></div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="gallery" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Galerija radova</h2>
          <p className="text-xl text-gray-600">Pogledajte naše završene projekte i kvalitet našeg rada</p>
        </div>

        {photos.length === 0 ? (
          <div className="text-center py-12">
            <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Galerija se uskoro dopunjuje</h3>
            <p className="text-gray-500">Radimo na dodavanju fotografija naših radova</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {photos.slice(0, visiblePhotos).map((photo) => (
                <Card key={photo.id} className="group overflow-hidden hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="relative">
                      <img
                        src={photo.image_url || "/placeholder.svg"}
                        alt={photo.title}
                        className="w-full h-64 object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center">
                        <Button
                          variant="secondary"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => setSelectedImage(photo.image_url)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Pogledaj
                        </Button>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">{photo.title}</h3>
                      {photo.description && <p className="text-sm text-gray-600">{photo.description}</p>}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {visiblePhotos < photos.length && (
              <div className="text-center mt-12">
                <Button onClick={loadMore} variant="outline" size="lg">
                  Prikaži više radova
                </Button>
              </div>
            )}
          </>
        )}

        {selectedImage && <Lightbox src={selectedImage} alt="Gallery image" onClose={() => setSelectedImage(null)} />}
      </div>
    </section>
  )
}
