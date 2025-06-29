import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Phone, Mail, MapPin, Wrench, Droplets, Zap, Clock, CheckCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { ContactForm } from "@/components/contact-form"
import { GallerySection } from "@/components/gallery-section-server"
import { TestimonialsSection } from "@/components/testimonials-section"

export default function HomePage() {
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
                <h1 className="text-xl font-bold">Vodoinstalater Zekić</h1>
                <p className="text-sm text-slate-300">Profesionalne vodoinstalaterske usluge</p>
              </div>
            </div>
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
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-slate-100 py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-100">Profesionalno i pouzdano</Badge>
              <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
                Stručne vodoinstalaterske usluge kojima možete verovati
              </h2>
              <p className="text-lg text-slate-600 mb-8">
                Sa preko 15 godina iskustva, pružamo vrhunska vodoinstalaterska rešenja za stambene i poslovne objekte.
                Dostupni smo 24/7 za hitne intervencije.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  <Phone className="mr-2 h-5 w-5" />
                  Pozovite odmah: +381 60 123 4567
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
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Licencirani i osigurani</p>
                    <p className="text-sm text-slate-600">Sertifikovani stručnjak</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-slate-900 mb-4">Naše usluge</h3>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Nudimo sveobuhvatne vodoinstalaterske usluge za sve vaše stambene i poslovne potrebe
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Droplets className="h-8 w-8" />,
                title: "Ugradnja i popravka cevi",
                description: "Kompletna ugradnja, popravka i zamena cevi za sve tipove vodoinstalaterskih sistema.",
              },
              {
                icon: <Wrench className="h-8 w-8" />,
                title: "Ugradnja sanitarija",
                description: "Profesionalna ugradnja sudopera, toaleta, tuš kabina i ostale sanitarne opreme.",
              },
              {
                icon: <Zap className="h-8 w-8" />,
                title: "Hitne intervencije",
                description: "24/7 hitne vodoinstalaterske usluge za urgentne popravke i sprečavanje štete od vode.",
              },
              {
                icon: <Clock className="h-8 w-8" />,
                title: "Servisne usluge",
                description: "Redovno održavanje i pregled instalacija za sprečavanje skupih kvarova.",
              },
              {
                icon: <Droplets className="h-8 w-8" />,
                title: "Čišćenje odvoda",
                description: "Profesionalno čišćenje i otčepljivanje odvoda najsavremenijom opremom.",
              },
              {
                icon: <Wrench className="h-8 w-8" />,
                title: "Usluge bojlera",
                description: "Ugradnja, popravka i održavanje klasičnih i protočnih bojlera.",
              },
            ].map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="bg-blue-100 w-16 h-16 rounded-lg flex items-center justify-center mb-4 text-blue-600">
                    {service.icon}
                  </div>
                  <h4 className="text-xl font-semibold text-slate-900 mb-3">{service.title}</h4>
                  <p className="text-slate-600">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <GallerySection />

      {/* Testimonials Section - Now dynamic */}
      <section id="testimonials">
        <TestimonialsSection />
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-slate-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-3xl font-bold mb-6">Kontaktirajte nas</h3>
              <p className="text-slate-300 mb-8">
                Spremni da rešimo vaše vodoinstalaterske probleme? Kontaktirajte nas danas za besplatnu konsultaciju i
                predračun.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-600 p-3 rounded-lg">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-semibold">Telefon</p>
                    <p className="text-slate-300">+381 60 123 4567</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="bg-blue-600 p-3 rounded-lg">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-semibold">Email</p>
                    <p className="text-slate-300">info@vodoinstaler-zekic.rs</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="bg-blue-600 p-3 rounded-lg">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-semibold">Oblast rada</p>
                    <p className="text-slate-300">Beograd i okolina</p>
                  </div>
                </div>
              </div>
            </div>

            <ContactForm />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Wrench className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold">Vodoinstalater Zekić</p>
                <p className="text-sm text-slate-400">Licencirani i osigurani</p>
              </div>
            </div>
            <p className="text-slate-400 text-sm">© 2024 Vodoinstalater Zekić. Sva prava zadržana.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
