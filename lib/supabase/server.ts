import { createServerComponentClient, createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import type { Database } from "@/types/supabase"
import { cache } from "react"

// Server component client (cached)
export const createServerClient = cache(() => {
  try {
    const cookieStore = cookies()
    return createServerComponentClient<Database>({
      cookies: () => cookieStore,
      options: {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      },
    })
  } catch (error) {
    console.error("Server client oluşturulurken hata:", error)
    // Fallback olarak boş bir cookie store ile client oluştur
    return createServerComponentClient<Database>({
      cookies: () => new Map(),
      options: {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      },
    })
  }
})

// Route handler client (for API routes)
export const createServerActionClient = () => {
  try {
    const cookieStore = cookies()
    return createRouteHandlerClient<Database>({
      cookies: () => cookieStore,
      options: {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      },
    })
  } catch (error) {
    console.error("Server action client oluşturulurken hata:", error)
    // Fallback olarak boş bir cookie store ile client oluştur
    return createRouteHandlerClient<Database>({
      cookies: () => new Map(),
      options: {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      },
    })
  }
}
