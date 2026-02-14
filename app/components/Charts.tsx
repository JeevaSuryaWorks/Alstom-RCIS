'use client';

import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend, LineElement, PointElement);

const commonOptions = {
  plugins: { legend: { labels: { color: '#cbd5e1' } } },
  scales: {
    x: { ticks: { color: '#cbd5e1' }, grid: { color: '#334155' } },
    y: { ticks: { color: '#cbd5e1' }, grid: { color: '#334155' } }
  }
};

export function TrendChart({ data }: { data: { month: string; qty: number }[] }) {
  return (
    <Line
      data={{
        labels: data.map((d) => d.month),
        datasets: [{ label: 'Monthly Rework', data: data.map((d) => d.qty), borderColor: '#0EA5E9', backgroundColor: '#0EA5E9' }]
      }}
      options={commonOptions}
    />
  );
}

export function BarChart({
  data,
  labelKey,
  valueKey,
  title
}: {
  data: Record<string, string | number>[];
  labelKey: string;
  valueKey: string;
  title: string;
}) {
  return (
    <Bar
      data={{
        labels: data.map((d) => String(d[labelKey])),
        datasets: [{ label: title, data: data.map((d) => Number(d[valueKey])), backgroundColor: '#0EA5E9' }]
      }}
      options={commonOptions}
    />
  );
}

export function DoughnutChart({
  data,
  labelKey,
  valueKey,
  title
}: {
  data: Record<string, string | number>[];
  labelKey: string;
  valueKey: string;
  title: string;
}) {
  return (
    <Doughnut
      data={{
        labels: data.map((d) => String(d[labelKey])),
        datasets: [
          {
            label: title,
            data: data.map((d) => Number(d[valueKey])),
            backgroundColor: ['#0EA5E9', '#1E3A5A', '#f59e0b', '#ef4444', '#22c55e']
          }
        ]
      }}
      options={{ plugins: { legend: { labels: { color: '#cbd5e1' } } } }}
    />
  );
}
