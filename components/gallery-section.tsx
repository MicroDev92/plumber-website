import { GalleryClient } from "./gallery-client"
import { createServerClient } from "@/lib/supabase"

export async function GallerySection() {
  const supabase = createServerClient()

  try {
    const { data: images, error } = await supabase
      .from("gallery")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(12)

    if (error) {
      console.error("Error fetching gallery images:", error)
      return (
        <section id="gallery" className="py-12 md:py-20 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12 md:mb-16">
              <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">Naši radovi</h3>
              <p className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto">
                Pogledajte primere naših uspešno završenih projekata
              </p>
            </div>
            <div className="text-center">
              <p className="text-slate-600">Trenutno nema dostupnih slika.</p>
            </div>
          </div>
        </section>
      )
    }

    return (
      <section id="gallery" className="py-12 md:py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">Naši radovi</h3>
            <p className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto">
              Pogledajte primere naših uspešno završenih projekata i kvalitet našeg rada
            </p>
          </div>

          <GalleryClient initialImages={images || []} />
        </div>
      </section>
    )
  } catch (error) {
    console.error("Failed to fetch gallery:", error)
    return (
      <section id="gallery" className="py-12 md:py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">Naši radovi</h3>
            <p className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto">
              Pogledajte primere naših uspešno završenih projekata
            </p>
          </div>
          <div className="text-center">
            <p className="text-slate-600">Trenutno nema dostupnih slika.</p>
          </div>
        </div>
      </section>
    )
  }
}
