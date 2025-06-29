import { createServerClient } from "./supabase"

export async function uploadImage(file: File): Promise<string> {
  const supabase = createServerClient()

  if (!file.type.startsWith("image/")) {
    throw new Error("Datoteka mora biti slika")
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new Error("Slika je prevelika. Maksimalna veličina je 5MB.")
  }

  const fileExt = file.name.split(".").pop()?.toLowerCase()
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
  const filePath = `gallery/${fileName}`

  const { data, error } = await supabase.storage.from("vodoinstalater-zekic-galerija").upload(filePath, file, {
    cacheControl: "3600",
    upsert: false,
  })

  if (error) {
    throw new Error(`Greška pri upload-u: ${error.message}`)
  }

  const { data: urlData } = supabase.storage.from("vodoinstalater-zekic-galerija").getPublicUrl(filePath)

  return urlData.publicUrl
}

export async function deleteImage(imageUrl: string): Promise<void> {
  try {
    const supabase = createServerClient()
    const urlParts = imageUrl.split("/")
    const fileName = urlParts[urlParts.length - 1]
    const filePath = `gallery/${fileName}`

    await supabase.storage.from("vodoinstalater-zekic-galerija").remove([filePath])
  } catch (error) {
    console.error("Delete error:", error)
  }
}
