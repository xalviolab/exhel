"use client"

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/types/supabase"

// Singleton pattern for client-side Supabase client
let supabaseClient: ReturnType<typeof createClientComponentClient<Database>> | null = null

export const createClient = () => {
  if (!supabaseClient) {
    try {
      supabaseClient = createClientComponentClient<Database>({
        options: {
          auth: {
            persistSession: true,
            autoRefreshToken: true,
          },
        },
      })
    } catch (error) {
      console.error("Client oluşturulurken hata:", error)
      // Fallback olarak varsayılan ayarlarla client oluştur
      supabaseClient = createClientComponentClient<Database>()
    }
  }
  return supabaseClient
}
