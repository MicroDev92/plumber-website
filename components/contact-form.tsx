"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"

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
          message: result.message,
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
          message: result.message,
        })
      }
    } catch (error) {
      console.error("Contact form error:", error)
      setSubmitStatus({
        type: "error",
        message: "Došlo je do greške pri slanju poruke. Molimo pozovite nas direktno na +381 60 123 4567.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <Card className="bg-white text-slate-900">
      <CardContent className="p-6">
        <h4 className="text-xl font-semibold mb-4">Zahtevajte predračun</h4>

        {submitStatus.type && (
          <Alert
            className={`mb-4 ${
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Ime <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Vaše ime"
                required
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Telefon</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="+381 60 123 4567"
                disabled={isSubmitting}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="vas.email@example.com"
              required
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Potrebna usluga</label>
            <select
              name="service"
              value={formData.service}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
          <div>
            <label className="block text-sm font-medium mb-2">
              Poruka <span className="text-red-500">*</span>
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Opišite detaljno vaše vodoinstalaterske potrebe..."
              required
              disabled={isSubmitting}
            ></textarea>
          </div>
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Šalje se...
              </>
            ) : (
              "Pošaljite poruku"
            )}
          </Button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            Ili nas pozovite direktno: <strong>+381 60 123 4567</strong>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
