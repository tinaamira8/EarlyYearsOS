import React, { useState } from 'react';
import { AlertTriangle, Loader2, Plus, Sparkles, Wrench } from 'lucide-react';
import toast from 'react-hot-toast';
import { generateMaintenanceRequest } from '../services/geminiService';
import { usePersistedState } from '../hooks/usePersistedState';

const initialItems = [
  { id: 1, item: 'Outdoor tap leaking', location: 'Outdoor area', priority: 'High', status: 'Reported', date: '2026-05-24', contractor: 'Pending', cost: null },
  { id: 2, item: 'Toddler room door handle loose', location: 'Toddler Room', priority: 'Medium', status: 'In Progress', date: '2026-05-20', contractor: 'Handy Fix Co.', cost: 80 },
  { id: 3, item: 'Garden fence panel replacement', location: 'Outdoor', priority: 'Medium', status: 'Completed', date: '2026-05-10', contractor: 'Fencing Pro', cost: 450 },
  { id: 4, item: 'Air conditioning service', location: 'All rooms', priority: 'Low', status: 'Completed', date: '2026-04-01', contractor: 'Cool Air Co.', cost: 320 },
  { id: 5, item: 'Bathroom extractor fan not working', location: 'Staff bathroom', priority: 'High', status: 'Reported', date: '2026-05-23', contractor: 'Pending', cost: null },
];

const priorityColors: Record<string, string> = { High: 'bg-red-100 text-red-700', Medium: 'bg-amber-100 text-amber-700', Low: 'bg-green-100 text-green-700' };
const statusColors: Record<string, string> = { Reported: 'bg-blue-100 text-blue-700', 'In Progress': 'bg-amber-100 text-amber-700', Completed: 'bg-emerald-100 text-emerald-700' };

export const MaintenanceLog: React.FC = () => {
  const [items, setItems] = usePersistedState('maintenance_items', initialItems);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ item: '', location: '', priority: 'Medium', status: 'Reported', date: new Date().toISOString().split('T')[0], contractor: '', cost: '' });
  const [requestDraft, setRequestDraft] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const generateRequest = async () => {
    if (!form.item.trim()) return toast.error('Describe the maintenance issue first.');
    setIsGenerating(true);
    try {
      setRequestDraft(await generateMaintenanceRequest([`${form.item} at ${form.location || 'location not specified'} (${form.priority} priority)`]));
      toast.success('Contractor request drafted for review.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'AI generation failed.');
    } finally {
      setIsGenerating(false);
    }
  };

  const add = () => {
    if (!form.item) return;
    setItems(i => [...i, { ...form, id: Date.now(), cost: form.cost ? +form.cost : null }]);
    setForm({ item: '', location: '', priority: 'Medium', status: 'Reported', date: new Date().toISOString().split('T')[0], contractor: '', cost: '' });
    setShowForm(false);
  };

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
            <Wrench className="w-5 h-5 text-orange-600" />
          </div>
          <div className="flex-1"><h1 className="text-2xl font-bold text-slate-800">Maintenance Log</h1>
            <p className="text-slate-500 text-sm">Track repairs and maintenance requests</p></div>
          <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-indigo-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-indigo-700">
            <Plus className="w-4 h-4" /> Report Issue
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {['Reported', 'In Progress', 'Completed'].map(s => (
            <div key={s} className="bg-white rounded-xl border border-slate-100 p-4 text-center">
              <div className="text-2xl font-bold text-slate-800">{items.filter(i => i.status === s).length}</div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[s]}`}>{s}</span>
            </div>
          ))}
        </div>

        {showForm && (
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-xs text-slate-500 mb-1 block">Issue</label>
                <input className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" value={form.item} onChange={e => setForm(f => ({ ...f, item: e.target.value }))} /></div>
              <div><label className="text-xs text-slate-500 mb-1 block">Location</label>
                <input className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} /></div>
              <div><label className="text-xs text-slate-500 mb-1 block">Priority</label>
                <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}>
                  {['High', 'Medium', 'Low'].map(p => <option key={p}>{p}</option>)}
                </select></div>
              <div><label className="text-xs text-slate-500 mb-1 block">Contractor (if known)</label>
                <input className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" value={form.contractor} onChange={e => setForm(f => ({ ...f, contractor: e.target.value }))} /></div>
            </div>
            {requestDraft ? <textarea aria-label="AI maintenance request draft" value={requestDraft} onChange={event => setRequestDraft(event.target.value)} rows={6} className="w-full rounded-lg border border-violet-200 bg-violet-50 px-3 py-2 text-sm" /> : null}
            <div className="flex gap-2 justify-end">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm border border-slate-200 rounded-lg">Cancel</button>
              <button disabled={isGenerating} onClick={() => void generateRequest()} className="flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm text-white disabled:opacity-50">{isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />} Draft request</button>
              <button onClick={add} className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg">Submit</button>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs text-slate-500 uppercase">
              <tr>
                <th className="text-left px-4 py-3">Issue</th>
                <th className="text-left px-4 py-3">Location</th>
                <th className="text-left px-4 py-3">Date</th>
                <th className="text-left px-4 py-3">Priority</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-left px-4 py-3">Contractor</th>
                <th className="text-right px-4 py-3">Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map(i => (
                <tr key={i.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-800">{i.item}</td>
                  <td className="px-4 py-3 text-slate-600">{i.location}</td>
                  <td className="px-4 py-3 text-slate-600">{i.date}</td>
                  <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityColors[i.priority]}`}>{i.priority}</span></td>
                  <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[i.status]}`}>{i.status}</span></td>
                  <td className="px-4 py-3 text-slate-600">{i.contractor || 'Pending'}</td>
                  <td className="px-4 py-3 text-right text-slate-700">{i.cost ? `$${i.cost}` : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
