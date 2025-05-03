// Kullanıcı istatistikleri için yardımcı fonksiyonlar

import { createServerClient } from "./supabase/server"
import { createClient } from "./supabase/client"

/**
 * Quiz sonuçlarını kaydet ve kullanıcı istatistiklerini güncelle
 * @param userId Kullanıcı ID'si
 * @param lessonId Ders ID'si
 * @param score Alınan puan
 * @param totalPossibleScore Maksimum alınabilecek puan
 * @param correctAnswers Doğru cevap sayısı
 * @param totalQuestions Toplam soru sayısı
 */
export async function updateQuizStats({
    userId,
    lessonId,
    score,
    totalPossibleScore,
    correctAnswers,
    totalQuestions,
}: {
    userId: string
    lessonId: string
    score: number
    totalPossibleScore: number
    correctAnswers: number
    totalQuestions: number
}) {
    const supabase = createServerClient()

    try {
        // Kullanıcının mevcut istatistiklerini al
        const { data: userStats, error: statsError } = await supabase
            .from("user_stats")
            .select("*")
            .eq("user_id", userId)
            .single()

        if (statsError && statsError.code !== "PGRST116") {
            // PGRST116: Kayıt bulunamadı hatası
            console.error("Kullanıcı istatistikleri alınamadı:", statsError)
            return null
        }

        // Quiz sonuçlarını kaydet
        const { error: quizResultError } = await supabase.from("quiz_results").insert({
            user_id: userId,
            lesson_id: lessonId,
            score,
            total_possible_score: totalPossibleScore,
            correct_answers: correctAnswers,
            total_questions: totalQuestions,
            completed_at: new Date().toISOString(),
        })

        if (quizResultError) {
            console.error("Quiz sonuçları kaydedilemedi:", quizResultError)
        }

        // Kullanıcı istatistiklerini güncelle veya oluştur
        if (userStats) {
            // Mevcut istatistikleri güncelle
            const { error: updateError } = await supabase
                .from("user_stats")
                .update({
                    total_questions_answered: userStats.total_questions_answered + totalQuestions,
                    correct_answers: userStats.correct_answers + correctAnswers,
                    updated_at: new Date().toISOString(),
                })
                .eq("user_id", userId)

            if (updateError) {
                console.error("Kullanıcı istatistikleri güncellenemedi:", updateError)
            }
        } else {
            // Yeni istatistik kaydı oluştur
            const { error: insertError } = await supabase.from("user_stats").insert({
                user_id: userId,
                total_questions_answered: totalQuestions,
                correct_answers: correctAnswers,
                total_xp: score,
                total_lessons_completed: 1,
                longest_streak: 1,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            })

            if (insertError) {
                console.error("Kullanıcı istatistikleri oluşturulamadı:", insertError)
            }
        }

        return true
    } catch (error) {
        console.error("Quiz istatistikleri güncellenirken hata:", error)
        return null
    }
}

/**
 * Kullanıcının quiz istatistiklerini getir
 * @param userId Kullanıcı ID'si
 */
export async function getUserQuizStats(userId: string) {
    const supabase = createServerClient()

    try {
        // Kullanıcının istatistiklerini al
        const { data: userStats, error: statsError } = await supabase
            .from("user_stats")
            .select("*")
            .eq("user_id", userId)
            .single()

        if (statsError) {
            console.error("Kullanıcı istatistikleri alınamadı:", statsError)
            return null
        }

        // Başarı oranını hesapla
        const successRate = userStats.total_questions_answered > 0
            ? Math.round((userStats.correct_answers / userStats.total_questions_answered) * 100)
            : 0

        return {
            ...userStats,
            success_rate: successRate
        }
    } catch (error) {
        console.error("Quiz istatistikleri alınırken hata:", error)
        return null
    }
}

/**
 * Client tarafında quiz sonuçlarını güncelle
 */
export function updateClientQuizStats({
    userId,
    lessonId,
    score,
    totalPossibleScore,
    correctAnswers,
    totalQuestions,
}: {
    userId: string
    lessonId: string
    score: number
    totalPossibleScore: number
    correctAnswers: number
    totalQuestions: number
}) {
    const supabase = createClient()

    return supabase.rpc('update_quiz_stats', {
        p_user_id: userId,
        p_lesson_id: lessonId,
        p_score: score,
        p_total_possible_score: totalPossibleScore,
        p_correct_answers: correctAnswers,
        p_total_questions: totalQuestions
    })
}
