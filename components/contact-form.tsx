"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, Send, Phone, Mail, MapPin, Clock } from "lucide-react"

interface SiteSettings {
  business_name: string
  phone: string
  email: string
  service_area: string
  description: string
  address: string
  working_hours: string
  emergency_available: boolean
}

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null
    message: string
  }>({ type: null, message: "" })
  const [settings, setSettings] = useState<SiteSettings | null>(null)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch("/api/settings", {
          cache: "no-store",
        })
        const result = await response.json()
        if (result.success) {
          setSettings(result.settings)
        }
      } catch (error) {
        console.error("Failed to fetch settings:", error)
      }
    }

    fetchSettings()
  }, [])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus({ type: null, message: "" })

    try {
      const response = await fetch("/api/contact", {
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
          message: "Hvala vam! Vaš upit je uspešno poslat. Odgovoriću vam u najkraćem roku.",
        })
        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          service: "",
          message: "",
        })
      } else {
        setSubmitStatus({
          type: "error",
          message: result.message || "Došlo je do greške. Molimo pokušajte ponovo.",
        })
      }
    } catch (error) {
      console.error("Contact form error:", error)
      setSubmitStatus({
        type: "error",
        message: "Došlo je do greške. Molimo pokušajte ponovo.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const phoneNumber = settings?.phone || "+381 60 123 4567"

  return (
    <section id="kontakt" className="py-16 sm:py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Kontaktirajte nas</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Potrebna vam je vodoinstalaterska usluga? Pošaljite nam upit i odgovoriću vam u najkraćem roku.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
          {/* Contact Form */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl">Pošaljite upit</CardTitle>
              <CardDescription>Popunite formu i kontaktiraću vas u najkraćem roku</CardDescription>
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
                    <Label htmlFor="phone">Telefon</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      disabled={isSubmitting}
                      placeholder="+381 60 123 4567"
                    />
                  </div>
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

                <div>
                  <Label htmlFor="service">Tip usluge</Label>
                  <Select value={formData.service} onValueChange={(value) => handleInputChange("service", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Izaberite tip usluge" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="popravka-slavine">Popravka slavine</SelectItem>
                      <SelectItem value="ugradnja-kupatila">Ugradnja kupatila</SelectItem>
                      <SelectItem value="popravka-wc-solje">Popravka WC šolje</SelectItem>
                      <SelectItem value="zamena-cevi">Zamena cevi</SelectItem>
                      <SelectItem value="ugradnja-bojlera">Ugradnja bojlera</SelectItem>
                      <SelectItem value="hitna-intervencija">Hitna intervencija</SelectItem>
                      <SelectItem value="ostalo">Ostalo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="message">Opis problema *</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => handleInputChange("message", e.target.value)}
                    required
                    disabled={isSubmitting}
                    rows={4}
                    placeholder="Opišite detaljno problem ili uslugu koja vam je potrebna..."
                  />
                </div>

                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Šalje se...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Pošaljite upit
                    </>
                  )}
                </Button>

                <p className="text-xs text-gray-500">
                  Ili nas pozovite direktno: <strong>{phoneNumber}</strong>
                </p>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl">Kontakt informacije</CardTitle>
                <CardDescription>Dostupan sam za sve vaše vodoinstalaterske potrebe</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-semibold">Telefon</p>
                    <p className="text-gray-600">{phoneNumber}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-semibold">Email</p>
                    <p className="text-gray-600">{settings?.email || "info@vodoinstaler-zekic.rs"}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-semibold">Oblast rada</p>
                    <p className="text-gray-600">{settings?.service_area || "Beograd i okolina"}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-semibold">Radno vreme</p>
                    <p className="text-gray-600">
                      {settings?.working_hours || "Ponedeljak - Petak: 08:00 - 20:00, Subota: 09:00 - 17:00"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg bg-blue-50 border-blue-200">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Hitne intervencije</h3>
                <p className="text-blue-800 mb-3">
                  Dostupan sam 24/7 za hitne vodoinstalaterske intervencije u Beogradu i okolini.
                </p>
                <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100 bg-transparent">
                  <Phone className="h-4 w-4 mr-2" />
                  Pozovite za hitnu intervenciju
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
