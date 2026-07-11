import React, { useState } from 'react';
import { Database, Filter } from 'lucide-react';

const events = [
  { id: 1, timestamp: '2026-05-24 09:45:12', user: 'amy.davis', action: 'Login', detail: 'Successful login from Safari/Mac', category: 'Auth' },
  { id: 2, timestamp: '2026-05-24 09:47:03', user: 'amy.davis', action: 'View', detail: 'Opened NQS Overview', category: 'Navigation' },
  { id: 3, timestamp: '2026-05-24 10:01:20', user: 'sarah.johnson', action: 'Create', detail: 'New observation added for Leo Martinez', category: 'Data' },
  { id: 4, timestamp: '2026-05-24 10:15:44', user: 'mark.chen', action: 'Update', detail: 'Updated staff roster for Wednesday', category: 'Data' },
  { id: 5, timestamp: '2026-05-24 10:22:08', user: 'amy.davis', action: 'Export', detail: 'Exported compliance report (PDF)', category: 'Export' },
  { id: 6, timestamp: '2026-05-23 14:32:15', user: 'sarah.johnson', action: 'Create', detail: 'Incident report submitted for Noah Kim', category: 'Data' },
  { id: 7, timestamp: '2026-05-23 11:08:40', user: 'amy.davis', action: 'Update', detail: 'Policy updated: Child Safe Environment Policy v3.3', category: 'Data' },
  { id: 8, timestamp: '2026-05-22 09:00:01', user: 'system', action: 'Backup', detail: 'Automatic daily backup completed (342MB)', category: 'System' },
];

const catColors: Record<string, string> = {
  Auth: 'bg-blue-100 text-blue-700',
  Navigation: 'bg-slate-100 text-slate-600',
  Data: 'bg-emerald-100 text-emerald-700',
  Export: 'bg-amber-100 text-amber-700',
  System: 'bg-purple-100 text-purple-700',
};

export const SystemAuditLog: React.FC = () => {
  const [filter, setFilter] = useState('All');
  const cats = ['All', 'Auth', 'Data', 'Export', 'System'];
  const filtered = filter === 'All' ? events : events.filter(e => e.category === filter);

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-200 rounded-xl flex items-center justify-center">
            <Database className="w-5 h-5 text-slate-600" />
          </div>
          <div><h1 className="text-2xl font-bold text-slate-800">System Audit Log</h1>
            <p className="text-slate-500 text-sm">Track all system events and user activity</p></div>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          {cats.map(c => <button key={c} onClick={() => setFilter(c)} className={`px-3 py-1.5 text-xs rounded-lg font-medium ${filter === c ? 'bg-slate-700 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}>{c}</button>)}
        </div>

        <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
          <table className="w-full text-sm font-mono">
            <thead className="bg-slate-800 text-xs text-slate-300 uppercase">
              <tr>
                <th className="text-left px-4 py-3">Timestamp</th>
                <th className="text-left px-4 py-3">User</th>
                <th className="text-left px-4 py-3">Action</th>
                <th className="text-left px-4 py-3">Detail</th>
                <th className="text-left px-4 py-3">Category</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(e => (
                <tr key={e.id} className="hover:bg-slate-50">
                  <td className="px-4 py-2.5 text-slate-500 text-xs">{e.timestamp}</td>
                  <td className="px-4 py-2.5 text-indigo-600 text-xs font-medium">{e.user}</td>
                  <td className="px-4 py-2.5 text-slate-700 font-semibold text-xs">{e.action}</td>
                  <td className="px-4 py-2.5 text-slate-600 text-xs font-sans">{e.detail}</td>
                  <td className="px-4 py-2.5"><span className={`text-xs px-2 py-0.5 rounded font-medium font-sans ${catColors[e.category]}`}>{e.category}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
