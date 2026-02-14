'use client';

import { FormEvent, useEffect, useState } from 'react';
import { RoleSelector } from '@/app/components/RoleSelector';

type Action = {
  id: number;
  defectType: string;
  actionDescription: string;
  responsiblePerson: string;
  targetDate: string;
  status: 'Open' | 'InProgress' | 'Closed';
  effectivenessReview?: string;
};

export default function ActionsPage() {
  const [actions, setActions] = useState<Action[]>([]);
  const [msg, setMsg] = useState('');

  async function load() {
    const res = await fetch('/api/actions');
    setActions(await res.json());
  }

  useEffect(() => {
    load();
  }, []);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const payload = Object.fromEntries(new FormData(e.currentTarget).entries());
    const role = localStorage.getItem('rcis-role') || 'Viewer';
    const res = await fetch('/api/actions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-role': role },
      body: JSON.stringify(payload)
    });

    setMsg(res.ok ? 'Corrective action created.' : 'Create failed. Admin role required.');
    if (res.ok) {
      e.currentTarget.reset();
      load();
    }
  }

  return (
    <div className="space-y-6">
      <div className="card max-w-4xl">
        <h2 className="mb-4 text-lg font-semibold">Corrective Action Tracker</h2>
        <RoleSelector />
        <form className="grid grid-cols-1 gap-3 md:grid-cols-2" onSubmit={submit}>
          <input className="input" name="defectType" required placeholder="Defect Type" />
          <input className="input" name="responsiblePerson" required placeholder="Responsible Person" />
          <input className="input md:col-span-2" name="actionDescription" required placeholder="Action Description" />
          <input className="input" name="targetDate" type="date" required />
          <select className="input" name="status"><option>Open</option><option>InProgress</option><option>Closed</option></select>
          <textarea className="input md:col-span-2" name="effectivenessReview" placeholder="Effectiveness Review" />
          <button className="rounded bg-accent px-4 py-2 font-semibold md:col-span-2">Add Action</button>
        </form>
        {msg && <p className="mt-2 text-sm">{msg}</p>}
      </div>

      <div className="card">
        <h3 className="mb-3 font-semibold">Action Status Board</h3>
        <div className="space-y-2 text-sm">
          {actions.map((a) => (
            <div key={a.id} className="rounded border border-slate-700 p-3">
              <div className="flex items-center justify-between">
                <p className="font-semibold">{a.defectType}</p>
                <span className={a.status === 'Closed' ? 'text-green-400' : a.status === 'InProgress' ? 'text-yellow-300' : 'text-red-400'}>{a.status}</span>
              </div>
              <p>{a.actionDescription}</p>
              <p className="text-slate-400">Owner: {a.responsiblePerson} | Target: {new Date(a.targetDate).toLocaleDateString()}</p>
            </div>
          ))}
          {actions.length === 0 && <p className="text-slate-400">No actions yet.</p>}
        </div>
      </div>
    </div>
  );
}
