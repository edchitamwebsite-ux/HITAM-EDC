import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { announcement_id, version } = body;
    // Log or persist dismissal for analytics
    return NextResponse.json({ success: true, dismissed: announcement_id, version });
  } catch (err) {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}
