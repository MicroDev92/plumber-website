import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export async function GET() {
  try {
    const supabase = createServerClient()

    // Get total inquiries
    const { count: totalCount, error: totalError } = await supabase
      .from("contact_inquiries")
      .select("*", { count: "exact", head: true })

    if (totalError) {
      console.error("Total count error:", totalError)
    }

    // Get monthly inquiries (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const { count: monthlyCount, error: monthlyError } = await supabase
      .from("contact_inquiries")
      .select("*", { count: "exact", head: true })
      .gte("created_at", thirtyDaysAgo.toISOString())

    if (monthlyError) {
      console.error("Monthly count error:", monthlyError)
    }

    // Get pending inquiries
    const { count: pendingCount, error: pendingError } = await supabase
      .from("contact_inquiries")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending")

    if (pendingError) {
      console.error("Pending count error:", pendingError)
    }

    // Log the actual values for debugging
    console.log("Analytics Debug:", {
      totalCount,
      monthlyCount,
      pendingCount,
      totalError,
      monthlyError,
      pendingError,
    })

    return NextResponse.json({
      success: true,
      total: totalCount || 0,
      monthly: monthlyCount || 0,
      pending: pendingCount || 0,
      source: "database",
    })
  } catch (error) {
    console.error("Inquiries analytics error:", error)
    return NextResponse.json({
      success: false,
      total: 0,
      monthly: 0,
      pending: 0,
      source: "fallback",
    })
  }
}
