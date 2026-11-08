'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Lock, Mail, AlertCircle, Sparkles } from 'lucide-react';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get('next') || '/dashboard';

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const supabase = createClient();

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
      document.cookie = 'edc_admin_auth=true; path=/; max-age=86400; SameSite=Lax';
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
        const { data: profile } = await supabase
          .from('users')
          .select('role')
          .eq('auth_id', data.user.id)
          .single();

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

      <form onSubmit={handleLogin} className="space-y-4">
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
