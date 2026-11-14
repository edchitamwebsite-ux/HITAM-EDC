import { createBrowserClient } from '@supabase/ssr';

const DEFAULT_SUPABASE_URL = 'https://zuqysklqojrsnfumxhrc.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_FgDfguhlWbYEN_n5LWixTA_A7cyns1b';

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;
  return createBrowserClient(url, key);
}
