import { NextResponse } from 'next/server';
import { z } from 'zod';
import { FEATURED_EVENTS } from '@/lib/data';

const RegisterSchema = z.object({
  event_id: z.string().min(1, 'Event ID is required'),
  reg_type: z.enum(['individual', 'team']),
  team_name: z.string().nullable().optional(),
  lead: z.object({
    name: z.string().min(2, 'Full name must be at least 2 characters'),
    email: z.string().email('Valid college email required'),
    phone: z.string().min(8, 'Valid contact number required'),
    college: z.string().default('HITAM'),
    department: z.string().default('General'),
    graduation_year: z.string().optional(),
  }),
  members: z.array(
    z.object({
      name: z.string(),
      email: z.string(),
      college: z.string().optional(),
    })
  ).optional().default([]),
});

export async function POST(request: Request) {
  try {
    const rawBody = await request.json();
    
    // Strict Schema Validation
    const parseResult = RegisterSchema.safeParse(rawBody);
    if (!parseResult.success) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: parseResult.error.flatten().fieldErrors 
        }, 
        { status: 422 }
      );
    }

    const { event_id, lead, reg_type, team_name, members } = parseResult.data;

    const event = FEATURED_EVENTS.find(e => e.id === event_id || e.slug === event_id);
    if (!event) {
      return NextResponse.json({ error: 'Event not found in EDC registry' }, { status: 404 });
    }

    if (!event.registration_open) {
      return NextResponse.json({ error: 'Registration for this conclave is currently closed.' }, { status: 400 });
    }

    if (new Date() > new Date(event.registration_deadline)) {
      return NextResponse.json({ error: 'Registration deadline has passed.' }, { status: 400 });
    }

    if (event.current_registrations >= event.max_registrations) {
      return NextResponse.json({ error: 'Event capacity reached. You may join the waitlist.' }, { status: 400 });
    }

    // Team validation
    if (reg_type === 'team' && (!team_name || team_name.trim().length === 0)) {
      return NextResponse.json({ error: 'Team name is required for team participation.' }, { status: 400 });
    }

    // Generate verified registration identifier
    const regCode = `HITAM-${event.slug.toUpperCase().slice(0, 4)}-${Math.floor(1000 + Math.random() * 9000)}`;

    return NextResponse.json({
      success: true,
      registration_code: regCode,
      status: event.require_approval ? 'Pending' : 'Confirmed',
      message: 'Registration confirmed successfully in EDC HITAM registry.'
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
