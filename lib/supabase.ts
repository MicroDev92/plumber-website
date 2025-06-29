import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables")
}

// Export the createClient function directly
export { createClient }

// Default client instance
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server client with service role key
export const createServerClient = () => {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!serviceRoleKey) {
    return createClient(supabaseUrl, supabaseAnonKey)
  }

  return createClient(supabaseUrl, serviceRoleKey)
}
