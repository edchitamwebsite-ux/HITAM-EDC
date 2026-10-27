'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Announcement } from '@/types';
import { 
  X, 
  Calendar, 
  Clock, 
  BellRing, 
  AlertTriangle, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface AnnouncementPopupProps {
  initialAnnouncement?: Announcement | null;
  userId?: string | null;
}

export function AnnouncementPopup({ initialAnnouncement, userId }: AnnouncementPopupProps) {
  const [announcement, setAnnouncement] = React.useState<Announcement | null>(initialAnnouncement || null);
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    // If no announcement provided via props, attempt to load active announcement
    if (!announcement) {
      loadActiveAnnouncement();
    } else {
      checkDismissal(announcement);
    }
  }, [announcement]);

  const loadActiveAnnouncement = async () => {
    try {
      const res = await fetch('/api/announcements/active');
      if (res.ok) {
        const data = await res.json();
        if (data && data.id) {
          setAnnouncement(data);
          checkDismissal(data);
        }
      }
    } catch (err) {
      console.warn('Could not load active announcement:', err);
    }
  };

  const checkDismissal = (item: Announcement) => {
    const dismissalKey = `edc_dismissed_announcement_${item.id}_v${item.version}`;
    const dismissed = localStorage.getItem(dismissalKey);

    if (item.repeat_policy === 'always_until_dismissed') {
      if (!dismissed) setIsOpen(true);
    } else if (item.repeat_policy === 'once_ever' || item.repeat_policy === 'on_version_update') {
      if (!dismissed) setIsOpen(true);
    } else if (item.repeat_policy === 'once_per_session') {
      const sessionDismissed = sessionStorage.getItem(dismissalKey);
      if (!sessionDismissed) setIsOpen(true);
    } else {
      if (!dismissed) setIsOpen(true);
    }
  };

  const handleDismiss = (remindLater: boolean = false) => {
    if (!announcement) return;
    const dismissalKey = `edc_dismissed_announcement_${announcement.id}_v${announcement.version}`;

    if (remindLater) {
      // Remind later: record only in sessionStorage so it can appear in next session
      sessionStorage.setItem(dismissalKey, 'remind_later');
    } else {
      // Permanent dismissal for this version
      localStorage.setItem(dismissalKey, new Date().toISOString());
    }

    setIsOpen(false);

    // If logged in, optionally sync to backend
    if (userId) {
      fetch('/api/announcements/dismiss', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          announcement_id: announcement.id,
          version: announcement.version,
        }),
      }).catch(() => {});
    }
  };

  if (!isOpen || !announcement) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm transition-opacity animate-fade-in"
        onClick={() => handleDismiss(false)}
        aria-hidden="true"
      />

      {/* Popup Modal Box */}
      <div 
        className="relative w-full max-w-lg rounded-3xl border border-slate-700 bg-slate-900 shadow-2xl p-6 sm:p-7 z-10 animate-scale-in text-slate-100 overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Decorative Top Accent Glow */}
        <div className={`absolute top-0 inset-x-0 h-1.5 ${announcement.is_urgent ? 'bg-red-500' : 'bg-gradient-to-r from-hitam-400 via-emerald-400 to-amber-400'}`} />

        {/* Close Button */}
        <button
          onClick={() => handleDismiss(false)}
          className="absolute right-4 top-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-hitam-400"
          aria-label="Close announcement"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Badges and Urgency */}
        <div className="flex items-center gap-2 mb-3">
          {announcement.is_urgent ? (
            <Badge variant="danger" className="gap-1 text-[11px]">
              <AlertTriangle className="h-3 w-3" />
              Urgent Notice
            </Badge>
          ) : (
            <Badge variant="hitam" className="gap-1 text-[11px]">
              <BellRing className="h-3 w-3 text-hitam-400" />
              EDC Announcement
            </Badge>
          )}

          {announcement.event && (
            <Badge variant="amber" className="text-[11px]">
              {announcement.event.category.replace('_', ' ')}
            </Badge>
          )}
        </div>

        {/* Optional Poster / Graphic */}
        {announcement.image_url && (
          <div className="relative w-full h-44 rounded-2xl overflow-hidden mb-4 border border-slate-800 bg-slate-950">
            <Image
              src={announcement.image_url}
              alt={announcement.title}
              fill
              className="object-cover"
            />
          </div>
        )}

        {/* Heading */}
        <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-snug">
          {announcement.title}
        </h3>

        {/* Message */}
        <p className="mt-2.5 text-sm text-slate-300 leading-relaxed">
          {announcement.message}
        </p>

        {/* Associated Event Quick Specs */}
        {announcement.event && (
          <div className="mt-4 p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex flex-wrap gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-hitam-400" />
              <span>{new Date(announcement.event.start_time).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-amber-400" />
              <span>Deadline: {new Date(announcement.event.registration_deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={() => handleDismiss(true)}
            className="text-xs text-slate-400 hover:text-slate-200 transition-colors py-2 px-3 order-2 sm:order-1"
          >
            Remind Me Later
          </button>

          <div className="flex items-center gap-2.5 w-full sm:w-auto order-1 sm:order-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDismiss(false)}
              className="flex-1 sm:flex-initial text-xs"
            >
              Dismiss
            </Button>

            {announcement.cta_url && (
              <Link 
                href={announcement.cta_url}
                onClick={() => handleDismiss(false)}
                className="flex-1 sm:flex-initial"
              >
                <Button variant="primary" size="sm" className="w-full text-xs gap-1.5">
                  {announcement.cta_label || 'View Details'}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
