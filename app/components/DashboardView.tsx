'use client';

import Link from 'next/link';
import { BarChart, DoughnutChart, TrendChart } from './Charts';

type Props = {
  summary: {
    thisWeekTotal: number;
    monthlyTrend: { month: string; qty: number }[];
    stationPercent: { station: string; percent: number }[];
    topDefects: { defect: string; qty: number }[];
    shiftComparison: { shift: string; qty: number }[];
    severityDistribution: { severity: string; qty: number }[];
    recurring: { defect: string; count: number }[];
  };
  insights: string[];
  actionSummary: { overdue: number; closed: number; open: number };
  heatMap: Record<string, Record<string, number>>;
};

export function DashboardView({ summary, insights, actionSummary, heatMap }: Props) {
  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-4">
        <div className="card"><p className="text-xs text-slate-400">Total Rework (Week)</p><p className="text-3xl font-bold">{summary.thisWeekTotal}</p></div>
        <div className="card"><p className="text-xs text-slate-400">Overdue Actions</p><p className="text-3xl font-bold text-red-400">{actionSummary.overdue}</p></div>
        <div className="card"><p className="text-xs text-slate-400">Closed Actions</p><p className="text-3xl font-bold text-green-400">{actionSummary.closed}</p></div>
        <div className="card"><p className="text-xs text-slate-400">Open Actions</p><p className="text-3xl font-bold text-yellow-300">{actionSummary.open}</p></div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="card"><h3 className="mb-3 font-semibold">Monthly Trend</h3><TrendChart data={summary.monthlyTrend} /></div>
        <div className="card"><h3 className="mb-3 font-semibold">Station-wise Defect %</h3><BarChart data={summary.stationPercent} labelKey="station" valueKey="percent" title="Station %" /></div>
        <div className="card"><h3 className="mb-3 font-semibold">Top 3 Defects (Pareto)</h3><BarChart data={summary.topDefects} labelKey="defect" valueKey="qty" title="Defect Qty" /></div>
        <div className="card"><h3 className="mb-3 font-semibold">Shift Comparison</h3><BarChart data={summary.shiftComparison} labelKey="shift" valueKey="qty" title="Shift Qty" /></div>
        <div className="card"><h3 className="mb-3 font-semibold">Severity Distribution</h3><DoughnutChart data={summary.severityDistribution} labelKey="severity" valueKey="qty" title="Severity" /></div>

        <div className="card">
          <h3 className="mb-2 font-semibold">Recurrence Alerts</h3>
          {summary.recurring.length === 0 ? <p className="text-sm text-slate-400">No recurring defects this week.</p> : (
            <ul className="space-y-2 text-sm">
              {summary.recurring.map((r) => <li key={r.defect} className="rounded border border-amber-500 bg-amber-900/20 p-2">⚠ Recurring defect – {r.defect} appeared {r.count} times in 7 days. Review countermeasure.</li>)}
            </ul>
          )}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="card">
          <h3 className="mb-3 font-semibold">Root Cause Intelligence Insights</h3>
          <ul className="space-y-2 text-sm text-slate-200">
            {insights.length ? insights.map((i, idx) => <li key={idx}>• {i}</li>) : <li className="text-slate-400">Not enough data yet.</li>}
          </ul>
        </div>

        <div className="card">
          <h3 className="mb-3 font-semibold">Risk Heat Map (Station vs Severity)</h3>
          <div className="grid grid-cols-4 gap-2 text-xs">
            <div></div><div>Low</div><div>Medium</div><div>High</div>
            {Object.entries(heatMap).map(([station, sev]) => (
              <>
                <div key={`${station}-name`} className="font-semibold">{station}</div>
                {(['Low', 'Medium', 'High'] as const).map((level) => {
                  const value = sev[level] ?? 0;
                  const color = level === 'Low' ? 'bg-green-700/60' : level === 'Medium' ? 'bg-orange-600/60' : 'bg-red-700/70';
                  return <div key={`${station}-${level}`} className={`rounded p-2 text-center ${color}`}>{value}</div>;
                })}
              </>
            ))}
          </div>
        </div>
      </section>

      <section className="flex gap-3">
        <Link href="/api/export/excel" className="rounded bg-accent px-4 py-2 text-sm font-semibold text-white">Export Excel</Link>
        <Link href="/api/export/pdf" className="rounded border border-accent px-4 py-2 text-sm font-semibold text-accent">PDF Summary</Link>
      </section>
    </div>
  );
}
