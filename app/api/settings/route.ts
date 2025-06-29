import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export async function GET() {
  try {
    const supabase = createServerClient()

    const { data: settings, error } = await supabase.from("site_settings").select("*").single()

    if (error && error.code !== "PGRST116") {
      console.error("Database error:", error)
      return NextResponse.json({ success: false, message: "Greška pri učitavanju podešavanja" }, { status: 500 })
    }

    // Return default settings if none exist
    const defaultSettings = {
      business_name: "Vodoinstalater Žekić",
      phone: "+381 60 123 4567",
      email: "info@vodoinstaler-zekic.rs",
      service_area: "Beograd i okolina",
      description:
        "Profesionalne vodoinstalaterske usluge sa preko 25 godina iskustva. Pružamo kvalitetne usluge ugradnje, popravke i održavanja vodovodnih i kanalizacionih sistema.",
      address: "Beograd, Srbija",
      working_hours: "Ponedeljak - Petak: 08:00 - 20:00, Subota: 09:00 - 17:00",
      emergency_available: true,
    }

    return NextResponse.json({
      success: true,
      settings: settings || defaultSettings,
    })
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json({ success: false, message: "Greška servera" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const settingsData = await request.json()
    const supabase = createServerClient()

    // First try to update existing settings
    const { data: existingSettings } = await supabase.from("site_settings").select("id").single()

    let result
    if (existingSettings) {
      // Update existing settings
      result = await supabase
        .from("site_settings")
        .update({
          ...settingsData,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingSettings.id)
    } else {
      // Insert new settings
      result = await supabase.from("site_settings").insert({
        ...settingsData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
    }

    if (result.error) {
      console.error("Database error:", result.error)
      return NextResponse.json({ success: false, message: "Greška pri čuvanju podešavanja" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Podešavanja su uspešno sačuvana",
    })
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json({ success: false, message: "Greška servera" }, { status: 500 })
  }
}
