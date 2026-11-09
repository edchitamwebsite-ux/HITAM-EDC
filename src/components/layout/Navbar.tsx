'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { 
  Menu, 
  X, 
  Sparkles, 
  Calendar, 
  Rocket, 
  Users, 
  Compass, 
  ShieldCheck, 
  UserCircle,
  LogOut
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface NavbarProps {
  userRole?: string | null;
  userEmail?: string | null;
}

export function Navbar({ userRole, userEmail }: NavbarProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = React.useState(false);
  const [isStudentLoggedIn, setIsStudentLoggedIn] = React.useState(false);
  const [currentUserName, setCurrentUserName] = React.useState<string | null>(null);
  const pathname = usePathname();

  React.useEffect(() => {
    if (typeof document !== 'undefined') {
      const hasAdminCookie = document.cookie.includes('edc_admin_auth=') && !document.cookie.includes('edc_admin_auth=;');
      const hasStudentCookie = document.cookie.includes('edc_student_auth=') && !document.cookie.includes('edc_student_auth=;');
      const savedUserStr = localStorage.getItem('edc_current_user');
      let parsedUser = null;
      if (savedUserStr) {
        try {
          parsedUser = JSON.parse(savedUserStr);
        } catch {}
      }

      const adminActive = hasAdminCookie || userRole === 'admin' || parsedUser?.role === 'admin';
      const studentActive = hasStudentCookie || Boolean(userEmail) || Boolean(parsedUser);

      setIsAdminLoggedIn(adminActive);
      setIsStudentLoggedIn(studentActive || adminActive);

      if (parsedUser?.fullName) {
        setCurrentUserName(parsedUser.fullName);
      } else if (userEmail) {
        setCurrentUserName(userEmail.split('@')[0]);
      }
    }
  }, [pathname, userRole, userEmail]);

  const handleSignOut = async () => {
    if (typeof document !== 'undefined') {
      document.cookie = 'edc_admin_auth=; path=/; max-age=0;';
      document.cookie = 'edc_student_auth=; path=/; max-age=0;';
      localStorage.removeItem('edc_current_user');
      try {
        const supabase = createClient();
        await supabase.auth.signOut();
      } catch {}
      setIsAdminLoggedIn(false);
      setIsStudentLoggedIn(false);
      setCurrentUserName(null);
      setIsOpen(false);
      window.location.href = '/';
    }
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/events', label: 'Events' },
    { href: '/startups', label: 'Startup Hub' },
    { href: '/opportunities', label: 'Opportunities' },
    { href: '/community', label: 'Community' },
    { href: '/team', label: 'Team' },
    { href: '/contact', label: 'Contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-navy-800 bg-navy-900 text-white shadow-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Official Logo Brand */}
          <Link href="/" className="flex items-center gap-3.5 group">
            <div className="relative h-11 w-11 rounded-xl bg-white p-1.5 flex items-center justify-center shadow-subtle transition-all group-hover:scale-105">
              <Image
                src="/images/brand/edc-logo.png"
                alt="EDC HITAM Logo"
                width={36}
                height={36}
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg text-white tracking-tight flex items-center gap-1.5 font-heading">
                EDC <span className="text-teal-400">HITAM</span>
              </span>
              <span className="text-[11px] text-slate-300 tracking-wider uppercase font-medium">
                Entrepreneurship Development Cell
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-colors ${
                    active
                      ? 'text-white bg-navy-800 border border-navy-700'
                      : 'text-slate-300 hover:text-white hover:bg-navy-800/60'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Right Actions */}
          <div className="hidden lg:flex items-center gap-2.5">
            {isAdminLoggedIn ? (
              <div className="flex items-center gap-2">
                <Link href="/admin">
                  <Button variant="secondary" size="sm" className="gap-1.5 text-xs text-amber-900 bg-amber-50 border-amber-200 hover:bg-amber-100 font-bold shadow-sm">
                    <ShieldCheck className="h-4 w-4 text-amber-700" />
                    Admin Console
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="outline" size="sm" className="gap-1.5 text-xs bg-navy-800 text-white border-navy-700 hover:bg-navy-700">
                    <UserCircle className="h-4 w-4 text-teal-400" />
                    Dashboard
                  </Button>
                </Link>
                <Link href="/startups/submit">
                  <Button variant="teal" size="sm" className="gap-1.5 text-xs">
                    <Sparkles className="h-3.5 w-3.5" />
                    Submit Idea
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleSignOut}
                  title="Sign Out"
                  className="px-2 text-xs text-slate-300 hover:text-white hover:bg-red-950/40 border-navy-700"
                >
                  <LogOut className="h-3.5 w-3.5 text-red-400" />
                </Button>
              </div>
            ) : isStudentLoggedIn ? (
              <div className="flex items-center gap-2">
                <Link href="/dashboard">
                  <Button variant="outline" size="sm" className="gap-1.5 text-xs bg-navy-800 text-white border-navy-700 hover:bg-navy-700">
                    <UserCircle className="h-4 w-4 text-teal-400" />
                    {currentUserName ? currentUserName.split(' ')[0] : 'Dashboard'}
                  </Button>
                </Link>
                <Link href="/startups/submit">
                  <Button variant="teal" size="sm" className="gap-1.5 text-xs">
                    <Sparkles className="h-3.5 w-3.5" />
                    Submit Idea
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleSignOut}
                  title="Sign Out"
                  className="px-2 text-xs text-slate-300 hover:text-white hover:bg-red-950/40 border-navy-700"
                >
                  <LogOut className="h-3.5 w-3.5 text-red-400" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm" className="text-xs text-slate-200 hover:text-white hover:bg-navy-800">
                    Sign In
                  </Button>
                </Link>
                <Link href="/events">
                  <Button variant="secondary" size="sm" className="gap-1.5 text-xs bg-navy-800 text-white border-navy-700 hover:bg-navy-700">
                    <Calendar className="h-3.5 w-3.5 text-teal-400" />
                    Events
                  </Button>
                </Link>
                <Link href="/startups/submit">
                  <Button variant="teal" size="sm" className="gap-1.5 text-xs">
                    <Sparkles className="h-3.5 w-3.5" />
                    Submit Idea
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-navy-800 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-400"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden border-b border-navy-800 bg-navy-950 px-4 pt-2 pb-6 space-y-3 animate-slide-up">
          <div className="grid grid-cols-2 gap-2 pt-2">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`px-3 py-2.5 rounded-lg text-xs font-semibold text-center transition-colors ${
                    active
                      ? 'text-white bg-navy-800 border border-navy-700'
                      : 'text-slate-300 hover:text-white hover:bg-navy-900'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="pt-4 border-t border-navy-800 flex flex-col gap-2.5">
            {isAdminLoggedIn ? (
              <>
                <Link href="/admin" onClick={() => setIsOpen(false)}>
                  <Button variant="secondary" className="w-full justify-center bg-amber-50 text-amber-900 border-amber-200 gap-2 font-bold">
                    <ShieldCheck className="h-4 w-4 text-amber-700" />
                    Admin Console
                  </Button>
                </Link>
                <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" className="w-full justify-center bg-navy-800 text-white border-navy-700 gap-2">
                    <UserCircle className="h-4 w-4 text-teal-400" />
                    Student Dashboard
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  onClick={handleSignOut} 
                  className="w-full justify-center border-red-900/60 bg-red-950/20 text-red-300 gap-2 text-xs"
                >
                  <LogOut className="h-3.5 w-3.5 text-red-400" />
                  Sign Out
                </Button>
              </>
            ) : isStudentLoggedIn ? (
              <>
                <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" className="w-full justify-center bg-navy-800 text-white border-navy-700 gap-2">
                    <UserCircle className="h-4 w-4 text-teal-400" />
                    Student Dashboard
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  onClick={handleSignOut} 
                  className="w-full justify-center border-red-900/60 bg-red-950/20 text-red-300 gap-2 text-xs"
                >
                  <LogOut className="h-3.5 w-3.5 text-red-400" />
                  Sign Out
                </Button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link href="/auth/login" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" className="w-full justify-center bg-navy-800 text-white border-navy-700 text-xs">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/register" onClick={() => setIsOpen(false)}>
                  <Button variant="secondary" className="w-full justify-center text-xs">
                    Register
                  </Button>
                </Link>
              </div>
            )}
            <Link href="/startups/submit" onClick={() => setIsOpen(false)}>
              <Button variant="teal" className="w-full justify-center gap-2 text-xs">
                <Sparkles className="h-4 w-4" />
                Submit Startup Idea
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
