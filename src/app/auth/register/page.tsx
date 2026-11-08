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
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-grid-pattern">
      <div className="sm:mx-auto sm:w-full sm:max-w-lg text-center">
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
          Create an EDC Account
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-slate-500">
          Join 18,500+ student innovators across the HITAM entrepreneurial network
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg px-4 sm:px-0">
        <Card className="border-slate-200 bg-white shadow-card rounded-2xl p-6 sm:p-8">
          {isSuccess ? (
            <div className="text-center py-8 space-y-4">
              <div className="inline-flex p-3 rounded-full bg-teal-50 border border-teal-200 text-teal-600">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold text-navy-900 font-heading">Account Created!</h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
                We have registered your account. If email confirmation was requested, please check your inbox at <strong>{email}</strong>.
              </p>
              <div className="pt-2">
                <Link href="/auth/login">
                  <Button variant="navy" size="md" className="text-xs">
                    Sign In Now
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              {error && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Candidate full name"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="rollno@hitam.org"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Password (min 8 characters) *
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    College / Institute *
                  </label>
                  <input
                    type="text"
                    required
                    value={collegeName}
                    onChange={(e) => setCollegeName(e.target.value)}
                    placeholder="HITAM / Other Institute"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Branch / Department *
                  </label>
                  <input
                    type="text"
                    required
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="e.g. CSE, ECE, MECH"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Graduation Year
                  </label>
                  <select
                    value={graduationYear}
                    onChange={(e) => setGraduationYear(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                  >
                    <option value="2025">2025</option>
                    <option value="2026">2026</option>
                    <option value="2027">2027</option>
                    <option value="2028">2028</option>
                    <option value="2029">2029</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Platform Role
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                  >
                    <option value="attendee">Student Attendee / Participant</option>
                    <option value="founder">Student Founder / Builder</option>
                    <option value="campus_ambassador">Campus Ambassador</option>
                  </select>
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
                  Create Student Account
                </Button>
              </div>
            </form>
          )}

          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              Already have an account?{' '}
              <Link href="/auth/login" className="font-semibold text-teal-700 hover:text-navy-900 underline">
                Sign In
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
