import { NextResponse } from "next/server"
import { revalidatePath, revalidateTag } from "next/cache"

export async function POST() {
  try {
    console.log("Starting complete cache clear...")

    // Revalidate all pages
    revalidatePath("/", "layout")
    revalidatePath("/")
    revalidatePath("/admin/dashboard")
    revalidatePath("/admin/login")

    // Revalidate all API routes
    revalidatePath("/api/gallery")
    revalidatePath("/api/analytics/gallery")

    // Clear specific tags
    revalidateTag("gallery")
    revalidateTag("photos")
    revalidateTag("analytics")

    console.log("Cache clear completed")

    return NextResponse.json({
      success: true,
      message: "All caches cleared successfully",
      cleared: ["Page cache", "API route cache", "Layout cache", "Tagged cache"],
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Cache clear error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to clear cache",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
