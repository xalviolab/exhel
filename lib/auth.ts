import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { cache } from "react"
import { updateUserStatusServer } from "@/lib/user-status"

// Önbelleğe alma ile session alma
export const getSession = cache(async () => {
  const supabase = createServerClient()

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    return session
  } catch (error) {
    console.error("Session alınırken hata:", error)
    return null
  }
})

// Önbelleğe alma ile kullanıcı detaylarını alma
export const getUserDetails = cache(async () => {
  const session = await getSession()

  if (!session) {
    return null
  }

  const supabase = createServerClient()

  try {
    // Kullanıcı durumunu güncelle (kalpler ve günlük seri)
    await updateUserStatusServer(session.user.id)

    // Güncel kullanıcı bilgilerini al
    const { data: user } = await supabase.from("users").select("*").eq("id", session.user.id).single()
    return user
  } catch (error) {
    console.error("Kullanıcı detayları alınırken hata:", error)
    return null
  }
})

export async function requireAuth() {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  // Kullanıcı oturum açtığında durumunu güncelle
  await updateUserStatusServer(session.user.id)

  return session
}

export async function requireAdmin() {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  const supabase = createServerClient()

  try {
    const { data: user } = await supabase.from("users").select("role").eq("id", session.user.id).single()

    if (!user || user.role !== "admin") {
      redirect("/dashboard")
    }

    return session
  } catch (error) {
    console.error("Admin kontrolü yapılırken hata:", error)
    redirect("/dashboard")
  }
}
