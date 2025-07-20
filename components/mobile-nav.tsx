"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import Link from "next/link"

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)

  const scrollToSection = (sectionId: string) => {
    setIsOpen(false)
    if (sectionId === "pocetna") {
      window.scrollTo({ top: 0, behavior: "smooth" })
      return
    }
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div className="md:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="text-white hover:bg-slate-800">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[300px] sm:w-[400px]">
          <div className="flex flex-col space-y-4 mt-8">
            <button
              onClick={() => scrollToSection("pocetna")}
              className="text-left text-lg font-medium hover:text-blue-600 transition-colors"
            >
              Početna
            </button>
            <button
              onClick={() => scrollToSection("services")}
              className="text-left text-lg font-medium hover:text-blue-600 transition-colors"
            >
              Usluge
            </button>
            <button
              onClick={() => scrollToSection("gallery")}
              className="text-left text-lg font-medium hover:text-blue-600 transition-colors"
            >
              Galerija
            </button>
            <button
              onClick={() => scrollToSection("testimonials")}
              className="text-left text-lg font-medium hover:text-blue-600 transition-colors"
            >
              Recenzije
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="text-left text-lg font-medium hover:text-blue-600 transition-colors"
            >
              Kontakt
            </button>
            <div className="pt-4 border-t">
              <Link href="/admin/login" onClick={() => setIsOpen(false)}>
                <Button variant="outline" className="w-full bg-transparent">
                  Admin Login
                </Button>
              </Link>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
