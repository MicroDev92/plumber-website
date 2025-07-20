"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Wrench,
  Droplets,
  Zap,
  Shield,
  Phone,
  Mail,
  MapPin,
  Clock,
  CheckCircle,
  Users,
  Award,
  Lightbulb,
} from "lucide-react"
import Link from "next/link"
import { GallerySection } from "@/components/gallery-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { ContactForm } from "@/components/contact-form"
import { MobileNav } from "@/components/mobile-nav"
import { AnalyticsTracker } from "@/components/analytics-tracker"

interface Settings {
  business_name: string
  phone: string
  email: string
  address: string
  working_hours: string
}

export default function HomePage() {
  const [settings, setSettings] = useState<Settings>({
    business_name: "Vodoinstalater Žekić",
    phone: "+381 60 123 4567",
    email: "info@vodoinstaler-zekic.rs",
    address: "Trebevićka 17, Beograd",
    working_hours: "Pon-Pet: 08:00-20:00, Sub: 09:00-17:00",
  })

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch("/api/settings")
        if (response.ok) {
          const data = await response.json()
          if (data.settings) {
            setSettings(data.settings)
          }
        }
      } catch (error) {
        console.error("Error fetching settings:", error)
      }
    }

    fetchSettings()
  }, [])

  const services = [
    {
      icon: <Droplets className="h-8 w-8 text-blue-600" />,
      title: "Popravka cevi",
      description: "Brza i efikasna popravka svih vrsta vodovodnih cevi",
    },
    {
      icon: <Wrench className="h-8 w-8 text-blue-600" />,
      title: "Instalacija sanitarija",
      description: "Profesionalna instalacija kupatila, kuhinja i sanitarnih čvorova",
    },
    {
      icon: <Zap className="h-8 w-8 text-blue-600" />,
      title: "Hitne intervencije",
      description: "Dostupni 24/7 za hitne vodoinstalaterske probleme",
    },
    {
      icon: <Shield className="h-8 w-8 text-blue-600" />,
      title: "Održavanje sistema",
      description: "Redovno održavanje i servis vodovodnih i kanalizacionih sistema",
    },
  ]

  const features = [
    "25 godina iskustva",
    "Licencirani majstori",
    "Garancija na sve radove",
    "Dostupni 24/7",
    "Besplatna procena",
    "Kvalitetni materijali",
  ]

  return (
    <div className="min-h-screen bg-white">
      <AnalyticsTracker />

      {/* Header */}
      <header className="bg-slate-900 text-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Wrench className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">{settings.business_name}</h1>
                <p className="text-sm text-gray-300">Profesionalne vodoinstalaterske usluge</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <Link href="#services" className="hover:text-blue-400 transition-colors">
                Usluge
              </Link>
              <Link href="#gallery" className="hover:text-blue-400 transition-colors">
                Galerija
              </Link>
              <Link href="#testimonials" className="hover:text-blue-400 transition-colors">
                Recenzije
              </Link>
              <Link href="#contact" className="hover:text-blue-400 transition-colors">
                Kontakt
              </Link>
              <Link href="/admin/login">
                <Button>Admin</Button>
              </Link>
            </nav>

            {/* Mobile Navigation */}
            <MobileNav />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">Pouzdane Vodoinstalaterske Usluge</h2>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            25 godina iskustva u rešavanju svih vaših vodoinstalaterskih problema
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100" asChild>
              <Link href="#contact">
                <Phone className="h-5 w-5 mr-2" />
                Pozovite sada
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600 bg-transparent"
              asChild
            >
              <Link href="#services">Naše usluge</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-900">{feature}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Naše Usluge</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Pružamo kompletne vodoinstalaterske usluge za stanove, kuće i poslovne objekte
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="mb-4 flex justify-center">{service.icon}</div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900">{service.title}</h3>
                  <p className="text-gray-600">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="flex justify-center mb-4">
                <Users className="h-12 w-12" />
              </div>
              <div className="text-3xl font-bold mb-2">500+</div>
              <div className="text-blue-100">Zadovoljnih klijenata</div>
            </div>
            <div>
              <div className="flex justify-center mb-4">
                <Award className="h-12 w-12" />
              </div>
              <div className="text-3xl font-bold mb-2">25</div>
              <div className="text-blue-100">Godina iskustva</div>
            </div>
            <div>
              <div className="flex justify-center mb-4">
                <Wrench className="h-12 w-12" />
              </div>
              <div className="text-3xl font-bold mb-2">1000+</div>
              <div className="text-blue-100">Završenih projekata</div>
            </div>
            <div>
              <div className="flex justify-center mb-4">
                <Lightbulb className="h-12 w-12" />
              </div>
              <div className="text-3xl font-bold mb-2">24/7</div>
              <div className="text-blue-100">Hitne intervencije</div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <GallerySection />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Kontaktirajte nas</h2>
            <p className="text-xl text-gray-600">Spremni smo da rešimo vaše vodoinstalaterske probleme</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-600 p-3 rounded-lg">
                  <Phone className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Telefon</h3>
                  <p className="text-gray-600">{settings.phone}</p>
                  <p className="text-sm text-gray-500">Pozovite nas bilo kada</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-blue-600 p-3 rounded-lg">
                  <Mail className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Email</h3>
                  <p className="text-gray-600">{settings.email}</p>
                  <p className="text-sm text-gray-500">Pošaljite nam poruku</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-blue-600 p-3 rounded-lg">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Adresa</h3>
                  <p className="text-gray-600">{settings.address}</p>
                  <p className="text-sm text-gray-500">Posetite nas</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-blue-600 p-3 rounded-lg">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Radno vreme</h3>
                  <p className="text-gray-600">{settings.working_hours}</p>
                  <p className="text-sm text-gray-500">Hitne intervencije 24/7</p>
                </div>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <Phone className="h-6 w-6 text-red-600" />
                  <h4 className="text-lg font-semibold text-red-900">Hitni pozivi</h4>
                </div>
                <p className="text-red-700">
                  Za hitne vodoinstalaterske intervencije dostupni smo 24 sata dnevno, 7 dana u nedelji. Ne oklevajte da
                  nas pozovete u slučaju curenja, kvarova ili drugih hitnih problema.
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <ContactForm />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <Wrench className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{settings.business_name}</h3>
                </div>
              </div>
              <p className="text-gray-300 mb-4">
                Profesionalne vodoinstalaterske usluge sa 25 godina iskustva. Licencirani i osigurani majstori za sve
                vaše potrebe.
              </p>
              <div className="flex space-x-4">
                <Badge variant="secondary">Licencirani</Badge>
                <Badge variant="secondary">Osigurani</Badge>
                <Badge variant="secondary">24/7</Badge>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Usluge</h4>
              <ul className="space-y-2 text-gray-300">
                <li>Popravka cevi</li>
                <li>Instalacija sanitarija</li>
                <li>Hitne intervencije</li>
                <li>Održavanje sistema</li>
                <li>Čišćenje kanalizacije</li>
                <li>Zamena armatura</li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Kontakt</h4>
              <div className="space-y-3 text-gray-300">
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5" />
                  <span>{settings.phone}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5" />
                  <span>{settings.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5" />
                  <span>{settings.address}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5" />
                  <span>{settings.working_hours}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 {settings.business_name}. Sva prava zadržana.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
