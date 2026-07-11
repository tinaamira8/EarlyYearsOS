import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, Clock, Filter } from 'lucide-react';
import { usePersistedState } from '../hooks/usePersistedState';

const initialAlerts = [
  { id: 1, item: 'First Aid Certificate - Sarah Johnson', category: 'Staff', status: 'Overdue', due: '2026-04-15', staff: 'Sarah Johnson' },
  { id: 2, item: 'Fire Drill Record', category: 'Safety', status: 'Due Soon', due: '2026-06-01', staff: 'Director' },
  { id: 3, item: 'WWCC Renewal - Mark Chen', category: 'Staff', status: 'Due Soon', due: '2026-06-20', staff: 'Mark Chen' },
  { id: 4, item: 'Immunisation Register Update', category: 'Health', status: 'Overdue', due: '2026-05-01', staff: 'Admin' },
  { id: 5, item: 'Policy Review - Child Safe Policy', category: 'Policy', status: 'Due Soon', due: '2026-07-01', staff: 'Director' },
  { id: 6, item: 'Anaphylaxis Management Plan - Leo M.', category: 'Health', status: 'Overdue', due: '2026-05-10', staff: 'Admin' },
  { id: 7, item: 'Staff Ratio Compliance Log', category: 'Staffing', status: 'Compliant', due: '2026-12-31', staff: 'Director' },
  { id: 8, item: 'Risk Assessment Review', category: 'Safety', status: 'Compliant', due: '2026-09-01', staff: 'Director' },
];

const statusConfig: Record<string, { color: string; icon: React.ReactNode }> = {
  'Overdue': { color: 'bg-red-100 text-red-700', icon: <AlertTriangle className="w-3.5 h-3.5" /> },
  'Due Soon': { color: 'bg-amber-100 text-amber-700', icon: <Clock className="w-3.5 h-3.5" /> },
  'Compliant': { color: 'bg-emerald-100 text-emerald-700', icon: <CheckCircle className="w-3.5 h-3.5" /> },
};

export const ComplianceAlerts: React.FC = () => {
  const [filter, setFilter] = useState('All');
  const filtered = filter === 'All' ? initialAlerts : initialAlerts.filter(a => a.status === filter);

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Compliance Alerts</h1>
            <p className="text-slate-500 text-sm">Track and manage compliance obligations</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {['Overdue', 'Due Soon', 'Compliant'].map(s => (
            <div key={s} className={`rounded-xl p-4 border text-center cursor-pointer transition-all ${filter === s ? 'ring-2 ring-indigo-500' : ''} bg-white border-slate-100`} onClick={() => setFilter(filter === s ? 'All' : s)}>
              <div className="text-2xl font-bold text-slate-800">{initialAlerts.filter(a => a.status === s).length}</div>
              <div className={`text-xs font-medium mt-1 px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${statusConfig[s].color}`}>
                {statusConfig[s].icon} {s}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
          <div className="flex items-center gap-2 p-4 border-b border-slate-100">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-sm font-medium text-slate-700">Showing: {filter}</span>
            {filter !== 'All' && <button onClick={() => setFilter('All')} className="text-xs text-indigo-600 ml-auto">Clear filter</button>}
          </div>
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs text-slate-500 uppercase">
              <tr>
                <th className="text-left px-4 py-3">Item</th>
                <th className="text-left px-4 py-3">Category</th>
                <th className="text-left px-4 py-3">Due Date</th>
                <th className="text-left px-4 py-3">Assigned</th>
                <th className="text-left px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(alert => (
                <tr key={alert.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-800">{alert.item}</td>
                  <td className="px-4 py-3 text-slate-600">{alert.category}</td>
                  <td className="px-4 py-3 text-slate-600">{alert.due}</td>
                  <td className="px-4 py-3 text-slate-600">{alert.staff}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig[alert.status].color}`}>
                      {statusConfig[alert.status].icon} {alert.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
