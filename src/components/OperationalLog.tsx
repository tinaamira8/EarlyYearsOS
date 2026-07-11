import React, { useState } from 'react';
import { Clipboard, Plus } from 'lucide-react';
import { usePersistedState } from '../hooks/usePersistedState';

const categories = ['Opening Check', 'Closing Check', 'Visitor', 'Maintenance', 'Incident', 'Communication', 'Other'];

const initialLog = [
  { id: 1, time: '07:02', category: 'Opening Check', description: 'All areas checked — outdoor, bathrooms, kitchens. No hazards noted. Heater on in babies room.', staff: 'Amy Davis', date: new Date().toISOString().split('T')[0] },
  { id: 2, time: '09:30', category: 'Visitor', description: 'Community nurse Stephanie Moore visited for immunisation education session with parents.', staff: 'Sarah Johnson', date: new Date().toISOString().split('T')[0] },
  { id: 3, time: '14:00', category: 'Maintenance', description: 'Outdoor tap leaking — maintenance request submitted. Tap shut off.', staff: 'James Park', date: new Date().toISOString().split('T')[0] },
];

export const OperationalLog: React.FC = () => {
  const [log, setLog] = usePersistedState('operational_log', initialLog);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ time: new Date().toTimeString().substring(0, 5), category: 'Other', description: '', staff: 'Amy Davis', date: new Date().toISOString().split('T')[0] });

  const add = () => {
    if (!form.description) return;
    setLog(l => [{ ...form, id: Date.now() }, ...l]);
    setForm({ time: new Date().toTimeString().substring(0, 5), category: 'Other', description: '', staff: 'Amy Davis', date: new Date().toISOString().split('T')[0] });
    setShowForm(false);
  };

  const catColors: Record<string, string> = {
    'Opening Check': 'bg-emerald-100 text-emerald-700', 'Closing Check': 'bg-blue-100 text-blue-700',
    'Visitor': 'bg-purple-100 text-purple-700', 'Maintenance': 'bg-orange-100 text-orange-700',
    'Incident': 'bg-red-100 text-red-700', 'Communication': 'bg-sky-100 text-sky-700', 'Other': 'bg-slate-100 text-slate-600',
  };

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-200 rounded-xl flex items-center justify-center">
            <Clipboard className="w-5 h-5 text-slate-600" />
          </div>
          <div className="flex-1"><h1 className="text-2xl font-bold text-slate-800">Operational Log</h1>
            <p className="text-slate-500 text-sm">Daily centre operation records</p></div>
          <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-indigo-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-indigo-700">
            <Plus className="w-4 h-4" /> Add Entry
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-xs text-slate-500 mb-1 block">Time</label>
                <input type="time" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} /></div>
              <div><label className="text-xs text-slate-500 mb-1 block">Category</label>
                <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                  {categories.map(c => <option key={c}>{c}</option>)}
                </select></div>
            </div>
            <div><label className="text-xs text-slate-500 mb-1 block">Description</label>
              <textarea className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" rows={2} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></div>
            <div><label className="text-xs text-slate-500 mb-1 block">Staff Member</label>
              <input className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" value={form.staff} onChange={e => setForm(f => ({ ...f, staff: e.target.value }))} /></div>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm border border-slate-200 rounded-lg">Cancel</button>
              <button onClick={add} className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg">Save</button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {log.map(entry => (
            <div key={entry.id} className="bg-white rounded-xl border border-slate-100 p-4 flex gap-4">
              <div className="text-center flex-shrink-0">
                <div className="text-sm font-mono font-bold text-slate-700">{entry.time}</div>
                <div className="text-xs text-slate-400">{entry.date}</div>
              </div>
              <div className="flex-1 min-w-0">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${catColors[entry.category]}`}>{entry.category}</span>
                <p className="text-sm text-slate-700 mt-1">{entry.description}</p>
                <p className="text-xs text-slate-400 mt-1">— {entry.staff}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
