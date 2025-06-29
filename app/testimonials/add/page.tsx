"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Star, CheckCircle, AlertCircle, Loader2, ArrowLeft, Wrench } from "lucide-react"
import Link from "next/link"

export default function AddTestimonialPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    location: "",
    text: "",
    rating: 5,
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

    // Basic validation
    if (!formData.name.trim()) {
      setSubmitStatus({ type: "error", message: "Ime je obavezno" })
      setIsSubmitting(false)
      return
    }

    if (!formData.text.trim()) {
      setSubmitStatus({ type: "error", message: "Recenzija je obavezna" })
      setIsSubmitting(false)
      return
    }

    if (formData.text.length < 20) {
      setSubmitStatus({ type: "error", message: "Recenzija mora imati najmanje 20 karaktera" })
      setIsSubmitting(false)
      return
    }

    try {
      console.log("Submitting testimonial:", formData)

      const response = await fetch("/api/testimonials/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      console.log("Response status:", response.status)
      const result = await response.json()
      console.log("Response data:", result)

      if (result.success) {
        setSubmitStatus({
          type: "success",
          message: result.message,
        })
        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          service: "",
          location: "",
          text: "",
          rating: 5,
        })
      } else {
        setSubmitStatus({
          type: "error",
          message: result.message || "Greška pri slanju recenzije",
        })
      }
    } catch (error) {
      console.error("Testimonial submission error:", error)
      setSubmitStatus({
        type: "error",
        message: "Došlo je do greške. Molimo pokušajte ponovo ili nas pozovite direktno.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "rating" ? Number.parseInt(value) : value,
    }))
  }

  const handleStarClick = (rating: number) => {
    setFormData((prev) => ({ ...prev, rating }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-slate-900 text-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 hover:text-blue-300 transition-colors">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Wrench className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Vodoinstalater Zekić</h1>
                <p className="text-sm text-slate-300">Profesionalne vodoinstalaterske usluge</p>
              </div>
            </Link>
            <Link href="/">
              <Button variant="outline" size="sm" className="text-white border-white bg-transparent">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Nazad na sajt
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Ostavite recenziju</h2>
            <p className="text-lg text-slate-600">
              Vaše mišljenje je važno za nas! Podelite svoje iskustvo sa našim uslugama.
            </p>
            <Badge variant="outline" className="mt-2">
              Recenzije se objavljuju nakon odobrenja
            </Badge>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Forma za recenziju</CardTitle>
              <CardDescription>
                Molimo popunite sva polja. Vaša recenzija će biti pregledana i objavljena u najkraćem roku.
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
                  <AlertDescription className={submitStatus.type === "success" ? "text-green-800" : "text-red-800"}>
                    {submitStatus.message}
                  </AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Rating */}
                <div>
                  <Label className="text-base font-medium">
                    Ocena <span className="text-red-500">*</span>
                  </Label>
                  <div className="flex items-center gap-2 mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleStarClick(star)}
                        className="focus:outline-none"
                        disabled={isSubmitting}
                      >
                        <Star
                          className={`h-8 w-8 transition-colors ${
                            star <= formData.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300 hover:text-yellow-400"
                          }`}
                        />
                      </button>
                    ))}
                    <span className="ml-2 text-sm text-gray-600">
                      {formData.rating} od 5 {formData.rating === 1 ? "zvezda" : "zvezda"}
                    </span>
                  </div>
                </div>

                {/* Personal Info */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">
                      Ime i prezime <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Vaše ime i prezime"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Lokacija</Label>
                    <Input
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="npr. Novi Beograd"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                {/* Contact Info */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="vas.email@example.com"
                      disabled={isSubmitting}
                    />
                    <p className="text-xs text-gray-500 mt-1">Za potvrdu identiteta (neće biti prikazano)</p>
                  </div>
                  <div>
                    <Label htmlFor="phone">Telefon</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+381 60 123 4567"
                      disabled={isSubmitting}
                    />
                    <p className="text-xs text-gray-500 mt-1">Za potvrdu identiteta (neće biti prikazano)</p>
                  </div>
                </div>

                {/* Service */}
                <div>
                  <Label htmlFor="service">Tip usluge</Label>
                  <select
                    id="service"
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={isSubmitting}
                  >
                    <option value="">Izaberite uslugu</option>
                    <option value="Hitna intervencija">Hitna intervencija</option>
                    <option value="Ugradnja sanitarija">Ugradnja sanitarija</option>
                    <option value="Popravka cevi">Popravka cevi</option>
                    <option value="Renoviranje kupatila">Renoviranje kupatila</option>
                    <option value="Čišćenje odvoda">Čišćenje odvoda</option>
                    <option value="Servis bojlera">Servis bojlera</option>
                    <option value="Održavanje">Održavanje</option>
                    <option value="Ostalo">Ostalo</option>
                  </select>
                </div>

                {/* Review Text */}
                <div>
                  <Label htmlFor="text">
                    Vaša recenzija <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="text"
                    name="text"
                    value={formData.text}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Opišite vaše iskustvo sa našim uslugama. Šta vam se dopalo? Da li biste preporučili naše usluge?"
                    required
                    disabled={isSubmitting}
                    className="resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">Minimum 20 karaktera ({formData.text.length}/20)</p>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={isSubmitting || formData.text.length < 20}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Šalje se...
                    </>
                  ) : (
                    "Pošaljite recenziju"
                  )}
                </Button>
              </form>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Napomena:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Recenzije se objavljuju nakon odobrenja administratora</li>
                  <li>• Email i telefon se koriste samo za potvrdu identiteta</li>
                  <li>• Neprikladne recenzije neće biti objavljene</li>
                  <li>• Objavljivanje može potrajati do 24 sata</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
