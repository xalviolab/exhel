import type { Database } from "@/types/supabase"

// Check if environment variables are available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

// Create a client with fallback values if environment variables are missing
export const createClient = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Supabase environment variables are missing. Please check your .env file.");
    // Return a dummy client that will show appropriate errors
    // This prevents infinite recursion during build/runtime if env vars are missing.
    return {
      auth: {
        getSession: async () => ({ data: { session: null }, error: new Error("Supabase environment variables are not configured.") }),
        signInWithPassword: async () => ({ data: { user: null, session: null }, error: new Error("Supabase environment variables are not configured.") }),
        signOut: async () => ({ error: new Error("Supabase environment variables are not configured.") }),
        updateUser: async () => ({ data: { user: null }, error: new Error("Supabase environment variables are not configured.") }),
        // Add other auth methods as needed with similar dummy implementations
      } as any, // Cast to any to match SupabaseClient type loosely for dummy
      from: () => ({
        select: () => ({
          eq: () => ({
            single: async () => ({ data: null, error: new Error("Supabase environment variables are not configured.") }),
            // Add other query methods as needed
          }),
          // Add other from methods as needed
        }),
        // Add other from methods as needed
      }) as any, // Cast to any for dummy
      // Add other top-level client methods as needed
    } as any; // Cast the whole dummy client to any
  }

  // Correctly create and return the Supabase client when variables are available
  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  });
}
