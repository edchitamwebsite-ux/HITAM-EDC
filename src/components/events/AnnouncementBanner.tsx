'use client';

import * as React from 'react';
import Link from 'next/link';
import { Announcement } from '@/types';
import { BellRing, ArrowRight, X } from 'lucide-react';

interface AnnouncementBannerProps {
  announcements?: Announcement[];
}

export function AnnouncementBanner({ announcements = [] }: AnnouncementBannerProps) {
  const [isVisible, setIsVisible] = React.useState(true);

  if (!isVisible || announcements.length === 0) return null;

  const current = announcements[0];

  return (
    <div className={`relative px-4 py-2.5 text-xs text-center border-b transition-all ${
      current.is_urgent 
        ? 'bg-red-950/80 border-red-500/30 text-red-200' 
        : 'bg-hitam-950/80 border-hitam-500/30 text-hitam-200'
    }`}>
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-3">
        <span className="flex items-center gap-1.5 font-semibold">
          <BellRing className="h-3.5 w-3.5 text-hitam-400 shrink-0" />
          <span className="hidden sm:inline uppercase tracking-wider text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-700">
            {current.is_urgent ? 'Urgent Notice' : 'Announcement'}
          </span>
        </span>

        <span className="truncate max-w-xl font-medium">
          {current.title} — {current.message}
        </span>

        {current.cta_url && (
          <Link
            href={current.cta_url}
            className="inline-flex items-center gap-1 font-bold text-hitam-400 hover:text-white underline underline-offset-2 shrink-0 ml-1"
          >
            {current.cta_label || 'Learn More'}
            <ArrowRight className="h-3 w-3" />
          </Link>
        )}

        <button
          onClick={() => setIsVisible(false)}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white rounded"
          aria-label="Close banner"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
