import { DashboardView } from './components/DashboardView';
import { correctiveSummary, detectPatterns, summarizeRework } from '@/lib/analytics';
import { getCorrectiveActions, getReworkEntries } from '@/lib/safe-data';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const [entries, actions] = await Promise.all([
    getReworkEntries(),
    getCorrectiveActions()

import { prisma } from '@/lib/prisma';
import { correctiveSummary, detectPatterns, summarizeRework } from '@/lib/analytics';

export default async function DashboardPage() {
  const [entries, actions] = await Promise.all([
    prisma.reworkEntry.findMany({ orderBy: { date: 'desc' } }),
    prisma.correctiveAction.findMany()

  ]);

  const summary = summarizeRework(entries);
  const insights = detectPatterns(entries);
  const actionSummary = correctiveSummary(actions);

  const heatMap = entries.reduce<Record<string, Record<string, number>>>((acc, e) => {
    acc[e.station] ??= { Low: 0, Medium: 0, High: 0 };
    acc[e.station][e.severity] = (acc[e.station][e.severity] ?? 0) + e.quantity;
    return acc;
  }, {});

  return <DashboardView summary={summary} insights={insights} actionSummary={actionSummary} heatMap={heatMap} />;
}
