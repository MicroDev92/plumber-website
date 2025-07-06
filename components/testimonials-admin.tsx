"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Star, Eye, Check, X, Trash2, Clock, MapPin, Wrench, RefreshCw } from "lucide-react"

interface Testimonial {
  id: string
  name: string
  text: string
  rating: number
  service?: string
  location?: string
  is_featured: boolean
  is_published: boolean
  created_at: string
}

export function TestimonialsAdmin() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null)

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    try {
      setIsLoading(true)
      console.log("Fetching testimonials...")

      const response = await fetch("/api/testimonials", {
        cache: "no-store",
      })
      const result = await response.json()

      console.log("Testimonials API response:", result)

      if (result.success) {
        setTestimonials(result.testimonials || [])
      } else {
        console.error("Failed to fetch testimonials:", result)
        setTestimonials([])
      }
    } catch (error) {
      console.error("Failed to fetch testimonials:", error)
      setTestimonials([])
    } finally {
      setIsLoading(false)
    }
  }

  const updateTestimonial = async (id: string, updates: Partial<Testimonial>) => {
    try {
      const response = await fetch(`/api/testimonials/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      })

      if (response.ok) {
        await fetchTestimonials()
        return true
      }
      return false
    } catch (error) {
      console.error("Update error:", error)
      return false
    }
  }

  const deleteTestimonial = async (id: string) => {
    if (!confirm("Da li ste sigurni da želite da obrišete ovu recenziju?")) {
      return
    }

    try {
      const response = await fetch(`/api/testimonials/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        await fetchTestimonials()
        alert("Recenzija je obrisana")
      } else {
        alert("Greška pri brisanju recenzije")
      }
    } catch (error) {
      console.error("Delete error:", error)
      alert("Greška pri brisanju recenzije")
    }
  }

  const approveTestimonial = async (id: string) => {
    const success = await updateTestimonial(id, { is_published: true })
    if (success) {
      alert("Recenzija je odobrena i objavljena!")
    }
  }

  const rejectTestimonial = async (id: string) => {
    const success = await updateTestimonial(id, { is_published: false })
    if (success) {
      alert("Recenzija je povučena sa objave")
    }
  }

  const toggleFeatured = async (id: string, currentStatus: boolean) => {
    const success = await updateTestimonial(id, { is_featured: !currentStatus })
    if (success) {
      alert(currentStatus ? "Recenzija nije više izdvojena" : "Recenzija je izdvojena!")
    }
  }

  const pendingTestimonials = testimonials.filter((t) => !t.is_published)
  const publishedTestimonials = testimonials.filter((t) => t.is_published)

  const TestimonialCard = ({
    testimonial,
    showActions = true,
  }: { testimonial: Testimonial; showActions?: boolean }) => (
    <Card className="mb-4">
      <CardContent className="p-3 sm:p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <h4 className="font-semibold text-sm sm:text-base truncate">{testimonial.name}</h4>
            {testimonial.is_featured && <Badge className="bg-blue-100 text-blue-800 text-xs shrink-0">Izdvojeno</Badge>}
            {!testimonial.is_published && (
              <Badge variant="secondary" className="text-xs shrink-0">
                Na čekanju
              </Badge>
            )}
          </div>
          <div className="flex shrink-0">
            {[...Array(testimonial.rating)].map((_, i) => (
              <Star key={i} className="h-3 w-3 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
        </div>

        <p className="text-gray-700 mb-3 italic text-sm line-clamp-3">"{testimonial.text}"</p>

        <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500 mb-3 flex-wrap">
          {testimonial.service && (
            <div className="flex items-center gap-1">
              <Wrench className="h-3 w-3" />
              <span className="truncate">{testimonial.service}</span>
            </div>
          )}
          {testimonial.location && (
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span className="truncate">{testimonial.location}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{new Date(testimonial.created_at).toLocaleDateString("sr-RS")}</span>
          </div>
        </div>

        {showActions && (
          <div className="flex gap-1 sm:gap-2 flex-wrap">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedTestimonial(testimonial)}
                  className="text-xs"
                >
                  <Eye className="h-3 w-3 mr-1" />
                  <span className="hidden sm:inline">Detalji</span>
                </Button>
              </DialogTrigger>
            </Dialog>

            {!testimonial.is_published ? (
              <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-xs"
                onClick={() => approveTestimonial(testimonial.id)}
              >
                <Check className="h-3 w-3 mr-1" />
                <span className="hidden sm:inline">Odobri</span>
              </Button>
            ) : (
              <Button size="sm" variant="outline" onClick={() => rejectTestimonial(testimonial.id)} className="text-xs">
                <X className="h-3 w-3 mr-1" />
                <span className="hidden sm:inline">Povuci</span>
              </Button>
            )}

            <Button
              size="sm"
              variant="outline"
              onClick={() => toggleFeatured(testimonial.id, testimonial.is_featured)}
              className="text-xs"
            >
              <Star className={`h-3 w-3 mr-1 ${testimonial.is_featured ? "fill-yellow-400 text-yellow-400" : ""}`} />
              <span className="hidden sm:inline">{testimonial.is_featured ? "Ukloni" : "Izdvoj"}</span>
            </Button>

            <Button
              size="sm"
              variant="destructive"
              onClick={() => deleteTestimonial(testimonial.id)}
              className="text-xs"
            >
              <Trash2 className="h-3 w-3 mr-1" />
              <span className="hidden sm:inline">Obriši</span>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8 sm:py-12">
        <RefreshCw className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-sm sm:text-base text-gray-600">Učitavanje recenzija...</span>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6 max-w-full overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Upravljanje recenzijama</h2>
          <p className="text-sm sm:text-base text-gray-600">Odobrite, uredite i upravljajte klijentskim recenzijama</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={fetchTestimonials} className="bg-transparent">
            <RefreshCw className="h-4 w-4 mr-2" />
            Osveži
          </Button>
          <Badge variant="outline" className="text-xs">
            {pendingTestimonials.length} na čekanju
          </Badge>
          <Badge variant="outline" className="text-xs">
            {publishedTestimonials.length} objavljeno
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="pending" className="space-y-4 w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending" className="relative text-xs sm:text-sm">
            Na čekanju
            {pendingTestimonials.length > 0 && (
              <Badge className="ml-1 sm:ml-2 bg-red-500 text-white text-xs px-1 py-0">
                {pendingTestimonials.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="published" className="text-xs sm:text-sm">
            Objavljeno ({publishedTestimonials.length})
          </TabsTrigger>
          <TabsTrigger value="all" className="text-xs sm:text-sm">
            Sve ({testimonials.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="w-full">
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-lg sm:text-xl">Recenzije na čekanju</CardTitle>
              <CardDescription className="text-sm">
                Recenzije koje čekaju vaše odobrenje pre objavljivanja
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <ScrollArea className="h-[60vh] w-full">
                {pendingTestimonials.length === 0 ? (
                  <p className="text-gray-500 text-center py-8 text-sm">Nema recenzija na čekanju</p>
                ) : (
                  <div className="space-y-4">
                    {pendingTestimonials.map((testimonial) => (
                      <TestimonialCard key={testimonial.id} testimonial={testimonial} />
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="published" className="w-full">
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-lg sm:text-xl">Objavljene recenzije</CardTitle>
              <CardDescription className="text-sm">Recenzije koje su trenutno vidljive na sajtu</CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <ScrollArea className="h-[60vh] w-full">
                {publishedTestimonials.length === 0 ? (
                  <p className="text-gray-500 text-center py-8 text-sm">Nema objavljenih recenzija</p>
                ) : (
                  <div className="space-y-4">
                    {publishedTestimonials.map((testimonial) => (
                      <TestimonialCard key={testimonial.id} testimonial={testimonial} />
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="all" className="w-full">
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-lg sm:text-xl">Sve recenzije</CardTitle>
              <CardDescription className="text-sm">Pregled svih recenzija u sistemu</CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <ScrollArea className="h-[60vh] w-full">
                {testimonials.length === 0 ? (
                  <p className="text-gray-500 text-center py-8 text-sm">Nema recenzija</p>
                ) : (
                  <div className="space-y-4">
                    {testimonials.map((testimonial) => (
                      <TestimonialCard key={testimonial.id} testimonial={testimonial} />
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Testimonial Details Dialog */}
      {selectedTestimonial && (
        <Dialog open={!!selectedTestimonial} onOpenChange={() => setSelectedTestimonial(null)}>
          <DialogContent className="max-w-2xl w-[95vw] max-h-[90vh]">
            <DialogHeader>
              <DialogTitle className="text-lg sm:text-xl">Detalji recenzije</DialogTitle>
              <DialogDescription className="text-sm">Kompletne informacije o recenziji</DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[70vh] w-full">
              <div className="space-y-4 p-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-sm">Ime klijenta</h4>
                    <p className="text-sm">{selectedTestimonial.name}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Ocena</h4>
                    <div className="flex">
                      {[...Array(selectedTestimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2 text-sm">Recenzija</h4>
                  <p className="bg-gray-50 p-3 rounded-lg italic text-sm">"{selectedTestimonial.text}"</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-sm">Usluga</h4>
                    <p className="text-sm">{selectedTestimonial.service || "Nije navedena"}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Lokacija</h4>
                    <p className="text-sm">{selectedTestimonial.location || "Nije navedena"}</p>
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t flex-wrap">
                  <Badge variant={selectedTestimonial.is_published ? "default" : "secondary"} className="text-xs">
                    {selectedTestimonial.is_published ? "Objavljeno" : "Na čekanju"}
                  </Badge>
                  {selectedTestimonial.is_featured && (
                    <Badge className="bg-blue-100 text-blue-800 text-xs">Izdvojeno</Badge>
                  )}
                </div>
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
