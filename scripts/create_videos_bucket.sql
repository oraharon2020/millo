-- =============================================
-- Create Videos Storage Bucket
-- Run this in your Supabase SQL Editor
-- =============================================

-- Create the videos bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('videos', 'videos', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to videos
CREATE POLICY "Public Access Videos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'videos');

-- Allow authenticated uploads to videos bucket
CREATE POLICY "Allow uploads to videos"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'videos');

-- Allow authenticated deletes from videos bucket
CREATE POLICY "Allow delete videos"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'videos');

-- Note: You can also create the bucket manually:
-- 1. Go to Supabase Dashboard > Storage
-- 2. Click "New bucket"
-- 3. Name: "videos"
-- 4. Check "Public bucket"
-- 5. Click "Create bucket"
