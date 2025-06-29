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

  console.log("Uploading to bucket: vodoinstalater-zekic-galerija, path:", filePath)

  const { data, error } = await supabase.storage.from("vodoinstalater-zekic-galerija").upload(filePath, file, {
    cacheControl: "3600",
    upsert: false,
  })

  if (error) {
    console.error("Storage upload error:", error)
    throw new Error(`Greška pri upload-u: ${error.message}`)
  }

  console.log("Upload successful:", data)

  const { data: urlData } = supabase.storage.from("vodoinstalater-zekic-galerija").getPublicUrl(filePath)

  console.log("Public URL:", urlData.publicUrl)

  return urlData.publicUrl
}

export async function deleteImage(imageUrl: string): Promise<void> {
  try {
    const supabase = createServerClient()

    console.log("Attempting to delete image:", imageUrl)

    // Extract file path from URL
    // URL format: https://project.supabase.co/storage/v1/object/public/bucket/path
    const urlParts = imageUrl.split("/")
    const bucketIndex = urlParts.findIndex((part) => part === "vodoinstalater-zekic-galerija")

    if (bucketIndex === -1) {
      console.log("Not a Supabase storage URL, skipping storage deletion")
      return
    }

    // Get the file path after the bucket name
    const filePath = urlParts.slice(bucketIndex + 1).join("/")

    console.log("Extracted file path:", filePath)

    const { error } = await supabase.storage.from("vodoinstalater-zekic-galerija").remove([filePath])

    if (error) {
      console.error("Storage delete error:", error)
      throw new Error(`Storage delete failed: ${error.message}`)
    }

    console.log("Successfully deleted from storage:", filePath)
  } catch (error) {
    console.error("Delete image error:", error)
    throw error
  }
}
