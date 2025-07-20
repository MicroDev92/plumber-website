"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, Send, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

interface TestimonialFormData {
  name: string
  email: string
  rating: number
  text: string
  service: string
}

export default function AddTestimonialPage() {
  const [formData, setFormData] = useState<TestimonialFormData>({
    name: "",
    email: "",
    rating: 5,
    text: "",
    service: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field: keyof TestimonialFormData, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

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

      const result = await response.json()

      if (result.success) {
        toast.success("Recenzija je uspešno poslata!", {
          description: "Hvala vam na povratnim informacijama. Recenzija će biti objavljena nakon pregleda.",
          icon: <CheckCircle className="h-4 w-4" />,
        })

        // Reset form
        setFormData({
          name: "",
          email: "",
          rating: 5,
          text: "",
          service: "",
        })
      } else {
        toast.error("Greška pri slanju recenzije", {
          description: result.message || "Pokušajte ponovo kasnije.",
          icon: <AlertCircle className="h-4 w-4" />,
        })
      }
    } catch (error) {
      console.error("Testimonial submission error:", error)
      toast.error("Greška pri slanju recenzije", {
        description: "Proverite internetsku vezu i pokušajte ponovo.",
        icon: <AlertCircle className="h-4 w-4" />,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStars = (rating: number, interactive = false) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-6 w-6 ${
              star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            } ${interactive ? "cursor-pointer hover:text-yellow-400" : ""}`}
            onClick={interactive ? () => handleInputChange("rating", star) : undefined}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 md:py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Nazad na početnu
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl text-center text-slate-900">Ostavite recenziju</CardTitle>
            <p className="text-slate-600 text-center">
              Vaše mišljenje je važno za nas! Podelite svoje iskustvo sa našim uslugama.
            </p>
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
                    placeholder="Vaše ime i prezime"
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
                    placeholder="vasa@email.com"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="service">Tip usluge *</Label>
                <Select value={formData.service} onValueChange={(value) => handleInputChange("service", value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Izaberite uslugu koju ste koristili" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popravka">Popravka instalacija</SelectItem>
                    <SelectItem value="ugradnja">Ugradnja sanitarija</SelectItem>
                    <SelectItem value="ciscenje">Čišćenje odvoda</SelectItem>
                    <SelectItem value="bojler">Usluge bojlera</SelectItem>
                    <SelectItem value="hitno">Hitna intervencija</SelectItem>
                    <SelectItem value="ostalo">Ostalo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Ocena *</Label>
                <div className="mt-2">
                  {renderStars(formData.rating, true)}
                  <p className="text-sm text-slate-600 mt-1">Kliknite na zvezde da date ocenu (1-5)</p>
                </div>
              </div>

              <div>
                <Label htmlFor="text">Vaša recenzija *</Label>
                <Textarea
                  id="text"
                  value={formData.text}
                  onChange={(e) => handleInputChange("text", e.target.value)}
                  required
                  className="mt-1 min-h-[120px]"
                  placeholder="Opišite vaše iskustvo sa našim uslugama..."
                />
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 hover:bg-blue-700">
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Šalje se...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Pošaljite recenziju
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Napomena:</strong> Sve recenzije prolaze kroz proces pregleda pre objavljivanja. Vaša recenzija
                će biti vidljiva na sajtu nakon što je odobrimo.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
