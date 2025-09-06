/*
  # Create clients table

  1. New Tables
    - `clients`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `company_name` (text, not null)
      - `contact_person` (text, not null)
      - `email` (text, not null)
      - `phone` (text, optional)
      - `address` (jsonb for structured address data)
      - `tax_id` (text, optional - Steuernummer)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `clients` table
    - Add policy for users to manage their own clients
*/

CREATE TABLE IF NOT EXISTS clients (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    company_name text NOT NULL,
    contact_person text NOT NULL,
    email text NOT NULL,
    phone text,
    address jsonb DEFAULT '{}',
    tax_id text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can manage their own clients"
    ON clients
    FOR ALL
    TO authenticated
    USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER clients_updated_at
    BEFORE UPDATE ON clients
    FOR EACH ROW
    EXECUTE FUNCTION handle_updated_at();

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_clients_user_id ON clients(user_id);