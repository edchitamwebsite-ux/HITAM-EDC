import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { verifyAdminSessionToken } from '@/lib/auth-security';

const DEFAULT_SUPABASE_URL = 'https://zuqysklqojrsnfumxhrc.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_FgDfguhlWbYEN_n5LWixTA_A7cyns1b';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
      },
    }
  );

  let user = null;
  try {
    const { data } = await supabase.auth.getUser();
    user = data?.user || null;
  } catch (err) {
    // If Supabase is unreachable (e.g. during offline build or test sandbox), proceed safely
  }

  const pathname = request.nextUrl.pathname;

  // Check administrative & student cryptographic/session state
  const adminSession = request.cookies.get('edc_admin_auth')?.value;
  const isValidAdmin = await verifyAdminSessionToken(adminSession);
  const studentSession = request.cookies.get('edc_student_auth')?.value;

  // Protect student dashboard routes (allow authenticated Supabase users, verified admins, and session holders)
  if (pathname.startsWith('/dashboard')) {
    if (!user && !isValidAdmin && !studentSession) {
      const redirectUrl = new URL('/auth/login', request.url);
      redirectUrl.searchParams.set('next', pathname);
      return NextResponse.redirect(redirectUrl);
    }
  }

  // Protect admin routes with cryptographic signature verification
  if (pathname.startsWith('/admin')) {
    if (isValidAdmin) {
      return response;
    }

    if (!user) {
      const redirectUrl = new URL('/auth/login', request.url);
      redirectUrl.searchParams.set('next', pathname);
      return NextResponse.redirect(redirectUrl);
    }

    // Role check via users table
    let profile = null;
    try {
      const { data } = await supabase
        .from('users')
        .select('role')
        .eq('auth_id', user.id)
        .single();
      profile = data;
    } catch (err) {
      // Offline fallback
    }

    if (!profile || profile.role !== 'admin') {
      // Unauthorized user attempting admin access - redirect to forbidden or student dashboard
      return NextResponse.redirect(new URL('/dashboard?error=unauthorized_admin', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|images|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
