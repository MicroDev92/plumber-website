import { NextResponse } from "next/server"
import { getWebsiteAnalytics } from "@/lib/analytics"

export async function GET() {
  try {
    const analytics = await getWebsiteAnalytics()

    return NextResponse.json({
      visits: analytics.monthlyVisits,
      pageViews: analytics.pageViews,
      uniqueVisitors: analytics.uniqueVisitors,
      source: analytics.source,
      lastUpdated: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Website analytics API error:", error)

    return NextResponse.json({
      visits: 1234,
      pageViews: 2456,
      uniqueVisitors: 892,
      source: "fallback",
      lastUpdated: new Date().toISOString(),
    })
  }
}
