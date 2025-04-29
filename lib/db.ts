import { createServerClient } from "@/lib/supabase/server"
import { createServerActionClient } from "@/lib/supabase/server"

// Modülleri getir
export async function getModules() {
  const supabase = createServerClient()

  const { data, error } = await supabase.from("modules").select("*").order("order_index")

  if (error) {
    console.error("Error fetching modules:", error)
    return []
  }

  return data
}

// Kullanıcı seviyesine göre erişilebilir modülleri getir
export async function getAccessibleModules(userId: string) {
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

  return data
}

// Modül detaylarını getir
export async function getModuleDetails(moduleId: string) {
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

  return { ...module, lessons }
}

// Ders detaylarını getir
export async function getLessonDetails(lessonId: string) {
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
}

// Ders sorularını getir
export async function getLessonQuestions(lessonId: string) {
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

  return data
}

// Kullanıcı ilerleme durumunu getir
export async function getUserProgress(userId: string) {
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

  return data
}

// Kullanıcı istatistiklerini getir
export async function getUserStats(userId: string) {
  const supabase = createServerClient()

  const { data, error } = await supabase.from("user_stats").select("*").eq("user_id", userId).single()

  if (error) {
    console.error("Error fetching user stats:", error)
    return null
  }

  return data
}

// Kullanıcı rozetlerini getir
export async function getUserBadges(userId: string) {
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

  return data
}

// Günlük hedefleri getir
export async function getDailyGoal(userId: string) {
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
}

// Ders tamamlama
export async function completeLesson(userId: string, lessonId: string, score: number) {
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
}

// Tüm kullanıcıları getir (admin için)
export async function getAllUsers() {
  const supabase = createServerClient()

  const { data, error } = await supabase.from("users").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching users:", error)
    return []
  }

  return data
}

// Kullanıcı rolünü güncelle (admin için)
export async function updateUserRole(userId: string, role: string) {
  const supabase = createServerActionClient()

  const { data, error } = await supabase.from("users").update({ role }).eq("id", userId).select().single()

  if (error) {
    console.error("Error updating user role:", error)
    return null
  }

  return data
}

// Modül oluştur (admin için)
export async function createModule(moduleData: any) {
  const supabase = createServerActionClient()

  const { data, error } = await supabase.from("modules").insert(moduleData).select().single()

  if (error) {
    console.error("Error creating module:", error)
    return null
  }

  return data
}

// Ders oluştur (admin için)
export async function createLesson(lessonData: any) {
  const supabase = createServerActionClient()

  const { data, error } = await supabase.from("lessons").insert(lessonData).select().single()

  if (error) {
    console.error("Error creating lesson:", error)
    return null
  }

  return data
}

// Soru oluştur (admin için)
export async function createQuestion(questionData: any) {
  const supabase = createServerActionClient()

  const { data, error } = await supabase.from("questions").insert(questionData).select().single()

  if (error) {
    console.error("Error creating question:", error)
    return null
  }

  return data
}

// Cevap oluştur (admin için)
export async function createAnswer(answerData: any) {
  const supabase = createServerActionClient()

  const { data, error } = await supabase.from("answers").insert(answerData).select().single()

  if (error) {
    console.error("Error creating answer:", error)
    return null
  }

  return data
}

// Rozet oluştur (admin için)
export async function createBadge(badgeData: any) {
  const supabase = createServerActionClient()

  const { data, error } = await supabase.from("badges").insert(badgeData).select().single()

  if (error) {
    console.error("Error creating badge:", error)
    return null
  }

  return data
}
