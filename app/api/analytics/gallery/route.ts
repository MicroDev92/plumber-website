import { NextResponse } from "next/server"
import { getGalleryAnalytics } from "@/lib/analytics"

export async function GET() {
  try {
    const gallery = await getGalleryAnalytics()

    return NextResponse.json({
      total: gallery.total,
      recent: gallery.recent,
      source: gallery.source,
      lastUpdated: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Gallery analytics API error:", error)

    return NextResponse.json({
      total: 6,
      recent: 2,
      source: "fallback",
      error: "Failed to fetch data",
    })
  }
}
