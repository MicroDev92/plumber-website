import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Phone, Mail, MapPin, Wrench, Droplets, Zap, Clock, CheckCircle, MessageSquare } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { ContactForm } from "@/components/contact-form"
import { GallerySection } from "@/components/gallery-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { MobileNav } from "@/components/mobile-nav"
import { createServerClient } from "@/lib/supabase"

// Force dynamic rendering to avoid static generation cache
export const dynamic = "force-dynamic"
export const revalidate = 0

async function getSettings() {
  try {
    const supabase = createServerClient()
    const { data: settings, error } = await supabase.from("site_settings").select("*").single()

    if (error && error.code !== "PGRST116") {
      console.error("Database error:", error)
      return null
    }

    return settings
  } catch (error) {
    console.error("Failed to fetch settings:", error)
    return null
  }
}

export default async function HomePage() {
  const settings = await getSettings()

  // Default settings fallback
  const businessName = settings?.business_name || "Vodoinstalater Zekić"
  const phone = settings?.phone || "+381 60 123 4567"
  const email = settings?.email || "info@vodoinstaler-zekic.rs"
  const serviceArea = settings?.service_area || "Beograd i okolina"
  const address = settings?.address || "Trebevicka 17, Beograd"
  const description =
    settings?.description ||
    "Profesionalne vodoinstalaterske usluge sa preko 25 godina iskustva. Pružamo kvalitetne usluge ugradnje, popravke i održavanja vodovodnih i kanalizacionih sistema."

  return (
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
                <h1 className="text-lg md:text-xl font-bold">{businessName}</h1>
                <p className="text-xs md:text-sm text-slate-300 hidden sm:block">
                  Profesionalne vodoinstalaterske usluge
                </p>
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
                <Button
                  variant="outline"
                  size="sm"
                  className="text-white border-white hover:bg-white hover:text-slate-900 bg-transparent"
                >
                  Admin
                </Button>
              </Link>
            </nav>

            {/* Mobile Navigation */}
            <MobileNav />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-slate-100 py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-100">Profesionalno i pouzdano</Badge>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4 md:mb-6">
                Stručne vodoinstalaterske usluge kojima možete verovati
              </h2>
              <p className="text-base md:text-lg text-slate-600 mb-6 md:mb-8">{description}</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700" asChild>
                  <a href={`tel:${phone.replace(/\s/g, "")}`}>
                    <Phone className="mr-2 h-5 w-5" />
                    <span className="hidden sm:inline">Pozovite odmah: </span>
                    <span className="sm:hidden">Pozovi: </span>
                    {phone}
                  </a>
                </Button>
                <Button variant="outline" size="lg">
                  Besplatan predračun
                </Button>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/placeholder.svg?height=500&width=600"
                alt="Professional plumber at work"
                width={600}
                height={500}
                className="rounded-lg shadow-xl"
                priority
              />
              <div className="absolute -bottom-4 -left-4 md:-bottom-6 md:-left-6 bg-white p-3 md:p-4 rounded-lg shadow-lg">
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="bg-green-100 p-1.5 md:p-2 rounded-full">
                    <CheckCircle className="h-4 w-4 md:h-6 md:w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm md:text-base">Licencirani i osigurani</p>
                    <p className="text-xs md:text-sm text-slate-600">Sertifikovani stručnjak</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">Naše usluge</h3>
            <p className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto">
              Nudimo sveobuhvatne vodoinstalaterske usluge za sve vaše stambene i poslovne potrebe
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                icon: <Droplets className="h-6 w-6 md:h-8 md:w-8" />,
                title: "Ugradnja i popravka cevi",
                description: "Kompletna ugradnja, popravka i zamena cevi za sve tipove vodoinstalaterskih sistema.",
              },
              {
                icon: <Wrench className="h-6 w-6 md:h-8 md:w-8" />,
                title: "Ugradnja sanitarija",
                description: "Profesionalna ugradnja sudopera, toaleta, tuš kabina i ostale sanitarne opreme.",
              },
              {
                icon: <Zap className="h-6 w-6 md:h-8 md:w-8" />,
                title: "Hitne intervencije",
                description: "24/7 hitne vodoinstalaterske usluge za urgentne popravke i sprečavanje štete od vode.",
              },
              {
                icon: <Clock className="h-6 w-6 md:h-8 md:w-8" />,
                title: "Servisne usluge",
                description: "Redovno održavanje i pregled instalacija za sprečavanje skupih kvarova.",
              },
              {
                icon: <Droplets className="h-6 w-6 md:h-8 md:w-8" />,
                title: "Čišćenje odvoda",
                description: "Profesionalno čišćenje i otčepljivanje odvoda najsavremenijom opremom.",
              },
              {
                icon: <Wrench className="h-6 w-6 md:h-8 md:w-8" />,
                title: "Usluge bojlera",
                description: "Ugradnja, popravka i održavanje klasičnih i protočnih bojlera.",
              },
            ].map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4 md:p-6">
                  <div className="bg-blue-100 w-12 h-12 md:w-16 md:h-16 rounded-lg flex items-center justify-center mb-3 md:mb-4 text-blue-600">
                    {service.icon}
                  </div>
                  <h4 className="text-lg md:text-xl font-semibold text-slate-900 mb-2 md:mb-3">{service.title}</h4>
                  <p className="text-sm md:text-base text-slate-600">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <GallerySection />

      {/* Testimonials Section */}
      <section id="testimonials">
        <TestimonialsSection />
      </section>

      {/* Call to Action for Reviews */}
      <section className="py-12 md:py-16 bg-blue-50">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <MessageSquare className="h-10 w-10 md:h-12 md:w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-4">Bili ste naš klijent?</h3>
            <p className="text-base md:text-lg text-slate-600 mb-6">
              Vaše mišljenje je važno za nas! Podelite svoje iskustvo i pomozite drugim klijentima da donose informisane
              odluke.
            </p>
            <Link href="/testimonials/add">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                <MessageSquare className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                Ostavite recenziju
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-12 md:py-20 bg-slate-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold mb-6">Kontaktirajte nas</h3>
              <p className="text-slate-300 mb-6 md:mb-8">
                Spremni da rešimo vaše vodoinstalaterske probleme? Kontaktirajte nas danas za besplatnu konsultaciju i
                predračun.
              </p>

              <div className="space-y-4">
                <a
                  href={`tel:${phone.replace(/\s/g, "")}`}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <div className="bg-blue-600 p-2 md:p-3 rounded-lg">
                    <Phone className="h-5 w-5 md:h-6 md:w-6" />
                  </div>
                  <div>
                    <p className="font-semibold">Telefon</p>
                    <p className="text-slate-300">{phone}</p>
                  </div>
                </a>

                <a
                  href={`mailto:${email}`}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <div className="bg-blue-600 p-2 md:p-3 rounded-lg">
                    <Mail className="h-5 w-5 md:h-6 md:w-6" />
                  </div>
                  <div>
                    <p className="font-semibold">Email</p>
                    <p className="text-slate-300">{email}</p>
                  </div>
                </a>

                <div className="flex items-center gap-4 p-3">
                  <div className="bg-blue-600 p-2 md:p-3 rounded-lg">
                    <MapPin className="h-5 w-5 md:h-6 md:w-6" />
                  </div>
                  <div>
                    <p className="font-semibold">Adresa</p>
                    <p className="text-slate-300">{address}</p>
                    <p className="text-xs text-slate-400 mt-1">Oblast rada: {serviceArea}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <ContactForm />

              {/* Google Maps Embed */}
              <div className="bg-white rounded-lg overflow-hidden shadow-lg">
                <div className="p-4 bg-slate-800 text-white">
                  <h4 className="font-semibold flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Naša lokacija
                  </h4>
                  <p className="text-sm text-slate-300">{address}</p>
                </div>
                <div className="relative h-64 md:h-80">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2830.1234567890123!2d20.4612345!3d44.8123456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x475a7aa123456789%3A0x123456789abcdef0!2sTrebevicka%2017%2C%20Beograd%2C%20Serbia!5e0!3m2!1sen!2srs!4v1234567890123!5m2!1sen!2srs"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Lokacija - Trebevicka 17, Beograd"
                    className="absolute inset-0"
                  />
                </div>
                <div className="p-3 bg-slate-50 text-slate-700 text-sm">
                  <p className="flex items-center gap-2">
                    <MapPin className="h-3 w-3 text-blue-600" />
                    Kliknite na mapu za detaljnije uputstvo
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-800 text-white py-6 md:py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Wrench className="h-4 w-4 md:h-5 md:w-5" />
              </div>
              <div>
                <p className="font-semibold">{businessName}</p>
                <p className="text-xs md:text-sm text-slate-400">Licencirani i osigurani</p>
              </div>
            </div>
            <p className="text-slate-400 text-xs md:text-sm text-center md:text-right">
              © 2024 {businessName}. Sva prava zadržana.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
