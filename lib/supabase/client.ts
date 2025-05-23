import { createClient as actualCreateSupabaseClient } from '@supabase/supabase-js';
import type { Database } from "@/types/supabase";

// Check if environment variables are available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const createThrowingProxy = (name: string, pathParts: string[] = []): any => {
  return new Proxy(() => {}, { // Target is a no-op function to allow it to be callable
    get: (target, prop, receiver) => {
      const currentPath = [...pathParts, String(prop)];
      const fullPath = `${name}.${currentPath.join('.')}`;
      // console.error(`Dummy Supabase: Attempted to access ${fullPath}`);
      // Return a new proxy for chained calls, or a function that throws for final calls
      return createThrowingProxy(name, currentPath);
    },
    apply: (target, thisArg, argumentsList) => {
      const fullPath = `${name}${pathParts.length > 0 ? '.' : ''}${pathParts.join('.')}`;
      const errorMessage = `Dummy Supabase: Attempted to call ${fullPath}() with args: ${JSON.stringify(argumentsList)}. Supabase environment variables are missing.`;
      console.error(errorMessage);
      throw new Error(errorMessage);
    }
  });
};

// Create a client with fallback values if environment variables are missing
export const createClient = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Supabase environment variables (NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY) are missing. Using a non-functional dummy Supabase client. Any interaction will throw an error.");
    return {
      auth: createThrowingProxy('auth'),
      from: (tableName: string) => createThrowingProxy('from', [tableName]),
      storage: createThrowingProxy('storage'),
      functions: createThrowingProxy('functions'),
      rpc: (fnName: string) => createThrowingProxy('rpc', [fnName]),
      // Add any other top-level Supabase client properties if needed
    } as any; // Cast to any to satisfy SupabaseClient type
  }

  // Correctly create and return the Supabase client when variables are available
  return actualCreateSupabaseClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      // Recommended: Add flowType and detectSessionInUrl for OAuth flows if used
      // flowType: 'pkce',
      // detectSessionInUrl: true,
    },
  });
}
