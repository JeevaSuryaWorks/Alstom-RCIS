import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const station = searchParams.get('station') || undefined;
  const defectType = searchParams.get('defectType') || undefined;

  const data = await prisma.knowledgeBankEntry.findMany({
    where: {
      station: station as never,
      defectType: defectType ? { contains: defectType, mode: 'insensitive' } : undefined
    },
    orderBy: { dateClosed: 'desc' }
  });

  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const role = req.headers.get('x-role') ?? 'Viewer';
  if (role !== 'Admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await req.json();
  const created = await prisma.knowledgeBankEntry.create({
    data: {
      station: body.station,
      defectType: body.defectType,
      problem: body.problem,
      rootCause: body.rootCause,
      correctiveAction: body.correctiveAction,
      beforeAfterResults: body.beforeAfterResults,
      imageUrl: body.imageUrl ?? null,
      dateClosed: new Date(body.dateClosed)
    }
  });

  return NextResponse.json(created, { status: 201 });
}
