"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Lightbox } from "@/components/ui/lightbox"
import { Camera, ExternalLink } from "lucide-react"

interface GalleryPhoto {
  id: string
  title: string
  description: string | null
  image_url: string
  created_at: string
}

export function GallerySection() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [visiblePhotos, setVisiblePhotos] = useState(6)

  useEffect(() => {
    fetchPhotos()
  }, [])

  const fetchPhotos = async () => {
    try {
      const response = await fetch("/api/gallery")
      if (response.ok) {
        const data = await response.json()
        setPhotos(data.photos || [])
      }
    } catch (error) {
      console.error("Failed to fetch photos:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadMore = () => {
    setVisiblePhotos((prev) => prev + 6)
  }

  if (loading) {
    return (
      <section id="gallery" className="py-12 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">Galerija radova</h3>
            <p className="text-base md:text-lg text-slate-600">Pogledajte naše završene projekte</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <div className="aspect-square bg-gray-200 animate-pulse" />
              </Card>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="gallery" className="py-12 md:py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">Galerija radova</h3>
          <p className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto">
            Pogledajte naše završene projekte i kvalitet rada koji pružamo našim klijentima
          </p>
        </div>

        {photos.length === 0 ? (
          <div className="text-center py-12">
            <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Trenutno nema fotografija u galeriji.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {photos.slice(0, visiblePhotos).map((photo) => (
                <Card key={photo.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                  <CardContent className="p-0">
                    <div className="relative aspect-square">
                      <Image
                        src={photo.image_url || "/placeholder.svg"}
                        alt={photo.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                        <Button
                          variant="secondary"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => setSelectedImage(photo.image_url)}
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Uvećaj
                        </Button>
                      </div>
                    </div>
                    {photo.title && (
                      <div className="p-4">
                        <h4 className="font-semibold text-slate-900 mb-1">{photo.title}</h4>
                        {photo.description && <p className="text-sm text-slate-600">{photo.description}</p>}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {visiblePhotos < photos.length && (
              <div className="text-center mt-8">
                <Button onClick={loadMore} variant="outline" size="lg">
                  Prikaži više fotografija
                </Button>
              </div>
            )}
          </>
        )}

        {selectedImage && <Lightbox src={selectedImage} onClose={() => setSelectedImage(null)} />}
      </div>
    </section>
  )
}
