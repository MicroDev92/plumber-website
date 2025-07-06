"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Menu, Wrench, Phone, Mail, MapPin } from "lucide-react"
import Link from "next/link"

export function MobileNav() {
  const [open, setOpen] = useState(false)

  const closeMenu = () => setOpen(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="md:hidden text-white hover:bg-white/20">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Otvori meni</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px] p-0">
        <ScrollArea className="h-full">
          <div className="p-6">
            <SheetHeader className="mb-8">
              <SheetTitle className="flex items-center gap-3">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <Wrench className="h-5 w-5 text-white" />
                </div>
                <div className="text-left">
                  <p className="font-bold">Vodoinstalater Žekić</p>
                  <p className="text-sm text-gray-500">Profesionalne usluge</p>
                </div>
              </SheetTitle>
            </SheetHeader>

            <div className="space-y-6">
              {/* Navigation Links */}
              <nav className="space-y-4">
                <Link
                  href="#services"
                  onClick={closeMenu}
                  className="block py-3 px-4 text-lg font-medium text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Usluge
                </Link>
                <Link
                  href="#gallery"
                  onClick={closeMenu}
                  className="block py-3 px-4 text-lg font-medium text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Galerija
                </Link>
                <Link
                  href="#testimonials"
                  onClick={closeMenu}
                  className="block py-3 px-4 text-lg font-medium text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Recenzije
                </Link>
                <Link
                  href="#contact"
                  onClick={closeMenu}
                  className="block py-3 px-4 text-lg font-medium text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Kontakt
                </Link>
              </nav>

              {/* Quick Contact */}
              <div className="border-t pt-6">
                <h4 className="font-semibold text-gray-900 mb-4">Brzi kontakt</h4>
                <div className="space-y-3">
                  <a
                    href="tel:+381601234567"
                    className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                    onClick={closeMenu}
                  >
                    <div className="bg-blue-600 p-2 rounded-lg">
                      <Phone className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-blue-900">Pozovite odmah</p>
                      <p className="text-sm text-blue-700">+381 60 123 4567</p>
                    </div>
                  </a>

                  <a
                    href="mailto:info@vodoinstaler-zekic.rs"
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    onClick={closeMenu}
                  >
                    <div className="bg-gray-600 p-2 rounded-lg">
                      <Mail className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Email</p>
                      <p className="text-sm text-gray-600">info@vodoinstaler-zekic.rs</p>
                    </div>
                  </a>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="bg-gray-600 p-2 rounded-lg">
                      <MapPin className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Oblast rada</p>
                      <p className="text-sm text-gray-600">Beograd i okolina</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="border-t pt-6 space-y-3">
                <Link href="/testimonials/add" onClick={closeMenu}>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">Ostavite recenziju</Button>
                </Link>
                <Link href="/admin/login" onClick={closeMenu}>
                  <Button variant="outline" className="w-full bg-transparent">
                    Admin pristup
                  </Button>
                </Link>
              </div>

              {/* Footer */}
              <div className="border-t pt-6 text-center pb-6">
                <p className="text-sm text-gray-500">
                  © 2024 Vodoinstalater Žekić
                  <br />
                  Licencirani i osigurani
                </p>
              </div>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
