import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getReworkEntries } from '@/lib/safe-data';

export async function GET() {
  const data = await getReworkEntries();
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const role = req.headers.get('x-role') ?? 'Viewer';
  if (role !== 'Admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await req.json();
  const created = await prisma.reworkEntry.create({
    data: {
      date: new Date(body.date),
      station: body.station,
      defectType: body.defectType,
      quantity: Number(body.quantity),
      shift: body.shift,
      operatorGroup: body.operatorGroup,
      materialBatch: body.materialBatch,
      suspectedRootCause: body.suspectedRootCause,
      severity: body.severity,
      remarks: body.remarks ?? null
    }
  });

  return NextResponse.json(created, { status: 201 });
}
