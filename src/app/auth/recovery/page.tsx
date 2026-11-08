'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Mail, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';

export default function PasswordRecoveryPage() {
  const [email, setEmail] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [isSuccess, setIsSuccess] = React.useState(false);

  const supabase = createClient();

  const handleRecovery = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (resetError) throw resetError;
      setIsSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to dispatch recovery instructions.');
    } finally {
      setIsLoading(false);
    }
  };

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
          Recover Account
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-slate-500">
          Enter your registered college or official email address to receive password reset instructions
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <Card className="border-slate-200 bg-white shadow-card rounded-2xl p-6 sm:p-8">
          {isSuccess ? (
            <div className="text-center py-6 space-y-4">
              <div className="inline-flex p-3 rounded-full bg-teal-50 border border-teal-200 text-teal-600">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-navy-900 font-heading">Recovery Email Sent</h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
                If an account exists for <strong>{email}</strong>, a password reset link has been dispatched. Please check your inbox and spam folder.
              </p>
              <div className="pt-2">
                <Link href="/auth/login">
                  <Button variant="navy" size="md" className="text-xs">
                    Back to Sign In
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleRecovery} className="space-y-4">
              {error && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Registered Email Address
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

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="navy"
                  size="md"
                  isLoading={isLoading}
                  className="w-full justify-center text-xs py-3 shadow-sm"
                >
                  Send Recovery Link
                </Button>
              </div>
            </form>
          )}

          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <Link href="/auth/login" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-navy-900">
              <ArrowLeft className="h-3.5 w-3.5" />
              Return to Login
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
