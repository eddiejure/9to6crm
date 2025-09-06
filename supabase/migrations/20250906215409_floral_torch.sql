/*
  # Create invoices table

  1. New Tables
    - `invoices`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `client_id` (uuid, foreign key to clients)
      - `project_id` (uuid, foreign key to projects, optional)
      - `quote_id` (uuid, foreign key to quotes, optional)
      - `invoice_number` (text, unique, not null)
      - `date` (date, not null)
      - `due_date` (date, not null)
      - `items` (jsonb array of invoice items)
      - `subtotal` (decimal)
      - `tax_amount` (decimal)
      - `total` (decimal)
      - `status` (enum: draft, sent, paid, overdue, cancelled)
      - `payment_date` (date, optional)
      - `notes` (text, optional)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `invoices` table
    - Add policy for users to manage their own invoices
*/

CREATE TABLE IF NOT EXISTS invoices (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    client_id uuid REFERENCES clients(id) ON DELETE CASCADE NOT NULL,
    project_id uuid REFERENCES projects(id) ON DELETE SET NULL,
    quote_id uuid REFERENCES quotes(id) ON DELETE SET NULL,
    invoice_number text UNIQUE NOT NULL,
    date date NOT NULL DEFAULT CURRENT_DATE,
    due_date date NOT NULL DEFAULT (CURRENT_DATE + INTERVAL '14 days'),
    items jsonb NOT NULL DEFAULT '[]',
    subtotal decimal(10,2) NOT NULL DEFAULT 0,
    tax_amount decimal(10,2) NOT NULL DEFAULT 0,
    total decimal(10,2) NOT NULL DEFAULT 0,
    status text CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')) DEFAULT 'draft',
    payment_date date,
    notes text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can manage their own invoices"
    ON invoices
    FOR ALL
    TO authenticated
    USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER invoices_updated_at
    BEFORE UPDATE ON invoices
    FOR EACH ROW
    EXECUTE FUNCTION handle_updated_at();

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_invoices_user_id ON invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_client_id ON invoices(client_id);
CREATE INDEX IF NOT EXISTS idx_invoices_project_id ON invoices(project_id);
CREATE INDEX IF NOT EXISTS idx_invoices_quote_id ON invoices(quote_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_invoice_number ON invoices(invoice_number);