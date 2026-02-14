'use client';

import { useEffect, useState } from 'react';

export function RoleSelector() {
  const [role, setRole] = useState('Viewer');

  useEffect(() => {
    const saved = localStorage.getItem('rcis-role') || 'Viewer';
    setRole(saved);
  }, []);

  const onChange = (value: string) => {
    setRole(value);
    localStorage.setItem('rcis-role', value);
  };

  return (
    <div className="mb-4 flex items-center gap-2">
      <label className="text-sm text-slate-300">Role:</label>
      <select className="input max-w-xs" value={role} onChange={(e) => onChange(e.target.value)}>
        <option>Viewer</option>
        <option>Admin</option>
      </select>
      <span className="text-xs text-slate-400">Admin required for create/update operations.</span>
    </div>
  );
}
