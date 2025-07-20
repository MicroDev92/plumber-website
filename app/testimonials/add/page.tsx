"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function AddTestimonialPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rating: 5,
    text: "",
    service: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null
    message: string
  }>({ type: null, message: "" })

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus({ type: null, message: "" })

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
        setSubmitStatus({
          type: "success",
          message: "Hvala vam na recenziji! Vaše mišljenje će biti objavljeno nakon pregleda.",
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
        setSubmitStatus({
          type: "error",
          message: result.message || "Došlo je do greške prilikom slanja recenzije.",
        })
      }
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: "Došlo je do greške prilikom slanja recenzije. Molimo pokušajte ponovo.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStars = (rating: number, interactive = false) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => interactive && handleInputChange("rating", star)}
            className={`${interactive ? "cursor-pointer hover:scale-110" : "cursor-default"} transition-transform`}
            disabled={!interactive}
          >
            <Star className={`h-6 w-6 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100">
      {/* Header */}
      <header className="bg-slate-900 text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <ArrowLeft className="h-5 w-5" />
              <span>Nazad na početnu</span>
            </Link>
            <h1 className="text-xl font-bold">Ostavite recenziju</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl md:text-3xl text-slate-900 mb-2">Podelite svoje iskustvo</CardTitle>
              <p className="text-slate-600">
                Vaše mišljenje je važno za nas i pomaže drugim klijentima da donose informisane odluke.
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              {submitStatus.type && (
                <Alert
                  className={
                    submitStatus.type === "success" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
                  }
                >
                  {submitStatus.type === "success" ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-600" />
                  )}
                  <AlertDescription className={submitStatus.type === "success" ? "text-green-800" : "text-red-800"}>
                    {submitStatus.message}
                  </AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium text-slate-700">
                    Ime i prezime *
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Unesite vaše ime i prezime"
                    required
                    className="w-full"
                  />
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                    Email adresa
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="vaš@email.com (opciono)"
                    className="w-full"
                  />
                  <p className="text-xs text-slate-500">Email adresa neće biti javno prikazana</p>
                </div>

                {/* Service Type */}
                <div className="space-y-2">
                  <Label htmlFor="service" className="text-sm font-medium text-slate-700">
                    Tip usluge
                  </Label>
                  <Select value={formData.service} onValueChange={(value) => handleInputChange("service", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Izaberite tip usluge" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ugradnja_cevi">Ugradnja i popravka cevi</SelectItem>
                      <SelectItem value="ugradnja_sanitarija">Ugradnja sanitarija</SelectItem>
                      <SelectItem value="hitne_intervencije">Hitne intervencije</SelectItem>
                      <SelectItem value="servisne_usluge">Servisne usluge</SelectItem>
                      <SelectItem value="cisćenje_odvoda">Čišćenje odvoda</SelectItem>
                      <SelectItem value="usluge_bojlera">Usluge bojlera</SelectItem>
                      <SelectItem value="ostalo">Ostalo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Rating */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-slate-700">Ocena *</Label>
                  <div className="flex items-center gap-4">
                    {renderStars(formData.rating, true)}
                    <span className="text-sm text-slate-600">({formData.rating} od 5 zvezda)</span>
                  </div>
                </div>

                {/* Comment */}
                <div className="space-y-2">
                  <Label htmlFor="text" className="text-sm font-medium text-slate-700">
                    Vaša recenzija *
                  </Label>
                  <Textarea
                    id="text"
                    value={formData.text}
                    onChange={(e) => handleInputChange("text", e.target.value)}
                    placeholder="Opišite vaše iskustvo sa našim uslugama..."
                    rows={5}
                    required
                    className="w-full resize-none"
                  />
                  <p className="text-xs text-slate-500">Minimum 10 karaktera</p>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting || !formData.name || !formData.text || formData.text.length < 10}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                  size="lg"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Šalje se...
                    </>
                  ) : (
                    <>
                      <Star className="mr-2 h-4 w-4" />
                      Pošaljite recenziju
                    </>
                  )}
                </Button>
              </form>

              {/* Info Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">Napomena:</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Sve recenzije prolaze kroz pregled pre objavljivanja</li>
                  <li>• Vaša email adresa neće biti javno prikazana</li>
                  <li>• Recenzije se obično objavljuju u roku od 24 sata</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
