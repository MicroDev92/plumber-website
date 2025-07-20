"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Menu, Phone, Mail, MapPin, Clock, Wrench, Home, Camera, MessageSquare, Star, Shield } from "lucide-react"
import Link from "next/link"

export function MobileNav() {
  const [open, setOpen] = useState(false)

  const closeNav = () => setOpen(false)

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
      closeNav()
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Otvori meni</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px] p-0">
        <ScrollArea className="h-full">
          <div className="p-6 pb-6">
            {/* Header */}
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Wrench className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-lg">Vodoinstalater Žekić</h2>
                <p className="text-sm text-gray-600">25 godina iskustva</p>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="space-y-4 mb-8">
              <button
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: "smooth" })
                  closeNav()
                }}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors w-full text-left"
              >
                <Home className="h-5 w-5 text-blue-600" />
                <span className="font-medium">Početna</span>
              </button>

              <button
                onClick={() => scrollToSection("services")}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors w-full text-left"
              >
                <Wrench className="h-5 w-5 text-blue-600" />
                <span className="font-medium">Usluge</span>
              </button>

              <button
                onClick={() => scrollToSection("gallery")}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors w-full text-left"
              >
                <Camera className="h-5 w-5 text-blue-600" />
                <span className="font-medium">Galerija</span>
              </button>

              <button
                onClick={() => scrollToSection("testimonials")}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors w-full text-left"
              >
                <Star className="h-5 w-5 text-blue-600" />
                <span className="font-medium">Recenzije</span>
              </button>

              <button
                onClick={() => scrollToSection("contact")}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors w-full text-left"
              >
                <MessageSquare className="h-5 w-5 text-blue-600" />
                <span className="font-medium">Kontakt</span>
              </button>
            </nav>

            {/* Contact Info */}
            <div className="space-y-4 mb-8">
              <h3 className="font-semibold text-gray-900 mb-3">Kontakt informacije</h3>

              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <Phone className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-900">+381 60 123 4567</p>
                  <p className="text-sm text-blue-700">Pozovite nas</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <Mail className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-900">info@vodoinstaler-zekic.rs</p>
                  <p className="text-sm text-green-700">Pošaljite email</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                <MapPin className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="font-medium text-orange-900">Trebevićka 17</p>
                  <p className="text-sm text-orange-700">Beograd, Srbija</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                <Clock className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="font-medium text-purple-900">Pon-Pet: 08:00-20:00</p>
                  <p className="text-sm text-purple-700">Sub: 09:00-17:00</p>
                </div>
              </div>
            </div>

            {/* Emergency Notice */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Phone className="h-5 w-5 text-red-600" />
                <h4 className="font-semibold text-red-900">Hitni pozivi</h4>
              </div>
              <p className="text-sm text-red-700">Dostupni smo 24/7 za hitne vodoinstalaterske intervencije</p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 mb-6">
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => scrollToSection("contact")}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Zatražite ponudu
              </Button>

              <Button variant="outline" className="w-full bg-transparent" onClick={closeNav} asChild>
                <Link href="/testimonials/add">
                  <Star className="h-4 w-4 mr-2" />
                  Ostavite recenziju
                </Link>
              </Button>

              <Button variant="outline" className="w-full bg-transparent" onClick={closeNav} asChild>
                <Link href="/admin/login">
                  <Shield className="h-4 w-4 mr-2" />
                  Admin pristup
                </Link>
              </Button>
            </div>

            {/* Footer */}
            <div className="border-t pt-6 text-center">
              <p className="text-sm text-gray-500">
                © 2024 Vodoinstalater Žekić
                <br />
                Licencirani i osigurani
              </p>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
