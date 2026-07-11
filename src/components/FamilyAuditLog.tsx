import React, { useState } from 'react';
import { UserCheck, Plus } from 'lucide-react';

const initialLogs = [
  { id: 1, date: '2026-05-23', family: 'Martinez Family', type: 'App Message', staff: 'Sarah Johnson', summary: 'Shared daily update and photo of Leo during outdoor play' },
  { id: 2, date: '2026-05-22', family: 'Wilson Family', type: 'Phone Call', staff: 'Amy Davis', summary: 'Discussed Emma\'s transition to school readiness activities. Family very positive.' },
  { id: 3, date: '2026-05-21', family: 'Kim Family', type: 'In-Person Meeting', staff: 'Amy Davis', summary: 'Parent meeting to discuss Noah\'s speech development goals and NDIS supports.' },
  { id: 4, date: '2026-05-20', family: 'Chen Family', type: 'Email', staff: 'Admin', summary: 'Sent invoice and CCS statement for April.' },
  { id: 5, date: '2026-05-20', family: 'Martinez Family', type: 'In-Person', staff: 'Sarah Johnson', summary: 'Informal chat at pick-up — Leo had a great day, parents mentioned upcoming holiday.' },
  { id: 6, date: '2026-05-19', family: 'Johnson Family', type: 'App Message', staff: 'Amy Davis', summary: 'Acknowledged absence notification for Mia. Wished quick recovery.' },
];

const types = ['All', 'App Message', 'Phone Call', 'Email', 'In-Person Meeting', 'In-Person'];
const typeColors: Record<string, string> = {
  'App Message': 'bg-blue-100 text-blue-700',
  'Phone Call': 'bg-purple-100 text-purple-700',
  'Email': 'bg-amber-100 text-amber-700',
  'In-Person Meeting': 'bg-emerald-100 text-emerald-700',
  'In-Person': 'bg-teal-100 text-teal-700',
};

interface FamilyAuditLogProps { user?: any; onBack?: () => void; }

export const FamilyAuditLog: React.FC<FamilyAuditLogProps> = () => {
  const [filter, setFilter] = useState('All');
  const [family, setFamily] = useState('All');
  const [logs, setLogs] = useState(initialLogs);
  const [showForm, setShowForm] = useState(false);
  const [entry, setEntry] = useState({ family: 'Martinez Family', type: 'App Message', summary: '' });
  const families = ['All', ...Array.from(new Set(logs.map(l => l.family)))];

  const filtered = logs.filter(l => (filter === 'All' || l.type === filter) && (family === 'All' || l.family === family));

  const addCommunication = (event: React.FormEvent) => {
    event.preventDefault();
    setLogs(current => [{ id: Date.now(), date: new Date().toISOString().slice(0, 10), family: entry.family, type: entry.type, staff: 'Demo User', summary: entry.summary.trim() }, ...current]);
    setEntry(current => ({ ...current, summary: '' }));
    setShowForm(false);
    setFilter('All');
    setFamily('All');
  };

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center">
            <UserCheck className="w-5 h-5 text-violet-600" />
          </div>
          <div className="flex-1"><h1 className="text-2xl font-bold text-slate-800">Family Audit Log</h1>
            <p className="text-slate-500 text-sm">Track all communications with families</p></div>
          <button type="button" onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-indigo-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-indigo-700">
            <Plus className="w-4 h-4" /> Log Communication
          </button>
        </div>

        <div className="flex gap-3 flex-wrap">
          <select className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white" value={family} onChange={e => setFamily(e.target.value)}>
            {families.map(f => <option key={f}>{f}</option>)}
          </select>
          <div className="flex gap-1 flex-wrap">
            {types.map(t => <button key={t} onClick={() => setFilter(t)} className={`px-3 py-1.5 text-xs rounded-lg ${filter === t ? 'bg-violet-600 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}>{t}</button>)}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs text-slate-500 uppercase">
              <tr><th className="text-left px-4 py-3">Date</th><th className="text-left px-4 py-3">Family</th><th className="text-left px-4 py-3">Type</th><th className="text-left px-4 py-3">Staff</th><th className="text-left px-4 py-3">Summary</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(l => (
                <tr key={l.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{l.date}</td>
                  <td className="px-4 py-3 font-medium text-slate-800">{l.family}</td>
                  <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeColors[l.type]}`}>{l.type}</span></td>
                  <td className="px-4 py-3 text-slate-600">{l.staff}</td>
                  <td className="px-4 py-3 text-slate-600 text-xs">{l.summary}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <p className="text-center text-slate-400 py-8 text-sm">No communications match your filters.</p>}
        </div>
        {showForm ? (
          <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/50 p-4" role="dialog" aria-modal="true" aria-labelledby="communication-title">
            <form onSubmit={addCommunication} className="w-full max-w-md space-y-4 rounded-2xl bg-white p-6 shadow-2xl">
              <h2 id="communication-title" className="text-xl font-bold text-slate-900">Log communication</h2>
              <select aria-label="Communication family" value={entry.family} onChange={event => setEntry(current => ({ ...current, family: event.target.value }))} className="w-full rounded-lg border border-slate-200 px-3 py-2">{families.filter(item => item !== 'All').map(item => <option key={item}>{item}</option>)}</select>
              <select aria-label="Communication type" value={entry.type} onChange={event => setEntry(current => ({ ...current, type: event.target.value }))} className="w-full rounded-lg border border-slate-200 px-3 py-2">{types.filter(item => item !== 'All').map(item => <option key={item}>{item}</option>)}</select>
              <textarea aria-label="Communication summary" required value={entry.summary} onChange={event => setEntry(current => ({ ...current, summary: event.target.value }))} placeholder="Summary" rows={3} className="w-full rounded-lg border border-slate-200 px-3 py-2" />
              <div className="flex gap-2"><button type="submit" className="flex-1 rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white">Save log</button><button type="button" onClick={() => setShowForm(false)} className="rounded-lg border border-slate-200 px-4 py-2 text-slate-600">Cancel</button></div>
            </form>
          </div>
        ) : null}
      </div>
    </div>
  );
};
