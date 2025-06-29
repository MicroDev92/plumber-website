import { NextResponse } from "next/server"
import { revalidatePath, revalidateTag } from "next/cache"

export async function POST() {
  try {
    // Force revalidate all gallery-related pages
    revalidatePath("/")
    revalidatePath("/admin/dashboard")
    revalidatePath("/api/gallery")

    // Clear any tagged cache
    revalidateTag("gallery")
    revalidateTag("photos")

    return NextResponse.json({
      success: true,
      message: "Cache cleared and pages revalidated",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Force refresh error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to refresh cache",
      },
      { status: 500 },
    )
  }
}
