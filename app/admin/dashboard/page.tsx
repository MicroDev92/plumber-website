"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Lightbox } from "@/components/ui/lightbox"
import {
  Wrench,
  Upload,
  ImageIcon,
  Trash2,
  Edit,
  Plus,
  LogOut,
  BarChart3,
  Phone,
  Mail,
  RefreshCw,
  TrendingUp,
  Expand,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

// Analytics data interface
interface AnalyticsData {
  totalPhotos: number
  monthlyVisits: number
  totalInquiries: number
  pendingInquiries: number
  isLoading: boolean
  lastUpdated: string | null
  dataSource: string
}

interface Photo {
  id: string | number
  title: string
  description: string
  image_url: string
  created_at?: string
}

export default function AdminDashboard() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalPhotos: 0,
    monthlyVisits: 0,
    totalInquiries: 0,
    pendingInquiries: 0,
    isLoading: true,
    lastUpdated: null,
    dataSource: "loading",
  })

  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [newPhoto, setNewPhoto] = useState({
    title: "",
    description: "",
    file: null as File | null,
  })
  const [isUploading, setIsUploading] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const router = useRouter()

  useEffect(() => {
    const auth = localStorage.getItem("adminAuth")
    if (auth === "true") {
      setIsAuthenticated(true)
      fetchAnalytics()
      fetchPhotos()
    } else {
      router.push("/admin/login")
    }
  }, [router])

  const fetchPhotos = async () => {
    try {
      const response = await fetch("/api/gallery")
      const result = await response.json()

      if (result.success && result.photos) {
        setPhotos(result.photos)
      }
    } catch (error) {
      console.error("Failed to fetch photos:", error)
    }
  }

  const fetchAnalytics = async () => {
    setAnalytics((prev) => ({ ...prev, isLoading: true }))

    try {
      // Fetch all analytics data in parallel (all free)
      const [websiteResponse, inquiriesResponse, galleryResponse] = await Promise.all([
        fetch("/api/analytics/website"),
        fetch("/api/analytics/inquiries"),
        fetch("/api/analytics/gallery"),
      ])

      const [websiteData, inquiriesData, galleryData] = await Promise.all([
        websiteResponse.json(),
        inquiriesResponse.json(),
        galleryResponse.json(),
      ])

      setAnalytics({
        totalPhotos: galleryData.total || photos.length,
        monthlyVisits: websiteData.visits || 0,
        totalInquiries: inquiriesData.monthly || 0,
        pendingInquiries: inquiriesData.pending || 0,
        isLoading: false,
        lastUpdated: new Date().toLocaleString("sr-RS"),
        dataSource: websiteData.source || "demo",
      })
    } catch (error) {
      console.error("Failed to fetch analytics:", error)

      // Fallback to demo data
      setAnalytics({
        totalPhotos: photos.length,
        monthlyVisits: 1234,
        totalInquiries: 12,
        pendingInquiries: 3,
        isLoading: false,
        lastUpdated: new Date().toLocaleString("sr-RS"),
        dataSource: "fallback",
      })
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("adminAuth")
    router.push("/admin/login")
  }

  const handlePhotoUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPhoto.title || !newPhoto.description || !newPhoto.file) {
      alert("Molimo popunite sva polja i izaberite fotografiju")
      return
    }

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append("file", newPhoto.file)
      formData.append("title", newPhoto.title)
      formData.append("description", newPhoto.description)

      const response = await fetch("/api/gallery/upload", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (result.success) {
        // Refresh photos list
        await fetchPhotos()

        // Reset form
        setNewPhoto({ title: "", description: "", file: null })
        setDialogOpen(false)

        alert("Fotografija je uspešno dodana!")
      } else {
        alert(result.message || "Greška pri dodavanju fotografije")
      }
    } catch (error) {
      console.error("Upload error:", error)
      alert("Greška pri dodavanju fotografije")
    } finally {
      setIsUploading(false)
    }
  }

  const deletePhoto = async (id: string | number) => {
    if (!confirm("Da li ste sigurni da želite da obrišete ovu fotografiju?")) {
      return
    }

    try {
      const response = await fetch(`/api/gallery/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        await fetchPhotos()
        alert("Fotografija je obrisana")
      } else {
        alert("Greška pri brisanju fotografije")
      }
    } catch (error) {
      console.error("Delete error:", error)
      alert("Greška pri brisanju fotografije")
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
    id: photo.id.toString(),
    src: photo.image_url || "/placeholder.svg?height=800&width=1200",
    alt: photo.title,
    title: photo.title,
    description: photo.description,
  }))

  if (!isAuthenticated) {
    return <div>Učitavanje...</div>
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center gap-3">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <Wrench className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Admin panel</h1>
                  <p className="text-sm text-gray-500">Vodoinstalater Zekić</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-500">
                  {analytics.lastUpdated && <span>Poslednje ažuriranje: {analytics.lastUpdated}</span>}
                </div>
                <Button variant="outline" size="sm" onClick={fetchAnalytics} disabled={analytics.isLoading}>
                  <RefreshCw className={`h-4 w-4 mr-2 ${analytics.isLoading ? "animate-spin" : ""}`} />
                  Osveži
                </Button>
                <Link href="/">
                  <Button variant="outline" size="sm">
                    Pogledaj sajt
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Odjava
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Data Source Badge */}
          <div className="mb-6">
            <Badge variant={analytics.dataSource === "vercel" ? "default" : "secondary"} className="mb-2">
              {analytics.dataSource === "vercel" && "📊 Vercel Analytics"}
              {analytics.dataSource === "demo" && "🎯 Demo podaci"}
              {analytics.dataSource === "fallback" && "⚠️ Rezervni podaci"}
              {analytics.dataSource === "loading" && "⏳ Učitavanje..."}
            </Badge>
            <p className="text-sm text-gray-600">
              Koriste se besplatni izvori podataka. Za naprednu analitiku, dodajte Google Analytics.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Ukupno fotografija</p>
                    <p className="text-2xl font-bold text-gray-900">{analytics.isLoading ? "..." : photos.length}</p>
                    <p className="text-xs text-green-600 flex items-center mt-1">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Aktivno praćenje
                    </p>
                  </div>
                  <ImageIcon className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Mesečne posete</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {analytics.isLoading ? "..." : analytics.monthlyVisits.toLocaleString()}
                    </p>
                    <p className="text-xs text-blue-600 flex items-center mt-1">
                      <BarChart3 className="h-3 w-3 mr-1" />
                      Poslednji mesec
                    </p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Mesečni upiti</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {analytics.isLoading ? "..." : analytics.totalInquiries}
                    </p>
                    <p className="text-xs text-orange-600 flex items-center mt-1">
                      <Mail className="h-3 w-3 mr-1" />
                      Kontakt forma
                    </p>
                  </div>
                  <Mail className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Upiti na čekanju</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {analytics.isLoading ? "..." : analytics.pendingInquiries}
                    </p>
                    <p className="text-xs text-purple-600 flex items-center mt-1">
                      <Phone className="h-3 w-3 mr-1" />
                      Zahtevaju odgovor
                    </p>
                  </div>
                  <Phone className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="gallery" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="gallery">Galerija fotografija</TabsTrigger>
              <TabsTrigger value="services">Usluge</TabsTrigger>
              <TabsTrigger value="settings">Podešavanja</TabsTrigger>
            </TabsList>

            <TabsContent value="gallery" className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Galerija fotografija</h2>
                  <p className="text-gray-600">Upravljajte fotografijama vaših radova</p>
                </div>

                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Dodaj fotografiju
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Dodaj novu fotografiju</DialogTitle>
                      <DialogDescription>
                        Otpremite novu fotografiju da pokažete vaše vodoinstalaterske radove
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handlePhotoUpload} className="space-y-4">
                      <div>
                        <Label htmlFor="photo-title">Naslov</Label>
                        <Input
                          id="photo-title"
                          value={newPhoto.title}
                          onChange={(e) => setNewPhoto((prev) => ({ ...prev, title: e.target.value }))}
                          placeholder="npr. Ugradnja kupatila"
                          required
                          disabled={isUploading}
                        />
                      </div>
                      <div>
                        <Label htmlFor="photo-description">Opis</Label>
                        <Textarea
                          id="photo-description"
                          value={newPhoto.description}
                          onChange={(e) => setNewPhoto((prev) => ({ ...prev, description: e.target.value }))}
                          placeholder="Kratak opis rada"
                          required
                          disabled={isUploading}
                        />
                      </div>
                      <div>
                        <Label htmlFor="photo-file">Fotografija</Label>
                        <Input
                          id="photo-file"
                          type="file"
                          accept="image/*"
                          onChange={(e) => setNewPhoto((prev) => ({ ...prev, file: e.target.files?.[0] || null }))}
                          required
                          disabled={isUploading}
                        />
                        {newPhoto.file && (
                          <p className="text-sm text-gray-500 mt-1">Izabrana datoteka: {newPhoto.file.name}</p>
                        )}
                      </div>
                      <Button type="submit" className="w-full" disabled={isUploading}>
                        {isUploading ? (
                          <>
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            Otprema u toku...
                          </>
                        ) : (
                          <>
                            <Upload className="h-4 w-4 mr-2" />
                            Otpremi fotografiju
                          </>
                        )}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              {photos.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Nema fotografija</h3>
                    <p className="text-gray-600 mb-4">Dodajte prve fotografije vaših radova</p>
                    <Button onClick={() => setDialogOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Dodaj prvu fotografiju
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {photos.map((photo, index) => (
                    <Card key={photo.id} className="overflow-hidden group">
                      <div className="relative">
                        <Image
                          src={photo.image_url || "/placeholder.svg?height=300&width=400"}
                          alt={photo.title}
                          width={400}
                          height={300}
                          className="w-full h-48 object-cover cursor-pointer transition-transform group-hover:scale-105"
                          onClick={() => openLightbox(index)}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.src = "/placeholder.svg?height=300&width=400"
                          }}
                        />
                        <div className="absolute top-2 right-2 flex gap-2">
                          <Button
                            size="sm"
                            variant="secondary"
                            className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => openLightbox(index)}
                          >
                            <Expand className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => deletePhoto(photo.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-1">{photo.title}</h3>
                        <p className="text-sm text-gray-600">{photo.description}</p>
                        {photo.created_at && (
                          <p className="text-xs text-gray-400 mt-2">
                            Dodano: {new Date(photo.created_at).toLocaleDateString("sr-RS")}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="services" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Upravljanje uslugama</CardTitle>
                  <CardDescription>Upravljajte vašim vodoinstalaterskim uslugama i cenama</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Funkcije upravljanja uslugama uskoro...</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Podešavanja sajta</CardTitle>
                  <CardDescription>Ažurirajte informacije o vašem poslu i kontakt podatke</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="business-name">Naziv firme</Label>
                      <Input id="business-name" defaultValue="Vodoinstalater Zekić" />
                    </div>
                    <div>
                      <Label htmlFor="phone">Broj telefona</Label>
                      <Input id="phone" defaultValue="+381 60 123 4567" />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" defaultValue="info@vodoinstaler-zekic.rs" />
                    </div>
                    <div>
                      <Label htmlFor="service-area">Oblast rada</Label>
                      <Input id="service-area" defaultValue="Beograd i okolina" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="description">Opis poslovanja</Label>
                    <Textarea
                      id="description"
                      defaultValue="Profesionalne vodoinstalaterske usluge sa preko 15 godina iskustva..."
                      rows={4}
                    />
                  </div>
                  <Button className="bg-blue-600 hover:bg-blue-700">Sačuvaj izmene</Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
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
