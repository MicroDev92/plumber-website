import { Metadata } from 'next'
import { Phone, Mail, MapPin, Clock, CheckCircle, Star, Wrench, Droplets, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ContactForm } from '@/components/contact-form'
import { GallerySection } from '@/components/gallery-section-server'
import { TestimonialsSection } from '@/components/testimonials-section'
import { AnalyticsTracker } from '@/components/analytics-tracker'
import { createServerClient } from '@/lib/supabase'

export const metadata: Metadata = {
  title: 'Vodoinstalater Zekić - Profesionalne vodoinstalaterne usluge u Beogradu',
  description: '25 godina iskustva u vodoinstalaterskim uslugama. Hitne intervencije 24/7, popravke, instalacije, održavanje. Pozovite nas za brzu i pouzdanu uslugu!',
  keywords: 'vodoinstalater, Beograd, hitne intervencije, popravke, instalacije, vodoinstalaterne usluge, Zekić',
  openGraph: {
    title: 'Vodoinstalater Zekić - 25 godina iskustva',
    description: 'Profesionalne vodoinstalaterne usluge u Beogradu. Hitne intervencije 24/7.',
    type: 'website',
  },
}

async function getSettings() {
  try {
    const supabase = createServerClient()
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .single()
    
    if (error) {
      console.error('Error fetching settings:', error)
      return null
    }
    
    return data
  } catch (error) {
    console.error('Error in getSettings:', error)
    return null
  }
}

export default async function Home() {
  const settings = await getSettings()
  
  // Fallback values if settings are not available
  const businessName = settings?.business_name || 'Vodoinstalater Zekić'
  const phone = settings?.phone || '+381 11 123 4567'
  const email = settings?.email || 'info@vodoinstalater-zekic.rs'
  const address = settings?.address || 'Beograd, Srbija'
  const serviceArea = settings?.service_area || 'Beograd i okolina'
  const businessDescription = settings?.business_description || 'Profesionalne vodoinstalaterne usluge sa 25 godina iskustva'
  const emergencyAvailable = settings?.emergency_available ?? true

  const services = [
    {
      icon: Wrench,
      title: "Popravke i održavanje",
      description: "Brze i efikasne popravke svih vrsta vodoinstalaterskih problema"
    },
    {
      icon: Droplets,
      title: "Instalacije",
      description: "Kompletne instalacije vodovoda i kanalizacije za nove objekte"
    },
    {
      icon: Zap,
      title: "Hitne intervencije",
      description: emergencyAvailable ? "Dostupni 24/7 za hitne slučajeve i kvarove" : "Hitne intervencije tokom radnog vremena"
    }
  ]

  const features = [
    "25 godina iskustva",
    "Licencirani majstori",
    "Garancija na radove",
    "Konkurentne cene",
    emergencyAvailable ? "Dostupni 24/7" : "Brza reakcija",
    "Besplatna procena"
  ]

  return (
    <>
      <AnalyticsTracker />
      <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <Wrench className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900">{businessName}</h1>
                  <p className="text-sm text-slate-600">Profesionalne vodoinstalaterne usluge</p>
                </div>
              </div>
              <div className="hidden md:flex items-center space-x-6">
                <div className="flex items-center space-x-2 text-slate-600">
                  <Phone className="h-4 w-4" />
                  <span className="text-sm">{phone}</span>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <a href="tel:{phone.replace(/\s/g, '')}">Pozovite odmah</a>
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-50 to-slate-100 py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Badge variant="outline" className="mb-4">
                25 godina iskustva
              </Badge>
              <h2 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
                Pouzdane vodoinstalaterne usluge u {serviceArea}
              </h2>
              <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
                {businessDescription}. {emergencyAvailable ? 'Dostupni 24/7 za hitne intervencije.' : 'Brza reakcija na sve pozive.'}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  <Phone className="mr-2 h-5 w-5" />
                  <a href="tel:{phone.replace(/\s/g, '')}">Pozovite: {phone}</a>
                </Button>
                <Button size="lg" variant="outline">
                  <a href="#contact">Pošaljite upit</a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h3 className="text-3xl font-bold text-slate-900 mb-4">Naše usluge</h3>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Pružamo kompletne vodoinstalaterne usluge za stanove, kuće i poslovne objekte
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-8">
                    <div className="inline-flex p-3 bg-blue-100 rounded-full mb-4">
                      <service.icon className="h-8 w-8 text-blue-600" />
                    </div>
                    <h4 className="text-xl font-semibold text-slate-900 mb-3">{service.title}</h4>
                    <p className="text-slate-600">{service.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h3 className="text-3xl font-bold text-slate-900 mb-4">Zašto izabrati nas?</h3>
              <p className="text-lg text-slate-600">
                Dugogodišnje iskustvo i zadovoljni klijenti govore za nas
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-slate-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        <GallerySection />

        {/* Testimonials Section */}
        <TestimonialsSection />

        {/* Contact Section */}
        <section id="contact" className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h3 className="text-3xl font-bold text-slate-900 mb-4">Kontaktirajte nas</h3>
              <p className="text-lg text-slate-600">
                Spremni smo da rešimo vaš vodoinstalaterski problem
              </p>
            </div>
            <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
              <div>
                <h4 className="text-xl font-semibold text-slate-900 mb-6">Pošaljite nam poruku</h4>
                <ContactForm />
              </div>
              <div>
                <h4 className="text-xl font-semibold text-slate-900 mb-6">Kontakt informacije</h4>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <Phone className="h-6 w-6 text-blue-600 mt-1" />
                    <div>
                      <p className="font-medium text-slate-900">Telefon</p>
                      <p className="text-slate-600">{phone}</p>
                      {emergencyAvailable && (
                        <p className="text-sm text-green-600">Dostupni 24/7</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <Mail className="h-6 w-6 text-blue-600 mt-1" />
                    <div>
                      <p className="font-medium text-slate-900">Email</p>
                      <p className="text-slate-600">{email}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <MapPin className="h-6 w-6 text-blue-600 mt-1" />
                    <div>
                      <p className="font-medium text-slate-900">Lokacija</p>
                      <p className="text-slate-600">{address}</p>
                      <p className="text-sm text-slate-500">Radimo u: {serviceArea}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <Clock className="h-6 w-6 text-blue-600 mt-1" />
                    <div>
                      <p className="font-medium text-slate-900">Radno vreme</p>
                      <p className="text-slate-600">
                        {settings?.working_hours || 'Ponedeljak - Petak: 08:00 - 20:00'}
                      </p>
                      <p className="text-slate-600">
                        Subota: 09:00 - 17:00
                      </p>
                      {emergencyAvailable && (
                        <p className="text-sm text-green-600">Hitne intervencije 24/7</p>
                      )}
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
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-blue-600 rounded-lg">
                    <Wrench className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h5 className="text-lg font-bold">{businessName}</h5>
                    <p className="text-slate-400 text-sm">Vodoinstalaterne usluge</p>
                  </div>
                </div>
                <p className="text-slate-400">
                  {businessDescription}
                </p>
              </div>
              <div>
                <h6 className="font-semibold mb-4">Kontakt</h6>
                <div className="space-y-2 text-slate-400">
                  <p>{phone}</p>
                  <p>{email}</p>
                  <p>{address}</p>
                </div>
              </div>
              <div>
                <h6 className="font-semibold mb-4">Usluge</h6>
                <div className="space-y-2 text-slate-400">
                  <p>Popravke i održavanje</p>
                  <p>Instalacije vodovoda</p>
                  <p>Hitne intervencije</p>
                  <p>Čišćenje kanalizacije</p>
                </div>
              </div>
            </div>
            <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400">
              <p>&copy; 2024 {businessName}. Sva prava zadržana.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
