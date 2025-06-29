"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, MapPin, Wrench, RefreshCw, Loader2 } from "lucide-react"

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

export function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async (silent = false) => {
    try {
      if (!silent) {
        setIsLoading(true)
        setError(null)
      }

      const response = await fetch("/api/testimonials/published", {
        cache: "no-store",
      })

      const result = await response.json()

      if (result.success) {
        setTestimonials(result.testimonials || [])
      } else {
        setError("Greška pri učitavanju recenzija")
        setTestimonials([])
      }
    } catch (err) {
      console.error("Testimonials fetch error:", err)
      if (!silent) {
        setError("Greška pri učitavanju recenzija")
        setTestimonials([])
      }
    } finally {
      if (!silent) {
        setIsLoading(false)
      }
    }
  }

  if (isLoading) {
    return (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h3 className="text-3xl font-bold text-slate-900 mb-4">Šta kažu naši klijenti</h3>
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                <span className="ml-2 text-gray-600">Učitavanje recenzija...</span>
              </div>
            </div>
          </div>
        </section>
    )
  }

  if (error) {
    return (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h3 className="text-3xl font-bold text-slate-900 mb-4">Šta kažu naši klijenti</h3>
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">{error}</p>
                <Button onClick={() => fetchTestimonials()} variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Pokušaj ponovo
                </Button>
              </div>
            </div>
          </div>
        </section>
    )
  }

  if (testimonials.length === 0) {
    return (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h3 className="text-3xl font-bold text-slate-900 mb-4">Šta kažu naši klijenti</h3>
              <p className="text-gray-600">Recenzije će biti dodane uskoro.</p>
              <Button onClick={() => fetchTestimonials()} variant="outline" className="mt-4">
                <RefreshCw className="h-4 w-4 mr-2" />
                Osveži
              </Button>
            </div>
          </div>
        </section>
    )
  }

  return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-4 mb-4">
              <h3 className="text-3xl font-bold text-slate-900">Šta kažu naši klijenti</h3>
              <Button onClick={() => fetchTestimonials()} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-lg text-slate-600">Pročitajte iskustva naših zadovoljnih klijenata</p>
            <Badge variant="outline" className="mt-2">
              {testimonials.length} {testimonials.length === 1 ? "recenzija" : "recenzija"}
            </Badge>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
                <Card key={testimonial.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    {/* Rating */}
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>

                    {/* Testimonial text */}
                    <p className="text-slate-600 mb-4 italic">"{testimonial.text}"</p>

                    {/* Client info */}
                    <div className="border-t pt-4">
                      <p className="font-semibold text-slate-900">{testimonial.name}</p>

                      <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
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
                      </div>
                    </div>

                    {/* Featured badge */}
                    {testimonial.is_featured && <Badge className="mt-3 bg-blue-100 text-blue-800 text-xs">Izdvojeno</Badge>}
                  </CardContent>
                </Card>
            ))}
          </div>
        </div>
      </section>
  )
}
