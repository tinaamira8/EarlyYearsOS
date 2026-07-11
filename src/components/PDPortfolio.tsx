import React, { useState } from 'react';
import { Award, Plus } from 'lucide-react';

const initialPD = [
  { id: 1, staff: 'Sarah Johnson', activity: 'EYLF & NQS Workshop', provider: 'ECA', date: '2026-04-15', type: 'Workshop', hours: 6 },
  { id: 2, staff: 'Amy Davis', activity: 'Director Leadership Program', provider: 'ACECQA', date: '2026-03-10', type: 'Course', hours: 20 },
  { id: 3, staff: 'Mark Chen', activity: 'Inclusion & Diversity Webinar', provider: 'DESE', date: '2026-05-02', type: 'Webinar', hours: 2 },
  { id: 4, staff: 'James Park', activity: 'Behaviour Guidance Training', provider: 'Goodstart', date: '2026-02-20', type: 'Training', hours: 4 },
];

const staffGoals: Record<string, number> = { 'Sarah Johnson': 20, 'Mark Chen': 20, 'Amy Davis': 30, 'James Park': 20, 'Jessica Turner': 20 };

export const PDPortfolio: React.FC = () => {
  const [log, setLog] = useState(initialPD);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ staff: 'Sarah Johnson', activity: '', provider: '', date: new Date().toISOString().split('T')[0], type: 'Workshop', hours: 3 });

  const staffList = Object.keys(staffGoals);
  const hoursPerStaff = staffList.map(name => ({
    name,
    hours: log.filter(l => l.staff === name).reduce((s, l) => s + l.hours, 0),
    goal: staffGoals[name],
  }));

  const add = () => {
    if (!form.activity) return;
    setLog(l => [...l, { ...form, id: Date.now() }]);
    setForm({ staff: 'Sarah Johnson', activity: '', provider: '', date: new Date().toISOString().split('T')[0], type: 'Workshop', hours: 3 });
    setShowForm(false);
  };

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
            <Award className="w-5 h-5 text-amber-600" />
          </div>
          <div className="flex-1"><h1 className="text-2xl font-bold text-slate-800">PD Portfolio</h1>
            <p className="text-slate-500 text-sm">Professional development hours and activities</p></div>
          <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-indigo-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-indigo-700">
            <Plus className="w-4 h-4" /> Log PD
          </button>
        </div>

        <div className="bg-white rounded-xl border border-slate-100 p-5">
          <h3 className="font-semibold text-slate-800 mb-4">Annual PD Hours Progress</h3>
          <div className="space-y-3">
            {hoursPerStaff.map(s => (
              <div key={s.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-slate-700">{s.name}</span>
                  <span className="text-slate-500">{s.hours}/{s.goal} hrs</span>
                </div>
                <div className="bg-slate-100 rounded-full h-2">
                  <div className={`h-2 rounded-full ${s.hours >= s.goal ? 'bg-emerald-500' : 'bg-amber-400'}`} style={{ width: `${Math.min(100, (s.hours / s.goal) * 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {showForm && (
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
            <h3 className="font-semibold text-slate-800">Log PD Activity</h3>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-xs text-slate-500 mb-1 block">Staff Member</label>
                <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" value={form.staff} onChange={e => setForm(f => ({ ...f, staff: e.target.value }))}>
                  {staffList.map(s => <option key={s}>{s}</option>)}
                </select></div>
              <div><label className="text-xs text-slate-500 mb-1 block">Date</label>
                <input type="date" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} /></div>
              <div className="col-span-2"><label className="text-xs text-slate-500 mb-1 block">Activity Title</label>
                <input className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" value={form.activity} onChange={e => setForm(f => ({ ...f, activity: e.target.value }))} /></div>
              <div><label className="text-xs text-slate-500 mb-1 block">Provider</label>
                <input className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" value={form.provider} onChange={e => setForm(f => ({ ...f, provider: e.target.value }))} /></div>
              <div><label className="text-xs text-slate-500 mb-1 block">Hours</label>
                <input type="number" min={0.5} step={0.5} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" value={form.hours} onChange={e => setForm(f => ({ ...f, hours: +e.target.value }))} /></div>
            </div>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm border border-slate-200 rounded-lg">Cancel</button>
              <button onClick={add} className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Save</button>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs text-slate-500 uppercase">
              <tr>
                <th className="text-left px-4 py-3">Staff</th>
                <th className="text-left px-4 py-3">Activity</th>
                <th className="text-left px-4 py-3">Provider</th>
                <th className="text-left px-4 py-3">Date</th>
                <th className="text-left px-4 py-3">Type</th>
                <th className="text-right px-4 py-3">Hours</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {log.map(l => (
                <tr key={l.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-800">{l.staff}</td>
                  <td className="px-4 py-3 text-slate-700">{l.activity}</td>
                  <td className="px-4 py-3 text-slate-500">{l.provider}</td>
                  <td className="px-4 py-3 text-slate-500">{l.date}</td>
                  <td className="px-4 py-3"><span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">{l.type}</span></td>
                  <td className="px-4 py-3 text-right font-semibold text-slate-700">{l.hours}h</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
