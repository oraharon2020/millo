import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

console.log('[Supabase] Creating client for:', supabaseUrl)

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storageKey: 'millo-auth',
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})

// Types for our database
export interface Project {
  id: string
  title: string
  description: string
  image_url: string
  thumbnail_url?: string
  images?: string[]
  category: string
  category_id?: string
  location?: string
  is_featured?: boolean
  created_at: string
  materials?: string
  countertop?: string
  handles?: string
  appliances?: string
}

export interface ProjectCategory {
  id: string
  name: string
  name_en?: string
  slug: string
  description?: string
  order_index: number
  is_active: boolean
}

export interface KitchenInsight {
  id: string
  title: string
  description: string
  content?: string
  image_url: string
  category?: string
  reading_time?: string
  created_at: string
}

export interface Contact {
  id: string
  name: string
  phone: string
  email?: string
  message: string
  created_at: string
  status: 'new' | 'contacted' | 'closed'
}

// Site Content Types
export interface HeroSection {
  id: string
  video_url?: string
  image_url?: string
  title_en: string
  title_he?: string
  subtitle?: string
  cta_text?: string
  cta_link?: string
  main_image_url?: string
  main_image_position?: string
  secondary_image_url?: string
  secondary_image_position?: string
  updated_at: string
}

export interface SocialLink {
  id: string
  platform: 'facebook' | 'instagram' | 'whatsapp' | 'tiktok' | 'youtube'
  url: string
  is_active: boolean
  order_index: number
}

export interface TopBanner {
  id: string
  text: string
  link?: string
  is_active: boolean
  background_color: string
  text_color: string
}

export interface ContactInfo {
  id: string
  phone?: string
  email?: string
  address?: string
  whatsapp?: string
}

export interface SiteSettings {
  id: string
  site_name: string
  site_description?: string
  logo_url?: string
  favicon_url?: string
}

export interface KitchenStyle {
  id: string
  name_en: string
  name_he: string
  image_url?: string
  image_position?: string
  row_group: 1 | 2
  text_position: 'top' | 'bottom'
  order_index: number
  is_active: boolean
  link_url?: string
  project_category_id?: string
  created_at: string
  updated_at: string
}
