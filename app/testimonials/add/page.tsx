"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Star, Send, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function AddTestimonialPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rating: 5,
    text: "",
    service: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/testimonials/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Recenzija poslata!",
          description: "Hvala vam na povratnoj informaciji. Recenzija će biti objavljena nakon odobrenja.",
        })
        setFormData({
          name: "",
          email: "",
          rating: 5,
          text: "",
          service: "",
        })
      } else {
        toast({
          title: "Greška",
          description: data.message || "Došlo je do greške prilikom slanja recenzije.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Greška",
        description: "Došlo je do greške prilikom slanja recenzije.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Nazad na početnu
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Ostavite recenziju</h1>
          <p className="text-gray-600">Podelite vaše iskustvo sa našim uslugama</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-6 w-6 text-yellow-500" />
              Vaša recenzija
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Ime i prezime *</Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email adresa *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="service">Tip usluge</Label>
                <Select value={formData.service} onValueChange={(value) => handleInputChange("service", value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Izaberite tip usluge" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popravka-cevi">Popravka cevi</SelectItem>
                    <SelectItem value="instalacija-sanitarija">Instalacija sanitarija</SelectItem>
                    <SelectItem value="hitna-intervencija">Hitna intervencija</SelectItem>
                    <SelectItem value="odrzavanje-sistema">Održavanje sistema</SelectItem>
                    <SelectItem value="ciscenje-kanalizacije">Čišćenje kanalizacije</SelectItem>
                    <SelectItem value="zamena-armatura">Zamena armatura</SelectItem>
                    <SelectItem value="ostalo">Ostalo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="rating">Ocena *</Label>
                <Select
                  value={formData.rating.toString()}
                  onValueChange={(value) => handleInputChange("rating", Number.parseInt(value))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">⭐⭐⭐⭐⭐ (5) - Odlično</SelectItem>
                    <SelectItem value="4">⭐⭐⭐⭐ (4) - Vrlo dobro</SelectItem>
                    <SelectItem value="3">⭐⭐⭐ (3) - Dobro</SelectItem>
                    <SelectItem value="2">⭐⭐ (2) - Loše</SelectItem>
                    <SelectItem value="1">⭐ (1) - Vrlo loše</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="text">Vaša recenzija *</Label>
                <Textarea
                  id="text"
                  value={formData.text}
                  onChange={(e) => handleInputChange("text", e.target.value)}
                  required
                  rows={4}
                  className="mt-1"
                  placeholder="Opišite vaše iskustvo sa našim uslugama..."
                />
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 hover:bg-blue-700">
                {isSubmitting ? (
                  "Šalje se..."
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Pošaljite recenziju
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
