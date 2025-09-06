/*
  # Fix RLS Policy Recursion Issue
  
  1. Policy Changes
    - Fix the "Superadmins can manage all profiles" policy to prevent infinite recursion
    - Change FROM ALL to FOR INSERT, UPDATE, DELETE to avoid circular dependency
    
  2. Security
    - Maintains security while preventing recursion
    - Users can still read their own profiles
    - Superadmins can still manage all profiles for non-SELECT operations
*/

-- Drop the existing problematic policy
DROP POLICY IF EXISTS "Superadmins can manage all profiles" ON profiles;

-- Recreate the policy without recursion issues
CREATE POLICY "Superadmins can manage all profiles"
    ON profiles
    FOR INSERT, UPDATE, DELETE
    TO authenticated
    USING (EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() AND role = 'superadmin'
    ));

-- Ensure the basic user policy exists for reading own profile
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
CREATE POLICY "Users can read own profile"
    ON profiles
    FOR SELECT
    TO authenticated
    USING (auth.uid() = id);

-- Ensure the basic user policy exists for updating own profile  
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
    ON profiles
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = id);