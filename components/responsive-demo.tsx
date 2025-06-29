"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Phone, Mail, Wrench, Monitor, Tablet, Smartphone } from "lucide-react"

export function ResponsiveDemo() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Responsive Design Overview</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            The website automatically adapts to different screen sizes using Tailwind CSS responsive utilities.
          </p>
        </div>

        {/* Responsive Grid Demo */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Smartphone className="h-8 w-8 text-blue-600" />
                <h3 className="text-lg font-semibold">Mobile (&lt; 768px)</h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Single column layout</li>
                <li>• Stacked navigation</li>
                <li>• Touch-friendly buttons</li>
                <li>• Optimized text sizes</li>
                <li>• Collapsible sections</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Tablet className="h-8 w-8 text-green-600" />
                <h3 className="text-lg font-semibold">Tablet (768px - 1024px)</h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Two column layouts</li>
                <li>• Horizontal navigation</li>
                <li>• Balanced content</li>
                <li>• Medium text sizes</li>
                <li>• Grid adjustments</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-purple-50 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Monitor className="h-8 w-8 text-purple-600" />
                <h3 className="text-lg font-semibold">Desktop (&gt; 1024px)</h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Multi-column layouts</li>
                <li>• Full navigation bar</li>
                <li>• Larger content areas</li>
                <li>• Optimal text sizes</li>
                <li>• Advanced interactions</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Responsive Examples */}
        <div className="space-y-12">
          {/* Header Example */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Wrench className="h-5 w-5" />
                Header Navigation
              </h3>
              <div className="bg-slate-900 text-white p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-600 p-2 rounded-lg">
                      <Wrench className="h-4 w-4 md:h-6 md:w-6" />
                    </div>
                    <div>
                      <h1 className="text-sm md:text-xl font-bold">Vodoinstalater Zekić</h1>
                      <p className="text-xs md:text-sm text-slate-300 hidden sm:block">
                        Profesionalne vodoinstalaterske usluge
                      </p>
                    </div>
                  </div>
                  <nav className="hidden md:flex items-center gap-6">
                    <span className="text-sm hover:text-blue-400">Usluge</span>
                    <span className="text-sm hover:text-blue-400">Galerija</span>
                    <span className="text-sm hover:text-blue-400">Kontakt</span>
                    <Button size="sm" variant="outline" className="text-white border-white bg-transparent">
                      Admin
                    </Button>
                  </nav>
                  <Button size="sm" className="md:hidden">
                    Menu
                  </Button>
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-600">
                <Badge variant="outline" className="mr-2">
                  Mobile: Hamburger menu
                </Badge>
                <Badge variant="outline" className="mr-2">
                  Tablet+: Full navigation
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Hero Section Example */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">Hero Section</h3>
              <div className="bg-gradient-to-br from-blue-50 to-slate-100 p-6 rounded-lg">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div>
                    <Badge className="mb-4 bg-blue-100 text-blue-800">Profesionalno i pouzdano</Badge>
                    <h2 className="text-2xl lg:text-4xl font-bold text-slate-900 mb-4">
                      Stručne vodoinstalaterske usluge
                    </h2>
                    <p className="text-sm lg:text-lg text-slate-600 mb-6">
                      Sa preko 15 godina iskustva, pružamo vrhunska vodoinstalaterska rešenja.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button size="sm" className="bg-blue-600">
                        <Phone className="mr-2 h-4 w-4" />
                        Pozovite odmah
                      </Button>
                      <Button variant="outline" size="sm">
                        Besplatan predračun
                      </Button>
                    </div>
                  </div>
                  <div className="bg-gray-200 h-48 lg:h-64 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500">Hero Image</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-600">
                <Badge variant="outline" className="mr-2">
                  Mobile: Stacked layout
                </Badge>
                <Badge variant="outline" className="mr-2">
                  Desktop: Side-by-side
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Services Grid Example */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">Services Grid</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <div key={item} className="bg-white p-4 rounded-lg border">
                    <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-3">
                      <Wrench className="h-6 w-6 text-blue-600" />
                    </div>
                    <h4 className="font-semibold mb-2">Usluga {item}</h4>
                    <p className="text-sm text-gray-600">Opis usluge koji se prilagođava veličini ekrana.</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-sm text-gray-600">
                <Badge variant="outline" className="mr-2">
                  Mobile: 1 column
                </Badge>
                <Badge variant="outline" className="mr-2">
                  Tablet: 2 columns
                </Badge>
                <Badge variant="outline" className="mr-2">
                  Desktop: 3 columns
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Contact Form Example */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">Contact Form</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-semibold mb-4">Kontakt informacije</h4>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="bg-blue-600 p-2 rounded-lg">
                        <Phone className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold">Telefon</p>
                        <p className="text-sm text-gray-600">+381 60 123 4567</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="bg-blue-600 p-2 rounded-lg">
                        <Mail className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold">Email</p>
                        <p className="text-sm text-gray-600">info@vodoinstaler-zekic.rs</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg border">
                  <h4 className="font-semibold mb-4">Kontakt forma</h4>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input type="text" placeholder="Ime" className="px-3 py-2 border rounded-lg text-sm" />
                      <input type="tel" placeholder="Telefon" className="px-3 py-2 border rounded-lg text-sm" />
                    </div>
                    <input type="email" placeholder="Email" className="w-full px-3 py-2 border rounded-lg text-sm" />
                    <textarea
                      placeholder="Poruka"
                      rows={3}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                    ></textarea>
                    <Button className="w-full bg-blue-600">Pošaljite poruku</Button>
                  </div>
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-600">
                <Badge variant="outline" className="mr-2">
                  Mobile: Stacked form
                </Badge>
                <Badge variant="outline" className="mr-2">
                  Desktop: Side-by-side layout
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Admin Dashboard Example */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">Admin Dashboard</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { title: "Fotografije", value: "12", icon: "📸" },
                  { title: "Posete", value: "1,234", icon: "👥" },
                  { title: "Upiti", value: "45", icon: "📧" },
                  { title: "Pozivi", value: "23", icon: "📞" },
                ].map((stat, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg border">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">{stat.title}</p>
                        <p className="text-2xl font-bold">{stat.value}</p>
                      </div>
                      <span className="text-2xl">{stat.icon}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-sm text-gray-600">
                <Badge variant="outline" className="mr-2">
                  Mobile: 1 column
                </Badge>
                <Badge variant="outline" className="mr-2">
                  Tablet: 2 columns
                </Badge>
                <Badge variant="outline" className="mr-2">
                  Desktop: 4 columns
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Responsive Breakpoints */}
        <Card className="mt-12">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4">Tailwind CSS Breakpoints Used</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <h4 className="font-semibold text-red-800">sm: 640px+</h4>
                <p className="text-sm text-red-600">Small tablets</p>
                <code className="text-xs bg-red-100 px-2 py-1 rounded">sm:flex-row</code>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <h4 className="font-semibold text-orange-800">md: 768px+</h4>
                <p className="text-sm text-orange-600">Tablets</p>
                <code className="text-xs bg-orange-100 px-2 py-1 rounded">md:grid-cols-2</code>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-800">lg: 1024px+</h4>
                <p className="text-sm text-green-600">Laptops</p>
                <code className="text-xs bg-green-100 px-2 py-1 rounded">lg:grid-cols-3</code>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-800">xl: 1280px+</h4>
                <p className="text-sm text-blue-600">Desktops</p>
                <code className="text-xs bg-blue-100 px-2 py-1 rounded">xl:text-6xl</code>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
