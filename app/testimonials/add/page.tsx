"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Wrench, Star, Send, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function AddTestimonial() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rating: 5,
    comment: "",
    service_type: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<{ type: "success" | "error" | null; message: string }>({
    type: null,
    message: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setStatus({ type: null, message: "" })

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
        setStatus({
          type: "success",
          message: "Hvala vam na recenziji! Vaša recenzija će biti objavljena nakon pregleda.",
        })
        // Reset form
        setFormData({
          name: "",
          email: "",
          rating: 5,
          comment: "",
          service_type: "",
        })
      } else {
        setStatus({
          type: "error",
          message: result.message || "Greška pri slanju recenzije",
        })
      }
    } catch (error) {
      console.error("Submit error:", error)
      setStatus({
        type: "error",
        message: "Greška pri slanju recenzije",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRatingClick = (rating: number) => {
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
              <h1 className="text-xl font-bold">Vodoinstalater Zekić</h1>
              <p className="text-sm text-slate-300">Ostavite vašu recenziju</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Podelite vaše iskustvo</h2>
            <p className="text-lg text-slate-600">
              Vaše mišljenje je važno za nas i pomaže drugim klijentima da donose informisane odluke
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Ostavite recenziju</CardTitle>
              <CardDescription>
                Molimo vas da podelite vaše iskustvo sa našim vodoinstalaterskim uslugama
              </CardDescription>
            </CardHeader>
            <CardContent>
              {status.type && (
                <Alert
                  className={`mb-6 ${
                    status.type === "success" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
                  }`}
                >
                  {status.type === "success" ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-600" />
                  )}
                  <AlertDescription className={status.type === "success" ? "text-green-800" : "text-red-800"}>
                    {status.message}
                  </AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Ime i prezime *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="Vaše ime"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email adresa *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                      placeholder="vas@email.com"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="service-type">Tip usluge</Label>
                  <Input
                    id="service-type"
                    value={formData.service_type}
                    onChange={(e) => setFormData((prev) => ({ ...prev, service_type: e.target.value }))}
                    placeholder="npr. Ugradnja kupatila, Popravka cevi, Hitna intervencija"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <Label className="text-base font-medium">Ocena *</Label>
                  <div className="flex gap-1 mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleRatingClick(star)}
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
                  <Label htmlFor="comment">Vaš komentar *</Label>
                  <Textarea
                    id="comment"
                    value={formData.comment}
                    onChange={(e) => setFormData((prev) => ({ ...prev, comment: e.target.value }))}
                    placeholder="Opišite vaše iskustvo sa našim uslugama..."
                    rows={5}
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700 flex-1" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Slanje...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Pošaljite recenziju
                      </>
                    )}
                  </Button>
                  <Link href="/">
                    <Button type="button" variant="outline" className="w-full sm:w-auto bg-transparent">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Nazad na sajt
                    </Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Sve recenzije prolaze kroz proces pregleda pre objavljivanja.
              <br />
              Hvala vam na razumevanju!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
