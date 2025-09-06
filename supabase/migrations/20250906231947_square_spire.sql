/*
  # Safe Auth Fix - No Table Drops
  
  1. Updates
    - Safely recreate functions using CREATE OR REPLACE
    - Update RLS policies without dropping tables
    - Ensure proper trigger setup
    
  2. Security
    - Fix RLS policies to prevent recursion
    - Maintain data integrity
*/

-- Safely recreate the updated_at function
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Safely recreate the new user handler function
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (NEW.id, NEW.email, 'user');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Ensure the profiles table has the correct structure (add missing columns if needed)
DO $$
BEGIN
  -- Add role column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'role'
  ) THEN
    ALTER TABLE profiles ADD COLUMN role text NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin', 'superadmin'));
  END IF;
  
  -- Add other columns if they don't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'full_name'
  ) THEN
    ALTER TABLE profiles ADD COLUMN full_name text;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'company_name'
  ) THEN
    ALTER TABLE profiles ADD COLUMN company_name text;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'tax_number'
  ) THEN
    ALTER TABLE profiles ADD COLUMN tax_number text;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'vat_id'
  ) THEN
    ALTER TABLE profiles ADD COLUMN vat_id text;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'address'
  ) THEN
    ALTER TABLE profiles ADD COLUMN address jsonb DEFAULT '{}';
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'created_at'
  ) THEN
    ALTER TABLE profiles ADD COLUMN created_at timestamptz DEFAULT now();
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE profiles ADD COLUMN updated_at timestamptz DEFAULT now();
  END IF;
END $$;

-- Enable RLS if not already enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Superadmins can manage all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can manage their own profiles" ON profiles;

-- Create simple, non-recursive RLS policies
CREATE POLICY "Enable read access for users based on user_id" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Enable insert for authenticated users only" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable update for users based on user_id" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Create trigger for new user signup (if it doesn't exist)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Create trigger for updated_at (if it doesn't exist)
DROP TRIGGER IF EXISTS profiles_updated_at ON profiles;
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- Add useful indexes
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);