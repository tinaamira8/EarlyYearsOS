import React, { useState } from 'react';
import { Eye, Plus, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import { usePersistedState } from '../hooks/usePersistedState';

const rooms = ['All Rooms', 'Babies Room', 'Toddler Room', 'Pre-Kindy Room'];

const walkthrough = [
  { area: 'Babies Room', item: 'Cots cleaned and positioned correctly', status: 'pass', notes: '' },
  { area: 'Babies Room', item: 'Nappy change station sanitised', status: 'pass', notes: '' },
  { area: 'Toddler Room', item: 'Outdoor gate latch functional', status: 'fail', notes: 'Latch stiff — maintenance requested' },
  { area: 'Toddler Room', item: 'Art supplies accessible and safe', status: 'pass', notes: '' },
  { area: 'Pre-Kindy Room', item: 'Staff-to-child ratio maintained', status: 'pass', notes: '' },
  { area: 'Outdoor', item: 'Shade sails in good repair', status: 'fail', notes: 'Tear on eastern sail — replacement ordered' },
  { area: 'Outdoor', item: 'Sand pit covered overnight', status: 'pass', notes: '' },
  { area: 'Kitchen', item: 'Fridge temperatures 0-4°C', status: 'pass', notes: '2.4°C recorded' },
  { area: 'Kitchen', item: 'Handwashing soap at all sinks', status: 'action', notes: 'Low on soap — restocking today' },
  { area: 'General', item: 'First aid kits accessible and complete', status: 'pass', notes: '' },
];

const statusConfig = { pass: { label: 'Pass', color: 'text-emerald-600', icon: CheckCircle }, fail: { label: 'Fail', color: 'text-red-500', icon: AlertTriangle }, action: { label: 'Action Needed', color: 'text-amber-500', icon: Clock } };

export const WalkthroughChecklist: React.FC = () => {
  const [items, setItems] = usePersistedState('walkthrough_checklist', walkthrough.map((w, i) => ({ ...w, id: i })));
  const [filter, setFilter] = useState('All Rooms');
  const pass = items.filter(i => i.status === 'pass').length;
  const fail = items.filter(i => i.status === 'fail').length;
  const action = items.filter(i => i.status === 'action').length;
  const filtered = filter === 'All Rooms' ? items : items.filter(i => filter.includes(i.area.split(' ')[0]));

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-sky-100 rounded-xl flex items-center justify-center">
            <Eye className="w-5 h-5 text-sky-600" />
          </div>
          <div className="flex-1"><h1 className="text-2xl font-bold text-slate-800">Walkthrough Checklist</h1>
            <p className="text-slate-500 text-sm">Daily safety and compliance walkthrough</p></div>
          <div className="flex gap-2 text-sm">
            <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded">{pass} Pass</span>
            <span className="bg-red-100 text-red-700 px-2 py-1 rounded">{fail} Fail</span>
            <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded">{action} Action</span>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          {rooms.map(r => <button key={r} onClick={() => setFilter(r)} className={`px-3 py-1.5 text-xs rounded-lg font-medium ${filter === r ? 'bg-sky-600 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}>{r}</button>)}
        </div>

        <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs text-slate-500 uppercase">
              <tr><th className="text-left px-4 py-3">Area</th><th className="text-left px-4 py-3">Check Item</th><th className="text-left px-4 py-3">Status</th><th className="text-left px-4 py-3">Notes</th><th className="text-left px-4 py-3">Change</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(item => {
                const s = statusConfig[item.status as keyof typeof statusConfig];
                const Icon = s.icon;
                return (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-xs text-slate-500">{item.area}</td>
                    <td className="px-4 py-3 font-medium text-slate-800">{item.item}</td>
                    <td className="px-4 py-3">
                      <div className={`flex items-center gap-1.5 ${s.color}`}>
                        <Icon className="w-4 h-4" />
                        <span className="text-xs font-medium">{s.label}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">{item.notes || '—'}</td>
                    <td className="px-4 py-3">
                      <select className="text-xs border border-slate-200 rounded px-2 py-1" value={item.status} onChange={e => setItems(prev => prev.map(p => p.id === item.id ? { ...p, status: e.target.value } : p))}>
                        <option value="pass">Pass</option>
                        <option value="fail">Fail</option>
                        <option value="action">Action</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
