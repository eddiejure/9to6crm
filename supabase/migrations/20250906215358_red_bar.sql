/*
  # Create quotes table

  1. New Tables
    - `quotes`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `client_id` (uuid, foreign key to clients)
      - `project_id` (uuid, foreign key to projects, optional)
      - `quote_number` (text, unique, not null)
      - `date` (date, not null)
      - `valid_until` (date, not null)
      - `items` (jsonb array of quote items)
      - `subtotal` (decimal)
      - `tax_amount` (decimal)
      - `total` (decimal)
      - `status` (enum: draft, sent, accepted, rejected, expired)
      - `notes` (text, optional)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `quotes` table
    - Add policy for users to manage their own quotes
*/

CREATE TABLE IF NOT EXISTS quotes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    client_id uuid REFERENCES clients(id) ON DELETE CASCADE NOT NULL,
    project_id uuid REFERENCES projects(id) ON DELETE SET NULL,
    quote_number text UNIQUE NOT NULL,
    date date NOT NULL DEFAULT CURRENT_DATE,
    valid_until date NOT NULL DEFAULT (CURRENT_DATE + INTERVAL '30 days'),
    items jsonb NOT NULL DEFAULT '[]',
    subtotal decimal(10,2) NOT NULL DEFAULT 0,
    tax_amount decimal(10,2) NOT NULL DEFAULT 0,
    total decimal(10,2) NOT NULL DEFAULT 0,
    status text CHECK (status IN ('draft', 'sent', 'accepted', 'rejected', 'expired')) DEFAULT 'draft',
    notes text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can manage their own quotes"
    ON quotes
    FOR ALL
    TO authenticated
    USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER quotes_updated_at
    BEFORE UPDATE ON quotes
    FOR EACH ROW
    EXECUTE FUNCTION handle_updated_at();

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_quotes_user_id ON quotes(user_id);
CREATE INDEX IF NOT EXISTS idx_quotes_client_id ON quotes(client_id);
CREATE INDEX IF NOT EXISTS idx_quotes_project_id ON quotes(project_id);
CREATE INDEX IF NOT EXISTS idx_quotes_status ON quotes(status);
CREATE INDEX IF NOT EXISTS idx_quotes_quote_number ON quotes(quote_number);