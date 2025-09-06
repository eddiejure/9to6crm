/*
  # Create projects table

  1. New Tables
    - `projects`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
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
    - Add policy for users to manage their own projects
*/

CREATE TABLE IF NOT EXISTS projects (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    client_id uuid REFERENCES clients(id) ON DELETE CASCADE NOT NULL,
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

-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can manage their own projects"
    ON projects
    FOR ALL
    TO authenticated
    USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION handle_updated_at();

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_client_id ON projects(client_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);