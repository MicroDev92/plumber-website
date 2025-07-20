"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Wrench, Phone, Mail, Star, ImageIcon, Shield } from "lucide-react"
import Link from "next/link"

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)

  const closeNav = () => setIsOpen(false)

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
      closeNav()
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Otvori meni</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between pb-4 border-b">
            <div className="flex items-center space-x-2">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Wrench className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900">Vodoinstalater Žekić</h2>
                <p className="text-sm text-gray-600">Profesionalne usluge</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 py-6">
            <div className="space-y-4">
              <button
                onClick={() => scrollToSection("pocetna")}
                className="flex items-center space-x-3 w-full text-left p-3 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Wrench className="h-5 w-5 text-blue-600" />
                <span className="font-medium">Početna</span>
              </button>

              <button
                onClick={() => scrollToSection("usluge")}
                className="flex items-center space-x-3 w-full text-left p-3 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Wrench className="h-5 w-5 text-blue-600" />
                <span className="font-medium">Usluge</span>
              </button>

              <button
                onClick={() => scrollToSection("galerija")}
                className="flex items-center space-x-3 w-full text-left p-3 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ImageIcon className="h-5 w-5 text-blue-600" />
                <span className="font-medium">Galerija</span>
              </button>

              <button
                onClick={() => scrollToSection("recenzije")}
                className="flex items-center space-x-3 w-full text-left p-3 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Star className="h-5 w-5 text-blue-600" />
                <span className="font-medium">Recenzije</span>
              </button>

              <button
                onClick={() => scrollToSection("kontakt")}
                className="flex items-center space-x-3 w-full text-left p-3 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Mail className="h-5 w-5 text-blue-600" />
                <span className="font-medium">Kontakt</span>
              </button>

              <Link href="/testimonials/add" onClick={closeNav}>
                <div className="flex items-center space-x-3 w-full text-left p-3 rounded-lg hover:bg-gray-100 transition-colors">
                  <Star className="h-5 w-5 text-blue-600" />
                  <span className="font-medium">Ostavite recenziju</span>
                </div>
              </Link>

              <Link href="/admin/login" onClick={closeNav}>
                <div className="flex items-center space-x-3 w-full text-left p-3 rounded-lg hover:bg-gray-100 transition-colors">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <span className="font-medium">Admin prijava</span>
                </div>
              </Link>
            </div>
          </nav>

          <div className="border-t pt-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <Phone className="h-4 w-4" />
                <span>+381 60 123 4567</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <Mail className="h-4 w-4" />
                <span>info@vodoinstaler-zekic.rs</span>
              </div>
            </div>

            <Button onClick={() => scrollToSection("kontakt")} className="w-full mt-4 bg-blue-600 hover:bg-blue-700">
              <Phone className="h-4 w-4 mr-2" />
              Pozovite sada
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
