"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Wrench,
  Droplets,
  Zap,
  Thermometer,
  Shield,
  Clock,
  Phone,
  Mail,
  MapPin,
  CheckCircle,
  ArrowRight,
  Menu,
  X,
} from "lucide-react"
import Image from "next/image"
import { GallerySectionServer } from "@/components/gallery-section-server"
import { TestimonialsSection } from "@/components/testimonials-section"
import { ContactForm } from "@/components/contact-form"
import { AnalyticsTracker } from "@/components/analytics-tracker"

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

export default function Home() {
  const [settings, setSettings] = useState<SiteSettings>({
    business_name: "Vodoinstalater Zekić",
    phone: "+381 60 123 4567",
    email: "info@vodoinstaler-zekic.rs",
    service_area: "Beograd i okolina",
    description: "Profesionalne vodoinstalaterske usluge sa preko 25 godina iskustva.",
    address: "Trebevicka 17, Beograd",
    working_hours: "Ponedeljak - Petak: 08:00 - 20:00, Subota: 09:00 - 17:00",
    emergency_available: true,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/settings", {
        cache: "no-store",
      })
      const result = await response.json()

      if (result.success && result.settings) {
        setSettings(result.settings)
      }
    } catch (error) {
      console.error("Failed to fetch settings:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const services = [
    {
      icon: Droplets,
      title: "Popravka slavina i cevi",
      description: "Brza popravka curenja slavina, cevi i vodovodnih instalacija",
      features: ["Zamena slavina", "Popravka curenja", "Čišćenje cevi"],
    },
    {
      icon: Wrench,
      title: "Ugradnja sanitarija",
      description: "Profesionalna ugradnja WC šolja, lavaboa i kupatilskih elemenata",
      features: ["WC šolje", "Lavaboi", "Tuš kabine"],
    },
    {
      icon: Thermometer,
      title: "Bojleri i grejanje",
      description: "Servis, ugradnja i održavanje bojlera i sistema grejanja",
      features: ["Električni bojleri", "Gasni bojleri", "Radijatori"],
    },
    {
      icon: Zap,
      title: "Hitne intervencije",
      description: "Dostupni 24/7 za hitne vodoinstalaterske probleme",
      features: ["24/7 dostupnost", "Brz odziv", "Hitne popravke"],
    },
    {
      icon: Shield,
      title: "Preventivno održavanje",
      description: "Redovno održavanje vodovodnih sistema za sprečavanje kvarova",
      features: ["Pregled instalacija", "Čišćenje cevi", "Saveti za održavanje"],
    },
    {
      icon: Clock,
      title: "Renoviranje kupatila",
      description: "Kompletno renoviranje kupatila od planiranja do završetka",
      features: ["Dizajn kupatila", "Keramičarske usluge", "Kompletna renovacija"],
    },
  ]

  return (
    <>
      <AnalyticsTracker />
      <div className="min-h-screen bg-white">
        {/* Navigation */}
        <nav className="bg-white shadow-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center gap-3">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <Wrench className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">{settings.business_name}</h1>
                  <p className="text-sm text-gray-600">25 godina iskustva</p>
                </div>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-8">
                <a href="#services" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Usluge
                </a>
                <a href="#gallery" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Galerija
                </a>
                <a href="#testimonials" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Recenzije
                </a>
                <a href="#contact" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Kontakt
                </a>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Phone className="h-4 w-4 mr-2" />
                  {isLoading ? "+381 60 123 4567" : settings.phone}
                </Button>
              </div>

              {/* Mobile Menu Button */}
              <div className="md:hidden">
                <Button variant="ghost" size="sm" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2">
                  {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </Button>
              </div>
            </div>

            {/* Mobile Navigation */}
            {mobileMenuOpen && (
              <div className="md:hidden border-t border-gray-200 py-4">
                <div className="flex flex-col gap-4">
                  <a
                    href="#services"
                    className="text-gray-700 hover:text-blue-600 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Usluge
                  </a>
                  <a
                    href="#gallery"
                    className="text-gray-700 hover:text-blue-600 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Galerija
                  </a>
                  <a
                    href="#testimonials"
                    className="text-gray-700 hover:text-blue-600 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Recenzije
                  </a>
                  <a
                    href="#contact"
                    className="text-gray-700 hover:text-blue-600 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Kontakt
                  </a>
                  <Button className="bg-blue-600 hover:bg-blue-700 w-full">
                    <Phone className="h-4 w-4 mr-2" />
                    {isLoading ? "+381 60 123 4567" : settings.phone}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl md:text-6xl font-bold mb-6">Profesionalne vodoinstalaterske usluge</h1>
                <p className="text-xl mb-8 text-blue-100">
                  {isLoading
                    ? "Profesionalne vodoinstalaterske usluge sa preko 25 godina iskustva."
                    : settings.description}
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                    <Phone className="h-5 w-5 mr-2" />
                    Pozovite odmah
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white hover:text-blue-600 bg-transparent"
                  >
                    <ArrowRight className="h-5 w-5 mr-2" />
                    Pogledajte radove
                  </Button>
                </div>
              </div>
              <div className="relative">
                <Image
                  src="/placeholder.svg?height=400&width=600&text=Vodoinstalater+na+radu"
                  alt="Vodoinstalater na radu"
                  width={600}
                  height={400}
                  className="rounded-lg shadow-2xl"
                />
                <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 p-2 rounded-full">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">25+ godina iskustva</p>
                      <p className="text-sm text-gray-600">Pouzdane usluge</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Naše usluge</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Pružamo kompletne vodoinstalaterske usluge za stanove, kuće i poslovne objekte u{" "}
                {isLoading ? "Beogradu i okolini" : settings.service_area}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <Card key={index} className="group hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors duration-300">
                      <service.icon className="h-6 w-6 text-blue-600 group-hover:text-white transition-colors duration-300" />
                    </div>
                    <CardTitle className="text-xl mb-2">{service.title}</CardTitle>
                    <CardDescription className="text-gray-600">{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center gap-2 text-sm text-gray-600">
                          <CheckCircle className="h-4 w-4 text-green-500" />
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
        <section id="gallery" className="py-20">
          <GallerySectionServer />
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-20 bg-gray-50">
          <TestimonialsSection />
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20 bg-gray-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Kontaktirajte nas</h2>
              <p className="text-xl text-gray-300">
                Dostupni smo 24/7 za hitne intervencije. Pozovite nas ili pošaljite upit.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Info */}
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-bold mb-6">Kontakt informacije</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="bg-blue-600 p-3 rounded-lg">
                        <Phone className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="font-semibold">Telefon</p>
                        <p className="text-gray-300">{isLoading ? "+381 60 123 4567" : settings.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="bg-blue-600 p-3 rounded-lg">
                        <Mail className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="font-semibold">Email</p>
                        <p className="text-gray-300">{isLoading ? "info@vodoinstaler-zekic.rs" : settings.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="bg-blue-600 p-3 rounded-lg">
                        <MapPin className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="font-semibold">Adresa</p>
                        <p className="text-gray-300">{isLoading ? "Trebevicka 17, Beograd" : settings.address}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="bg-blue-600 p-3 rounded-lg">
                        <Clock className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="font-semibold">Radno vreme</p>
                        <p className="text-gray-300">
                          {isLoading ? "Ponedeljak - Petak: 08:00 - 20:00" : settings.working_hours}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Google Maps */}
                <div className="bg-white rounded-lg overflow-hidden">
                  <div className="bg-blue-600 text-white p-4">
                    <h4 className="font-semibold flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Naša lokacija
                    </h4>
                  </div>
                  <div className="h-64 md:h-80">
                    <iframe
                      src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dO_BcqOhOKOvHc&q=${encodeURIComponent(settings.address)}`}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Lokacija vodoinstalatera"
                    />
                  </div>
                  <div className="p-4 bg-gray-50 text-gray-700">
                    <p className="text-sm">
                      <strong>Oblast rada:</strong> {isLoading ? "Beograd i okolina" : settings.service_area}
                    </p>
                  </div>
                </div>

                {settings.emergency_available && (
                  <div className="bg-red-600 p-6 rounded-lg">
                    <h4 className="font-bold text-lg mb-2">🚨 Hitne intervencije</h4>
                    <p className="mb-4">Dostupni smo 24/7 za hitne vodoinstalaterske probleme!</p>
                    <Button className="bg-white text-red-600 hover:bg-gray-100">
                      <Phone className="h-4 w-4 mr-2" />
                      Pozovite odmah: {isLoading ? "+381 60 123 4567" : settings.phone}
                    </Button>
                  </div>
                )}
              </div>

              {/* Contact Form */}
              <div>
                <ContactForm />
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-800 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-blue-600 p-2 rounded-lg">
                    <Wrench className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{settings.business_name}</h3>
                    <p className="text-gray-400">25 godina iskustva</p>
                  </div>
                </div>
                <p className="text-gray-400 mb-4">
                  {isLoading
                    ? "Profesionalne vodoinstalaterske usluge sa preko 25 godina iskustva."
                    : settings.description}
                </p>
              </div>

              <div>
                <h4 className="text-lg font-semibold mb-4">Usluge</h4>
                <ul className="space-y-2 text-gray-400">
                  <li>Popravka slavina i cevi</li>
                  <li>Ugradnja sanitarija</li>
                  <li>Bojleri i grejanje</li>
                  <li>Hitne intervencije</li>
                  <li>Renoviranje kupatila</li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-semibold mb-4">Kontakt</h4>
                <div className="space-y-2 text-gray-400">
                  <p>📞 {isLoading ? "+381 60 123 4567" : settings.phone}</p>
                  <p>✉️ {isLoading ? "info@vodoinstaler-zekic.rs" : settings.email}</p>
                  <p>📍 {isLoading ? "Trebevicka 17, Beograd" : settings.address}</p>
                  <p>🕒 {isLoading ? "Ponedeljak - Petak: 08:00 - 20:00" : settings.working_hours}</p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; 2024 {settings.business_name}. Sva prava zadržana.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
