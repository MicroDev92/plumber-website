"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Mail, Phone, Send } from "lucide-react"

interface ContactFormData {
  name: string
  email: string
  phone: string
  service: string
  message: string
}

export function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState("+381 60 123 4567")
  const { toast } = useToast()

  useEffect(() => {
    // Fetch phone number from settings
    const fetchSettings = async () => {
      try {
        const response = await fetch("/api/settings")
        if (response.ok) {
          const result = await response.json()
          if (result.success && result.settings?.phone) {
            setPhoneNumber(result.settings.phone)
          }
        }
      } catch (error) {
        console.error("Failed to fetch settings:", error)
      }
    }

    fetchSettings()
  }, [])

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
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
        toast({
          title: "Poruka poslata!",
          description: "Kontaktiraćemo vas u najkraćem mogućem roku.",
        })
        setFormData({
          name: "",
          email: "",
          phone: "",
          service: "",
          message: "",
        })
      } else {
        toast({
          title: "Greška",
          description: result.message || "Došlo je do greške prilikom slanja poruke.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Greška",
        description: "Došlo je do greške prilikom slanja poruke.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Pošaljite nam poruku
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Telefon</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder={phoneNumber}
              />
            </div>
            <div>
              <Label htmlFor="service">Tip usluge</Label>
              <Select value={formData.service} onValueChange={(value) => handleInputChange("service", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Izaberite uslugu" />
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
          </div>

          <div>
            <Label htmlFor="message">Poruka *</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => handleInputChange("message", e.target.value)}
              required
              placeholder="Opišite vaš problem ili potrebu..."
              rows={4}
            />
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 hover:bg-blue-700">
            {isSubmitting ? (
              "Šalje se..."
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Pošaljite poruku
              </>
            )}
          </Button>

          <div className="text-center pt-4 border-t">
            <p className="text-sm text-slate-600 mb-2">Ili nas pozovite direktno:</p>
            <Button variant="outline" size="lg" asChild>
              <a href={`tel:${phoneNumber.replace(/\s/g, "")}`}>
                <Phone className="mr-2 h-4 w-4" />
                {phoneNumber}
              </a>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
