import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

import { getCorrectiveActions } from '@/lib/safe-data';

export async function GET() {
  const data = await getCorrectiveActions();

export async function GET() {
  const data = await prisma.correctiveAction.findMany({ orderBy: { targetDate: 'asc' } });
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const role = req.headers.get('x-role') ?? 'Viewer';
  if (role !== 'Admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await req.json();
  const created = await prisma.correctiveAction.create({
    data: {
      defectType: body.defectType,
      actionDescription: body.actionDescription,
      responsiblePerson: body.responsiblePerson,
      targetDate: new Date(body.targetDate),
      status: body.status,
      effectivenessReview: body.effectivenessReview ?? null
    }
  });

  return NextResponse.json(created, { status: 201 });
}
