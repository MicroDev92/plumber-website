"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MessageSquare, ImageIcon, BarChart3, LogOut, Phone, Mail, Calendar, Eye, Star, Loader2 } from "lucide-react"
import { TestimonialsAdmin } from "@/components/testimonials-admin"
import { Input, Label } from "@/components/ui/input"

interface Analytics {
  totalViews: number
  monthlyViews: number
  totalInquiries: number
  monthlyInquiries: number
  pendingInquiries: number
  totalTestimonials: number
  publishedTestimonials: number
  averageRating: number
  galleryImages: number
}

interface ContactInquiry {
  id: string
  name: string
  email: string
  phone: string
  message: string
  created_at: string
  status: string
}

interface SiteSettings {
  business_name: string
  phone: string
  email: string
  address: string
  service_area: string
  working_hours: string
  emergency_available: boolean
  description: string
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([])
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [activeTab, setActiveTab] = useState("overview")
  const router = useRouter()

  useEffect(() => {
    // Check authentication
    const checkAuth = () => {
      if (typeof window !== "undefined") {
        const isLoggedIn = localStorage.getItem("adminLoggedIn")
        const loginTime = localStorage.getItem("adminLoginTime")

        if (isLoggedIn === "true" && loginTime) {
          const timeDiff = Date.now() - Number.parseInt(loginTime)
          // Session expires after 24 hours
          if (timeDiff < 24 * 60 * 60 * 1000) {
            setIsAuthenticated(true)
            loadDashboardData()
          } else {
            // Clear expired session
            localStorage.removeItem("adminLoggedIn")
            localStorage.removeItem("adminLoginTime")
            router.replace("/admin/login")
          }
        } else {
          router.replace("/admin/login")
        }
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [router])

  const loadDashboardData = async () => {
    try {
      // Load analytics
      const analyticsRes = await fetch("/api/analytics/inquiries")
      if (analyticsRes.ok) {
        const analyticsData = await analyticsRes.json()
        setAnalytics(analyticsData)
      }

      // Load contact inquiries
      const inquiriesRes = await fetch("/api/contact/inquiries")
      if (inquiriesRes.ok) {
        const inquiriesData = await inquiriesRes.json()
        setInquiries(inquiriesData.inquiries || [])
      }

      // Load settings
      const settingsRes = await fetch("/api/settings")
      if (settingsRes.ok) {
        const settingsData = await settingsRes.json()
        setSettings(settingsData.settings)
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error)
    }
  }

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("adminLoggedIn")
      localStorage.removeItem("adminLoginTime")
      localStorage.removeItem("adminUser")
    }
    router.replace("/admin/login")
  }

  const updateInquiryStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/contact/inquiries/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        // Refresh inquiries
        const inquiriesRes = await fetch("/api/contact/inquiries")
        if (inquiriesRes.ok) {
          const inquiriesData = await inquiriesRes.json()
          setInquiries(inquiriesData.inquiries || [])
        }

        // Refresh analytics
        const analyticsRes = await fetch("/api/analytics/inquiries")
        if (analyticsRes.ok) {
          const analyticsData = await analyticsRes.json()
          setAnalytics(analyticsData)
        }
      }
    } catch (error) {
      console.error("Error updating inquiry status:", error)
    }
  }

  const saveSettings = async (newSettings: SiteSettings) => {
    try {
      const response = await fetch("/api/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newSettings),
      })

      if (response.ok) {
        setSettings(newSettings)
        return true
      }
      return false
    } catch (error) {
      console.error("Error saving settings:", error)
      return false
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Učitavanje...</span>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
                <p className="text-sm text-gray-500">Vodoinstalater Žekić</p>
              </div>
            </div>
            <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2 bg-transparent">
              <LogOut className="h-4 w-4" />
              Odjavi se
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Pregled</TabsTrigger>
            <TabsTrigger value="inquiries">Upiti</TabsTrigger>
            <TabsTrigger value="testimonials">Recenzije</TabsTrigger>
            <TabsTrigger value="settings">Podešavanja</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {analytics && (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Ukupni pregledi</CardTitle>
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analytics.totalViews}</div>
                    <p className="text-xs text-muted-foreground">{analytics.monthlyViews} ovaj mesec</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Kontakt upiti</CardTitle>
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analytics.totalInquiries}</div>
                    <p className="text-xs text-muted-foreground">{analytics.pendingInquiries} na čekanju</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Recenzije</CardTitle>
                    <Star className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analytics.publishedTestimonials}</div>
                    <p className="text-xs text-muted-foreground">Prosek: {analytics.averageRating.toFixed(1)} ⭐</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Galerija</CardTitle>
                    <ImageIcon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analytics.galleryImages}</div>
                    <p className="text-xs text-muted-foreground">Ukupno slika</p>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Recent Inquiries */}
            <Card>
              <CardHeader>
                <CardTitle>Najnoviji upiti</CardTitle>
                <CardDescription>Poslednji kontakt upiti od klijenata</CardDescription>
              </CardHeader>
              <CardContent>
                {inquiries.length > 0 ? (
                  <div className="space-y-4">
                    {inquiries.slice(0, 5).map((inquiry) => (
                      <div key={inquiry.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{inquiry.name}</h4>
                            <Badge variant={inquiry.status === "pending" ? "destructive" : "secondary"}>
                              {inquiry.status === "pending" ? "Na čekanju" : "Obrađen"}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">
                            {inquiry.email} • {inquiry.phone}
                          </p>
                          <p className="text-sm text-gray-500 line-clamp-2">{inquiry.message}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(inquiry.created_at).toLocaleDateString("sr-RS")}
                          </p>
                        </div>
                        {inquiry.status === "pending" && (
                          <Button size="sm" onClick={() => updateInquiryStatus(inquiry.id, "resolved")}>
                            Označi kao obrađen
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">Nema novih upita</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Inquiries Tab */}
          <TabsContent value="inquiries" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Svi kontakt upiti</CardTitle>
                <CardDescription>Upravljajte kontakt upitima od klijenata</CardDescription>
              </CardHeader>
              <CardContent>
                {inquiries.length > 0 ? (
                  <div className="space-y-4">
                    {inquiries.map((inquiry) => (
                      <div key={inquiry.id} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium">{inquiry.name}</h4>
                              <Badge variant={inquiry.status === "pending" ? "destructive" : "secondary"}>
                                {inquiry.status === "pending" ? "Na čekanju" : "Obrađen"}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                              <span className="flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                {inquiry.email}
                              </span>
                              <span className="flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {inquiry.phone}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(inquiry.created_at).toLocaleDateString("sr-RS")}
                              </span>
                            </div>
                          </div>
                          {inquiry.status === "pending" && (
                            <Button size="sm" onClick={() => updateInquiryStatus(inquiry.id, "resolved")}>
                              Označi kao obrađen
                            </Button>
                          )}
                        </div>
                        <div className="bg-gray-50 p-3 rounded">
                          <p className="text-sm">{inquiry.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Alert>
                    <MessageSquare className="h-4 w-4" />
                    <AlertDescription>Trenutno nema kontakt upita.</AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Testimonials Tab */}
          <TabsContent value="testimonials">
            <TestimonialsAdmin />
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <SettingsForm settings={settings} onSave={saveSettings} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

// Settings Form Component
function SettingsForm({
  settings,
  onSave,
}: {
  settings: SiteSettings | null
  onSave: (settings: SiteSettings) => Promise<boolean>
}) {
  const [formData, setFormData] = useState<SiteSettings>({
    business_name: settings?.business_name || "Vodoinstalater Žekić",
    phone: settings?.phone || "+381 60 123 4567",
    email: settings?.email || "info@vodoinstaler-zekic.rs",
    address: settings?.address || "Trebevićka 17, Beograd",
    service_area: settings?.service_area || "Beograd i okolina",
    working_hours: settings?.working_hours || "Ponedeljak - Petak: 08:00 - 20:00, Subota: 09:00 - 15:00",
    emergency_available: settings?.emergency_available || true,
    description: settings?.description || "Profesionalne vodoinstalaterske usluge sa 25 godina iskustva.",
  })
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setSaveMessage("")

    const success = await onSave(formData)

    if (success) {
      setSaveMessage("Podešavanja su uspešno sačuvana!")
    } else {
      setSaveMessage("Greška pri čuvanju podešavanja.")
    }

    setIsSaving(false)
    setTimeout(() => setSaveMessage(""), 3000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Podešavanja sajta</CardTitle>
        <CardDescription>Upravljajte osnovnim informacijama o vašem biznisu</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="business_name">Naziv biznisa</Label>
              <Input
                id="business_name"
                value={formData.business_name}
                onChange={(e) => setFormData((prev) => ({ ...prev, business_name: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefon</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="service_area">Oblast rada</Label>
              <Input
                id="service_area"
                value={formData.service_area}
                onChange={(e) => setFormData((prev) => ({ ...prev, service_area: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Adresa</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="working_hours">Radno vreme</Label>
            <Input
              id="working_hours"
              value={formData.working_hours}
              onChange={(e) => setFormData((prev) => ({ ...prev, working_hours: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Opis biznisa</Label>
            <textarea
              id="description"
              className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="emergency_available"
              checked={formData.emergency_available}
              onChange={(e) => setFormData((prev) => ({ ...prev, emergency_available: e.target.checked }))}
              className="rounded border-gray-300 focus:ring-blue-500"
            />
            <Label htmlFor="emergency_available">Dostupan za hitne slučajeve</Label>
          </div>

          {saveMessage && (
            <Alert
              className={saveMessage.includes("uspešno") ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}
            >
              <AlertDescription className={saveMessage.includes("uspešno") ? "text-green-800" : "text-red-800"}>
                {saveMessage}
              </AlertDescription>
            </Alert>
          )}

          <Button type="submit" disabled={isSaving} className="w-full md:w-auto">
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Čuvanje...
              </>
            ) : (
              "Sačuvaj podešavanja"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
