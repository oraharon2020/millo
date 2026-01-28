-- Gallery Images Table for SEO metadata
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS gallery_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  url TEXT NOT NULL,
  storage_path TEXT,
  
  -- SEO Fields
  alt_text TEXT,
  title TEXT,
  description TEXT,
  
  -- Organization
  folder TEXT DEFAULT 'general',
  tags TEXT[],
  
  -- Metadata
  file_name TEXT,
  file_size INTEGER,
  mime_type TEXT,
  width INTEGER,
  height INTEGER,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to manage images
CREATE POLICY "Allow authenticated users to view images"
  ON gallery_images FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert images"
  ON gallery_images FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update images"
  ON gallery_images FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to delete images"
  ON gallery_images FOR DELETE
  TO authenticated
  USING (true);

-- Allow public read access for website
CREATE POLICY "Allow public to view images"
  ON gallery_images FOR SELECT
  TO anon
  USING (true);

-- Create index for faster searches
CREATE INDEX IF NOT EXISTS idx_gallery_images_folder ON gallery_images(folder);
CREATE INDEX IF NOT EXISTS idx_gallery_images_tags ON gallery_images USING GIN(tags);

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_gallery_images_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_gallery_images_updated_at
  BEFORE UPDATE ON gallery_images
  FOR EACH ROW
  EXECUTE FUNCTION update_gallery_images_updated_at();
