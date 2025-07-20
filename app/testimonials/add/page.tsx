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
    location: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null
    message: string
  }>({ type: null, message: "" })

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
          message: "Hvala vam na recenziji! Vaša recenzija će biti objavljena nakon pregleda.",
        })
        // Reset form
        setFormData({
          name: "",
          email: "",
          rating: 5,
          text: "",
          service: "",
          location: "",
        })
      } else {
        setSubmitStatus({
          type: "error",
          message: result.message || "Došlo je do greške pri slanju recenzije.",
        })
      }
    } catch (error) {
      console.error("Testimonial submission error:", error)
      setSubmitStatus({
        type: "error",
        message: "Došlo je do greške pri slanju recenzije. Molimo pokušajte ponovo.",
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
          <p className="text-gray-600">
            Vaše iskustvo je važno za nas i pomaže drugim klijentima da donose informisane odluke.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              Podelite svoje iskustvo
            </CardTitle>
          </CardHeader>
          <CardContent>
            {submitStatus.type && (
              <Alert
                className={`mb-6 ${
                  submitStatus.type === "success" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
                }`}
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
                <Label htmlFor="rating">Ocena *</Label>
                <div className="flex items-center gap-2 mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleInputChange("rating", star)}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`h-8 w-8 ${
                          star <= formData.rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300 hover:text-yellow-400"
                        } transition-colors`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-sm text-gray-600">({formData.rating}/5)</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="service">Tip usluge</Label>
                  <Select value={formData.service} onValueChange={(value) => handleInputChange("service", value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Izaberite uslugu" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Popravka cevi">Popravka cevi</SelectItem>
                      <SelectItem value="Ugradnja sanitarija">Ugradnja sanitarija</SelectItem>
                      <SelectItem value="Hitna intervencija">Hitna intervencija</SelectItem>
                      <SelectItem value="Čišćenje odvoda">Čišćenje odvoda</SelectItem>
                      <SelectItem value="Servis bojlera">Servis bojlera</SelectItem>
                      <SelectItem value="Održavanje">Održavanje</SelectItem>
                      <SelectItem value="Ostalo">Ostalo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="location">Lokacija</Label>
                  <Input
                    id="location"
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    className="mt-1"
                    placeholder="Beograd, Novi Sad..."
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="text">Vaša recenzija *</Label>
                <Textarea
                  id="text"
                  value={formData.text}
                  onChange={(e) => handleInputChange("text", e.target.value)}
                  required
                  rows={5}
                  className="mt-1"
                  placeholder="Opišite vaše iskustvo sa našim uslugama..."
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">Napomena o privatnosti</h4>
                <p className="text-sm text-blue-800">
                  Vaša recenzija će biti pregledana pre objavljivanja. Email adresa neće biti javno prikazana i
                  koristiće se samo za komunikaciju u vezi sa vašom recenzijom.
                </p>
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 hover:bg-blue-700">
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
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
