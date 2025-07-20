"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Wrench, Shield, Eye, EyeOff, ArrowLeft, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function AdminLogin() {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isMounted, setIsMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsMounted(true)

    // Check if already logged in and redirect immediately
    if (typeof window !== "undefined") {
      const isLoggedIn = localStorage.getItem("adminLoggedIn")
      const loginTime = localStorage.getItem("adminLoginTime")

      if (isLoggedIn === "true" && loginTime) {
        const timeDiff = Date.now() - Number.parseInt(loginTime)
        // Session expires after 24 hours
        if (timeDiff < 24 * 60 * 60 * 1000) {
          console.log("✅ Already logged in, redirecting to dashboard...")
          router.replace("/admin/dashboard")
          return
        } else {
          // Clean up expired session
          localStorage.removeItem("adminLoggedIn")
          localStorage.removeItem("adminLoginTime")
          localStorage.removeItem("adminUser")
        }
      }
    }
  }, [router])

  const handleInputChange = (field: string, value: string) => {
    setCredentials((prev) => ({ ...prev, [field]: value }))
    if (error) setError("")
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      console.log("🔐 Attempting login...")

      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      })

      const result = await response.json()
      console.log("📊 Login response:", result)

      if (result.success) {
        console.log("✅ Login successful!")

        // Store login state
        if (typeof window !== "undefined") {
          localStorage.setItem("adminLoggedIn", "true")
          localStorage.setItem("adminLoginTime", Date.now().toString())
          localStorage.setItem("adminUser", JSON.stringify(result.user))
        }

        // Redirect to dashboard
        console.log("🔄 Redirecting to dashboard...")
        router.replace("/admin/dashboard")
      } else {
        console.log("❌ Login failed:", result.message)
        setError(result.message || "Neispravni podaci za prijavu")
      }
    } catch (error) {
      console.error("❌ Login error:", error)
      setError("Greška pri povezivanju sa serverom")
    } finally {
      setIsLoading(false)
    }
  }

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          <span className="text-gray-600">Učitavanje...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to Website Button */}
        <div className="mb-6">
          <Link href="/">
            <Button variant="outline" size="sm" className="bg-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Nazad na sajt
            </Button>
          </Link>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-blue-600 p-3 rounded-full">
                <Shield className="h-8 w-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">Admin prijava</CardTitle>
            <CardDescription>Prijavite se da pristupite admin panelu</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert className="mb-6 border-red-200 bg-red-50">
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="username">Korisničko ime</Label>
                <Input
                  id="username"
                  type="text"
                  value={credentials.username}
                  onChange={(e) => handleInputChange("username", e.target.value)}
                  required
                  disabled={isLoading}
                  placeholder="Unesite korisničko ime"
                  autoComplete="username"
                />
              </div>

              <div>
                <Label htmlFor="password">Lozinka</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={credentials.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    required
                    disabled={isLoading}
                    placeholder="Unesite lozinku"
                    autoComplete="current-password"
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Prijavljivanje...
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4 mr-2" />
                    Prijavite se
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                <Wrench className="h-4 w-4" />
                <span>Vodoinstalater Žekić - Admin Panel</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
