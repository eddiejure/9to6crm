import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('your-project-ref') || supabaseAnonKey.includes('your-anon-public-key')) {
  console.error('⚠️  Supabase not configured properly!');
  console.error('Please update your .env file with actual Supabase credentials:');
  console.error('1. Go to https://supabase.com and create a project');
  console.error('2. Copy your project URL and anon key');
  console.error('3. Update VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env');
  console.error('4. Restart the development server');
  
  // Create a mock client to prevent the app from crashing
  export const supabase = {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signInWithPassword: () => Promise.resolve({ error: new Error('Supabase not configured') }),
      signUp: () => Promise.resolve({ error: new Error('Supabase not configured') }),
      signOut: () => Promise.resolve({ error: null })
    },
    from: () => ({
      select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }) }) }),
      insert: () => Promise.resolve({ error: new Error('Supabase not configured') }),
      update: () => ({ eq: () => Promise.resolve({ error: new Error('Supabase not configured') }) })
    })
  } as any;
} else {
  export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
}