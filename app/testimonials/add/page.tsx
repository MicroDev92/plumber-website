"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Star, CheckCircle, AlertCircle, Loader2, ArrowLeft, Wrench } from "lucide-react"
import Link from "next/link"

export default function AddTestimonial() {
  const [formData, setFormData] = useState({
    name: "",
    text: "",
    rating: 5,
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
          message: "Hvala vam! Vaša recenzija je poslata i biće objavljena nakon pregleda.",
        })
        // Reset form
        setFormData({
          name: "",
          text: "",
          rating: 5,
          service: "",
          location: "",
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
        message: "Greška pri slanju recenzije. Molimo pokušajte ponovo.",
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100">
      {/* Header */}
      <header className="bg-slate-900 text-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Wrench className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Vodoinstalater Žekić</h1>
              <p className="text-sm text-slate-300">Ostavite recenziju</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <Link href="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Nazad na početnu
              </Button>
            </Link>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Podelite svoje iskustvo</CardTitle>
              <CardDescription>
                Vaše mišljenje je važno za nas i pomaže drugim klijentima da donose informisane odluke.
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
                <div>
                  <Label htmlFor="name">
                    Vaše ime <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Marko Petrović"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <Label>
                    Ocena <span className="text-red-500">*</span>
                  </Label>
                  <div className="flex gap-1 mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleStarClick(star)}
                        disabled={isSubmitting}
                        className="p-1 hover:scale-110 transition-transform disabled:cursor-not-allowed"
                      >
                        <Star
                          className={`h-8 w-8 ${
                            star <= formData.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300 hover:text-yellow-400"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {formData.rating === 1 && "Vrlo loše"}
                    {formData.rating === 2 && "Loše"}
                    {formData.rating === 3 && "Prosečno"}
                    {formData.rating === 4 && "Dobro"}
                    {formData.rating === 5 && "Odlično"}
                  </p>
                </div>

                <div>
                  <Label htmlFor="text">
                    Vaša recenzija <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="text"
                    name="text"
                    value={formData.text}
                    onChange={handleChange}
                    placeholder="Opišite vaše iskustvo sa našim uslugama..."
                    rows={4}
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="service">Usluga</Label>
                    <select
                      id="service"
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  <div>
                    <Label htmlFor="location">Lokacija</Label>
                    <Input
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="Beograd, Novi Sad..."
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
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

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Sve recenzije prolaze kroz pregled pre objavljivanja kako bi se osigurala autentičnost.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
