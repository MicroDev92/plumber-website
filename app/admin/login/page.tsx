"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Wrench, Loader2, AlertCircle } from "lucide-react"

export default function AdminLogin() {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [isMounted, setIsMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsMounted(true)

    // Check if already logged in
    if (typeof window !== "undefined") {
      const isLoggedIn = localStorage.getItem("adminLoggedIn")
      const loginTime = localStorage.getItem("adminLoginTime")

      console.log("🔍 Checking existing session...")
      console.log("📊 isLoggedIn:", isLoggedIn)
      console.log("⏰ loginTime:", loginTime)

      if (isLoggedIn === "true" && loginTime) {
        const timeDiff = Date.now() - Number.parseInt(loginTime)
        if (timeDiff < 24 * 60 * 60 * 1000) {
          // 24 hours
          console.log("✅ Valid session found, redirecting...")
          router.replace("/admin/dashboard")
          return
        } else {
          console.log("⏰ Session expired, clearing...")
          localStorage.removeItem("adminLoggedIn")
          localStorage.removeItem("adminLoginTime")
          localStorage.removeItem("adminUser")
        }
      }
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    console.log("🚀 Starting login process...")
    console.log("👤 Username:", credentials.username)

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      })

      console.log("📡 Login response status:", response.status)

      const data = await response.json()
      console.log("📦 Login response data:", data)

      if (response.ok && data.success) {
        console.log("✅ Login successful!")

        // Store authentication state
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem("adminLoggedIn", "true")
            localStorage.setItem("adminLoginTime", Date.now().toString())
            localStorage.setItem("adminUser", credentials.username)
            console.log("💾 Session data stored successfully")
          } catch (storageError) {
            console.error("❌ Storage error:", storageError)
          }
        }

        console.log("🔄 Redirecting to dashboard...")

        // Force redirect using window.location for better mobile compatibility
        if (typeof window !== "undefined") {
          window.location.href = "/admin/dashboard"
        } else {
          router.replace("/admin/dashboard")
        }
      } else {
        console.log("❌ Login failed:", data.message)
        setError(data.message || "Neispravni podaci za prijavu")
      }
    } catch (error) {
      console.error("💥 Login error:", error)
      setError("Greška pri povezivanju sa serverom")
    } finally {
      setIsLoading(false)
    }
  }

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="flex items-center gap-2 text-white">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Učitavanje...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-lg">
              <Wrench className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">Admin prijava</CardTitle>
          <CardDescription className="text-center">Prijavite se da pristupite admin panelu</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Korisničko ime</Label>
              <Input
                id="username"
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials((prev) => ({ ...prev, username: e.target.value }))}
                required
                disabled={isLoading}
                autoComplete="username"
                placeholder="Unesite korisničko ime"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Lozinka</Label>
              <Input
                id="password"
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials((prev) => ({ ...prev, password: e.target.value }))}
                required
                disabled={isLoading}
                autoComplete="current-password"
                placeholder="Unesite lozinku"
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Prijavljivanje...
                </>
              ) : (
                "Prijavite se"
              )}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm text-gray-600">
            <p>Demo podaci: admin / plumber2024</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
