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
  UserCircle 
} from 'lucide-react';

interface NavbarProps {
  userRole?: string | null;
  userEmail?: string | null;
}

export function Navbar({ userRole, userEmail }: NavbarProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const pathname = usePathname();

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
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative h-11 w-11 rounded-xl bg-hitam-950 border border-hitam-500/40 p-1.5 flex items-center justify-center transition-all group-hover:border-hitam-400 group-hover:shadow-glow-sm">
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
              <span className="font-extrabold text-lg text-white tracking-tight flex items-center gap-1.5">
                EDC <span className="text-hitam-400">HITAM</span>
              </span>
              <span className="text-[10px] text-slate-400 tracking-wider uppercase font-medium">
                Doing Engineering The Experiential Way
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
                  className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                    active
                      ? 'text-hitam-400 bg-hitam-950/60 border border-hitam-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Right Actions */}
          <div className="hidden lg:flex items-center gap-3">
            {userEmail ? (
              <div className="flex items-center gap-2">
                {userRole === 'admin' && (
                  <Link href="/admin">
                    <Button variant="secondary" size="sm" className="gap-1.5 text-xs text-amber-300 border-amber-500/30">
                      <ShieldCheck className="h-4 w-4 text-amber-400" />
                      Admin Console
                    </Button>
                  </Link>
                )}
                <Link href="/dashboard">
                  <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                    <UserCircle className="h-4 w-4 text-hitam-400" />
                    Dashboard
                  </Button>
                </Link>
                <Link href="/startups/submit">
                  <Button variant="primary" size="sm" className="gap-1.5 text-xs">
                    <Sparkles className="h-3.5 w-3.5" />
                    Submit Idea
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm" className="text-xs">
                    Sign In
                  </Button>
                </Link>
                <Link href="/events">
                  <Button variant="secondary" size="sm" className="gap-1.5 text-xs">
                    <Calendar className="h-3.5 w-3.5 text-hitam-400" />
                    Events
                  </Button>
                </Link>
                <Link href="/startups/submit">
                  <Button variant="primary" size="sm" className="gap-1.5 text-xs">
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
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-colors focus:outline-none focus:ring-2 focus:ring-hitam-400"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden border-b border-slate-800 bg-slate-950 px-4 pt-2 pb-6 space-y-3 animate-slide-up">
          <div className="grid grid-cols-2 gap-2 pt-2">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`px-3 py-2.5 rounded-xl text-sm font-medium text-center transition-colors ${
                    active
                      ? 'text-hitam-400 bg-hitam-950 border border-hitam-500/40'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-800/80 flex flex-col gap-2.5">
            {userEmail ? (
              <>
                {userRole === 'admin' && (
                  <Link href="/admin" onClick={() => setIsOpen(false)}>
                    <Button variant="secondary" className="w-full justify-center text-amber-300 border-amber-500/30 gap-2">
                      <ShieldCheck className="h-4 w-4 text-amber-400" />
                      Admin Console
                    </Button>
                  </Link>
                )}
                <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" className="w-full justify-center gap-2">
                    <UserCircle className="h-4 w-4 text-hitam-400" />
                    Student Dashboard
                  </Button>
                </Link>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link href="/auth/login" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" className="w-full justify-center">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/register" onClick={() => setIsOpen(false)}>
                  <Button variant="secondary" className="w-full justify-center">
                    Register
                  </Button>
                </Link>
              </div>
            )}
            <Link href="/startups/submit" onClick={() => setIsOpen(false)}>
              <Button variant="primary" className="w-full justify-center gap-2">
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
