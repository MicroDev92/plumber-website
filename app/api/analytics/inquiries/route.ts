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

    // Get monthly inquiries
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const { count: monthlyCount, error: monthlyError } = await supabase
      .from("contact_inquiries")
      .select("*", { count: "exact", head: true })
      .gte("created_at", thirtyDaysAgo.toISOString())

    if (monthlyError) {
      console.error("❌ Error fetching monthly inquiries:", monthlyError)
    } else {
      console.log("📅 Monthly inquiries:", monthlyCount)
    }

    // Get pending inquiries with detailed logging
    const { count: pendingCount, error: pendingError } = await supabase
      .from("contact_inquiries")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending")

    if (pendingError) {
      console.error("❌ Error fetching pending inquiries:", pendingError)
    } else {
      console.log("⏳ Pending inquiries count:", pendingCount)
    }

    // Also fetch actual pending records to see what's there
    const { data: pendingRecords, error: recordsError } = await supabase
      .from("contact_inquiries")
      .select("id, name, email, status, created_at")
      .eq("status", "pending")

    if (recordsError) {
      console.error("❌ Error fetching pending records:", recordsError)
    } else {
      console.log("📋 Actual pending records:", pendingRecords)
    }

    const result = {
      total: totalCount || 0,
      monthly: monthlyCount || 0,
      pending: pendingCount || 0,
      source: "database",
    }

    console.log("✅ Final inquiries result:", result)

    return NextResponse.json(result)
  } catch (error) {
    console.error("💥 Inquiries fetch error:", error)
    return NextResponse.json({ total: 0, monthly: 0, pending: 0, source: "fallback" }, { status: 500 })
  }
}
