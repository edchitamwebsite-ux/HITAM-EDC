import { NextResponse } from 'next/server';
import { FEATURED_EVENTS } from '@/lib/data';
import { Announcement } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  const flagship = FEATURED_EVENTS[0]; // Concept Fusion 2026

  const activeAnnouncement: Announcement = {
    id: 'ann-concept-fusion-2026',
    event_id: flagship.id,
    title: 'Concept Fusion 2026 Registrations Open!',
    message: 'HITAM flagship multidisciplinary innovation conclave is now accepting team registrations. ₹2,50,000 in cash prizes, maker bay access, and angel reviews.',
    image_url: '/images/events/ConceptFusion-Poster.jpeg',
    cta_label: 'Register for Concept Fusion',
    cta_url: '/events/concept-fusion-2026',
    type: 'modal_popup',
    target_audience: 'all',
    repeat_policy: 'once_ever',
    version: 1,
    start_time: '2026-10-01T00:00:00Z',
    end_time: '2026-11-20T00:00:00Z',
    is_active: true,
    is_urgent: false,
    created_at: '2026-10-01T00:00:00Z',
    updated_at: '2026-10-15T00:00:00Z',
    event: flagship,
  };

  return NextResponse.json(activeAnnouncement);
}
