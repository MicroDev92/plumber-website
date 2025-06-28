import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AnalyticsTracker } from "@/components/analytics-tracker"
import { Suspense } from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Vodoinstalater Zekić - Profesionalne vodoinstalaterske usluge",
  description:
    "Stručne vodoinstalaterske usluge u Beogradu i okolini. Hitne intervencije 24/7, ugradnja, popravke i održavanje.",
  keywords: "vodoinstaler, Beograd, hitne intervencije, popravke, ugradnja",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="sr">
      <body className={inter.className}>
        <Suspense fallback={<div>Loading...</div>}>
          <AnalyticsTracker page="home" />
          {children}
        </Suspense>
      </body>
    </html>
  )
}
