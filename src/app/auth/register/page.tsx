'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Lock, Mail, User, Building, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();

  const [fullName, setFullName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [collegeName, setCollegeName] = React.useState('HITAM');
  const [department, setDepartment] = React.useState('CSE');
  const [graduationYear, setGraduationYear] = React.useState('2026');
  const [role, setRole] = React.useState<'attendee' | 'founder' | 'campus_ambassador'>('attendee');

  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [isSuccess, setIsSuccess] = React.useState(false);

  const supabase = createClient();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // 1. Sign up with Supabase GoTrue Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            college_name: collegeName,
            department: department,
            graduation_year: parseInt(graduationYear),
            role: role,
          },
        },
      });

      if (authError) throw authError;

      // 2. Insert or sync profile into public.users
      if (authData.user) {
        await supabase.from('users').upsert({
          auth_id: authData.user.id,
          email: email,
          full_name: fullName,
          college_name: collegeName,
          department: department,
          graduation_year: parseInt(graduationYear),
          role: role,
          is_hitam_student: collegeName.toLowerCase().includes('hitam'),
        });
      }

      setIsSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please verify your details.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-grid-pattern">
      <div className="sm:mx-auto sm:w-full sm:max-w-lg text-center">
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
          Create an EDC Account
        </h2>
        <p className="mt-2 text-xs text-slate-400">
          Join 18,500+ student innovators across the HITAM entrepreneurial network
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg px-4 sm:px-0">
        <Card className="border-slate-800 bg-slate-900/90 shadow-2xl p-6 sm:p-8">
          {isSuccess ? (
            <div className="text-center py-8 space-y-4 animate-scale-in">
              <div className="inline-flex p-3 rounded-full bg-hitam-950 border border-hitam-500/40 text-hitam-400">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold text-white">Account Created!</h3>
              <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
                We have registered your account. If email confirmation was requested, please check your inbox at <strong>{email}</strong>.
              </p>
              <div className="pt-2">
                <Link href="/auth/login">
                  <Button variant="primary" size="md" className="text-xs">
                    Sign In Now
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              {error && (
                <div className="p-3.5 rounded-xl bg-red-950/80 border border-red-500/40 text-xs text-red-200 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Candidate full name"
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-hitam-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    College Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. rollno@hitam.org"
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-hitam-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Create Password *
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-hitam-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Institution *
                  </label>
                  <input
                    type="text"
                    required
                    value={collegeName}
                    onChange={(e) => setCollegeName(e.target.value)}
                    placeholder="HITAM"
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-hitam-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Department *
                  </label>
                  <input
                    type="text"
                    required
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="CSE, ECE, etc."
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-hitam-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Graduation Year *
                  </label>
                  <input
                    type="number"
                    required
                    min="2024"
                    max="2032"
                    value={graduationYear}
                    onChange={(e) => setGraduationYear(e.target.value)}
                    placeholder="2026"
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-hitam-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Primary Profile Track
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('attendee')}
                    className={`py-2 px-3 rounded-lg text-xs font-medium text-center transition-all ${
                      role === 'attendee'
                        ? 'bg-hitam-600 text-white shadow-sm'
                        : 'bg-slate-950 text-slate-400 border border-slate-800'
                    }`}
                  >
                    Student Innovator
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('founder')}
                    className={`py-2 px-3 rounded-lg text-xs font-medium text-center transition-all ${
                      role === 'founder'
                        ? 'bg-hitam-600 text-white shadow-sm'
                        : 'bg-slate-950 text-slate-400 border border-slate-800'
                    }`}
                  >
                    Startup Founder
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('campus_ambassador')}
                    className={`py-2 px-3 rounded-lg text-xs font-medium text-center transition-all ${
                      role === 'campus_ambassador'
                        ? 'bg-hitam-600 text-white shadow-sm'
                        : 'bg-slate-950 text-slate-400 border border-slate-800'
                    }`}
                  >
                    Ambassador
                  </button>
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
                  Complete Registration
                </Button>
              </div>
            </form>
          )}

          <div className="mt-6 pt-6 border-t border-slate-800 text-center">
            <p className="text-xs text-slate-400">
              Already have an account?{' '}
              <Link href="/auth/login" className="font-semibold text-hitam-400 hover:text-white underline">
                Sign In
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
