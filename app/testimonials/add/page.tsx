"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Star, Send, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react"
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
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null
    message: string
  }>({ type: null, message: "" })

  const handleInputChange = (field: keyof TestimonialFormData, value: string | number) => {
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
          message: "Hvala vam na recenziji! Biće objavljena nakon odobrenja.",
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
          message: result.message || "Došlo je do greške. Molimo pokušajte ponovo.",
        })
      }
    } catch (error) {
      console.error("Testimonial submission error:", error)
      setSubmitStatus({
        type: "error",
        message: "Došlo je do greške. Molimo pokušajte ponovo.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Nazad na početnu
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Ostavite recenziju</h1>
          <p className="text-gray-600">
            Vaše iskustvo je važno za nas i pomaže drugim klijentima da donose informisane odluke.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Podelite svoje iskustvo</CardTitle>
            <CardDescription>Sva polja označena sa * su obavezna</CardDescription>
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
                <AlertDescription className={`${submitStatus.type === "success" ? "text-green-800" : "text-red-800"}`}>
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
                    placeholder="vasa@email.com"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="service">Tip usluge</Label>
                <Select value={formData.service} onValueChange={(value) => handleInputChange("service", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Izaberite uslugu koju ste koristili" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ugradnja-cevi">Ugradnja i popravka cevi</SelectItem>
                    <SelectItem value="ugradnja-sanitarija">Ugradnja sanitarija</SelectItem>
                    <SelectItem value="hitne-intervencije">Hitne intervencije</SelectItem>
                    <SelectItem value="servisne-usluge">Servisne usluge</SelectItem>
                    <SelectItem value="ciscenje-odvoda">Čišćenje odvoda</SelectItem>
                    <SelectItem value="usluge-bojlera">Usluge bojlera</SelectItem>
                    <SelectItem value="ostalo">Ostalo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Ocena *</Label>
                <div className="flex items-center gap-2 mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleInputChange("rating", star)}
                      className={`p-1 rounded transition-colors ${
                        star <= formData.rating ? "text-yellow-400" : "text-gray-300"
                      }`}
                    >
                      <Star className="h-8 w-8 fill-current" />
                    </button>
                  ))}
                  <span className="ml-2 text-sm text-gray-600">({formData.rating}/5)</span>
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
                  placeholder="Opišite svoje iskustvo sa našim uslugama..."
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
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
