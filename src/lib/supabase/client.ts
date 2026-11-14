import { createBrowserClient } from '@supabase/ssr';

const DEFAULT_SUPABASE_URL = 'https://kxsinhfsjmqrfkmoqelw.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4c2luaGZzam1xcmZrbW9xZWx3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2ODEzNDksImV4cCI6MjA5NzI1NzM0OX0.sRiimBO19iO6kNdcxy2d5SmMkiZS4jsUDDtUWj3rp3w';

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;
  return createBrowserClient(url, key);
}
