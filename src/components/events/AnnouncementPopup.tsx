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
  ArrowRight
} from 'lucide-react';

interface AnnouncementPopupProps {
  initialAnnouncement?: Announcement | null;
  userId?: string | null;
}

export function AnnouncementPopup({ initialAnnouncement, userId }: AnnouncementPopupProps) {
  const [announcement, setAnnouncement] = React.useState<Announcement | null>(initialAnnouncement || null);
  const [isOpen, setIsOpen] = React.useState(false);

  const checkDismissal = React.useCallback((item: Announcement) => {
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
  }, []);

  const loadActiveAnnouncement = React.useCallback(async () => {
    try {
      // 1. Check custom admin configuration first
      const custom = localStorage.getItem('edc_custom_announcement');
      if (custom) {
        try {
          const parsed = JSON.parse(custom);
          if (parsed && parsed.is_active) {
            setAnnouncement(parsed);
            checkDismissal(parsed);
            return;
          } else {
            // Explicitly disabled by admin
            setAnnouncement(null);
            return;
          }
        } catch {
          // Fall through to API
        }
      }

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
  }, [checkDismissal]);

  React.useEffect(() => {
    if (!announcement) {
      loadActiveAnnouncement();
    } else {
      checkDismissal(announcement);
    }

    const handleUpdate = () => {
      loadActiveAnnouncement();
    };

    window.addEventListener('storage', handleUpdate);
    window.addEventListener('edc_announcement_updated', handleUpdate);

    return () => {
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('edc_announcement_updated', handleUpdate);
    };
  }, [announcement, loadActiveAnnouncement, checkDismissal]);

  const handleDismiss = (remindLater: boolean = false) => {
    if (!announcement) return;
    const dismissalKey = `edc_dismissed_announcement_${announcement.id}_v${announcement.version}`;

    if (remindLater) {
      sessionStorage.setItem(dismissalKey, 'remind_later');
    } else {
      localStorage.setItem(dismissalKey, new Date().toISOString());
    }

    setIsOpen(false);

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
    <div className="announcement-popup fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-navy-950/70 backdrop-blur-sm transition-opacity animate-fade-in"
        onClick={() => handleDismiss(false)}
        aria-hidden="true"
      />

      {/* Popup Modal Box */}
      <div 
        className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-modal p-6 sm:p-7 z-10 animate-scale-in text-slate-800 overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Top Accent Bar */}
        <div className={`absolute top-0 inset-x-0 h-1.5 ${announcement.is_urgent ? 'bg-amber-600' : 'bg-teal-600'}`} />

        {/* Close Button */}
        <button
          onClick={() => handleDismiss(false)}
          className="absolute right-4 top-4 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-navy-900"
          aria-label="Close announcement"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Badges */}
        <div className="flex items-center gap-2 mb-3">
          {announcement.is_urgent ? (
            <Badge variant="amber" className="gap-1 text-[11px]">
              <AlertTriangle className="h-3 w-3" />
              Urgent Notice
            </Badge>
          ) : (
            <Badge variant="teal" className="gap-1 text-[11px]">
              <BellRing className="h-3 w-3" />
              EDC Official Notice
            </Badge>
          )}

          {announcement.event && (
            <Badge variant="default" className="text-[11px]">
              {announcement.event.category.replace('_', ' ')}
            </Badge>
          )}
        </div>

        {/* Optional Poster Image */}
        {announcement.image_url && (
          <div className="relative w-full h-44 rounded-xl overflow-hidden mb-4 border border-slate-200 bg-slate-100">
            <Image
              src={announcement.image_url}
              alt={announcement.title}
              fill
              className="object-cover"
            />
          </div>
        )}

        {/* Heading */}
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-snug font-heading">
          {announcement.title}
        </h3>

        {/* Message */}
        <p className="mt-2.5 text-sm text-slate-600 leading-relaxed">
          {announcement.message}
        </p>

        {/* Associated Event Metadata */}
        {announcement.event && (
          <div className="mt-4 p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap gap-4 text-xs text-slate-600">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-teal-600" />
              <span>{new Date(announcement.event.start_time).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-amber-600" />
              <span>Deadline: {new Date(announcement.event.registration_deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={() => handleDismiss(true)}
            className="text-xs text-slate-500 hover:text-slate-800 transition-colors py-2 px-3 order-2 sm:order-1 font-medium"
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
