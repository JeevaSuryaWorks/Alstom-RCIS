import { CorrectiveAction, ReworkEntry } from '@prisma/client';
import { startOfWeek, subDays } from 'date-fns';

export function summarizeRework(entries: ReworkEntry[]) {
  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const thisWeekTotal = entries
    .filter((e) => new Date(e.date) >= weekStart)
    .reduce((sum, e) => sum + e.quantity, 0);

  const monthly = new Map<string, number>();
  entries.forEach((e) => {
    const d = new Date(e.date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    monthly.set(key, (monthly.get(key) ?? 0) + e.quantity);
  });

  const stationTotals = new Map<string, number>();
  const defectTotals = new Map<string, number>();
  const shiftTotals = new Map<string, number>();
  const severityTotals = new Map<string, number>();

  entries.forEach((e) => {
    stationTotals.set(e.station, (stationTotals.get(e.station) ?? 0) + e.quantity);
    defectTotals.set(e.defectType, (defectTotals.get(e.defectType) ?? 0) + e.quantity);
    shiftTotals.set(e.shift, (shiftTotals.get(e.shift) ?? 0) + e.quantity);
    severityTotals.set(e.severity, (severityTotals.get(e.severity) ?? 0) + e.quantity);
  });

  const totalQty = entries.reduce((s, e) => s + e.quantity, 0) || 1;

  const stationPercent = [...stationTotals.entries()].map(([station, qty]) => ({
    station,
    percent: Number(((qty / totalQty) * 100).toFixed(1))
  }));

  const topDefects = [...defectTotals.entries()]
    .map(([defect, qty]) => ({ defect, qty }))
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 3);

  const recurrenceCutoff = subDays(now, 7);
  const recurrenceMap = new Map<string, number>();
  entries
    .filter((e) => new Date(e.date) >= recurrenceCutoff)
    .forEach((e) => recurrenceMap.set(e.defectType, (recurrenceMap.get(e.defectType) ?? 0) + 1));

  const recurring = [...recurrenceMap.entries()]
    .filter(([, count]) => count > 3)
    .map(([defect, count]) => ({ defect, count }));

  return {
    thisWeekTotal,
    monthlyTrend: [...monthly.entries()].map(([month, qty]) => ({ month, qty })),
    stationPercent,
    topDefects,
    shiftComparison: [...shiftTotals.entries()].map(([shift, qty]) => ({ shift, qty })),
    severityDistribution: [...severityTotals.entries()].map(([severity, qty]) => ({ severity, qty })),
    recurring
  };
}

export function detectPatterns(entries: ReworkEntry[]) {
  const pairCount = (key: (e: ReworkEntry) => string, defect: string) =>
    entries.filter((e) => e.defectType === defect).reduce((acc, e) => {
      const k = key(e);
      acc.set(k, (acc.get(k) ?? 0) + 1);
      return acc;
    }, new Map<string, number>());

  const defects = [...new Set(entries.map((e) => e.defectType))];
  const insights: string[] = [];

  defects.forEach((defect) => {
    const byShift = pairCount((e) => e.shift, defect);
    const shiftTotal = [...byShift.values()].reduce((a, b) => a + b, 0);
    const topShift = [...byShift.entries()].sort((a, b) => b[1] - a[1])[0];
    if (topShift && shiftTotal > 0) {
      insights.push(`${defect} ${Math.round((topShift[1] / shiftTotal) * 100)}% linked to ${topShift[0]} Shift`);
    }

    const byStation = pairCount((e) => e.station, defect);
    const topStation = [...byStation.entries()].sort((a, b) => b[1] - a[1])[0];
    if (topStation) {
      insights.push(`${defect} mostly occurring at ${topStation[0]} station`);
    }

    const byBatch = pairCount((e) => e.materialBatch, defect);
    const topBatch = [...byBatch.entries()].sort((a, b) => b[1] - a[1])[0];
    if (topBatch && topBatch[1] >= 2) {
      insights.push(`${defect} spike after Batch ${topBatch[0]}`);
    }
  });

  return insights.slice(0, 8);
}

export function correctiveSummary(actions: CorrectiveAction[]) {
  const now = new Date();
  return {
    overdue: actions.filter((a) => a.status !== 'Closed' && new Date(a.targetDate) < now).length,
    closed: actions.filter((a) => a.status === 'Closed').length,
    open: actions.filter((a) => a.status === 'Open' || a.status === 'InProgress').length
  };
}
