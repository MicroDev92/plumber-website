import { createServerClient } from "./supabase"

export interface Testimonial {
  id: string
  name: string
  text: string
  rating: number
  service?: string
  location?: string
  is_featured: boolean
  is_published: boolean
  created_at: string
}

export async function getPublishedTestimonials(limit?: number): Promise<Testimonial[]> {
  try {
    const supabase = createServerClient()

    let query = supabase
      .from("testimonials")
      .select("*")
      .eq("is_published", true)
      .order("is_featured", { ascending: false })
      .order("created_at", { ascending: false })

    if (limit) {
      query = query.limit(limit)
    }

    const { data: testimonials, error } = await query

    if (error) throw error

    return testimonials || []
  } catch (error) {
    console.error("Testimonials fetch error:", error)
    return []
  }
}

export async function getFeaturedTestimonials(limit = 3): Promise<Testimonial[]> {
  try {
    const supabase = createServerClient()

    const { data: testimonials, error } = await supabase
      .from("testimonials")
      .select("*")
      .eq("is_published", true)
      .eq("is_featured", true)
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) throw error

    return testimonials || []
  } catch (error) {
    console.error("Featured testimonials fetch error:", error)
    return []
  }
}
