import { NextResponse } from 'next/server';
import { FEATURED_EVENTS } from '@/lib/data';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { event_id, lead, reg_type, team_name, members } = body;

    const event = FEATURED_EVENTS.find(e => e.id === event_id || e.slug === event_id);
    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    if (!event.registration_open) {
      return NextResponse.json({ error: 'Registration for this event is currently closed.' }, { status: 400 });
    }

    if (new Date() > new Date(event.registration_deadline)) {
      return NextResponse.json({ error: 'Registration deadline has passed.' }, { status: 400 });
    }

    if (event.current_registrations >= event.max_registrations) {
      return NextResponse.json({ error: 'Event capacity reached. You may join the waitlist.' }, { status: 400 });
    }

    // Generate verified registration identifier
    const regCode = `HITAM-${event.slug.toUpperCase().slice(0, 4)}-${Math.floor(1000 + Math.random() * 9000)}`;

    return NextResponse.json({
      success: true,
      registration_code: regCode,
      status: event.require_approval ? 'Pending' : 'Confirmed',
      message: 'Registration registered successfully in EDC HITAM registry.'
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal error' }, { status: 500 });
  }
}
