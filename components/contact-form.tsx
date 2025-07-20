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
import { Send } from "lucide-react"

interface Settings {
  phone: string
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
  const [settings, setSettings] = useState<Settings>({ phone: "+381 60 123 4567" })
  const { toast } = useToast()

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch("/api/settings")
        if (response.ok) {
          const data = await response.json()
          if (data.settings?.phone) {
            setSettings({ phone: data.settings.phone })
          }
        }
      } catch (error) {
        console.error("Error fetching settings:", error)
      }
    }

    fetchSettings()
  }, [])

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

      const data = await response.json()

      if (data.success) {
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
          description: data.message || "Došlo je do greške prilikom slanja poruke.",
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

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl text-gray-900">Pošaljite nam poruku</CardTitle>
      </CardHeader>
      <CardContent>
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
              />
            </div>
          </div>

          <div>
            <Label htmlFor="phone">Telefon</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              placeholder={settings.phone}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="service">Tip usluge</Label>
            <Select value={formData.service} onValueChange={(value) => handleInputChange("service", value)}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Izaberite tip usluge" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popravka-cevi">Popravka cevi</SelectItem>
                <SelectItem value="instalacija-sanitarija">Instalacija sanitarija</SelectItem>
                <SelectItem value="hitna-intervencija">Hitna intervencija</SelectItem>
                <SelectItem value="odrzavanje-sistema">Održavanje sistema</SelectItem>
                <SelectItem value="ciscenje-kanalizacije">Čišćenje kanalizacije</SelectItem>
                <SelectItem value="zamena-armatura">Zamena armatura</SelectItem>
                <SelectItem value="ostalo">Ostalo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="message">Poruka *</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => handleInputChange("message", e.target.value)}
              required
              rows={4}
              className="mt-1"
              placeholder="Opišite vaš problem ili potrebu..."
            />
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 hover:bg-blue-700">
            {isSubmitting ? (
              "Šalje se..."
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Pošaljite poruku
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
