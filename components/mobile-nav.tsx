"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Wrench, Phone, Mail, Star, ImageIcon, MessageSquare } from "lucide-react"

const navigation = [
  { name: "Početna", href: "/" },
  { name: "Usluge", href: "#services" },
  { name: "Galerija", href: "#gallery" },
  { name: "Recenzije", href: "#testimonials" },
  { name: "Kontakt", href: "#contact" },
]

export function MobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0 w-[300px] sm:w-[350px]">
        <ScrollArea className="h-full">
          <div className="px-6 py-6">
            {/* Logo */}
            <div className="flex items-center gap-2 mb-8">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Wrench className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Vodoinstalater Žekić</h2>
                <p className="text-sm text-gray-600">25 godina iskustva</p>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="space-y-4 mb-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  {item.name === "Početna" && <Wrench className="h-5 w-5" />}
                  {item.name === "Usluge" && <Wrench className="h-5 w-5" />}
                  {item.name === "Galerija" && <ImageIcon className="h-5 w-5" />}
                  {item.name === "Recenzije" && <Star className="h-5 w-5" />}
                  {item.name === "Kontakt" && <MessageSquare className="h-5 w-5" />}
                  <span className="font-medium">{item.name}</span>
                </Link>
              ))}
            </nav>

            {/* Contact Info */}
            <div className="space-y-4 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-3 text-gray-600">
                <Phone className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900">Pozovite nas</p>
                  <a href="tel:+381601234567" className="text-blue-600 hover:underline">
                    +381 60 123 4567
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3 text-gray-600">
                <Mail className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900">Email</p>
                  <a href="mailto:info@vodoinstaler-zekic.rs" className="text-blue-600 hover:underline">
                    info@vodoinstaler-zekic.rs
                  </a>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-6">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setOpen(false)}>
                <Phone className="h-4 w-4 mr-2" />
                Pozovi odmah
              </Button>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
