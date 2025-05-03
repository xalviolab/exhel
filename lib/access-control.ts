// Ders ve modül erişim kontrolü için yardımcı fonksiyonlar

import { createServerClient } from "./supabase/server"

/**
 * Bir dersin kilitli olup olmadığını kontrol eder
 * @param userId Kullanıcı ID'si
 * @param lessonId Ders ID'si
 * @returns Dersin kilitli olup olmadığı bilgisi
 */
export async function isLessonLocked(userId: string, lessonId: string): Promise<boolean> {
    const supabase = createServerClient()

    try {
        // Dersin bilgilerini al
        const { data: lesson, error: lessonError } = await supabase
            .from("lessons")
            .select("*, modules(*)")
            .eq("id", lessonId)
            .single()

        if (lessonError || !lesson) {
            console.error("Ders bilgileri alınamadı:", lessonError)
            return true // Hata durumunda güvenli tarafta kal ve kilitli olarak işaretle
        }

        // Kullanıcının kalp sayısını kontrol et
        const { data: user, error: userError } = await supabase
            .from("users")
            .select("hearts")
            .eq("id", userId)
            .single()

        if (userError || !user) {
            console.error("Kullanıcı bilgileri alınamadı:", userError)
            return true
        }

        // Kullanıcının ilerleme durumunu kontrol et
        const { data: userProgress, error: progressError } = await supabase
            .from("user_progress")
            .select("*")
            .eq("user_id", userId)

        if (progressError) {
            console.error("Kullanıcı ilerleme bilgileri alınamadı:", progressError)
            return true
        }

        // Ders daha önce tamamlanmış mı kontrol et
        const lessonCompleted = userProgress?.some(p => p.lesson_id === lessonId && p.completed)

        // Eğer ders tamamlanmışsa, her zaman erişime izin ver
        if (lessonCompleted) {
            return false
        }

        // Kalp sayısı 0 ise ve ders tamamlanmamışsa erişimi engelle
        if (user.hearts <= 0) {
            return true
        }

        // Modüldeki tüm dersleri al ve sırala
        const { data: moduleLessons, error: moduleLessonsError } = await supabase
            .from("lessons")
            .select("*")
            .eq("module_id", lesson.module_id)
            .order("order_index")

        if (moduleLessonsError || !moduleLessons) {
            console.error("Modül dersleri alınamadı:", moduleLessonsError)
            return true
        }

        // Dersin modüldeki indeksini bul
        const lessonIndex = moduleLessons.findIndex(l => l.id === lessonId)

        // İlk ders her zaman açık
        if (lessonIndex === 0) {
            return false
        }

        // Önceki dersin tamamlanıp tamamlanmadığını kontrol et
        const previousLesson = moduleLessons[lessonIndex - 1]
        const previousLessonCompleted = userProgress?.some(p => p.lesson_id === previousLesson.id && p.completed)

        // Önceki ders tamamlanmamışsa kilitli
        return !previousLessonCompleted
    } catch (error) {
        console.error("Ders kilidi kontrolünde hata:", error)
        return true // Hata durumunda güvenli tarafta kal
    }
}

/**
 * Bir modülün kilitli olup olmadığını kontrol eder
 * @param userId Kullanıcı ID'si
 * @param moduleId Modül ID'si
 * @returns Modülün kilitli olup olmadığı bilgisi
 */
export async function isModuleLocked(userId: string, moduleId: string): Promise<boolean> {
    const supabase = createServerClient()

    try {
        // Modül bilgilerini al
        const { data: module, error: moduleError } = await supabase
            .from("modules")
            .select("*")
            .eq("id", moduleId)
            .single()

        if (moduleError || !module) {
            console.error("Modül bilgileri alınamadı:", moduleError)
            return true
        }

        // Kullanıcı bilgilerini al
        const { data: user, error: userError } = await supabase
            .from("users")
            .select("level")
            .eq("id", userId)
            .single()

        if (userError || !user) {
            console.error("Kullanıcı bilgileri alınamadı:", userError)
            return true
        }

        // Kullanıcının seviyesi modül için gereken seviyeden düşükse kilitli
        if (module.required_level > user.level) {
            return true
        }

        return false
    } catch (error) {
        console.error("Modül kilidi kontrolünde hata:", error)
        return true
    }
}
