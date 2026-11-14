import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const response = NextResponse.redirect(`${origin}${next}`);
      response.cookies.set('edc_student_auth', '1', {
        path: '/',
        maxAge: 86400 * 7,
        sameSite: 'lax',
      });
      return response;
    }
  }

  // Return the user to login with context
  return NextResponse.redirect(`${origin}/auth/login?error=oauth_exchange_failed`);
}
