@@ .. @@
 CREATE TABLE IF NOT EXISTS profiles (
   id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
-  email text UNIQUE NOT NULL,
+  email text NOT NULL,
   full_name text,
   company_name text,
+  role text NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin', 'superadmin')),
   tax_number text,
   vat_id text,
   address jsonb DEFAULT '{}',