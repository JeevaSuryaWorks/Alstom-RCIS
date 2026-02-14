'use client';

import { FormEvent, useState } from 'react';
import { RoleSelector } from '@/app/components/RoleSelector';

const stations = ['CVS', 'Loom', 'IGBT', 'SubAssembly', 'Testing'];

export default function ReworkEntryPage() {
  const [message, setMessage] = useState('');

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData.entries());
    const role = localStorage.getItem('rcis-role') || 'Viewer';

    const res = await fetch('/api/rework', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-role': role },
      body: JSON.stringify(payload)
    });

    setMessage(res.ok ? 'Rework entry logged successfully.' : 'Save failed. Ensure Admin role is selected.');
    if (res.ok) e.currentTarget.reset();
  }

  return (
    <div className="card max-w-3xl">
      <h2 className="mb-4 text-lg font-semibold">Rework Entry Module</h2>
      <RoleSelector />
      <form className="grid grid-cols-1 gap-4 md:grid-cols-2" onSubmit={onSubmit}>
        <div><label className="label">Date</label><input required name="date" type="date" className="input" /></div>
        <div><label className="label">Station</label><select required name="station" className="input">{stations.map((s) => <option key={s}>{s}</option>)}</select></div>
        <div><label className="label">Defect Type</label><input required name="defectType" className="input" /></div>
        <div><label className="label">Quantity</label><input required name="quantity" type="number" min={1} className="input" /></div>
        <div><label className="label">Shift</label><select required name="shift" className="input"><option>Day</option><option>Night</option></select></div>
        <div><label className="label">Operator Group</label><input required name="operatorGroup" className="input" /></div>
        <div><label className="label">Material Batch</label><input required name="materialBatch" className="input" /></div>
        <div><label className="label">Suspected Root Cause</label><input required name="suspectedRootCause" className="input" /></div>
        <div><label className="label">Severity</label><select required name="severity" className="input"><option>Low</option><option>Medium</option><option>High</option></select></div>
        <div className="md:col-span-2"><label className="label">Remarks</label><textarea name="remarks" className="input" /></div>
        <div className="md:col-span-2"><button className="rounded bg-accent px-4 py-2 font-semibold">Submit Rework</button></div>
      </form>
      {message && <p className="mt-3 text-sm text-slate-300">{message}</p>}
    </div>
  );
}
