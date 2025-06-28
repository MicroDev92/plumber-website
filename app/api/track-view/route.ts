import { NextResponse } from "next/server"
import { trackPageView } from "@/lib/analytics"

export async function POST(request: Request) {
  try {
    const { page, visitorId } = await request.json()

    if (!page || !visitorId) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 })
    }

    await trackPageView(page, visitorId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Track view error:", error)
    return NextResponse.json({ success: false, message: "Failed to track view" }, { status: 500 })
  }
}
