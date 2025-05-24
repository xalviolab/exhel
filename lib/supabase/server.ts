// Update the server-side Supabase client to handle missing environment variables
import { createServerComponentClient, createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import type { Database } from "@/types/supabase"
import { cache } from "react"

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
      throw new Error("Supabase environment variables are missing")
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
    // Return a dummy client that will show appropriate errors
    return {
      from: () => ({
        select: () => ({
          eq: () => ({
            single: () => ({ data: null, error: { message: "Supabase client not initialized properly" } }),
          }),
        }),
      }),
      auth: { getSession: () => Promise.resolve({ data: { session: null }, error: null }) },
    } as any
  }
})

// Route handler client (for API routes)
export const createServerActionClient = () => {
  try {
    // Check if environment variables are available
    if (!hasEnvVars()) {
      console.error("Supabase environment variables are missing. Please check your .env file.")
      throw new Error("Supabase environment variables are missing")
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
    // Return a dummy client that will show appropriate errors
    return {
      from: () => ({
        select: () => ({
          eq: () => ({
            single: () => ({ data: null, error: { message: "Supabase client not initialized properly" } }),
          }),
        }),
      }),
      auth: { getSession: () => Promise.resolve({ data: { session: null }, error: null }) },
    } as any
  }
}
