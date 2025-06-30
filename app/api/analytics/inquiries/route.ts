import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export async function GET() {
  try {
    const supabase = createServerClient()

    console.log("🔍 Fetching contact inquiries analytics...")

    // Get total inquiries
    const { count: totalCount, error: totalError } = await supabase
      .from("contact_inquiries")
      .select("*", { count: "exact", head: true })

    if (totalError) {
      console.error("❌ Error fetching total inquiries:", totalError)
    } else {
      console.log("📊 Total inquiries in DB:", totalCount)
    }

    // Get monthly inquiries (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const { count: monthlyCount, error: monthlyError } = await supabase
      .from("contact_inquiries")
      .select("*", { count: "exact", head: true })
      .gte("created_at", thirtyDaysAgo.toISOString())

    if (monthlyError) {
      console.error("❌ Error fetching monthly inquiries:", monthlyError)
    } else {
      console.log("📅 Monthly inquiries (last 30 days):", monthlyCount)
    }

    // Get pending inquiries
    const { count: pendingCount, error: pendingError } = await supabase
      .from("contact_inquiries")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending")

    if (pendingError) {
      console.error("❌ Error fetching pending inquiries:", pendingError)
    } else {
      console.log("⏳ Pending inquiries:", pendingCount)
    }

    // Also fetch actual pending records to debug
    const { data: pendingRecords, error: recordsError } = await supabase
      .from("contact_inquiries")
      .select("id, name, status, created_at")
      .eq("status", "pending")

    if (recordsError) {
      console.error("❌ Error fetching pending records:", recordsError)
    } else {
      console.log("📋 Actual pending records:", pendingRecords)
    }

    const result = {
      success: true,
      total: totalCount || 0,
      monthly: monthlyCount || 0,
      pending: pendingCount || 0,
      source: "database",
      debug: {
        totalError: totalError?.message,
        monthlyError: monthlyError?.message,
        pendingError: pendingError?.message,
        pendingRecords: pendingRecords || [],
      },
    }

    console.log("✅ Final analytics result:", result)

    return NextResponse.json(result)
  } catch (error) {
    console.error("💥 Analytics API error:", error)

    return NextResponse.json({
      success: false,
      total: 0,
      monthly: 0,
      pending: 0,
      source: "fallback",
      error: error instanceof Error ? error.message : "Unknown error",
    })
  }
}
