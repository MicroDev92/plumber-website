"use client"

import { useState } from "react"
import { Lightbox } from "@/components/ui/lightbox"
import { Expand } from "lucide-react"
import Image from "next/image"
import type { Photo } from "@/lib/gallery"

interface GalleryClientProps {
  initialPhotos: Photo[]
}

export function GalleryClient({ initialPhotos }: GalleryClientProps) {
  const [photos] = useState<Photo[]>(initialPhotos)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

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
    alt: photo.alt_text || photo.title,
    title: photo.title,
    description: photo.description,
  }))

  return (
    <>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {photos.map((photo, index) => (
          <div
            key={photo.id}
            className="relative group overflow-hidden rounded-lg cursor-pointer"
            onClick={() => openLightbox(index)}
          >
            <Image
              src={photo.image_url || "/placeholder.svg"}
              alt={photo.alt_text || photo.title}
              width={400}
              height={300}
              className="w-full h-64 object-cover transition-transform group-hover:scale-105"
              priority={index < 3} // Prioritize first 3 images
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = "/placeholder.svg?height=300&width=400"
              }}
            />

            {/* Featured badge */}
            {photo.is_featured && (
              <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                Izdvojeno
              </div>
            )}

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

      {/* Lightbox */}
      <Lightbox
        images={lightboxImages}
        currentIndex={currentImageIndex}
        isOpen={lightboxOpen}
        onClose={closeLightbox}
        onNext={nextImage}
        onPrevious={previousImage}
      />
    </>
  )
}
