import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const supabase = createServerClient()

    // Validate required fields
    if (!data.name || !data.text || !data.rating) {
      return NextResponse.json(
        {
          success: false,
          message: "Ime, recenzija i ocena su obavezni",
        },
        { status: 400 },
      )
    }

    // Validate rating
    if (data.rating < 1 || data.rating > 5) {
      return NextResponse.json(
        {
          success: false,
          message: "Ocena mora biti između 1 i 5 zvezda",
        },
        { status: 400 },
      )
    }

    // Validate text length
    if (data.text.length < 20) {
      return NextResponse.json(
        {
          success: false,
          message: "Recenzija mora imati najmanje 20 karaktera",
        },
        { status: 400 },
      )
    }

    // Validate email format if provided
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      return NextResponse.json(
        {
          success: false,
          message: "Molimo unesite validnu email adresu",
        },
        { status: 400 },
      )
    }

    // Insert testimonial (unpublished by default) - SIMPLIFIED
    const { data: testimonial, error } = await supabase
      .from("testimonials")
      .insert([
        {
          name: data.name.trim(),
          text: data.text.trim(),
          rating: Number.parseInt(data.rating),
          service: data.service?.trim() || null,
          location: data.location?.trim() || null,
          is_featured: false,
          is_published: false, // Requires admin approval
          created_at: new Date().toISOString(),
        },
      ])
      .select()

    if (error) {
      console.error("Database error:", error)
      throw new Error(`Database error: ${error.message}`)
    }

    console.log("Testimonial saved successfully:", testimonial[0])

    // Send email notification to admin (optional - simplified)
    try {
      if (process.env.RESEND_API_KEY) {
        const emailResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "noreply@vodoinstaler-zekic.rs",
            to: "info@vodoinstaler-zekic.rs",
            subject: "Nova recenzija čeka odobrenje - Vodoinstalater Zekić",
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #1e40af;">Nova recenzija za odobrenje</h2>
                
                <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <h3 style="margin-top: 0;">Podaci o klijentu:</h3>
                  <p><strong>Ime:</strong> ${data.name}</p>
                  <p><strong>Email:</strong> ${data.email || "Nije naveden"}</p>
                  <p><strong>Telefon:</strong> ${data.phone || "Nije naveden"}</p>
                  <p><strong>Lokacija:</strong> ${data.location || "Nije navedena"}</p>
                  <p><strong>Usluga:</strong> ${data.service || "Nije navedena"}</p>
                  <p><strong>Ocena:</strong> ${"⭐".repeat(data.rating)} (${data.rating}/5)</p>
                </div>

                <div style="background: #ffffff; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
                  <h3 style="margin-top: 0;">Recenzija:</h3>
                  <p style="white-space: pre-wrap; font-style: italic;">"${data.text}"</p>
                </div>

                <div style="margin: 30px 0; text-align: center;">
                  <a href="${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/admin/login" 
                     style="background: #1e40af; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                    Odobri recenziju u admin panelu
                  </a>
                </div>

                <hr style="margin: 30px 0; border: none; border-top: 1px solid #e2e8f0;">
                <p style="color: #64748b; font-size: 14px;">
                  Poslano: ${new Date().toLocaleString("sr-RS")}<br>
                  Sa sajta: Vodoinstalater Zekić
                </p>
              </div>
            `,
          }),
        })

        if (!emailResponse.ok) {
          console.error("Email sending failed:", await emailResponse.text())
        } else {
          console.log("Email notification sent successfully")
        }
      }
    } catch (emailError) {
      console.error("Email notification failed:", emailError)
      // Don't fail the request if email fails
    }

    return NextResponse.json({
      success: true,
      message:
        "Hvala vam na recenziji! Vaša recenzija je poslata i biće objavljena nakon odobrenja. Očekujte objavu u roku od 24 sata.",
      testimonial: {
        id: testimonial[0].id,
        name: testimonial[0].name,
        rating: testimonial[0].rating,
        status: "pending_approval",
      },
    })
  } catch (error) {
    console.error("Testimonial submission error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Došlo je do greške pri slanju recenzije. Molimo pokušajte ponovo ili nas pozovite direktno.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
