import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, Wrench } from "lucide-react"
import { getFeaturedTestimonials } from "@/lib/testimonials"

export async function TestimonialsSection() {
  const testimonials = await getFeaturedTestimonials(3)

  if (testimonials.length === 0) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-slate-900 mb-4">Šta kažu naši klijenti</h3>
            <p className="text-gray-600">Recenzije će biti dodane uskoro.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h3 className="text-3xl font-bold text-slate-900 mb-4">Šta kažu naši klijenti</h3>
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
