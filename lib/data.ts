import { createClient } from '@supabase/supabase-js';

// Server-side Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ============================================
// Data fetching functions for Server Components
// ============================================

export async function getHeroSection() {
  const { data } = await supabase
    .from('hero_section')
    .select('*')
    .single();
  return data;
}

export async function getKitchenStyles() {
  const { data } = await supabase
    .from('kitchen_styles')
    .select('*')
    .eq('is_active', true)
    .order('order_index', { ascending: true });
  return data || [];
}

export async function getCategories() {
  const { data } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('order_index', { ascending: true });
  return data || [];
}

export async function getProjects(limit?: number) {
  let query = supabase
    .from('projects')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false });
  
  if (limit) {
    query = query.limit(limit);
  }
  
  const { data } = await query;
  return data || [];
}

export async function getProjectById(id: string) {
  const { data } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single();
  return data;
}

export async function getKitchenInsights(limit?: number) {
  let query = supabase
    .from('kitchen_insights')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false });
  
  if (limit) {
    query = query.limit(limit);
  }
  
  const { data } = await query;
  return data || [];
}

export async function getFaqs() {
  const { data } = await supabase
    .from('faqs')
    .select('*')
    .eq('is_active', true)
    .order('order_index', { ascending: true });
  return data || [];
}

export async function getSettings() {
  const { data } = await supabase
    .from('settings')
    .select('*')
    .single();
  return data;
}

export async function getAboutContent() {
  const { data } = await supabase
    .from('about_content')
    .select('*')
    .single();
  return data;
}

// ============================================
// Fetch all homepage data in parallel
// ============================================

export async function getHomepageData() {
  const [hero, kitchenStyles, categories, projects, insights, settings] = await Promise.all([
    getHeroSection(),
    getKitchenStyles(),
    getCategories(),
    getProjects(6),
    getKitchenInsights(6),
    getSettings(),
  ]);

  return {
    hero,
    kitchenStyles,
    categories,
    projects,
    insights,
    settings,
  };
}
