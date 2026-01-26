-- Project Categories Table
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS project_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  name_en TEXT,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE project_categories ENABLE ROW LEVEL SECURITY;

-- Allow public read
CREATE POLICY "Allow public read access on project_categories" ON project_categories
  FOR SELECT USING (true);

-- Allow authenticated users full access
CREATE POLICY "Allow authenticated users full access on project_categories" ON project_categories
  FOR ALL USING (auth.role() = 'authenticated');

-- Insert default categories
INSERT INTO project_categories (name, name_en, slug, order_index) VALUES
  ('מטבח מודרני', 'Modern Kitchen', 'modern', 1),
  ('מטבח קלאסי', 'Classic Kitchen', 'classic', 2),
  ('מטבח כפרי', 'Rustic Kitchen', 'rustic', 3),
  ('מטבח מינימליסטי', 'Minimalist Kitchen', 'minimalist', 4),
  ('ארונות', 'Cabinets', 'cabinets', 5),
  ('חדרי אמבטיה', 'Bathrooms', 'bathrooms', 6),
  ('חדרי שינה', 'Bedrooms', 'bedrooms', 7),
  ('פרויקטים מסחריים', 'Commercial', 'commercial', 8)
ON CONFLICT (slug) DO NOTHING;
