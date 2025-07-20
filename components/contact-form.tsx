"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Phone, Mail, Send, CheckCircle, AlertCircle } from "lucide-react"
import { toast } from "sonner"

interface ContactFormData {
  name: string
  email: string
  phone: string
  service: string
  message: string
  urgency: string
}

interface Settings {
  phone?: string
  email?: string
}

export function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
    urgency: "normal",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [settings, setSettings] = useState<Settings>({})

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/settings")
      if (response.ok) {
        const data = await response.json()
        setSettings(data)
      }
    } catch (error) {
      console.error("Failed to fetch settings:", error)
    }
  }

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

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
        toast.success("Poruka je uspešno poslata!", {
          description: "Kontaktiraćemo vas u najkraćem mogućem roku.",
          icon: <CheckCircle className="h-4 w-4" />,
        })

        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          service: "",
          message: "",
          urgency: "normal",
        })
      } else {
        toast.error("Greška pri slanju poruke", {
          description: result.message || "Pokušajte ponovo kasnije.",
          icon: <AlertCircle className="h-4 w-4" />,
        })
      }
    } catch (error) {
      console.error("Contact form error:", error)
      toast.error("Greška pri slanju poruke", {
        description: "Proverite internetsku vezu i pokušajte ponovo.",
        icon: <AlertCircle className="h-4 w-4" />,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const businessPhone = settings.phone || "+381 60 123 4567"

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl text-slate-900">Pošaljite nam poruku</CardTitle>
        <p className="text-slate-600">Popunite formu ispod i kontaktiraćemo vas u najkraćem mogućem roku</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
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
            <Label htmlFor="phone">Broj telefona</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              className="mt-1"
              placeholder={businessPhone}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="service">Tip usluge *</Label>
              <Select value={formData.service} onValueChange={(value) => handleInputChange("service", value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Izaberite uslugu" />
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
              <Label htmlFor="urgency">Hitnost</Label>
              <Select value={formData.urgency} onValueChange={(value) => handleInputChange("urgency", value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Izaberite hitnost" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Nije hitno</SelectItem>
                  <SelectItem value="normal">Normalno</SelectItem>
                  <SelectItem value="high">Hitno</SelectItem>
                  <SelectItem value="urgent">Vrlo hitno</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="message">Opis problema *</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => handleInputChange("message", e.target.value)}
              required
              className="mt-1 min-h-[120px]"
              placeholder="Opišite detaljno vaš problem ili potrebu za uslugom..."
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
                Pošaljite poruku
              </>
            )}
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-200">
          <p className="text-sm text-slate-600 mb-4">Ili nas kontaktirajte direktno:</p>
          <div className="space-y-3">
            <a
              href={`tel:${businessPhone.replace(/\s/g, "")}`}
              className="flex items-center gap-3 text-sm text-slate-700 hover:text-blue-600 transition-colors"
            >
              <Phone className="h-4 w-4" />
              <span>{businessPhone}</span>
            </a>
            <a
              href={`mailto:${settings.email || "info@vodoinstaler-zekic.rs"}`}
              className="flex items-center gap-3 text-sm text-slate-700 hover:text-blue-600 transition-colors"
            >
              <Mail className="h-4 w-4" />
              <span>{settings.email || "info@vodoinstaler-zekic.rs"}</span>
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
