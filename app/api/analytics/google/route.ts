import { NextResponse } from "next/server"
import { google } from "googleapis"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Initialize Google Analytics Reporting API
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/analytics.readonly"],
    })

    const analyticsreporting = google.analyticsreporting({
      version: "v4",
      auth,
    })

    const response = await analyticsreporting.reports.batchGet({
      requestBody: body,
    })

    return NextResponse.json(response.data)
  } catch (error) {
    console.error("Google Analytics API error:", error)
    return NextResponse.json({ error: "Failed to fetch Google Analytics data" }, { status: 500 })
  }
}
