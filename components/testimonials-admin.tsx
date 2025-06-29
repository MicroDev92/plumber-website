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
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold">{testimonial.name}</h4>
              {testimonial.is_featured && <Badge className="bg-blue-100 text-blue-800 text-xs">Izdvojeno</Badge>}
              {!testimonial.is_published && (
                  <Badge variant="secondary" className="text-xs">
                    Na čekanju
                  </Badge>
              )}
            </div>
            <div className="flex">
              {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
          </div>

          <p className="text-gray-700 mb-3 italic">"{testimonial.text}"</p>

          <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
            {testimonial.service && (
                <div className="flex items-center gap-1">
                  <Wrench className="h-3 w-3" />
                  <span>{testimonial.service}</span>
                </div>
            )}
            {testimonial.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  <span>{testimonial.location}</span>
                </div>
            )}
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{new Date(testimonial.created_at).toLocaleDateString("sr-RS")}</span>
            </div>
          </div>

          {showActions && (
              <div className="flex gap-2 flex-wrap">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline" onClick={() => setSelectedTestimonial(testimonial)}>
                      <Eye className="h-3 w-3 mr-1" />
                      Detalji
                    </Button>
                  </DialogTrigger>
                </Dialog>

                {!testimonial.is_published ? (
                    <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => approveTestimonial(testimonial.id)}
                    >
                      <Check className="h-3 w-3 mr-1" />
                      Odobri
                    </Button>
                ) : (
                    <Button size="sm" variant="outline" onClick={() => rejectTestimonial(testimonial.id)}>
                      <X className="h-3 w-3 mr-1" />
                      Povuci
                    </Button>
                )}

                <Button size="sm" variant="outline" onClick={() => toggleFeatured(testimonial.id, testimonial.is_featured)}>
                  <Star className={`h-3 w-3 mr-1 ${testimonial.is_featured ? "fill-yellow-400 text-yellow-400" : ""}`} />
                  {testimonial.is_featured ? "Ukloni izdvojeno" : "Izdvoj"}
                </Button>

                <Button size="sm" variant="destructive" onClick={() => deleteTestimonial(testimonial.id)}>
                  <Trash2 className="h-3 w-3 mr-1" />
                  Obriši
                </Button>
              </div>
          )}
        </CardContent>
      </Card>
  )

  if (isLoading) {
    return (
        <div className="flex justify-center items-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Učitavanje recenzija...</span>
        </div>
    )
  }

  return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Upravljanje recenzijama</h2>
            <p className="text-gray-600">Odobrite, uredite i upravljajte klijentskim recenzijama</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={fetchTestimonials}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Osveži
            </Button>
            <Badge variant="outline">{pendingTestimonials.length} na čekanju</Badge>
            <Badge variant="outline">{publishedTestimonials.length} objavljeno</Badge>
          </div>
        </div>

        <Tabs defaultValue="pending" className="space-y-4">
          <TabsList>
            <TabsTrigger value="pending" className="relative">
              Na čekanju
              {pendingTestimonials.length > 0 && (
                  <Badge className="ml-2 bg-red-500 text-white text-xs px-1.5 py-0.5">{pendingTestimonials.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="published">Objavljeno ({publishedTestimonials.length})</TabsTrigger>
            <TabsTrigger value="all">Sve ({testimonials.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            <Card>
              <CardHeader>
                <CardTitle>Recenzije na čekanju</CardTitle>
                <CardDescription>Recenzije koje čekaju vaše odobrenje pre objavljivanja</CardDescription>
              </CardHeader>
              <CardContent>
                {pendingTestimonials.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">Nema recenzija na čekanju</p>
                ) : (
                    pendingTestimonials.map((testimonial) => (
                        <TestimonialCard key={testimonial.id} testimonial={testimonial} />
                    ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="published">
            <Card>
              <CardHeader>
                <CardTitle>Objavljene recenzije</CardTitle>
                <CardDescription>Recenzije koje su trenutno vidljive na sajtu</CardDescription>
              </CardHeader>
              <CardContent>
                {publishedTestimonials.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">Nema objavljenih recenzija</p>
                ) : (
                    publishedTestimonials.map((testimonial) => (
                        <TestimonialCard key={testimonial.id} testimonial={testimonial} />
                    ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="all">
            <Card>
              <CardHeader>
                <CardTitle>Sve recenzije</CardTitle>
                <CardDescription>Pregled svih recenzija u sistemu</CardDescription>
              </CardHeader>
              <CardContent>
                {testimonials.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">Nema recenzija</p>
                ) : (
                    testimonials.map((testimonial) => <TestimonialCard key={testimonial.id} testimonial={testimonial} />)
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Testimonial Details Dialog */}
        {selectedTestimonial && (
            <Dialog open={!!selectedTestimonial} onOpenChange={() => setSelectedTestimonial(null)}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Detalji recenzije</DialogTitle>
                  <DialogDescription>Kompletne informacije o recenziji</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold">Ime klijenta</h4>
                      <p>{selectedTestimonial.name}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold">Ocena</h4>
                      <div className="flex">
                        {[...Array(selectedTestimonial.rating)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Recenzija</h4>
                    <p className="bg-gray-50 p-3 rounded-lg italic">"{selectedTestimonial.text}"</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold">Usluga</h4>
                      <p>{selectedTestimonial.service || "Nije navedena"}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold">Lokacija</h4>
                      <p>{selectedTestimonial.location || "Nije navedena"}</p>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4 border-t">
                    <Badge variant={selectedTestimonial.is_published ? "default" : "secondary"}>
                      {selectedTestimonial.is_published ? "Objavljeno" : "Na čekanju"}
                    </Badge>
                    {selectedTestimonial.is_featured && <Badge className="bg-blue-100 text-blue-800">Izdvojeno</Badge>}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
        )}
      </div>
  )
}
