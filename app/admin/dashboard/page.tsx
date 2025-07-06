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
import { Alert, AlertDescription } from "@/components/ui/alert"
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
  CheckCircle,
  AlertCircle,
  Save,
  Loader2,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { TestimonialsAdmin } from "@/components/testimonials-admin"

// Analytics data interface
interface AnalyticsData {
  totalPhotos: number
  monthlyVisits: number
  totalInquiries: number
  pendingInquiries: number
  isLoading: boolean
  lastUpdated: string | null
  dataSource: string
  averageRating?: number
}

interface Photo {
  id: string | number
  title: string
  description: string
  image_url: string
  created_at?: string
}

interface SiteSettings {
  business_name: string
  phone: string
  email: string
  service_area: string
  description: string
  address: string
  working_hours: string
  emergency_available: boolean
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
    averageRating: 0,
  })

  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [newPhoto, setNewPhoto] = useState({
    title: "",
    description: "",
    file: null as File | null,
  })
  const [isUploading, setIsUploading] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteStatus, setDeleteStatus] = useState<{ type: "success" | "error" | null; message: string }>({
    type: null,
    message: "",
  })

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const [inquiries, setInquiries] = useState<any[]>([])
  const [isLoadingInquiries, setIsLoadingInquiries] = useState(false)

  // Settings state
  const [settings, setSettings] = useState<SiteSettings>({
    business_name: "Vodoinstalater Žekić",
    phone: "+381 60 123 4567",
    email: "info@vodoinstaler-zekic.rs",
    service_area: "Beograd i okolina",
    description: "Profesionalne vodoinstalaterske usluge sa preko 25 godina iskustva.",
    address: "Trebevićka 17, Beograd",
    working_hours: "Ponedeljak - Petak: 08:00 - 20:00, Subota: 09:00 - 17:00",
    emergency_available: true,
  })
  const [isLoadingSettings, setIsLoadingSettings] = useState(false)
  const [isSavingSettings, setIsSavingSettings] = useState(false)
  const [settingsStatus, setSettingsStatus] = useState<{ type: "success" | "error" | null; message: string }>({
    type: null,
    message: "",
  })

  const router = useRouter()

  useEffect(() => {
    const checkAuth = () => {
      console.log("🔍 Checking authentication...")

      if (typeof window !== "undefined") {
        const isLoggedIn = localStorage.getItem("adminLoggedIn")
        const loginTime = localStorage.getItem("adminLoginTime")

        console.log("📊 Auth check - isLoggedIn:", isLoggedIn)
        console.log("⏰ Auth check - loginTime:", loginTime)

        if (isLoggedIn === "true" && loginTime) {
          const timeDiff = Date.now() - Number.parseInt(loginTime)
          console.log("⏱️ Time difference:", timeDiff)

          // Session expires after 24 hours
          if (timeDiff < 24 * 60 * 60 * 1000) {
            console.log("✅ Valid session, loading dashboard...")
            setIsAuthenticated(true)
            fetchAnalytics()
            fetchPhotos()
            fetchInquiries()
            fetchSettings()
          } else {
            console.log("⏰ Session expired, redirecting to login...")
            localStorage.removeItem("adminLoggedIn")
            localStorage.removeItem("adminLoginTime")
            localStorage.removeItem("adminUser")
            router.replace("/admin/login")
          }
        } else {
          console.log("❌ No valid session, redirecting to login...")
          router.replace("/admin/login")
        }
      }
      setIsCheckingAuth(false)
    }

    checkAuth()
  }, [router])

  const fetchPhotos = async () => {
    try {
      console.log("📸 Fetching photos...")
      const response = await fetch("/api/gallery", {
        cache: "no-store",
      })
      const result = await response.json()

      if (result.success && result.photos) {
        console.log("✅ Photos loaded:", result.photos.length)
        setPhotos(result.photos)
      }
    } catch (error) {
      console.error("❌ Failed to fetch photos:", error)
    }
  }

  const fetchAnalytics = async () => {
    setAnalytics((prev) => ({ ...prev, isLoading: true }))
    console.log("📊 Fetching analytics...")

    try {
      // Fetch all analytics data in parallel
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

      console.log("📈 Analytics data loaded:", { websiteData, inquiriesData, galleryData })

      setAnalytics({
        totalPhotos: galleryData.total || photos.length,
        monthlyVisits: websiteData.visits || 0,
        totalInquiries: inquiriesData.monthly || 0,
        pendingInquiries: inquiriesData.pending || 0,
        isLoading: false,
        lastUpdated: new Date().toLocaleString("sr-RS"),
        dataSource: websiteData.source || "demo",
        averageRating: inquiriesData.averageRating || 0,
      })
    } catch (error) {
      console.error("❌ Failed to fetch analytics:", error)

      // Fallback to demo data
      setAnalytics({
        totalPhotos: photos.length,
        monthlyVisits: 0,
        totalInquiries: 0,
        pendingInquiries: 0,
        isLoading: false,
        lastUpdated: new Date().toLocaleString("sr-RS"),
        dataSource: "production",
        averageRating: 0,
      })
    }
  }

  const handleLogout = () => {
    console.log("🚪 Logging out...")
    if (typeof window !== "undefined") {
      localStorage.removeItem("adminLoggedIn")
      localStorage.removeItem("adminLoginTime")
      localStorage.removeItem("adminUser")
    }
    router.replace("/admin/login")
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
        // Refresh photos list immediately
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

    setDeleteStatus({ type: null, message: "" })

    try {
      const response = await fetch(`/api/gallery/${id}`, {
        method: "DELETE",
      })

      const result = await response.json()

      if (response.ok && result.success) {
        // Immediately refresh the photos list
        await fetchPhotos()

        setDeleteStatus({
          type: "success",
          message: result.message || "Fotografija je obrisana",
        })

        // Clear status after 3 seconds
        setTimeout(() => setDeleteStatus({ type: null, message: "" }), 3000)
      } else {
        setDeleteStatus({
          type: "error",
          message: result.message || "Greška pri brisanju fotografije",
        })
      }
    } catch (error) {
      console.error("Delete error:", error)
      setDeleteStatus({
        type: "error",
        message: "Greška pri brisanju fotografije",
      })
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

  const updateInquiryStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/contact/inquiries/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        await fetchInquiries()
        alert(`Upit je označen kao ${status === "resolved" ? "obrađen" : "na čekanju"}`)
      }
    } catch (error) {
      console.error("Failed to update inquiry status:", error)
      alert("Greška pri ažuriranju statusa upita")
    }
  }

  const fetchInquiries = async () => {
    try {
      setIsLoadingInquiries(true)
      const response = await fetch("/api/contact/inquiries", {
        cache: "no-store",
      })
      const result = await response.json()

      if (result.success) {
        setInquiries(result.inquiries || [])
      }
    } catch (error) {
      console.error("Failed to fetch inquiries:", error)
    } finally {
      setIsLoadingInquiries(false)
    }
  }

  const fetchSettings = async () => {
    try {
      setIsLoadingSettings(true)
      const response = await fetch("/api/settings", {
        cache: "no-store",
      })
      const result = await response.json()

      if (result.success) {
        setSettings(result.settings)
      }
    } catch (error) {
      console.error("Failed to fetch settings:", error)
    } finally {
      setIsLoadingSettings(false)
    }
  }

  const handleSettingsChange = (field: keyof SiteSettings, value: string | boolean) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const saveSettings = async () => {
    try {
      setIsSavingSettings(true)
      setSettingsStatus({ type: null, message: "" })

      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      })

      const result = await response.json()

      if (result.success) {
        setSettingsStatus({
          type: "success",
          message: "Podešavanja su uspešno sačuvana!",
        })
        // Clear success message after 3 seconds
        setTimeout(() => setSettingsStatus({ type: null, message: "" }), 3000)
      } else {
        setSettingsStatus({
          type: "error",
          message: result.message || "Greška pri čuvanju podešavanja",
        })
      }
    } catch (error) {
      console.error("Failed to save settings:", error)
      setSettingsStatus({
        type: "error",
        message: "Greška pri čuvanju podešavanja",
      })
    } finally {
      setIsSavingSettings(false)
    }
  }

  // Convert photos to lightbox format
  const lightboxImages = photos.map((photo) => ({
    id: photo.id.toString(),
    src: photo.image_url || "/placeholder.svg?height=800&width=1200",
    alt: photo.title,
    title: photo.title,
    description: photo.description,
  }))

  // Show loading screen while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          <span className="text-gray-600">Proverava se autentifikacija...</span>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
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
                  <p className="text-sm text-gray-500">Vodoinstalater Žekić</p>
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
          {/* Delete Status Alert */}
          {deleteStatus.type && (
            <div
              className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
                deleteStatus.type === "success"
                  ? "bg-green-50 border border-green-200"
                  : "bg-red-50 border border-red-200"
              }`}
            >
              {deleteStatus.type === "success" ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-600" />
              )}
              <span className={deleteStatus.type === "success" ? "text-green-800" : "text-red-800"}>
                {deleteStatus.message}
              </span>
            </div>
          )}

          {/* Data Source Badge */}
          <div className="mb-6">
            <Badge variant={analytics.dataSource === "vercel" ? "default" : "secondary"} className="mb-2">
              {analytics.dataSource === "vercel" && "📊 Vercel Analytics"}
              {analytics.dataSource === "production" && "🚀 Produkcijski podaci"}
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
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="gallery">Galerija fotografija</TabsTrigger>
              <TabsTrigger value="inquiries">Upiti</TabsTrigger>
              <TabsTrigger value="testimonials">Recenzije</TabsTrigger>
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

            <TabsContent value="inquiries" className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Upravljanje upitima</h2>
                  <p className="text-gray-600">Pregledajte i odgovorite na kontakt upite</p>
                </div>
                <Button variant="outline" size="sm" onClick={fetchInquiries} disabled={isLoadingInquiries}>
                  <RefreshCw className={`h-4 w-4 mr-2 ${isLoadingInquiries ? "animate-spin" : ""}`} />
                  Osveži
                </Button>
              </div>

              {isLoadingInquiries ? (
                <div className="flex justify-center items-center py-12">
                  <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
                  <span className="ml-2 text-gray-600">Učitavanje upita...</span>
                </div>
              ) : inquiries.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Nema upita</h3>
                    <p className="text-gray-600">Kada klijenti pošalju kontakt formu, upiti će se pojaviti ovde</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {inquiries.map((inquiry) => (
                    <Card key={inquiry.id} className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">{inquiry.name}</h3>
                          <p className="text-gray-600">{inquiry.email}</p>
                          {inquiry.phone && <p className="text-gray-600">{inquiry.phone}</p>}
                          {inquiry.service && (
                            <Badge variant="outline" className="mt-1">
                              {inquiry.service}
                            </Badge>
                          )}
                        </div>
                        <div className="text-right">
                          <Badge variant={inquiry.status === "pending" ? "destructive" : "default"}>
                            {inquiry.status === "pending" ? "Na čekanju" : "Obrađeno"}
                          </Badge>
                          <p className="text-sm text-gray-500 mt-1">
                            {new Date(inquiry.created_at).toLocaleDateString("sr-RS")}
                          </p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <h4 className="font-medium mb-2">Poruka:</h4>
                        <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{inquiry.message}</p>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Mail className="h-4 w-4 mr-2" />
                          Odgovori
                        </Button>
                        <Button
                          size="sm"
                          variant={inquiry.status === "pending" ? "default" : "outline"}
                          onClick={() =>
                            updateInquiryStatus(inquiry.id, inquiry.status === "pending" ? "resolved" : "pending")
                          }
                        >
                          {inquiry.status === "pending" ? "Označi kao obrađeno" : "Označi kao na čekanju"}
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="testimonials" className="space-y-6">
              <TestimonialsAdmin />
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
                <CardContent className="space-y-6">
                  {/* Settings Status Alert */}
                  {settingsStatus.type && (
                    <Alert
                      className={`${
                        settingsStatus.type === "success" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
                      }`}
                    >
                      {settingsStatus.type === "success" ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-red-600" />
                      )}
                      <AlertDescription
                        className={settingsStatus.type === "success" ? "text-green-800" : "text-red-800"}
                      >
                        {settingsStatus.message}
                      </AlertDescription>
                    </Alert>
                  )}

                  {isLoadingSettings ? (
                    <div className="flex justify-center items-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                      <span className="ml-2 text-gray-600">Učitavanje podešavanja...</span>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="business-name">Naziv firme</Label>
                          <Input
                            id="business-name"
                            value={settings.business_name}
                            onChange={(e) => handleSettingsChange("business_name", e.target.value)}
                            placeholder="Vodoinstalater Žekić"
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Broj telefona</Label>
                          <Input
                            id="phone"
                            value={settings.phone}
                            onChange={(e) => handleSettingsChange("phone", e.target.value)}
                            placeholder="+381 60 123 4567"
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={settings.email}
                            onChange={(e) => handleSettingsChange("email", e.target.value)}
                            placeholder="info@vodoinstaler-zekic.rs"
                          />
                        </div>
                        <div>
                          <Label htmlFor="service-area">Oblast rada</Label>
                          <Input
                            id="service-area"
                            value={settings.service_area}
                            onChange={(e) => handleSettingsChange("service_area", e.target.value)}
                            placeholder="Beograd i okolina"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="address">Adresa</Label>
                        <Input
                          id="address"
                          value={settings.address}
                          onChange={(e) => handleSettingsChange("address", e.target.value)}
                          placeholder="Trebevićka 17, Beograd"
                        />
                      </div>

                      <div>
                        <Label htmlFor="working-hours">Radno vreme</Label>
                        <Input
                          id="working-hours"
                          value={settings.working_hours}
                          onChange={(e) => handleSettingsChange("working_hours", e.target.value)}
                          placeholder="Ponedeljak - Petak: 08:00 - 20:00"
                        />
                      </div>

                      <div>
                        <Label htmlFor="description">Opis poslovanja</Label>
                        <Textarea
                          id="description"
                          value={settings.description}
                          onChange={(e) => handleSettingsChange("description", e.target.value)}
                          rows={4}
                          placeholder="Profesionalne vodoinstalaterske usluge sa preko 25 godina iskustva..."
                        />
                      </div>

                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="emergency-available"
                          checked={settings.emergency_available}
                          onChange={(e) => handleSettingsChange("emergency_available", e.target.checked)}
                          className="rounded border-gray-300"
                        />
                        <Label htmlFor="emergency-available">Dostupan za hitne intervencije</Label>
                      </div>

                      <Button
                        onClick={saveSettings}
                        className="bg-blue-600 hover:bg-blue-700"
                        disabled={isSavingSettings}
                      >
                        {isSavingSettings ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Čuvanje...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Sačuvaj izmene
                          </>
                        )}
                      </Button>
                    </>
                  )}
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
