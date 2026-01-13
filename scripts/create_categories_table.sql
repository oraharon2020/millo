-- =============================================
-- Categories for "Not Only Kitchens" section
-- Run this in your Supabase SQL Editor
-- =============================================

CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  bg_color TEXT DEFAULT 'from-gray-100 to-gray-200',
  link_url TEXT, -- optional link to a page
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view categories" ON categories;
DROP POLICY IF EXISTS "Admins can manage categories" ON categories;

-- Everyone can view active categories
CREATE POLICY "Anyone can view categories" ON categories 
  FOR SELECT 
  USING (is_active = true);

-- Admins can do everything
CREATE POLICY "Admins can manage categories" ON categories 
  FOR ALL 
  TO authenticated
  USING (public.is_admin());

-- Insert default categories
INSERT INTO categories (title, description, bg_color, order_index) VALUES
  ('נגרות מסדרון', 'פתרונות אחסון חכמים למסדרון', 'from-amber-50 to-orange-50', 1),
  ('נגרות אמבטיה', 'ארונות אמבטיה בעיצוב אישי', 'from-gray-100 to-gray-200', 2),
  ('ארונות בהתאמה אישית', 'ארונות קיר וחדרי ארונות', 'from-amber-100 to-amber-200', 3),
  ('חדרי שינה', 'עיצוב וריהוט חדרי שינה', 'from-rose-50 to-pink-50', 4)
ON CONFLICT DO NOTHING;

-- Index for ordering
CREATE INDEX IF NOT EXISTS idx_categories_order ON categories(order_index);
