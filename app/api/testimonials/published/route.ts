import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

// Disable caching for this API route
export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET() {
    try {
        const supabase = createServerClient()

        console.log("Fetching published testimonials...")

        const { data: testimonials, error } = await supabase
            .from("testimonials")
            .select("*")
            .eq("is_published", true)
            .order("is_featured", { ascending: false })
            .order("created_at", { ascending: false })

        if (error) {
            console.error("Database error:", error)
            throw error
        }

        console.log(`Fetched ${testimonials?.length || 0} published testimonials`)

        return NextResponse.json(
            {
                success: true,
                testimonials: testimonials || [],
                total: testimonials?.length || 0,
                timestamp: new Date().toISOString(),
            },
            {
                headers: {
                    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
                    "CDN-Cache-Control": "no-store",
                    "Vercel-CDN-Cache-Control": "no-store",
                },
            },
        )
    } catch (error) {
        console.error("Published testimonials API error:", error)

        return NextResponse.json(
            {
                success: false,
                testimonials: [],
                total: 0,
                error: "Failed to fetch testimonials",
                timestamp: new Date().toISOString(),
            },
            { status: 500 },
        )
    }
}
