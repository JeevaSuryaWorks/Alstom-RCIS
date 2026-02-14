import { NextResponse } from 'next/server';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

import { summarizeRework } from '@/lib/analytics';
import { getReworkEntries } from '@/lib/safe-data';

export async function GET() {
  const entries = await getReworkEntries();

import { prisma } from '@/lib/prisma';
import { summarizeRework } from '@/lib/analytics';

export async function GET() {
  const entries = await prisma.reworkEntry.findMany();

  const summary = summarizeRework(entries);

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 800]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  page.drawText('Alstom RCIS - Summary Report', { x: 40, y: 760, size: 18, font, color: rgb(0.06, 0.65, 0.91) });
  page.drawText(`Weekly Rework Qty: ${summary.thisWeekTotal}`, { x: 40, y: 720, size: 12, font });
  page.drawText(`Top Defects: ${summary.topDefects.map((d) => `${d.defect} (${d.qty})`).join(', ') || 'None'}`, { x: 40, y: 700, size: 12, font });
  page.drawText(`Recurring Alerts: ${summary.recurring.map((r) => `${r.defect} (${r.count})`).join(', ') || 'None'}`, { x: 40, y: 680, size: 12, font });

  const bytes = await pdfDoc.save();
  return new NextResponse(Buffer.from(bytes), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="alstom-rcis-summary.pdf"'
    }
  });
}
