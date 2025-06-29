import { Suspense } from "react"
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Wrench,
  Droplets,
  Zap,
  Shield,
  CheckCircle,
  Users,
  Award,
  Calendar,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ContactForm } from "@/components/contact-form"
import { TestimonialsSection } from "@/components/testimonials-section"
import { GallerySection } from "@/components/gallery-section"
import { AnalyticsTracker } from "@/components/analytics-tracker"
import { createClient } from "@/lib/supabase"

// Server component to fetch settings
async function getSettings() {
  try {
    const supabase = createClient()
    const { data, error } = await supabase.from("site_settings").select("*").single()

    if (error) {
      console.error("Error fetching settings:", error)
      // Return default values if no settings found
      return {
        business_name: "Vodoinstalater Zekić",
        phone: "+381 60 123 4567",
        email: "info@vodoinstalater-zekic.rs",
        address: "Beograd, Srbija",
        service_area: "Beograd i okolina",
        years_experience: 25,
        description: "Profesionalne vodoinstalaterske usluge sa 25 godina iskustva",
        emergency_available: true,
        working_hours: "Pon-Pet: 08:00-20:00, Sub: 09:00-17:00",
      }
    }

    return data
  } catch (error) {
    console.error("Error in getSettings:", error)
    // Return default values on error
    return {
      business_name: "Vodoinstalater Zekić",
      phone: "+381 60 123 4567",
      email: "info@vodoinstalater-zekic.rs",
      address: "Beograd, Srbija",
      service_area: "Beograd i okolina",
      years_experience: 25,
      description: "Profesionalne vodoinstalaterske usluge sa 25 godina iskustva",
      emergency_available: true,
      working_hours: "Pon-Pet: 08:00-20:00, Sub: 09:00-17:00",
    }
  }
}

export default async function HomePage() {
  const settings = await getSettings()

  const services = [
    {
      icon: Droplets,
      title: "Popravke cevi",
      description: "Brza i efikasna popravka svih vrsta cevi i instalacija",
    },
    {
      icon: Wrench,
      title: "Ugradnja sanitarija",
      description: "Profesionalna ugradnja WC šolja, lavabora i tuš kabina",
    },
    {
      icon: Zap,
      title: "Hitne intervencije",
      description: "Dostupni 24/7 za hitne vodoinstalaterske probleme",
    },
    {
      icon: Shield,
      title: "Održavanje sistema",
      description: "Redovno održavanje i servis vodovodnih instalacija",
    },
  ]

  const features = ["Licencirani majstori", "Garancija na radove", "Besplatna procena", "Kvalitetni materijali"]

  return (
    <>
      <AnalyticsTracker />
      <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <Wrench className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">{settings.business_name}</h1>
                  <p className="text-sm text-gray-600">{settings.years_experience} godina iskustva</p>
                </div>
              </div>
              <div className="hidden md:flex items-center gap-6">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-blue-600" />
                  <span className="font-medium">{settings.phone}</span>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">Pozovite odmah</Button>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-50 to-slate-100 py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="mb-6 bg-blue-100 text-blue-800 hover:bg-blue-100">⚡ Hitne intervencije 24/7</Badge>
              <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Profesionalne
                <span className="text-blue-600 block">vodoinstalaterske usluge</span>
              </h2>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                {settings.description} u {settings.service_area}. Brzo, pouzdano i po pristupačnim cenama.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3">
                  <Phone className="mr-2 h-5 w-5" />
                  Pozovite: {settings.phone}
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 py-3 bg-transparent">
                  Besplatna procena
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Naše usluge</h3>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Pružamo kompletne vodoinstalaterske usluge za stanove, kuće i poslovne objekte
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {services.map((service, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <service.icon className="h-8 w-8 text-blue-600" />
                    </div>
                    <h4 className="text-xl font-semibold mb-2">{service.title}</h4>
                    <p className="text-gray-600">{service.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-3xl font-bold text-gray-900 mb-6">Zašto odabrati {settings.business_name}?</h3>
                <div className="space-y-4">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-8 grid grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">500+</div>
                    <div className="text-sm text-gray-600">Zadovoljnih klijenata</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Award className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{settings.years_experience}</div>
                    <div className="text-sm text-gray-600">Godina iskustva</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Calendar className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">24/7</div>
                    <div className="text-sm text-gray-600">Hitne intervencije</div>
                  </div>
                </div>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <h4 className="text-2xl font-bold text-gray-900 mb-6">Kontaktirajte nas</h4>
                <Suspense fallback={<div>Loading...</div>}>
                  <ContactForm />
                </Suspense>
              </div>
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        <Suspense fallback={<div className="py-20 text-center">Učitavanje galerije...</div>}>
          <GallerySection />
        </Suspense>

        {/* Testimonials */}
        <Suspense fallback={<div className="py-20 text-center">Učitavanje utisaka...</div>}>
          <TestimonialsSection />
        </Suspense>

        {/* Contact Section */}
        <section className="py-20 bg-blue-600 text-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold mb-4">Kontakt informacije</h3>
              <p className="text-blue-100 max-w-2xl mx-auto">
                Dostupni smo {settings.working_hours}. Za hitne slučajeve pozovite bilo kada!
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="bg-blue-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="h-8 w-8" />
                </div>
                <h4 className="text-xl font-semibold mb-2">Telefon</h4>
                <p className="text-blue-100">{settings.phone}</p>
              </div>
              <div>
                <div className="bg-blue-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-8 w-8" />
                </div>
                <h4 className="text-xl font-semibold mb-2">Email</h4>
                <p className="text-blue-100">{settings.email}</p>
              </div>
              <div>
                <div className="bg-blue-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-8 w-8" />
                </div>
                <h4 className="text-xl font-semibold mb-2">Lokacija</h4>
                <p className="text-blue-100">{settings.service_area}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-blue-600 p-2 rounded-lg">
                    <Wrench className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h5 className="text-xl font-bold">{settings.business_name}</h5>
                    <p className="text-gray-400">{settings.years_experience} godina iskustva</p>
                  </div>
                </div>
                <p className="text-gray-400">{settings.description}</p>
              </div>
              <div>
                <h6 className="text-lg font-semibold mb-4">Kontakt</h6>
                <div className="space-y-2 text-gray-400">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span>{settings.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>{settings.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{settings.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{settings.working_hours}</span>
                  </div>
                </div>
              </div>
              <div>
                <h6 className="text-lg font-semibold mb-4">Brzi linkovi</h6>
                <div className="space-y-2">
                  <Link href="/testimonials/add" className="block text-gray-400 hover:text-white transition-colors">
                    Ostavite utisak
                  </Link>
                  <Link href="/admin/login" className="block text-gray-400 hover:text-white transition-colors">
                    Admin panel
                  </Link>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; 2024 {settings.business_name}. Sva prava zadržana.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
