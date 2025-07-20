"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Lightbox } from "@/components/ui/lightbox"
import { Camera, Calendar, MapPin, Eye } from "lucide-react"
import Image from "next/image"

interface GalleryItem {
  id: string
  title: string
  description: string
  image_url: string
  category: string
  location: string
  date_completed: string
  views: number
  created_at: string
}

export function GallerySection() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null)
  const [loading, setLoading] = useState(true)

  const categories = [
    { id: "all", label: "Sve kategorije" },
    { id: "bathroom", label: "Kupatila" },
    { id: "kitchen", label: "Kuhinje" },
    { id: "pipes", label: "Cevi i instalacije" },
    { id: "emergency", label: "Hitne intervencije" },
    { id: "boiler", label: "Bojleri" },
  ]

  useEffect(() => {
    fetchGalleryItems()
  }, [])

  const fetchGalleryItems = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/gallery", {
        cache: "no-store",
      })
      const result = await response.json()

      if (result.success) {
        setGalleryItems(result.items || [])
      }
    } catch (error) {
      console.error("Failed to fetch gallery items:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredItems = galleryItems.filter((item) =>
    selectedCategory === "all" ? true : item.category === selectedCategory,
  )

  const handleImageClick = async (item: GalleryItem) => {
    setSelectedImage(item)
    setLightboxOpen(true)

    // Track view
    try {
      await fetch("/api/track-view", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "gallery",
          item_id: item.id,
        }),
      })
    } catch (error) {
      console.error("Failed to track view:", error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("sr-RS", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <section id="gallery" className="py-12 md:py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">Galerija radova</h3>
          <p className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto">
            Pogledajte naše završene projekte i uverite se u kvalitet našeg rada
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-8 md:mb-12">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className={`text-xs md:text-sm ${
                selectedCategory === category.id
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "hover:bg-blue-50 hover:text-blue-600"
              }`}
            >
              {category.label}
            </Button>
          ))}
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[...Array(6)].map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="aspect-video bg-gray-200 animate-pulse" />
                <CardContent className="p-4">
                  <div className="h-4 bg-gray-200 rounded animate-pulse mb-2" />
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredItems.map((item) => (
              <Card
                key={item.id}
                className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
                onClick={() => handleImageClick(item)}
              >
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={item.image_url || "/placeholder.svg"}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                    <Camera className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <Badge className="absolute top-2 left-2 bg-blue-600 text-white">
                    {categories.find((cat) => cat.id === item.category)?.label || item.category}
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <h4 className="font-semibold text-slate-900 mb-2 line-clamp-2">{item.title}</h4>
                  <p className="text-sm text-slate-600 mb-3 line-clamp-2">{item.description}</p>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span>{item.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(item.date_completed)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mt-2 text-xs text-slate-500">
                    <Eye className="h-3 w-3" />
                    <span>{item.views} pregleda</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Camera className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-slate-900 mb-2">Nema radova u ovoj kategoriji</h4>
            <p className="text-slate-600">Pokušajte sa drugom kategorijom ili se vratite kasnije.</p>
          </div>
        )}

        {/* Lightbox */}
        {selectedImage && (
          <Lightbox
            isOpen={lightboxOpen}
            onClose={() => {
              setLightboxOpen(false)
              setSelectedImage(null)
            }}
            images={[
              {
                src: selectedImage.image_url,
                alt: selectedImage.title,
                title: selectedImage.title,
                description: selectedImage.description,
              },
            ]}
            currentIndex={0}
          />
        )}
      </div>
    </section>
  )
}
