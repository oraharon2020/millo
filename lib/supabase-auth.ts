import { createClientComponentClient, createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

// Client-side Supabase client
export const createClient = () => createClientComponentClient()

// Server-side Supabase client
export const createServerClient = () => {
  const cookieStore = cookies()
  return createServerComponentClient({ cookies: () => cookieStore })
}

// Types
export interface UserProfile {
  id: string
  email: string
  full_name: string | null
  role: 'admin' | 'client'
  avatar_url: string | null
  phone: string | null
  created_at: string
  updated_at: string
}

export type UserRole = 'admin' | 'client'
