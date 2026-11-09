'use client';

import * as React from 'react';
import Link from 'next/link';
import { Announcement } from '@/types';
import { BellRing, ArrowRight, X } from 'lucide-react';

interface AnnouncementBannerProps {
  announcements?: Announcement[];
}

export function AnnouncementBanner({ announcements }: AnnouncementBannerProps) {
  const [current, setCurrent] = React.useState<Announcement | null>(announcements?.[0] || null);
  const [isVisible, setIsVisible] = React.useState(true);

  const checkAnnouncement = React.useCallback(() => {
    // 1. Check custom admin override
    const custom = localStorage.getItem('edc_custom_announcement');
    if (custom) {
      try {
        const parsed = JSON.parse(custom);
        if (parsed.is_active) {
          setCurrent(parsed);
          setIsVisible(true);
          return;
        } else {
          setCurrent(null);
          return;
        }
      } catch {
        // Fallback
      }
    }

    // 2. Fallback to API
    fetch('/api/announcements/active')
      .then(res => res.json())
      .then(data => {
        if (data && data.is_active) {
          setCurrent(data);
          setIsVisible(true);
        }
      })
      .catch(() => {});
  }, []);

  React.useEffect(() => {
    checkAnnouncement();

    const handleStorageChange = () => {
      checkAnnouncement();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('edc_announcement_updated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('edc_announcement_updated', handleStorageChange);
    };
  }, [checkAnnouncement]);

  if (!isVisible || !current || !current.is_active) return null;

  return (
    <div className={`announcement-banner relative px-4 py-2.5 text-xs text-center border-b transition-all ${
      current.is_urgent 
        ? 'bg-amber-50 border-amber-200 text-amber-900' 
        : 'bg-navy-950 border-navy-800 text-slate-200'
    }`}>
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-3">
        <span className="flex items-center gap-1.5 font-semibold">
          <BellRing className={`h-3.5 w-3.5 shrink-0 ${current.is_urgent ? 'text-amber-700' : 'text-teal-400'}`} />
          <span className={`hidden sm:inline uppercase tracking-wider text-[10px] px-2 py-0.5 rounded font-bold ${
            current.is_urgent 
              ? 'bg-amber-100 text-amber-800 border border-amber-300' 
              : 'bg-navy-900 text-slate-300 border border-navy-700'
          }`}>
            {current.is_urgent ? 'Urgent Notice' : 'Official Notice'}
          </span>
        </span>

        <span className="truncate max-w-xl font-medium">
          {current.title} — {current.message}
        </span>

        {current.cta_url && (
          <Link
            href={current.cta_url}
            className={`inline-flex items-center gap-1 font-bold underline underline-offset-2 shrink-0 ml-1 ${
              current.is_urgent ? 'text-amber-900 hover:text-black' : 'text-teal-400 hover:text-white'
            }`}
          >
            {current.cta_label || 'Learn More'}
            <ArrowRight className="h-3 w-3" />
          </Link>
        )}

        <button
          onClick={() => setIsVisible(false)}
          className={`absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded ${
            current.is_urgent ? 'text-amber-700 hover:text-amber-950' : 'text-slate-400 hover:text-white'
          }`}
          aria-label="Close banner"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
