'use client';

import { FormEvent, useEffect, useState } from 'react';
import { RoleSelector } from '@/app/components/RoleSelector';

const stations = ['CVS', 'Loom', 'IGBT', 'SubAssembly', 'Testing'];

type KB = {
  id: number;
  station: string;
  defectType: string;
  problem: string;
  rootCause: string;
  correctiveAction: string;
  beforeAfterResults: string;
  imageUrl?: string;
  dateClosed: string;
};

export default function KnowledgePage() {
  const [list, setList] = useState<KB[]>([]);
  const [stationFilter, setStationFilter] = useState('');
  const [defectFilter, setDefectFilter] = useState('');

  async function load() {
    const query = new URLSearchParams();
    if (stationFilter) query.set('station', stationFilter);
    if (defectFilter) query.set('defectType', defectFilter);
    const res = await fetch(`/api/knowledge?${query.toString()}`);
    setList(await res.json());
  }

  useEffect(() => {
    load();
  }, [stationFilter, defectFilter]);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const payload = Object.fromEntries(new FormData(e.currentTarget).entries());
    const role = localStorage.getItem('rcis-role') || 'Viewer';
    const res = await fetch('/api/knowledge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-role': role },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      e.currentTarget.reset();
      load();
    }
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="mb-4 text-lg font-semibold">Knowledge Bank Module</h2>
        <RoleSelector />
        <form className="grid gap-3 md:grid-cols-2" onSubmit={submit}>
          <select name="station" className="input">{stations.map((s) => <option key={s}>{s}</option>)}</select>
          <input className="input" name="defectType" required placeholder="Defect Type" />
          <input className="input md:col-span-2" name="problem" required placeholder="Problem" />
          <input className="input" name="rootCause" required placeholder="Root Cause" />
          <input className="input" name="correctiveAction" required placeholder="Corrective Action" />
          <input className="input" name="beforeAfterResults" required placeholder="Before/After Results" />
          <input className="input" name="imageUrl" placeholder="Image URL" />
          <input className="input" name="dateClosed" type="date" required />
          <button className="rounded bg-accent px-4 py-2 font-semibold md:col-span-2">Save Knowledge Record</button>
        </form>
      </div>

      <div className="card">
        <div className="mb-3 flex gap-2">
          <select className="input max-w-40" value={stationFilter} onChange={(e) => setStationFilter(e.target.value)}>
            <option value="">All Stations</option>
            {stations.map((s) => <option key={s}>{s}</option>)}
          </select>
          <input className="input max-w-xs" placeholder="Search defect" value={defectFilter} onChange={(e) => setDefectFilter(e.target.value)} />
        </div>
        <div className="space-y-3">
          {list.map((k) => (
            <article key={k.id} className="rounded border border-slate-700 p-3">
              <p className="font-semibold">{k.defectType} • {k.station}</p>
              <p className="text-sm">Problem: {k.problem}</p>
              <p className="text-sm">Root Cause: {k.rootCause}</p>
              <p className="text-sm">Action: {k.correctiveAction}</p>
              <p className="text-sm">Results: {k.beforeAfterResults}</p>
              {k.imageUrl && <a className="text-accent underline" href={k.imageUrl}>Image</a>}
            </article>
          ))}
          {list.length === 0 && <p className="text-slate-400">No records found.</p>}
        </div>
      </div>
    </div>
  );
}
