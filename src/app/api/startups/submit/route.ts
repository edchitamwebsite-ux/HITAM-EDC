import { NextResponse } from 'next/server';
import { z } from 'zod';

const StartupSubmitSchema = z.object({
  name: z.string().min(2, 'Startup or project name is required (min 2 chars)'),
  tagline: z.string().min(5, 'Elevator tagline is required (min 5 chars)'),
  problem: z.string().min(10, 'Problem description must be at least 10 characters'),
  solution: z.string().min(10, 'Solution description must be at least 10 characters'),
  target_audience: z.string().optional().default('General Market'),
  sector: z.string().default('AgriTech'),
  stage: z.string().default('Ideation'),
  founder_names: z.union([z.array(z.string()), z.string()]).optional().default([]),
  skills_needed: z.union([z.array(z.string()), z.string()]).optional().default([]),
  deck_url: z.string().url('Must be a valid URL').or(z.literal('')).optional(),
});

export async function POST(request: Request) {
  try {
    const rawBody = await request.json();
    
    // Strict Schema Validation
    const parseResult = StartupSubmitSchema.safeParse(rawBody);
    if (!parseResult.success) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: parseResult.error.flatten().fieldErrors 
        }, 
        { status: 422 }
      );
    }

    const validData = parseResult.data;

    return NextResponse.json({
      success: true,
      message: 'Venture idea successfully logged into EDC Catalyst Cohort registry.',
      id: `st-${Date.now()}`,
      data: validData
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
