'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Lock, Mail, AlertCircle } from 'lucide-react';

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
    <Card className="border-slate-800 bg-slate-900/90 shadow-2xl p-6 sm:p-8">
      {error && (
        <div className="mb-5 p-3.5 rounded-xl bg-red-950/80 border border-red-500/40 text-xs text-red-200 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">
            College or Official Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="rollno@hitam.org"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-hitam-400"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold text-slate-300">
              Password
            </label>
            <Link href="/auth/recovery" className="text-[11px] text-hitam-400 hover:text-white">
              Forgot Password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-hitam-400"
            />
          </div>
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isLoading}
            className="w-full justify-center text-xs py-3 shadow-glow-sm"
          >
            Sign In to Dashboard
          </Button>
        </div>
      </form>

      <div className="mt-6 pt-6 border-t border-slate-800 text-center">
        <p className="text-xs text-slate-400">
          Don't have an EDC account yet?{' '}
          <Link href="/auth/register" className="font-semibold text-hitam-400 hover:text-white underline">
            Create Student Account
          </Link>
        </p>
      </div>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-grid-pattern">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-3 group mb-4">
          <div className="h-12 w-12 rounded-xl bg-hitam-950 border border-hitam-500/40 p-2 flex items-center justify-center group-hover:border-hitam-400">
            <Image
              src="/images/brand/edc-logo.png"
              alt="EDC HITAM"
              width={40}
              height={40}
              className="object-contain"
            />
          </div>
        </Link>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">
          Sign In to EDC HITAM
        </h2>
        <p className="mt-2 text-xs text-slate-400">
          Access your registered conclaves, startup drafts, and community network
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <React.Suspense fallback={<div className="text-center text-xs text-slate-400">Loading sign in...</div>}>
          <LoginFormContent />
        </React.Suspense>
      </div>
    </div>
  );
}
