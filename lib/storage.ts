import { createClient } from "@/lib/supabase/client"
import { v4 as uuidv4 } from "uuid"

// Bucket oluşturma fonksiyonu
async function createBucketIfNotExists(bucketName: string) {
  try {
    const supabase = createClient()

    // Önce mevcut bucket'ları kontrol et
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()

    if (bucketsError) {
      console.error("Bucket listesi alınamadı:", bucketsError)
      throw bucketsError
    }

    // Bucket zaten var mı kontrol et
    if (buckets.some((b) => b.name === bucketName)) {
      console.log(`'${bucketName}' bucket'ı zaten mevcut`)
      return true
    }

    // Bucket yoksa oluştur
    const { error } = await supabase.storage.createBucket(bucketName, {
      public: true,
      fileSizeLimit: 5242880, // 5MB
      allowedMimeTypes: ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"],
    })

    if (error) {
      console.error(`'${bucketName}' bucket'ı oluşturulamadı:`, error)
      return false
    }

    console.log(`'${bucketName}' bucket'ı başarıyla oluşturuldu`)
    return true
  } catch (error) {
    console.error("Bucket oluşturma hatası:", error)
    return false
  }
}

// Dosya türü kontrolü
function validateFileType(file: File): boolean {
  const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"]
  return allowedTypes.includes(file.type)
}

// Dosya boyutu kontrolü (5MB)
function validateFileSize(file: File): boolean {
  const maxSize = 5 * 1024 * 1024 // 5MB
  return file.size <= maxSize
}

// Dosya adını güvenli hale getir
function sanitizeFileName(fileName: string): string {
  return fileName.replace(/[^a-zA-Z0-9.-]/g, "_")
}

// Görsel yükleme fonksiyonu
export async function uploadImage(file: File): Promise<string | null> {
  try {
    // Dosya validasyonu
    if (!validateFileType(file)) {
      throw new Error("Desteklenmeyen dosya türü. Sadece JPEG, PNG, GIF, WebP ve SVG dosyaları kabul edilir.")
    }

    if (!validateFileSize(file)) {
      throw new Error("Dosya boyutu 5MB'dan büyük olamaz.")
    }

    const supabase = createClient()
    const bucketName = "edulogy-assets"

    // Bucket'ı kontrol et ve gerekirse oluştur
    const bucketCreated = await createBucketIfNotExists(bucketName)

    if (!bucketCreated) {
      throw new Error("Storage bucket oluşturulamadı")
    }

    // Güvenli dosya adı oluştur
    const fileExt = file.name.split(".").pop()
    const sanitizedName = sanitizeFileName(file.name.split(".")[0])
    const fileName = `${sanitizedName}_${uuidv4()}.${fileExt}`
    const filePath = `uploads/${new Date().getFullYear()}/${new Date().getMonth() + 1}/${fileName}`

    // Dosyayı yükle
    const { error: uploadError } = await supabase.storage.from(bucketName).upload(filePath, file, {
      cacheControl: "3600",
      upsert: false, // Aynı dosya adıyla üzerine yazma
    })

    if (uploadError) {
      console.error("Yükleme hatası:", uploadError)
      throw uploadError
    }

    // Dosya URL'ini al - domain URL'i kullan
    const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath)

    // Domain URL'i ile değiştir
    const domainUrl = data.publicUrl.replace(
      /^https:\/\/[^/]+/,
      `${window.location.protocol}//${window.location.host}/api/storage`,
    )

    return domainUrl
  } catch (error) {
    console.error("Görsel yükleme hatası:", error)
    throw error
  }
}

// Görseli silme fonksiyonu
export async function deleteImage(url: string): Promise<boolean> {
  try {
    const supabase = createClient()
    const bucketName = "edulogy-assets"

    // URL'den dosya yolunu çıkar
    const urlParts = url.split("/")
    const pathIndex = urlParts.findIndex((part) => part === "uploads")
    if (pathIndex === -1) return false

    const filePath = urlParts.slice(pathIndex).join("/")

    const { error } = await supabase.storage.from(bucketName).remove([filePath])

    if (error) {
      throw error
    }

    return true
  } catch (error) {
    console.error("Görsel silme hatası:", error)
    return false
  }
}

// Storage proxy API endpoint'i için
export async function getStorageFile(path: string) {
  try {
    const supabase = createClient()
    const bucketName = "edulogy-assets"

    const { data, error } = await supabase.storage.from(bucketName).download(path)

    if (error) {
      throw error
    }

    return data
  } catch (error) {
    console.error("Dosya indirme hatası:", error)
    return null
  }
}
