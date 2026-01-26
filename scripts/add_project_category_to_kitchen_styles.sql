-- Add project_category_id to kitchen_styles table
-- Run this in Supabase SQL Editor

ALTER TABLE kitchen_styles 
ADD COLUMN IF NOT EXISTS project_category_id UUID REFERENCES project_categories(id);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_kitchen_styles_project_category 
ON kitchen_styles(project_category_id);
