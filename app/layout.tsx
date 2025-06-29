import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Vodoinstalater Žekić - Profesionalne vodoinstalaterske usluge",
  description:
    "Stručne vodoinstalaterske usluge u Beogradu i okolini. Hitne intervencije 24/7, ugradnja, popravke i održavanje.",
  keywords: "vodoinstaler, Beograd, hitne intervencije, popravke, ugradnja",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="sr">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
