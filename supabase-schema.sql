-- =============================================
-- MILLO Website - Supabase Database Schema
-- Run this in your Supabase SQL Editor
-- =============================================

-- 1. Hero Section (Main banner on homepage)
CREATE TABLE IF NOT EXISTS hero_section (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  video_url TEXT,
  image_url TEXT,
  title_en TEXT NOT NULL DEFAULT 'TAILORED DESIGN, JUST FOR YOU',
  title_he TEXT,
  subtitle TEXT,
  cta_text TEXT DEFAULT 'לתאום פגישת ייעוץ ללא עלות',
  cta_link TEXT DEFAULT '/contact',
  main_image_url TEXT,
  secondary_image_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Top Banner (promotional banner at top of site)
CREATE TABLE IF NOT EXISTS top_banner (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  text TEXT NOT NULL DEFAULT 'לתאום פגישת ייעוץ ללא עלות',
  link TEXT,
  is_active BOOLEAN DEFAULT true,
  background_color TEXT DEFAULT '#000000',
  text_color TEXT DEFAULT '#ffffff'
);

-- 3. Social Links
CREATE TABLE IF NOT EXISTS social_links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  platform TEXT NOT NULL, -- 'facebook', 'instagram', 'whatsapp', 'tiktok', 'youtube'
  url TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0
);

-- 4. Contact Info
CREATE TABLE IF NOT EXISTS contact_info (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  phone TEXT,
  email TEXT,
  address TEXT,
  whatsapp TEXT
);

-- 5. Projects (Portfolio)
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  thumbnail_url TEXT,
  images TEXT[], -- Array of image URLs
  category TEXT,
  location TEXT,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Kitchen Insights (Blog/Tips)
CREATE TABLE IF NOT EXISTS kitchen_insights (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT,
  image_url TEXT,
  category TEXT,
  reading_time TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add missing columns to kitchen_insights if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'kitchen_insights' AND column_name = 'category') THEN
    ALTER TABLE kitchen_insights ADD COLUMN category TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'kitchen_insights' AND column_name = 'content') THEN
    ALTER TABLE kitchen_insights ADD COLUMN content TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'kitchen_insights' AND column_name = 'reading_time') THEN
    ALTER TABLE kitchen_insights ADD COLUMN reading_time TEXT;
  END IF;
END $$;

-- 7. Contacts (Form submissions)
CREATE TABLE IF NOT EXISTS contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  message TEXT,
  status TEXT DEFAULT 'new', -- 'new', 'contacted', 'closed'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- Insert default data
-- =============================================

-- Default hero section
INSERT INTO hero_section (
  video_url, 
  title_en, 
  title_he, 
  subtitle, 
  cta_text, 
  cta_link
) VALUES (
  '/סרטון-לרוחב.mp4',
  'TAILORED DESIGN, JUST FOR YOU',
  'עיצוב מותאם אישית שמשלב את הצרכים שלכם עם האסתטיקה המושלמת',
  'עיצוב מטבח בנגרות אישית, המשלב פונקציונליות וסטנדרט אסתטי גבוה. הזמינו פגישת ייעוץ אישית להתאמה מושלמת עבור הבית שלכם.',
  'לתאום פגישת ייעוץ ללא עלות',
  '/contact'
) ON CONFLICT DO NOTHING;

-- Default top banner
INSERT INTO top_banner (text, link, is_active, background_color, text_color)
VALUES ('לתאום פגישת ייעוץ ללא עלות', '/contact', true, '#000000', '#ffffff')
ON CONFLICT DO NOTHING;

-- Default social links
INSERT INTO social_links (platform, url, is_active, order_index) VALUES 
  ('facebook', 'https://facebook.com/millo', true, 1),
  ('instagram', 'https://instagram.com/millo', true, 2)
ON CONFLICT DO NOTHING;

-- Default contact info
INSERT INTO contact_info (phone, email, address, whatsapp)
VALUES ('052-1234567', 'info@millo.co.il', 'תל אביב, ישראל', '972521234567')
ON CONFLICT DO NOTHING;

-- Sample Kitchen Insights
INSERT INTO kitchen_insights (title, description, image_url, category, reading_time) VALUES 
  ('איך לבחור צבעים למטבח', 'מדריך מקיף לבחירת פלטת צבעים מושלמת למטבח שלכם', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600', 'עיצוב', '5 דקות'),
  ('טרנדים במטבחים 2025', 'כל מה שחם בעולם עיצוב המטבחים השנה', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600', 'טרנדים', '4 דקות'),
  ('חומרים איכותיים למטבח', 'סקירה של החומרים הטובים ביותר לארונות מטבח', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600', 'חומרים', '6 דקות')
ON CONFLICT DO NOTHING;

-- =============================================
-- Enable Row Level Security (RLS)
-- =============================================

ALTER TABLE hero_section ENABLE ROW LEVEL SECURITY;
ALTER TABLE top_banner ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE kitchen_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read" ON hero_section;
DROP POLICY IF EXISTS "Allow public read" ON top_banner;
DROP POLICY IF EXISTS "Allow public read" ON social_links;
DROP POLICY IF EXISTS "Allow public read" ON contact_info;
DROP POLICY IF EXISTS "Allow public read" ON projects;
DROP POLICY IF EXISTS "Allow public read" ON kitchen_insights;
DROP POLICY IF EXISTS "Allow public insert" ON contacts;
DROP POLICY IF EXISTS "Allow admin full access" ON hero_section;
DROP POLICY IF EXISTS "Allow admin full access" ON top_banner;
DROP POLICY IF EXISTS "Allow admin full access" ON social_links;
DROP POLICY IF EXISTS "Allow admin full access" ON contact_info;
DROP POLICY IF EXISTS "Allow admin full access" ON projects;
DROP POLICY IF EXISTS "Allow admin full access" ON kitchen_insights;
DROP POLICY IF EXISTS "Allow admin full access" ON contacts;
DROP POLICY IF EXISTS "Allow all" ON hero_section;
DROP POLICY IF EXISTS "Allow all" ON top_banner;
DROP POLICY IF EXISTS "Allow all" ON social_links;
DROP POLICY IF EXISTS "Allow all" ON contact_info;
DROP POLICY IF EXISTS "Allow all" ON projects;
DROP POLICY IF EXISTS "Allow all" ON kitchen_insights;
DROP POLICY IF EXISTS "Allow all" ON contacts;

-- Create policies to allow FULL access (temporary - until auth is implemented)
CREATE POLICY "Allow all" ON hero_section FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON top_banner FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON social_links FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON contact_info FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON projects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON kitchen_insights FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON contacts FOR ALL USING (true) WITH CHECK (true);

-- =============================================
-- Create Storage Bucket for images
-- =============================================
-- Run this separately in SQL Editor:

-- Create storage bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public access to images
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'images');

-- Allow anyone to upload images (temporary - until auth is implemented)
CREATE POLICY "Allow uploads" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'images');

-- Allow anyone to update images
CREATE POLICY "Allow updates" ON storage.objects FOR UPDATE USING (bucket_id = 'images');

-- Allow anyone to delete images
CREATE POLICY "Allow deletes" ON storage.objects FOR DELETE USING (bucket_id = 'images');
