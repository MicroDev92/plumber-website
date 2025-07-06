"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Wrench, LogIn, Loader2, AlertCircle, Eye, EyeOff } from "lucide-react"

export default function AdminLogin() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [isMounted, setIsMounted] = useState(false)
  const [isCheckingSession, setIsCheckingSession] = useState(true)
  const router = useRouter()

  useEffect(() => {
    setIsMounted(true)

    // Check if already logged in - but don't auto-redirect immediately
    const checkExistingSession = () => {
      if (typeof window !== "undefined") {
        const isLoggedIn = localStorage.getItem("adminLoggedIn")
        const loginTime = localStorage.getItem("adminLoginTime")

        console.log("🔍 Checking existing session...")
        console.log("📊 isLoggedIn:", isLoggedIn)
        console.log("⏰ loginTime:", loginTime)

        if (isLoggedIn === "true" && loginTime) {
          const timeDiff = Date.now() - Number.parseInt(loginTime)
          console.log("⏱️ Time difference:", timeDiff)

          // Session expires after 24 hours
          if (timeDiff < 24 * 60 * 60 * 1000) {
            console.log("✅ Valid session found, but waiting for user interaction...")
            // Don't auto-redirect, let user choose to continue or login again
            setIsCheckingSession(false)
            return
          } else {
            console.log("⏰ Session expired, clearing storage...")
            localStorage.removeItem("adminLoggedIn")
            localStorage.removeItem("adminLoginTime")
            localStorage.removeItem("adminUser")
          }
        }
      }
      setIsCheckingSession(false)
    }

    // Add a small delay to prevent immediate redirect
    const timer = setTimeout(checkExistingSession, 500)
    return () => clearTimeout(timer)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    console.log("🚀 Starting login process...")
    console.log("👤 Username:", username)

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })

      console.log("📡 Login response status:", response.status)

      const data = await response.json()
      console.log("📊 Login response data:", data)

      if (response.ok && data.success) {
        console.log("✅ Login successful!")

        if (typeof window !== "undefined") {
          try {
            localStorage.setItem("adminLoggedIn", "true")
            localStorage.setItem("adminLoginTime", Date.now().toString())
            localStorage.setItem("adminUser", username)
            console.log("💾 Session data saved to localStorage")
          } catch (storageError) {
            console.error("❌ Error saving to localStorage:", storageError)
          }
        }

        console.log("🔄 Redirecting to dashboard...")

        // Use router.push instead of window.location for better UX
        router.push("/admin/dashboard")
      } else {
        console.log("❌ Login failed:", data.message)
        setError(data.message || "Neispravni podaci za prijavu")
      }
    } catch (error) {
      console.error("❌ Login error:", error)
      setError("Greška pri povezivanju sa serverom")
    } finally {
      setIsLoading(false)
    }
  }

  const handleContinueSession = () => {
    console.log("🔄 Continuing existing session...")
    router.push("/admin/dashboard")
  }

  if (!isMounted || isCheckingSession) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="flex items-center gap-2 text-white">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Proverava se sesija...</span>
        </div>
      </div>
    )
  }

  // Check if user has valid session but show option to continue
  const hasValidSession = () => {
    if (typeof window !== "undefined") {
      const isLoggedIn = localStorage.getItem("adminLoggedIn")
      const loginTime = localStorage.getItem("adminLoginTime")

      if (isLoggedIn === "true" && loginTime) {
        const timeDiff = Date.now() - Number.parseInt(loginTime)
        return timeDiff < 24 * 60 * 60 * 1000
      }
    }
    return false
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
          <CardTitle className="text-2xl text-center">Admin pristup</CardTitle>
          <CardDescription className="text-center">Prijavite se da pristupite admin panelu</CardDescription>
        </CardHeader>
        <CardContent>
          {hasValidSession() && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800 mb-3">
                Već ste prijavljeni. Želite li da nastavite sa postojećom sesijom?
              </p>
              <Button onClick={handleContinueSession} className="w-full mb-2 bg-blue-600 hover:bg-blue-700">
                Nastavi sa sesijom
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  localStorage.removeItem("adminLoggedIn")
                  localStorage.removeItem("adminLoginTime")
                  localStorage.removeItem("adminUser")
                  window.location.reload()
                }}
                className="w-full"
              >
                Nova prijava
              </Button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Korisničko ime</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={isLoading}
                autoComplete="username"
                placeholder="Unesite korisničko ime"
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
                  required
                  disabled={isLoading}
                  autoComplete="current-password"
                  placeholder="Unesite lozinku"
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
                <AlertCircle className="h-4 w-4" />
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
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  Prijavite se
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Demo pristup: <code className="bg-gray-100 px-2 py-1 rounded text-xs">admin / plumber2024</code>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
