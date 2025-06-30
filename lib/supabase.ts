import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables")
}

// Client-side Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side Supabase client with service role key
export const createServerClient = () => {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!serviceRoleKey) {
    console.warn("No service role key found, using anon key")
    return createClient(supabaseUrl, supabaseAnonKey)
  }

  return createClient(supabaseUrl, serviceRoleKey)
}

// Export createClient for compatibility
export { createClient }
