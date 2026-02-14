import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import { getReworkEntries } from '@/lib/safe-data';

export async function GET() {
  const data = await getReworkEntries();
  const worksheet = XLSX.utils.json_to_sheet(
    data.map((e) => ({
      Date: e.date.toISOString().split('T')[0],
      Station: e.station,
      Defect: e.defectType,
      Quantity: e.quantity,
      Shift: e.shift,
      Batch: e.materialBatch,
      Severity: e.severity,
      RootCause: e.suspectedRootCause
    }))
  );
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Rework');
  const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="alstom-rcis-rework.xlsx"'
    }
  });
}
