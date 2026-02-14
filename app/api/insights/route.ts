import { NextResponse } from 'next/server';
import { detectPatterns, summarizeRework } from '@/lib/analytics';
import { getReworkEntries } from '@/lib/safe-data';

export async function GET() {
  const entries = await getReworkEntries();

import { prisma } from '@/lib/prisma';
import { detectPatterns, summarizeRework } from '@/lib/analytics';

export async function GET() {
  const entries = await prisma.reworkEntry.findMany();
  const summary = summarizeRework(entries);
  const insights = detectPatterns(entries);
  return NextResponse.json({ summary, insights });
}
