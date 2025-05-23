// Supabase client'ı daha dayanıklı hale getirelim
import { createServerComponentClient, createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import type { Database } from "@/types/supabase"
import { cache } from "react"

// Dummy client to return when environment variables are missing
const createDummyClient = () => {
  return {
    from: () => ({
      select: () => ({
        eq: () => ({
          single: () => ({ data: null, error: { message: "Supabase client not initialized properly" } }),
          order: () => ({ limit: () => ({ data: [], error: null }) }),
        }),
        order: () => ({ limit: () => ({ data: [], error: null }) }),
      }),
      insert: () => ({ data: null, error: { message: "Supabase client not initialized properly" } }),
      update: () => ({ eq: () => ({ data: null, error: { message: "Supabase client not initialized properly" } }) }),
      delete: () => ({ eq: () => ({ data: null, error: { message: "Supabase client not initialized properly" } }) }),
    }),
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      signInWithPassword: () =>
        Promise.resolve({ data: { session: null }, error: { message: "Authentication not available" } }),
      signUp: () => Promise.resolve({ data: { user: null }, error: { message: "Authentication not available" } }),
      signOut: () => Promise.resolve({ error: null }),
    },
    storage: {
      from: () => ({
        upload: () => Promise.resolve({ data: null, error: { message: "Storage not available" } }),
        getPublicUrl: () => ({ data: { publicUrl: "" } }),
      }),
    },
  } as any
}

// Check if environment variables are available
const hasEnvVars = () => {
  return !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
}

// Server component client (cached)
export const createServerClient = cache(() => {
  try {
    // Check if environment variables are available
    if (!hasEnvVars()) {
      console.error("Supabase environment variables are missing. Please check your .env file.")
      return createDummyClient()
    }

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
    return createDummyClient()
  }
})

// Route handler client (for API routes)
export const createServerActionClient = () => {
  try {
    // Check if environment variables are available
    if (!hasEnvVars()) {
      console.error("Supabase environment variables are missing. Please check your .env file.")
      return createDummyClient()
    }

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
    return createDummyClient()
  }
}
