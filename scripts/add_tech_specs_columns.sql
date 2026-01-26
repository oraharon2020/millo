-- Add technical specifications columns to projects table
-- Run this in Supabase SQL Editor

-- Materials (e.g., "MDF צבוע, אלון טבעי")
ALTER TABLE projects ADD COLUMN IF NOT EXISTS materials TEXT;

-- Countertop (e.g., "קוורץ לבן")
ALTER TABLE projects ADD COLUMN IF NOT EXISTS countertop TEXT;

-- Handles (e.g., "ידיות אינטגרליות")
ALTER TABLE projects ADD COLUMN IF NOT EXISTS handles TEXT;

-- Appliances (e.g., "Miele, Siemens")
ALTER TABLE projects ADD COLUMN IF NOT EXISTS appliances TEXT;
