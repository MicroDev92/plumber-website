import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"

export async function POST() {
  try {
    console.log("Purging Vercel production cache...")

    // Revalidate all gallery-related paths
    revalidatePath("/", "layout")
    revalidatePath("/")
    revalidatePath("/admin/dashboard")
    revalidatePath("/api/gallery")

    // If you have Vercel API token, you can also purge edge cache
    if (process.env.VERCEL_ACCESS_TOKEN && process.env.VERCEL_PROJECT_ID) {
      try {
        const purgeResponse = await fetch(
          `https://api.vercel.com/v1/projects/${process.env.VERCEL_PROJECT_ID}/domains/purge`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${process.env.VERCEL_ACCESS_TOKEN}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              paths: ["/", "/api/gallery", "/admin/dashboard"],
            }),
          },
        )

        const purgeResult = await purgeResponse.json()
        console.log("Vercel edge cache purge result:", purgeResult)
      } catch (edgeError) {
        console.log("Edge cache purge failed (this is optional):", edgeError)
      }
    }

    return NextResponse.json({
      success: true,
      message: "Production cache purged successfully",
      timestamp: new Date().toISOString(),
      environment: "production",
    })
  } catch (error) {
    console.error("Production cache purge error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to purge production cache",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
