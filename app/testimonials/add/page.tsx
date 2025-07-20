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
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertCircle, Star, ArrowLeft, MessageSquare } from "lucide-react"
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
          message: "Hvala vam na recenziji! Vaše mišljenje je važno za nas i biće objavljeno nakon pregleda.",
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
    <div className="min-h-screen bg-gray-50 py-8 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Nazad na početnu
          </Link>
          <div className="text-center">
            <MessageSquare className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Ostavite recenziju</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Vaše iskustvo je važno za nas! Podelite svoje mišljenje o našim vodoinstalaterskim uslugama.
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl">Vaša recenzija</CardTitle>
              <CardDescription>
                Molimo vas da podelite svoje iskustvo sa našim uslugama. Sve recenzije se pregledaju pre objavljivanja.
              </CardDescription>
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
                  <AlertDescription
                    className={`${submitStatus.type === "success" ? "text-green-800" : "text-red-800"}`}
                  >
                    {submitStatus.message}
                  </AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Ime i prezime *</Label>
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      required
                      disabled={isSubmitting}
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
                      disabled={isSubmitting}
                      placeholder="vasa.email@example.com"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="service">Tip usluge</Label>
                  <Select value={formData.service} onValueChange={(value) => handleInputChange("service", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Izaberite tip usluge koju ste koristili" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="popravka-slavine">Popravka slavine</SelectItem>
                      <SelectItem value="ugradnja-kupatila">Ugradnja kupatila</SelectItem>
                      <SelectItem value="popravka-wc-solje">Popravka WC šolje</SelectItem>
                      <SelectItem value="zamena-cevi">Zamena cevi</SelectItem>
                      <SelectItem value="ugradnja-bojlera">Ugradnja bojlera</SelectItem>
                      <SelectItem value="hitna-intervencija">Hitna intervencija</SelectItem>
                      <SelectItem value="renoviranje-kupatila">Renoviranje kupatila</SelectItem>
                      <SelectItem value="cisenje-odvoda">Čišćenje odvoda</SelectItem>
                      <SelectItem value="servis-bojlera">Servis bojlera</SelectItem>
                      <SelectItem value="odrzavanje">Održavanje</SelectItem>
                      <SelectItem value="ostalo">Ostalo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Ocena *</Label>
                  <div className="mt-2">
                    {renderStars(formData.rating, true)}
                    <p className="text-sm text-gray-600 mt-1">
                      Kliknite na zvezde da date ocenu (trenutno: {formData.rating}/5)
                    </p>
                  </div>
                </div>

                <div>
                  <Label htmlFor="text">Vaša recenzija *</Label>
                  <Textarea
                    id="text"
                    value={formData.text}
                    onChange={(e) => handleInputChange("text", e.target.value)}
                    required
                    disabled={isSubmitting}
                    rows={5}
                    placeholder="Opišite vaše iskustvo sa našim uslugama. Šta vam se dopalo? Da li biste preporučili naše usluge drugima?"
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">Napomena o privatnosti</h4>
                  <p className="text-sm text-blue-800">
                    Vaša email adresa neće biti javno prikazana. Koristimo je samo za kontakt u slučaju potrebe za
                    dodatnim informacijama o vašoj recenziji.
                  </p>
                </div>

                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Šalje se...
                    </>
                  ) : (
                    <>
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Pošaljite recenziju
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Additional Info */}
          <div className="mt-8 text-center">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 shadow">
                <Badge className="bg-green-100 text-green-800 mb-2">Brza objava</Badge>
                <p className="text-sm text-gray-600">Recenzije se objavljuju u roku od 24 sata</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow">
                <Badge className="bg-blue-100 text-blue-800 mb-2">Provera kvaliteta</Badge>
                <p className="text-sm text-gray-600">Sve recenzije se pregledaju pre objavljivanja</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow">
                <Badge className="bg-purple-100 text-purple-800 mb-2">Anonimnost</Badge>
                <p className="text-sm text-gray-600">Email adresa se ne prikazuje javno</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
