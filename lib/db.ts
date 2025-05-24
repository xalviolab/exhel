import { createServerClient } from "@/lib/supabase/server"
import { createServerActionClient } from "@/lib/supabase/server"

// Modülleri getir
export async function getModules() {
  try {
    const supabase = createServerClient()

    const { data, error } = await supabase.from("modules").select("*").order("order_index")

    if (error) {
      console.error("Error fetching modules:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error in getModules:", error)
    return []
  }
}

// Kullanıcı seviyesine göre erişilebilir modülleri getir
export async function getAccessibleModules(userId: string) {
  try {
    const supabase = createServerClient()

    // Kullanıcı bilgilerini al
    const { data: user } = await supabase.from("users").select("level, role").eq("id", userId).single()

    if (!user) {
      return []
    }

    // Kullanıcı premium mi kontrol et
    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("plan_type, is_active")
      .eq("user_id", userId)
      .eq("is_active", true)
      .single()

    const isPremium = subscription && subscription.plan_type !== "free"

    // Modülleri getir
    let query = supabase.from("modules").select("*").lte("required_level", user.level).order("order_index")

    // Admin değilse ve premium değilse, premium olmayan modülleri getir
    if (user.role !== "admin" && !isPremium) {
      query = query.eq("is_premium", false)
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching accessible modules:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error in getAccessibleModules:", error)
    return []
  }
}

// Modül detaylarını getir
export async function getModuleDetails(moduleId: string) {
  try {
    const supabase = createServerClient()

    const { data: module, error: moduleError } = await supabase.from("modules").select("*").eq("id", moduleId).single()

    if (moduleError) {
      console.error("Error fetching module:", moduleError)
      return null
    }

    const { data: lessons, error: lessonsError } = await supabase
      .from("lessons")
      .select("*")
      .eq("module_id", moduleId)
      .order("order_index")

    if (lessonsError) {
      console.error("Error fetching lessons:", lessonsError)
      return { ...module, lessons: [] }
    }

    return { ...module, lessons: lessons || [] }
  } catch (error) {
    console.error("Error in getModuleDetails:", error)
    return null
  }
}

// Ders detaylarını getir
export async function getLessonDetails(lessonId: string) {
  try {
    const supabase = createServerClient()

    const { data, error } = await supabase
      .from("lessons")
      .select(`
        *,
        modules (*)
      `)
      .eq("id", lessonId)
      .single()

    if (error) {
      console.error("Error fetching lesson:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Error in getLessonDetails:", error)
    return null
  }
}

// Ders sorularını getir
export async function getLessonQuestions(lessonId: string) {
  try {
    const supabase = createServerClient()

    const { data, error } = await supabase
      .from("questions")
      .select(`
        *,
        answers (*)
      `)
      .eq("lesson_id", lessonId)
      .order("order_index")

    if (error) {
      console.error("Error fetching questions:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error in getLessonQuestions:", error)
    return []
  }
}

// Kullanıcı ilerleme durumunu getir
export async function getUserProgress(userId: string) {
  try {
    const supabase = createServerClient()

    const { data, error } = await supabase
      .from("user_progress")
      .select(`
        *,
        lessons (*)
      `)
      .eq("user_id", userId)

    if (error) {
      console.error("Error fetching user progress:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error in getUserProgress:", error)
    return []
  }
}

// Kullanıcı quiz sonuçlarını getir
export async function getUserQuizResults(userId: string) {
  try {
    const supabase = createServerClient()

    const { data, error } = await supabase.from("quiz_results").select("*").eq("user_id", userId)

    if (error) {
      console.error("Error fetching quiz results:", error)
      return { completed_quizzes: 0, total_score: 0, average_score: 0 }
    }

    const completedQuizzes = data?.length || 0
    const totalScore = data?.reduce((sum, result) => sum + (result.score || 0), 0) || 0

    return {
      completed_quizzes: completedQuizzes,
      total_score: totalScore,
      average_score: completedQuizzes > 0 ? Math.round(totalScore / completedQuizzes) : 0,
    }
  } catch (error) {
    console.error("Error in getUserQuizResults:", error)
    return { completed_quizzes: 0, total_score: 0, average_score: 0 }
  }
}

// Kullanıcı istatistiklerini getir
export async function getUserStats(userId: string) {
  try {
    const supabase = createServerClient()

    // Kullanıcının tamamladığı dersler
    const { data: completedLessons } = await supabase
      .from("user_progress")
      .select("*")
      .eq("user_id", userId)
      .eq("completed", true)

    // Kullanıcının cevapladığı sorular
    const { data: answeredQuestions } = await supabase.from("user_question_answers").select("*").eq("user_id", userId)

    const totalLessonsCompleted = completedLessons?.length || 0
    const totalQuestionsAnswered = answeredQuestions?.length || 0
    const correctAnswers = answeredQuestions?.filter((answer) => answer.is_correct)?.length || 0

    return {
      total_lessons_completed: totalLessonsCompleted,
      total_questions_answered: totalQuestionsAnswered,
      correct_answers: correctAnswers,
      accuracy_rate: totalQuestionsAnswered > 0 ? Math.round((correctAnswers / totalQuestionsAnswered) * 100) : 0,
    }
  } catch (error) {
    console.error("Error in getUserStats:", error)
    return {
      total_lessons_completed: 0,
      total_questions_answered: 0,
      correct_answers: 0,
      accuracy_rate: 0,
    }
  }
}

// Kullanıcı rozetlerini getir
export async function getUserBadges(userId: string) {
  try {
    const supabase = createServerClient()

    const { data, error } = await supabase
      .from("user_badges")
      .select(`
        *,
        badges (*)
      `)
      .eq("user_id", userId)

    if (error) {
      console.error("Error fetching user badges:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error in getUserBadges function:", error)
    return []
  }
}

// Günlük hedefleri getir
export async function getDailyGoal(userId: string) {
  try {
    const supabase = createServerClient()

    const today = new Date().toISOString().split("T")[0]

    const { data, error } = await supabase
      .from("daily_goals")
      .select("*")
      .eq("user_id", userId)
      .eq("date", today)
      .single()

    if (error && error.code !== "PGRST116") {
      // PGRST116: No rows returned
      console.error("Error fetching daily goal:", error)
      return null
    }

    if (!data) {
      // Günlük hedef yoksa oluştur
      const { data: newGoal, error: createError } = await supabase
        .from("daily_goals")
        .insert({
          user_id: userId,
          date: today,
          xp_goal: 50,
          lessons_goal: 3,
          xp_earned: 0,
          lessons_completed: 0,
          completed: false,
        })
        .select()
        .single()

      if (createError) {
        console.error("Error creating daily goal:", createError)
        return null
      }

      return newGoal
    }

    return data
  } catch (error) {
    console.error("Error in getDailyGoal:", error)
    return null
  }
}

// Ders tamamlama
export async function completeLesson(userId: string, lessonId: string, score: number) {
  try {
    const supabase = createServerActionClient()

    const { data, error } = await supabase
      .from("user_progress")
      .upsert({
        user_id: userId,
        lesson_id: lessonId,
        completed: true,
        score,
        completed_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error("Error completing lesson:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Error in completeLesson:", error)
    return null
  }
}

// Tüm kullanıcıları getir (admin için)
export async function getAllUsers() {
  try {
    const supabase = createServerClient()

    const { data, error } = await supabase.from("users").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching users:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error in getAllUsers:", error)
    return []
  }
}

// Kullanıcı rolünü güncelle (admin için)
export async function updateUserRole(userId: string, role: string) {
  try {
    const supabase = createServerActionClient()

    const { data, error } = await supabase.from("users").update({ role }).eq("id", userId).select().single()

    if (error) {
      console.error("Error updating user role:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Error in updateUserRole:", error)
    return null
  }
}

// Modül oluştur (admin için)
export async function createModule(moduleData: any) {
  try {
    const supabase = createServerActionClient()

    const { data, error } = await supabase.from("modules").insert(moduleData).select().single()

    if (error) {
      console.error("Error creating module:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Error in createModule:", error)
    return null
  }
}

// Ders oluştur (admin için)
export async function createLesson(lessonData: any) {
  try {
    const supabase = createServerActionClient()

    const { data, error } = await supabase.from("lessons").insert(lessonData).select().single()

    if (error) {
      console.error("Error creating lesson:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Error in createLesson:", error)
    return null
  }
}

// Soru oluştur (admin için)
export async function createQuestion(questionData: any) {
  try {
    const supabase = createServerActionClient()

    const { data, error } = await supabase.from("questions").insert(questionData).select().single()

    if (error) {
      console.error("Error creating question:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Error in createQuestion:", error)
    return null
  }
}

// Cevap oluştur (admin için)
export async function createAnswer(answerData: any) {
  try {
    const supabase = createServerActionClient()

    const { data, error } = await supabase.from("answers").insert(answerData).select().single()

    if (error) {
      console.error("Error creating answer:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Error in createAnswer:", error)
    return null
  }
}

// Rozet oluştur (admin için)
export async function createBadge(badgeData: any) {
  try {
    const supabase = createServerActionClient()

    const { data, error } = await supabase.from("badges").insert(badgeData).select().single()

    if (error) {
      console.error("Error creating badge:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Error in createBadge:", error)
    return null
  }
}
