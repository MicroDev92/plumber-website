"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Wrench, Eye, EyeOff, Loader2 } from "lucide-react"

export default function AdminLogin() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsMounted(true)
    // Check if already logged in
    if (typeof window !== "undefined") {
      const isLoggedIn = localStorage.getItem("adminLoggedIn")
      const loginTime = localStorage.getItem("adminLoginTime")

      if (isLoggedIn === "true" && loginTime) {
        const timeDiff = Date.now() - Number.parseInt(loginTime)
        // Session expires after 24 hours
        if (timeDiff < 24 * 60 * 60 * 1000) {
          router.replace("/admin/dashboard")
          return
        } else {
          // Clear expired session
          localStorage.removeItem("adminLoggedIn")
          localStorage.removeItem("adminLoginTime")
        }
      }
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isMounted) return

    setError("")
    setIsLoading(true)

    try {
      console.log("🔐 Attempting login...")

      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })

      console.log("📡 Response status:", response.status)

      const data = await response.json()
      console.log("📊 Response data:", data)

      if (response.ok && data.success) {
        console.log("✅ Login successful, storing session...")

        // Store admin session with error handling
        try {
          localStorage.setItem("adminLoggedIn", "true")
          localStorage.setItem("adminLoginTime", Date.now().toString())
          localStorage.setItem("adminUser", JSON.stringify(data.user || { username: "admin" }))

          console.log("💾 Session stored, redirecting...")

          // Force redirect with replace to prevent back navigation
          window.location.href = "/admin/dashboard"
        } catch (storageError) {
          console.error("❌ Storage error:", storageError)
          setError("Greška pri čuvanju sesije")
        }
      } else {
        console.log("❌ Login failed:", data.message)
        setError(data.message || "Neispravni podaci za prijavu")
      }
    } catch (error) {
      console.error("🚨 Network error:", error)
      setError("Greška pri povezivanju sa serverom. Proverite internet konekciju.")
    } finally {
      setIsLoading(false)
    }
  }

  // Don't render until mounted to prevent hydration issues
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-full">
              <Wrench className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Admin Panel</CardTitle>
          <CardDescription>Prijavite se da pristupite admin panelu</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Korisničko ime</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Unesite korisničko ime"
                required
                disabled={isLoading}
                autoComplete="username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Lozinka</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Unesite lozinku"
                  required
                  disabled={isLoading}
                  autoComplete="current-password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
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

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800 font-medium mb-2">Demo pristup:</p>
            <p className="text-xs text-blue-600">
              <strong>Korisničko ime:</strong> admin
              <br />
              <strong>Lozinka:</strong> plumber2024
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
