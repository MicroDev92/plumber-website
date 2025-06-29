"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Wrench, LogIn, AlertCircle, Eye, EyeOff } from "lucide-react"

export default function AdminLogin() {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      })

      const result = await response.json()

      if (result.success) {
        localStorage.setItem("adminAuth", "true")
        router.push("/admin/dashboard")
      } else {
        setError(result.message || "Neispravni podaci za prijavu")
      }
    } catch (error) {
      console.error("Login error:", error)
      setError("Greška pri povezivanju sa serverom")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoLogin = () => {
    setCredentials({
      username: "admin",
      password: "plumber2024",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl border-0">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto bg-blue-600 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <Wrench className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-slate-900">Admin Panel</CardTitle>
            <CardDescription className="text-slate-600">Vodoinstalater Zekić - Upravljanje sajtom</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Korisničko ime</Label>
                <Input
                  id="username"
                  type="text"
                  value={credentials.username}
                  onChange={(e) => setCredentials((prev) => ({ ...prev, username: e.target.value }))}
                  placeholder="Unesite korisničko ime"
                  required
                  disabled={isLoading}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Lozinka</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={credentials.password}
                    onChange={(e) => setCredentials((prev) => ({ ...prev, password: e.target.value }))}
                    placeholder="Unesite lozinku"
                    required
                    disabled={isLoading}
                    className="h-11 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full h-11 bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Prijavljivanje...
                  </>
                ) : (
                  <>
                    <LogIn className="h-4 w-4 mr-2" />
                    Prijavite se
                  </>
                )}
              </Button>
            </form>

            <div className="pt-4 border-t border-gray-200">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-blue-900 mb-2">Demo pristup:</h3>
                <div className="text-sm text-blue-700 space-y-1">
                  <p>
                    <strong>Korisničko ime:</strong> admin
                  </p>
                  <p>
                    <strong>Lozinka:</strong> plumber2024
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleDemoLogin}
                  className="mt-3 w-full border-blue-200 text-blue-700 hover:bg-blue-100 bg-transparent"
                  disabled={isLoading}
                >
                  Popuni demo podatke
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
