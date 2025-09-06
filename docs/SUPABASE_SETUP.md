# Supabase Setup Guide

Diese Anleitung führt Sie durch die Einrichtung der Supabase-Datenbank für die 9to6 Project Management App.

## 🚀 Schnellstart

1. **Supabase Projekt erstellen**
   - Gehen Sie zu [supabase.com](https://supabase.com)
   - Erstellen Sie ein neues Projekt
   - Notieren Sie sich die URL und den API Key

2. **Datenbank Schema importieren**
   - Öffnen Sie den SQL Editor in Supabase
   - Führen Sie die untenstehenden SQL-Befehle aus

3. **Environment Variablen setzen**
   ```bash
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

## 📊 Datenbank Schema

### 1. Clients Table (Kunden)

```sql
/*
  # Clients Table Setup
  
  1. New Tables
    - `clients`
      - `id` (uuid, primary key)
      - `company_name` (text, not null)
      - `contact_person` (text, not null) 
      - `email` (text, unique, not null)
      - `phone` (text, optional)
      - `address` (jsonb for structured address data)
      - `tax_id` (text, optional - Steuernummer)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      
  2. Security
    - Enable RLS on `clients` table
    - Add policy for authenticated users to manage their clients
*/

CREATE TABLE IF NOT EXISTS clients (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name text NOT NULL,
    contact_person text NOT NULL,
    email text UNIQUE NOT NULL,
    phone text,
    address jsonb NOT NULL DEFAULT '{}',
    tax_id text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own clients"
    ON clients
    FOR ALL
    TO authenticated
    USING (true);

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER clients_updated_at
    BEFORE UPDATE ON clients
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();
```

### 2. Projects Table (Projekte)

```sql
/*
  # Projects Table Setup
  
  1. New Tables
    - `projects`
      - `id` (uuid, primary key)
      - `client_id` (uuid, foreign key to clients)
      - `name` (text, not null)
      - `description` (text, optional)
      - `status` (enum: planning, in_progress, review, completed, cancelled)
      - `project_type` (enum: onetime, monthly)
      - `elementor_details` (jsonb for Elementor-specific data)
      - `start_date` (date, optional)
      - `end_date` (date, optional)
      - `total_value` (decimal)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      
  2. Security
    - Enable RLS on `projects` table
    - Add policy for authenticated users to manage their projects
*/

CREATE TABLE IF NOT EXISTS projects (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id uuid REFERENCES clients(id) ON DELETE CASCADE,
    name text NOT NULL,
    description text,
    status text CHECK (status IN ('planning', 'in_progress', 'review', 'completed', 'cancelled')) DEFAULT 'planning',
    project_type text CHECK (project_type IN ('onetime', 'monthly')) NOT NULL,
    elementor_details jsonb DEFAULT '{}',
    start_date date,
    end_date date,
    total_value decimal(10,2) DEFAULT 0,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own projects"
    ON projects
    FOR ALL
    TO authenticated
    USING (true);

CREATE TRIGGER projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();
```

### 3. Quotes Table (Angebote)

```sql
/*
  # Quotes Table Setup
  
  1. New Tables
    - `quotes`
      - `id` (uuid, primary key)
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
    - Add policy for authenticated users to manage their quotes
*/

CREATE TABLE IF NOT EXISTS quotes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id uuid REFERENCES clients(id) ON DELETE CASCADE,
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

ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own quotes"
    ON quotes
    FOR ALL
    TO authenticated
    USING (true);

CREATE TRIGGER quotes_updated_at
    BEFORE UPDATE ON quotes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();
```

### 4. Invoices Table (Rechnungen)

```sql
/*
  # Invoices Table Setup
  
  1. New Tables
    - `invoices`
      - `id` (uuid, primary key)
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
    - Add policy for authenticated users to manage their invoices
*/

CREATE TABLE IF NOT EXISTS invoices (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id uuid REFERENCES clients(id) ON DELETE CASCADE,
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

ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own invoices"
    ON invoices
    FOR ALL
    TO authenticated
    USING (true);

CREATE TRIGGER invoices_updated_at
    BEFORE UPDATE ON invoices
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();
```

### 5. Service Templates Table (Dienstleistungsvorlagen)

```sql
/*
  # Service Templates Table Setup
  
  1. New Tables
    - `service_templates`
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `description` (text, optional)
      - `type` (enum: onetime, monthly)
      - `base_price` (decimal)
      - `items` (jsonb array of template items)
      - `created_at` (timestamptz)
      
  2. Security
    - Enable RLS on `service_templates` table
    - Add policy for authenticated users to manage their templates
*/

CREATE TABLE IF NOT EXISTS service_templates (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    type text CHECK (type IN ('onetime', 'monthly')) NOT NULL,
    base_price decimal(10,2) NOT NULL DEFAULT 0,
    items jsonb NOT NULL DEFAULT '[]',
    created_at timestamptz DEFAULT now()
);

ALTER TABLE service_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own service templates"
    ON service_templates
    FOR ALL
    TO authenticated
    USING (true);
```

## 🔧 Indizes für Performance

```sql
-- Indizes für bessere Performance
CREATE INDEX IF NOT EXISTS idx_projects_client_id ON projects(client_id);
CREATE INDEX IF NOT EXISTS idx_quotes_client_id ON quotes(client_id);
CREATE INDEX IF NOT EXISTS idx_quotes_project_id ON quotes(project_id);
CREATE INDEX IF NOT EXISTS idx_invoices_client_id ON invoices(client_id);
CREATE INDEX IF NOT EXISTS idx_invoices_project_id ON invoices(project_id);
CREATE INDEX IF NOT EXISTS idx_invoices_quote_id ON invoices(quote_id);
CREATE INDEX IF NOT EXISTS idx_quotes_status ON quotes(status);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
```

## 📊 Beispieldaten

```sql
-- Beispiel-Kunde
INSERT INTO clients (company_name, contact_person, email, address, tax_id) VALUES (
    'Musterfirma GmbH',
    'Max Mustermann',
    'max@musterfirma.de',
    '{"street": "Musterstraße 123", "city": "Berlin", "postal_code": "10115", "country": "Deutschland"}',
    'DE123456789'
);

-- Beispiel-Dienstleistungsvorlagen
INSERT INTO service_templates (name, description, type, base_price, items) VALUES (
    'Elementor Basic Website',
    'Einfache Website mit Elementor (bis zu 5 Seiten)',
    'onetime',
    1500.00,
    '[
        {
            "description": "Elementor Website Entwicklung (5 Seiten)",
            "quantity": 1,
            "unit_price": 1200,
            "tax_rate": 0.19
        },
        {
            "description": "SEO Grundkonfiguration",
            "quantity": 1,
            "unit_price": 300,
            "tax_rate": 0.19
        }
    ]'
),
(
    'Monatliche Wartung',
    'Regelmäßige Website-Wartung und Support',
    'monthly',
    99.00,
    '[
        {
            "description": "Website Wartung & Updates",
            "quantity": 1,
            "unit_price": 79,
            "tax_rate": 0.19
        },
        {
            "description": "Backup & Security Monitoring",
            "quantity": 1,
            "unit_price": 20,
            "tax_rate": 0.19
        }
    ]'
);
```

## 🔐 Authentication Setup

```sql
-- Enable authentication
-- This is handled automatically by Supabase Auth

-- Optional: Create custom profiles table
CREATE TABLE IF NOT EXISTS profiles (
    id uuid REFERENCES auth.users(id) PRIMARY KEY,
    company_name text,
    full_name text,
    email text,
    tax_number text,
    vat_id text,
    address jsonb,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own profile"
    ON profiles
    FOR ALL
    TO authenticated
    USING (auth.uid() = id);
```

## 🚨 Backup & Wartung

### Regelmäßige Backups
```sql
-- Backup-Script (ausführen mit pg_dump)
pg_dump -h your-host -U postgres -d your-database > backup_$(date +%Y%m%d).sql
```

### Performance Monitoring
```sql
-- Slow Queries identifizieren
SELECT query, mean_time, calls, total_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;
```

## 📞 Support

Bei Problemen mit der Supabase-Einrichtung:
1. Überprüfen Sie die Supabase-Dokumentation
2. Kontaktieren Sie den Support unter support@9to6.de
3. Erstellen Sie ein Issue im Repository

---

**Wichtig**: Stellen Sie sicher, dass alle SQL-Befehle in der richtigen Reihenfolge ausgeführt werden, da Fremdschlüssel-Beziehungen bestehen.