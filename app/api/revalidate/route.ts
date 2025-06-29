import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"

export async function POST(request: Request) {
  try {
    const { path } = await request.json()

    // Revalidate the home page to refresh gallery
    revalidatePath("/")
    revalidatePath("/admin/dashboard")

    if (path) {
      revalidatePath(path)
    }

    return NextResponse.json({
      success: true,
      message: "Cache refreshed",
      revalidated: true,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Revalidation error:", error)
    return NextResponse.json({ success: false, message: "Failed to revalidate" }, { status: 500 })
  }
}
