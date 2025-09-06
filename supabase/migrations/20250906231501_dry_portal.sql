/*
  # Fix RLS Policies to Prevent Infinite Recursion
  
  1. Security Changes
    - Drop problematic superadmin policy that causes recursion
    - Simplify RLS policies to basic user access only
    - Remove circular dependencies in policy checks
*/

-- Drop the problematic superadmin policy that causes infinite recursion
DROP POLICY IF EXISTS "Superadmins can manage all profiles" ON profiles;

-- Keep only the basic user policies
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Create simple, non-recursive policies
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);