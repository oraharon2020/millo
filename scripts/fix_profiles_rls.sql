-- =============================================
-- FIX Profiles RLS Policies
-- Run this in your Supabase SQL Editor
-- =============================================

-- Drop all existing policies on profiles
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can insert profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can delete profiles" ON profiles;

-- Create simple, working policies

-- 1. Allow users to read their own profile (simple, no recursion)
CREATE POLICY "Users can read own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

-- 2. Allow users to update their own profile
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);

-- 3. Allow the trigger to insert profiles (using SECURITY DEFINER on function)
CREATE POLICY "Allow profile creation"
ON profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- =============================================
-- Check if you have profiles - if empty, create one
-- =============================================

-- First, see what users exist in auth.users:
-- SELECT id, email FROM auth.users;

-- Then manually insert a profile for your admin user:
-- INSERT INTO profiles (id, email, full_name, role)
-- VALUES ('YOUR-USER-UUID-HERE', 'your@email.com', 'Your Name', 'admin');

-- Or update existing profile to admin:
-- UPDATE profiles SET role = 'admin' WHERE email = 'your@email.com';
