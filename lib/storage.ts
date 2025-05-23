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

// Görsel yükleme fonksiyonu
export async function uploadImage(file: File): Promise<string | null> {
  try {
    const supabase = createClient()

    // Varsayılan bucket adı
    const bucketName = "edulogy"

    // Bucket'ı kontrol et ve gerekirse oluştur
    const bucketCreated = await createBucketIfNotExists(bucketName)

    if (!bucketCreated) {
      console.warn("Storage bucket oluşturulamadı, URL ile devam ediliyor")
      // Bucket oluşturulamadığında doğrudan dosyayı URL'e dönüştür
      return URL.createObjectURL(file)
    }

    // Dosya adını benzersiz yap
    const fileExt = file.name.split(".").pop()
    const fileName = `${uuidv4()}.${fileExt}`
    const filePath = `lesson-content/${fileName}`

    // Dosyayı yükle
    const { error: uploadError } = await supabase.storage.from(bucketName).upload(filePath, file, {
      cacheControl: '3600',
      upsert: true
    })

    if (uploadError) {
      console.error("Yükleme hatası:", uploadError)
      throw uploadError
    }

    // Dosya URL'ini al
    const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath)

    return data.publicUrl
  } catch (error) {
    console.error("Görsel yükleme hatası:", error)
    return null
  }
}

// Görseli silme fonksiyonu
export async function deleteImage(url: string): Promise<boolean> {
  try {
    const supabase = createClient()

    // Varsayılan bucket adı
    const bucketName = "edulogy"

    // Bucket'ı kontrol et ve gerekirse oluştur
    const bucketExists = await createBucketIfNotExists(bucketName)

    if (!bucketExists) {
      console.error("Storage bucket bulunamadı veya oluşturulamadı")
      return false
    }

    // URL'den dosya yolunu çıkar
    const urlParts = url.split("/")
    const fileName = urlParts[urlParts.length - 1]
    const filePath = `lesson-content/${fileName}`

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
