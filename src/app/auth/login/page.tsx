'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { createAdminSessionToken } from '@/lib/auth-security';
import { Lock, Mail, AlertCircle, Sparkles } from 'lucide-react';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get('next') || '/dashboard';

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const supabase = createClient();

  const handleGoogleLogin = async () => {
    setError(null);
    setIsGoogleLoading(true);
    try {
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextUrl)}`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });
      if (oauthError) throw oauthError;
    } catch (err: any) {
      setError(err.message || 'Google authentication failed. Please verify configuration.');
      setIsGoogleLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Master Super Admin bypass for offline/local evaluation and institutional operations
    const cleanEmail = email.trim().toLowerCase();
    if (
      (cleanEmail === 'edc.hitam.website@hitam.org' || cleanEmail === 'admin@hitam.org') &&
      password === 'edc.hitam@2026'
    ) {
      const signedToken = await createAdminSessionToken(cleanEmail);
      document.cookie = `edc_admin_auth=${signedToken}; path=/; max-age=86400; SameSite=Lax`;
      document.cookie = `edc_student_auth=1; path=/; max-age=86400; SameSite=Lax`;
      localStorage.setItem('edc_current_user', JSON.stringify({
        id: 'master-admin',
        email: cleanEmail,
        fullName: 'Super Administrator',
        role: 'admin',
        college: 'HITAM Hyderabad',
        department: 'Innovation & Incubation Cell'
      }));
      router.push('/admin');
      return;
    }

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        throw authError;
      }

      if (data.user) {
        let profile = null;
        try {
          const { data: p } = await supabase
            .from('users')
            .select('*')
            .eq('auth_id', data.user.id)
            .single();
          profile = p;
        } catch {}

        document.cookie = `edc_student_auth=1; path=/; max-age=86400; SameSite=Lax`;
        if (profile?.role === 'admin') {
          const signedToken = await createAdminSessionToken(data.user.email || 'admin@hitam.org');
          document.cookie = `edc_admin_auth=${signedToken}; path=/; max-age=86400; SameSite=Lax`;
        }

        const userObj = {
          id: data.user.id,
          email: data.user.email,
          fullName: profile?.full_name || data.user.user_metadata?.full_name || data.user.email?.split('@')[0],
          role: profile?.role || 'student',
          college: profile?.college_name || 'HITAM',
          department: profile?.department || 'Engineering',
          graduationYear: profile?.graduation_year || 2026
        };
        localStorage.setItem('edc_current_user', JSON.stringify(userObj));

        if (profile?.role === 'admin' && nextUrl.startsWith('/admin')) {
          router.push('/admin');
          return;
        }
      }

      router.push(nextUrl);
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Failed to authenticate. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-slate-200 bg-white shadow-card rounded-2xl p-6 sm:p-8">
      {error && (
        <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Google OAuth Quick Sign In */}
      <div className="space-y-4">
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isGoogleLoading || isLoading}
          className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-subtle transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-navy-900 focus:ring-offset-1 disabled:opacity-50"
        >
          <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          {isGoogleLoading ? 'Connecting to Google OAuth...' : 'Continue with Google'}
        </button>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-200 w-full" />
          <span className="bg-white px-3 text-[11px] font-medium text-slate-400 uppercase tracking-wider whitespace-nowrap">
            or sign in with email
          </span>
          <div className="border-t border-slate-200 w-full" />
        </div>
      </div>

      <form onSubmit={handleLogin} className="space-y-4 mt-4">
        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1">
            College or Official Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="rollno@hitam.org"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold text-slate-700">
              Password
            </label>
            <Link href="/auth/recovery" className="text-[11px] text-teal-700 hover:text-navy-900 font-medium">
              Forgot Password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
            />
          </div>
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            variant="navy"
            size="md"
            isLoading={isLoading}
            className="w-full justify-center text-xs py-3 shadow-sm"
          >
            Sign In to Dashboard
          </Button>
        </div>
      </form>

      <div className="mt-6 pt-6 border-t border-slate-100 text-center">
        <p className="text-xs text-slate-500">
          Don&apos;t have an EDC account yet?{' '}
          <Link href="/auth/register" className="font-semibold text-teal-700 hover:text-navy-900 underline">
            Create Student Account
          </Link>
        </p>
      </div>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-grid-pattern">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-3 group mb-4">
          <div className="h-12 w-12 rounded-xl bg-white border border-slate-200 p-2 flex items-center justify-center shadow-subtle group-hover:border-navy-900 transition-all">
            <Image
              src="/images/brand/edc-logo.png"
              alt="EDC HITAM"
              width={40}
              height={40}
              className="object-contain"
            />
          </div>
        </Link>
        <h2 className="text-3xl font-extrabold text-navy-900 tracking-tight font-heading">
          Student & Founder Portal
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-slate-500">
          Access your conclave registration passes, makerspace bookings, and venture files
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <React.Suspense fallback={<div className="p-8 text-center text-xs text-slate-500">Loading sign in form...</div>}>
          <LoginFormContent />
        </React.Suspense>
      </div>
    </div>
  );
}
