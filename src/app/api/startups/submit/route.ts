import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, tagline, problem, solution, sector, stage, founder_names } = body;

    if (!name || !problem || !solution) {
      return NextResponse.json({ error: 'Missing required venture information' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: 'Venture idea logged for Catalyst Cohort review.',
      id: `st-${Date.now()}`
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
