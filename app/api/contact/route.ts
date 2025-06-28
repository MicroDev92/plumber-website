import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export async function POST(request: Request) {
  try {
    const formData = await request.json()
    const supabase = createServerClient()

    // Validate required fields
    if (!formData.name || !formData.email || !formData.message) {
      return NextResponse.json(
        {
          success: false,
          message: "Molimo popunite sva obavezna polja (ime, email, poruka).",
        },
        { status: 400 },
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      return NextResponse.json(
        {
          success: false,
          message: "Molimo unesite validnu email adresu.",
        },
        { status: 400 },
      )
    }

    // Insert contact inquiry into database
    const { data, error } = await supabase
      .from("contact_inquiries")
      .insert([
        {
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          phone: formData.phone?.trim() || null,
          service: formData.service || null,
          message: formData.message.trim(),
          status: "pending",
          created_at: new Date().toISOString(),
        },
      ])
      .select()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json(
        {
          success: false,
          message: "Greška pri čuvanju poruke. Molimo pokušajte ponovo.",
        },
        { status: 500 },
      )
    }

    // Send email notification (optional - using Resend free tier)
    try {
      if (process.env.RESEND_API_KEY) {
        const emailResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "noreply@vodoinstaler-zekic.rs", // Replace with your verified domain
            to: "info@vodoinstaler-zekic.rs", // Replace with your email
            subject: "Nova poruka sa sajta - Vodoinstaler Žekić",
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #1e40af;">Nova poruka sa sajta</h2>
                <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <p><strong>Ime:</strong> ${formData.name}</p>
                  <p><strong>Email:</strong> ${formData.email}</p>
                  <p><strong>Telefon:</strong> ${formData.phone || "Nije naveden"}</p>
                  <p><strong>Usluga:</strong> ${formData.service || "Nije navedena"}</p>
                </div>
                <div style="background: #ffffff; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
                  <h3 style="margin-top: 0;">Poruka:</h3>
                  <p style="white-space: pre-wrap;">${formData.message}</p>
                </div>
                <hr style="margin: 30px 0; border: none; border-top: 1px solid #e2e8f0;">
                <p style="color: #64748b; font-size: 14px;">
                  Poslano: ${new Date().toLocaleString("sr-RS")}<br>
                  Sa sajta: Vodoinstaler Žekić
                </p>
              </div>
            `,
          }),
        })

        if (!emailResponse.ok) {
          console.error("Email sending failed:", await emailResponse.text())
        }
      }
    } catch (emailError) {
      console.error("Email notification failed:", emailError)
      // Don't fail the request if email fails
    }

    return NextResponse.json({
      success: true,
      message: "Poruka je uspešno poslata! Kontaktiraćemo vas u najkraćem roku.",
      data: data?.[0],
    })
  } catch (error) {
    console.error("Contact form error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Došlo je do neočekivane greške. Molimo pozovite nas direktno na +381 60 123 4567.",
      },
      { status: 500 },
    )
  }
}
