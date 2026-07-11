import React, { useState } from 'react';
import { Activity, AlertTriangle, CheckCircle } from 'lucide-react';

const children = [
  { id: 1, name: 'Leo Martinez', dob: '2022-03-15', room: 'Toddlers', immunisation: 'Up to date', expiry: '2027-03-15', status: 'Current' },
  { id: 2, name: 'Emma Wilson', dob: '2021-07-22', room: 'Pre-Kindy', immunisation: 'Up to date', expiry: '2026-07-22', status: 'Current' },
  { id: 3, name: 'Noah Kim', dob: '2022-11-05', room: 'Toddlers', immunisation: 'Due for review', expiry: '2026-06-01', status: 'Due Soon' },
  { id: 4, name: 'Ava Chen', dob: '2020-05-18', room: 'Pre-Kindy', immunisation: 'Exemption', expiry: '-', status: 'Exemption' },
  { id: 5, name: 'Mia Johnson', dob: '2023-01-30', room: 'Babies', immunisation: 'Overdue', expiry: '2026-04-30', status: 'Overdue' },
];

const healthChecks = [
  { item: 'Medication Storage Audit', lastChecked: '2026-05-15', nextDue: '2026-06-15', status: 'Current' },
  { item: 'First Aid Kit Inspection', lastChecked: '2026-05-01', nextDue: '2026-06-01', status: 'Due Soon' },
  { item: 'Bathroom Hygiene Inspection', lastChecked: '2026-05-20', nextDue: '2026-05-27', status: 'Current' },
  { item: 'Food Safety Compliance Check', lastChecked: '2026-04-01', nextDue: '2026-05-01', status: 'Overdue' },
];

const statusColors: Record<string, string> = {
  'Current': 'bg-emerald-100 text-emerald-700',
  'Due Soon': 'bg-amber-100 text-amber-700',
  'Overdue': 'bg-red-100 text-red-700',
  'Exemption': 'bg-purple-100 text-purple-700',
};

export const HealthCompliance: React.FC = () => {
  const [tab, setTab] = useState<'immunisation' | 'checks'>('immunisation');

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
            <Activity className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Health Compliance</h1>
            <p className="text-slate-500 text-sm">Immunisation records and health checks</p>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {['Current', 'Due Soon', 'Overdue', 'Exemption'].map(s => (
            <div key={s} className="bg-white rounded-xl border border-slate-100 p-3 text-center">
              <div className="text-xl font-bold text-slate-800">{children.filter(c => c.status === s).length}</div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[s]}`}>{s}</span>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <button onClick={() => setTab('immunisation')} className={`px-4 py-2 text-sm rounded-lg font-medium transition-colors ${tab === 'immunisation' ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}>Immunisation Register</button>
          <button onClick={() => setTab('checks')} className={`px-4 py-2 text-sm rounded-lg font-medium transition-colors ${tab === 'checks' ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}>Health Checks</button>
        </div>

        {tab === 'immunisation' && (
          <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-xs text-slate-500 uppercase">
                <tr>
                  <th className="text-left px-4 py-3">Child</th>
                  <th className="text-left px-4 py-3">DOB</th>
                  <th className="text-left px-4 py-3">Room</th>
                  <th className="text-left px-4 py-3">Immunisation</th>
                  <th className="text-left px-4 py-3">Expiry</th>
                  <th className="text-left px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {children.map(c => (
                  <tr key={c.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-800">{c.name}</td>
                    <td className="px-4 py-3 text-slate-600">{c.dob}</td>
                    <td className="px-4 py-3 text-slate-600">{c.room}</td>
                    <td className="px-4 py-3 text-slate-600">{c.immunisation}</td>
                    <td className="px-4 py-3 text-slate-600">{c.expiry}</td>
                    <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[c.status]}`}>{c.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'checks' && (
          <div className="space-y-3">
            {healthChecks.map((h, i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-100 p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-800">{h.item}</p>
                  <p className="text-xs text-slate-500">Last checked: {h.lastChecked} · Next due: {h.nextDue}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[h.status]}`}>{h.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
