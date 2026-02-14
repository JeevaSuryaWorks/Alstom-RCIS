import { NextResponse } from 'next/server';
import { detectPatterns, summarizeRework } from '@/lib/analytics';
import { getReworkEntries } from '@/lib/safe-data';

export const runtime = 'nodejs';

export async function GET() {
  const entries = await getReworkEntries();
  const summary = summarizeRework(entries);
  const insights = detectPatterns(entries);
  return NextResponse.json({ summary, insights });
}
