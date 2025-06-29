"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Wrench, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function AdminLogin() {
  const [showPassword, setShowPassword] = useState(false)
  const [credentials, setCredentials] = useState({ username: "", password: "" })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Try API authentication first (production)
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          localStorage.setItem("adminAuth", "true")
          localStorage.setItem("adminUser", result.user?.username || credentials.username)
          router.push("/admin/dashboard")
          return
        }
      }

      // Fallback to demo credentials (development)
      if (credentials.username === "admin" && credentials.password === "plumber2024") {
        localStorage.setItem("adminAuth", "true")
        localStorage.setItem("adminUser", "admin")
        router.push("/admin/dashboard")
        return
      }

      setError("Neispravno korisničko ime ili lozinka")
    } catch (error) {
      console.error("Login error:", error)

      // Fallback to demo credentials if API fails
      if (credentials.username === "admin" && credentials.password === "plumber2024") {
        localStorage.setItem("adminAuth", "true")
        localStorage.setItem("adminUser", "admin")
        router.push("/admin/dashboard")
      } else {
        setError("Greška pri prijavljivanju. Pokušajte ponovo.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <Link
                href="/"
                className="inline-flex items-center gap-3 text-white hover:text-blue-300 transition-colors mb-4"
            >
              <div className="bg-blue-600 p-2 rounded-lg">
                <Wrench className="h-6 w-6" />
              </div>
              <span className="text-lg font-semibold">Nazad na sajt</span>
            </Link>
          </div>

          <Card className="shadow-2xl border-0">
            <CardHeader className="space-y-1 pb-6">
              <div className="flex justify-center mb-4">
                <div className="bg-blue-100 p-4 rounded-full">
                  <Wrench className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <CardTitle className="text-2xl text-center font-bold">Admin prijava</CardTitle>
              <CardDescription className="text-center">
                Pristupite admin panelu za upravljanje vašim vodoinstalaterskim sajtom
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Korisničko ime</Label>
                  <Input
                      id="username"
                      type="text"
                      placeholder="Unesite korisničko ime"
                      value={credentials.username}
                      onChange={(e) => setCredentials((prev) => ({ ...prev, username: e.target.value }))}
                      required
                      className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Lozinka</Label>
                  <div className="relative">
                    <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Unesite lozinku"
                        value={credentials.password}
                        onChange={(e) => setCredentials((prev) => ({ ...prev, password: e.target.value }))}
                        required
                        className="h-11 pr-10"
                    />
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>

                {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <Button type="submit" className="w-full h-11 bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                  {isLoading ? "Prijavljivanje..." : "Prijavite se"}
                </Button>
              </form>

              <div className="mt-6 text-center space-y-2">
                <p className="text-sm text-gray-600">
                  <strong>Demo pristup:</strong> admin / plumber2024
                </p>
                <p className="text-xs text-gray-500">Za produkciju, promenite lozinku u admin panelu</p>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-300">Siguran admin pristup za Vodoinstalater Zekić</p>
          </div>
        </div>
      </div>
  )
}
