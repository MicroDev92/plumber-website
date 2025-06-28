import { NextResponse } from "next/server"
import { getContactInquiries } from "@/lib/analytics"

export async function GET() {
  try {
    const inquiries = await getContactInquiries()

    return NextResponse.json({
      total: inquiries.total,
      monthly: inquiries.monthly,
      pending: inquiries.pending,
      source: inquiries.source,
      lastUpdated: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Inquiries API error:", error)

    return NextResponse.json({
      total: 0,
      monthly: 0,
      pending: 0,
      source: "fallback",
      error: "Failed to fetch data",
    })
  }
}
