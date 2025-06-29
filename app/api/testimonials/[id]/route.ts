import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"
import { revalidatePath, revalidateTag } from "next/cache"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    try {
        const data = await request.json()
        const supabase = createServerClient()

        console.log("Updating testimonial:", params.id, data)

        const { data: testimonial, error } = await supabase
            .from("testimonials")
            .update({
                name: data.name?.trim(),
                text: data.text?.trim(),
                rating: data.rating ? Number.parseInt(data.rating) : undefined,
                service: data.service?.trim() || null,
                location: data.location?.trim() || null,
                is_featured: data.is_featured,
                is_published: data.is_published,
                updated_at: new Date().toISOString(),
            })
            .eq("id", params.id)
            .select()

        if (error) {
            console.error("Database update error:", error)
            throw error
        }

        console.log("Testimonial updated successfully:", testimonial[0])

        // 🚀 AUTOMATIC CACHE INVALIDATION
        try {
            // Revalidate all testimonial-related pages immediately
            revalidatePath("/", "layout")
            revalidatePath("/")
            revalidatePath("/api/testimonials/published")

            // Revalidate tagged cache
            revalidateTag("testimonials")
            revalidateTag("published-testimonials")

            console.log("✅ Cache invalidated successfully after testimonial update")
        } catch (cacheError) {
            console.error("❌ Cache invalidation failed:", cacheError)
            // Don't fail the request if cache invalidation fails
        }

        return NextResponse.json({
            success: true,
            message: "Recenzija je ažurirana i cache je osveži!",
            testimonial: testimonial[0],
            cache_invalidated: true,
            timestamp: new Date().toISOString(),
        })
    } catch (error) {
        console.error("Testimonial update error:", error)
        return NextResponse.json(
            {
                success: false,
                message: "Greška pri ažuriranju recenzije",
                error: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 },
        )
    }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        const supabase = createServerClient()

        console.log("Deleting testimonial:", params.id)

        const { error } = await supabase.from("testimonials").delete().eq("id", params.id)

        if (error) {
            console.error("Database delete error:", error)
            throw error
        }

        console.log("Testimonial deleted successfully")

        // 🚀 AUTOMATIC CACHE INVALIDATION
        try {
            // Revalidate all testimonial-related pages immediately
            revalidatePath("/", "layout")
            revalidatePath("/")
            revalidatePath("/api/testimonials/published")

            // Revalidate tagged cache
            revalidateTag("testimonials")
            revalidateTag("published-testimonials")

            console.log("✅ Cache invalidated successfully after testimonial deletion")
        } catch (cacheError) {
            console.error("❌ Cache invalidation failed:", cacheError)
            // Don't fail the request if cache invalidation fails
        }

        return NextResponse.json({
            success: true,
            message: "Recenzija je obrisana i cache je ažuriran!",
            cache_invalidated: true,
            timestamp: new Date().toISOString(),
        })
    } catch (error) {
        console.error("Testimonial delete error:", error)
        return NextResponse.json(
            {
                success: false,
                message: "Greška pri brisanju recenzije",
                error: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 },
        )
    }
}
