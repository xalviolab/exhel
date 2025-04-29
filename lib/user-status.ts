import { createClient } from "@/lib/supabase/client"
import { createServerClient } from "@/lib/supabase/server"

/**
 * Kullanıcının kalp ve günlük seri durumunu kontrol eder ve günceller.
 * Bu fonksiyon kullanıcı oturum açtığında çağrılmalıdır.
 */
export async function updateUserStatus(userId: string) {
    try {
        const supabase = createClient()

        // Kullanıcı bilgilerini al
        const { data: user, error: userError } = await supabase
            .from("users")
            .select("hearts, max_hearts, streak_count, streak_last_updated")
            .eq("id", userId)
            .single()

        if (userError) {
            console.error("Kullanıcı bilgileri alınamadı:", userError)
            return null
        }

        const now = new Date()
        const lastUpdated = user.streak_last_updated ? new Date(user.streak_last_updated) : null
        const updates: Record<string, any> = {}

        // Kalpleri kontrol et ve gerekirse yenile
        if (user.hearts < user.max_hearts) {
            // Son güncelleme zamanından bu yana 24 saat geçmiş mi kontrol et
            if (lastUpdated && now.getTime() - lastUpdated.getTime() >= 24 * 60 * 60 * 1000) {
                updates.hearts = user.max_hearts
            }
        }

        // Günlük seriyi kontrol et ve güncelle
        if (lastUpdated) {
            const lastUpdatedDate = new Date(lastUpdated)
            const lastUpdatedDay = lastUpdatedDate.setHours(0, 0, 0, 0)
            const today = new Date().setHours(0, 0, 0, 0)
            const yesterday = new Date(today - 24 * 60 * 60 * 1000).setHours(0, 0, 0, 0)

            if (lastUpdatedDay === yesterday) {
                // Dün giriş yapmış, seriyi bir artır
                updates.streak_count = user.streak_count + 1
            } else if (lastUpdatedDay < yesterday) {
                // Bir günden fazla giriş yapmamış, seriyi sıfırla
                updates.streak_count = 1
            }
            // Bugün zaten giriş yapmışsa streak_count değişmez
        } else {
            // İlk kez giriş yapıyor
            updates.streak_count = 1
        }

        // Streak son güncelleme zamanını güncelle
        updates.streak_last_updated = now.toISOString()

        // Değişiklik varsa kullanıcıyı güncelle
        if (Object.keys(updates).length > 0) {
            const { error: updateError } = await supabase
                .from("users")
                .update(updates)
                .eq("id", userId)

            if (updateError) {
                console.error("Kullanıcı durumu güncellenemedi:", updateError)
                return null
            }
        }

        return { ...user, ...updates }
    } catch (error) {
        console.error("Kullanıcı durumu güncellenirken hata oluştu:", error)
        return null
    }
}

/**
 * Server component'ler için kullanıcı durumunu güncelleyen fonksiyon
 */
export async function updateUserStatusServer(userId: string) {
    try {
        const supabase = createServerClient()

        // Kullanıcı bilgilerini al
        const { data: user, error: userError } = await supabase
            .from("users")
            .select("hearts, max_hearts, streak_count, streak_last_updated")
            .eq("id", userId)
            .single()

        if (userError) {
            console.error("Kullanıcı bilgileri alınamadı:", userError)
            return null
        }

        const now = new Date()
        const lastUpdated = user.streak_last_updated ? new Date(user.streak_last_updated) : null
        const updates: Record<string, any> = {}

        // Kalpleri kontrol et ve gerekirse yenile
        if (user.hearts < user.max_hearts) {
            // Son güncelleme zamanından bu yana 24 saat geçmiş mi kontrol et
            if (lastUpdated && now.getTime() - lastUpdated.getTime() >= 24 * 60 * 60 * 1000) {
                updates.hearts = user.max_hearts
            }
        }

        // Günlük seriyi kontrol et ve güncelle
        if (lastUpdated) {
            const lastUpdatedDate = new Date(lastUpdated)
            const lastUpdatedDay = lastUpdatedDate.setHours(0, 0, 0, 0)
            const today = new Date().setHours(0, 0, 0, 0)
            const yesterday = new Date(today - 24 * 60 * 60 * 1000).setHours(0, 0, 0, 0)

            if (lastUpdatedDay === yesterday) {
                // Dün giriş yapmış, seriyi bir artır
                updates.streak_count = user.streak_count + 1
            } else if (lastUpdatedDay < yesterday) {
                // Bir günden fazla giriş yapmamış, seriyi sıfırla
                updates.streak_count = 1
            }
            // Bugün zaten giriş yapmışsa streak_count değişmez
        } else {
            // İlk kez giriş yapıyor
            updates.streak_count = 1
        }

        // Streak son güncelleme zamanını güncelle
        updates.streak_last_updated = now.toISOString()

        // Değişiklik varsa kullanıcıyı güncelle
        if (Object.keys(updates).length > 0) {
            const { error: updateError } = await supabase
                .from("users")
                .update(updates)
                .eq("id", userId)

            if (updateError) {
                console.error("Kullanıcı durumu güncellenemedi:", updateError)
                return null
            }
        }

        return { ...user, ...updates }
    } catch (error) {
        console.error("Kullanıcı durumu güncellenirken hata oluştu:", error)
        return null
    }
}