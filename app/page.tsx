import { Suspense } from "react"
import { Phone, Mail, MapPin, Clock, CheckCircle, Star, Wrench, Droplets, Zap, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { ContactForm } from "@/components/contact-form"
import { GallerySectionServer } from "@/components/gallery-section-server"
import { TestimonialsSection } from "@/components/testimonials-section"
import { AnalyticsTracker } from "@/components/analytics-tracker"

// Server component to fetch settings
async function getSettings() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/settings`, {
      cache: "no-store",
    })
    const result = await response.json()

    if (result.success) {
      return result.settings
    }
  } catch (error) {
    console.error("Failed to fetch settings:", error)
  }

  // Return default settings if fetch fails
  return {
    business_name: "Vodoinstalater Zekić",
    phone: "+381 60 123 4567",
    email: "info@vodoinstaler-zekic.rs",
    service_area: "Beograd i okolina",
    description:
      "Profesionalne vodoinstalaterske usluge sa preko 25 godina iskustva. Pružamo kvalitetne usluge ugradnje, popravke i održavanja vodovodnih i kanalizacionih sistema.",
    address: "Beograd, Srbija",
    working_hours: "Ponedeljak - Petak: 08:00 - 20:00, Subota: 09:00 - 17:00",
    emergency_available: true,
  }
}

export default async function HomePage() {
  const settings = await getSettings()

  const services = [
    {
      icon: Droplets,
      title: "Hitne intervencije",
      description: "Dostupni 24/7 za hitne popravke cevi, kvarova i problema sa vodom",
      features: ["24/7 dostupnost", "Brza reakcija", "Profesionalna oprema"],
    },
    {
      icon: Wrench,
      title: "Ugradnja sanitarija",
      description: "Kompletna ugradnja kupatila, kuhinja i sanitarnih čvorova",
      features: ["WC šolje i bidei", "Lavaboi i sudopere", "Tuš kabine"],
    },
    {
      icon: Zap,
      title: "Popravka i održavanje",
      description: "Redovno održavanje i popravka vodovodnih i kanalizacionih sistema",
      features: ["Čišćenje odvoda", "Popravka slavina", "Servis bojlera"],
    },
    {
      icon: Shield,
      title: "Renoviranje kupatila",
      description: "Kompletno renoviranje kupatila od projekta do završetka",
      features: ["Dizajn i planiranje", "Keramičarske usluge", "Završni radovi"],
    },
  ]

  return (
    <>
      <AnalyticsTracker />
      <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="bg-slate-900 text-white sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <Wrench className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">{settings.business_name}</h1>
                  <p className="text-sm text-slate-300">25 godina iskustva</p>
                </div>
              </div>
              <div className="hidden md:flex items-center gap-6">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-blue-400" />
                  <span>{settings.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-blue-400" />
                  <span>{settings.email}</span>
                </div>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  <Phone className="h-4 w-4 mr-2" />
                  Pozovite sada
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white py-20">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <Badge className="bg-blue-600 text-white mb-4">
                  {settings.emergency_available ? "Dostupni 24/7" : "Radnim danima"}
                </Badge>
                <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                  Profesionalne vodoinstalaterske usluge u {settings.service_area}
                </h2>
                <p className="text-xl text-slate-300 mb-8">{settings.description}</p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                    <Phone className="h-5 w-5 mr-2" />
                    Pozovite odmah
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white hover:text-slate-900 bg-transparent"
                  >
                    Pogledajte radove
                  </Button>
                </div>
              </div>
              <div className="relative">
                <Image
                  src="/placeholder.svg?height=500&width=600&text=Vodoinstalater+na+radu"
                  alt="Profesionalni vodoinstalater na radu"
                  width={600}
                  height={500}
                  className="rounded-lg shadow-2xl"
                />
                <div className="absolute -bottom-6 -left-6 bg-white text-slate-900 p-4 rounded-lg shadow-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="font-semibold">25+ godina iskustva</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-20 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">Naše usluge</h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                Pružamo kompletne vodoinstalaterske usluge za stanove, kuće i poslovne objekte
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {services.map((service, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="bg-blue-100 p-3 rounded-lg w-fit mb-4">
                      <service.icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-3">{service.title}</h3>
                    <p className="text-slate-600 mb-4">{service.description}</p>
                    <ul className="space-y-2">
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center gap-2 text-sm text-slate-600">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">Naši radovi</h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                Pogledajte fotografije naših uspešno završenih projekata
              </p>
            </div>
            <Suspense
              fallback={
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-slate-200 animate-pulse rounded-lg h-64"></div>
                  ))}
                </div>
              }
            >
              <GallerySectionServer />
            </Suspense>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">Šta kažu naši klijenti</h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                Pročitajte iskustva zadovoljnih klijenata koji su koristili naše usluge
              </p>
            </div>
            <Suspense
              fallback={
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-white p-6 rounded-lg shadow-sm">
                      <div className="animate-pulse">
                        <div className="flex gap-1 mb-4">
                          {[...Array(5)].map((_, j) => (
                            <div key={j} className="w-4 h-4 bg-slate-200 rounded"></div>
                          ))}
                        </div>
                        <div className="space-y-2 mb-4">
                          <div className="h-4 bg-slate-200 rounded w-full"></div>
                          <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                        </div>
                        <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              }
            >
              <TestimonialsSection />
            </Suspense>
            <div className="text-center mt-8">
              <Link href="/testimonials/add">
                <Button variant="outline" size="lg">
                  <Star className="h-5 w-5 mr-2" />
                  Ostavite recenziju
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">Kontaktirajte nas</h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                Potrebne su vam vodoinstalaterske usluge? Kontaktirajte nas za brzu i profesionalnu pomoć
              </p>
            </div>
            <div className="grid lg:grid-cols-2 gap-12">
              <div>
                <h3 className="text-2xl font-semibold text-slate-900 mb-6">Pošaljite upit</h3>
                <ContactForm />
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-slate-900 mb-6">Kontakt informacije</h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <Phone className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">Telefon</h4>
                      <p className="text-slate-600">{settings.phone}</p>
                      <p className="text-sm text-slate-500">Dostupni 24/7 za hitne slučajeve</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <Mail className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">Email</h4>
                      <p className="text-slate-600">{settings.email}</p>
                      <p className="text-sm text-slate-500">Odgovaramo u roku od 24h</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <MapPin className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">Oblast rada</h4>
                      <p className="text-slate-600">{settings.service_area}</p>
                      <p className="text-sm text-slate-500">Besplatna procena na terenu</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <Clock className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">Radno vreme</h4>
                      <p className="text-slate-600">{settings.working_hours}</p>
                      <p className="text-sm text-slate-500">Hitne intervencije 24/7</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-slate-900 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-blue-600 p-2 rounded-lg">
                    <Wrench className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{settings.business_name}</h3>
                    <p className="text-sm text-slate-300">25 godina iskustva</p>
                  </div>
                </div>
                <p className="text-slate-300 mb-4">{settings.description}</p>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">Kontakt</h4>
                <div className="space-y-2 text-slate-300">
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
                </div>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">Usluge</h4>
                <ul className="space-y-2 text-slate-300">
                  <li>Hitne intervencije</li>
                  <li>Ugradnja sanitarija</li>
                  <li>Popravka cevi</li>
                  <li>Renoviranje kupatila</li>
                  <li>Čišćenje odvoda</li>
                  <li>Servis bojlera</li>
                </ul>
              </div>
            </div>
            <div className="border-t border-slate-700 mt-8 pt-8 text-center text-slate-400">
              <p>&copy; 2024 {settings.business_name}. Sva prava zadržana.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
