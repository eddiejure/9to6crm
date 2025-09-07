/*
  # Fix Authentication and RLS Policies
  
  1. Auth Helper Function
    - Create proper auth.uid() function for RLS
    
  2. Profile Policies
    - Drop conflicting policies
    - Create clean, working policies
    
  3. Trigger Function
    - Update handle_new_user function to be more robust
    - Ensure trigger exists and works
    
  4. Testing
    - Add queries to test the setup
*/

-- 1. Create the auth helper function (if it doesn't exist)
CREATE OR REPLACE FUNCTION auth.uid() RETURNS uuid
    LANGUAGE sql STABLE
    AS $$
  SELECT 
    COALESCE(
        NULLIF(current_setting('request.jwt.claim.sub', true), ''),
        (NULLIF(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
    )::uuid
$$;

-- 2. Drop all existing conflicting policies on profiles table
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Enable read access for users based on user_id" ON profiles;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON profiles;
DROP POLICY IF EXISTS "Users can manage their own clients" ON profiles;
DROP POLICY IF EXISTS "Superadmins can manage all profiles" ON profiles;

-- 3. Create new, clean policies for profiles
CREATE POLICY "Users can manage their own profile"
    ON profiles
    FOR ALL
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- 4. Update the handle_new_user function to be more robust
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (NEW.id, NEW.email, 'user')
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Ensure the trigger exists (drop and recreate to be safe)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 6. Add indexes for better performance (if they don't exist)
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- 7. Test queries (these will show results in the SQL editor)
-- Check current user
SELECT 'Current authenticated user ID:' as info, auth.uid() as user_id;

-- Check if profiles table is accessible
SELECT 'Profiles table test:' as info, count(*) as profile_count FROM profiles;

-- Check if current user has a profile
SELECT 'Current user profile:' as info, * FROM profiles WHERE id = auth.uid();