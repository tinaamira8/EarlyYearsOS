import React, { useState } from 'react';
import { FileText, Plus, Eye, Edit3 } from 'lucide-react';
import { usePersistedState } from '../hooks/usePersistedState';

const initialPolicies = [
  { id: 1, title: 'Child Safe Environment Policy', category: 'Child Safety', reviewed: '2025-11-01', nextReview: '2026-11-01', status: 'Current', version: '3.2' },
  { id: 2, title: 'Health and Safety Policy', category: 'Health', reviewed: '2025-09-15', nextReview: '2026-09-15', status: 'Current', version: '2.4' },
  { id: 3, title: 'Emergency Management Policy', category: 'Safety', reviewed: '2025-10-01', nextReview: '2026-10-01', status: 'Current', version: '1.8' },
  { id: 4, title: 'Enrolment and Orientation Policy', category: 'Enrolment', reviewed: '2025-06-01', nextReview: '2026-06-01', status: 'Due for Review', version: '2.1' },
  { id: 5, title: 'Anaphylaxis Management Policy', category: 'Health', reviewed: '2026-01-10', nextReview: '2027-01-10', status: 'Current', version: '4.0' },
  { id: 6, title: 'Sun Safety Policy', category: 'Health', reviewed: '2025-08-20', nextReview: '2026-08-20', status: 'Current', version: '1.5' },
  { id: 7, title: 'Social Media and Privacy Policy', category: 'Privacy', reviewed: '2025-03-01', nextReview: '2026-03-01', status: 'Overdue', version: '2.0' },
  { id: 8, title: 'Code of Conduct Policy', category: 'HR', reviewed: '2025-12-01', nextReview: '2026-12-01', status: 'Current', version: '3.1' },
];

const statusColors: Record<string, string> = {
  'Current': 'bg-emerald-100 text-emerald-700',
  'Due for Review': 'bg-amber-100 text-amber-700',
  'Overdue': 'bg-red-100 text-red-700',
};

export const PolicyPortal: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<number | null>(null);
  const [policies, setPolicies] = usePersistedState('policies', initialPolicies);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<number | null>(null);
  const [draft, setDraft] = useState({ title: '', category: 'General' });
  const filtered = policies.filter(p => p.title.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()));
  const selectedPolicy = policies.find(policy => policy.id === selected);

  const savePolicy = (event: React.FormEvent) => {
    event.preventDefault();
    if (editing) {
      setPolicies(current => current.map(policy => policy.id === editing ? { ...policy, title: draft.title.trim(), category: draft.category.trim(), reviewed: new Date().toISOString().slice(0, 10), status: 'Current' } : policy));
    } else {
      setPolicies(current => [...current, { id: Date.now(), title: draft.title.trim(), category: draft.category.trim(), reviewed: new Date().toISOString().slice(0, 10), nextReview: 'Not scheduled', status: 'Current', version: '1.0' }]);
    }
    setDraft({ title: '', category: 'General' });
    setEditing(null);
    setShowForm(false);
  };

  const openEdit = (id: number) => {
    const policy = policies.find(item => item.id === id);
    if (!policy) return;
    setEditing(id);
    setDraft({ title: policy.title, category: policy.category });
    setShowForm(true);
  };

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-slate-800">Policy Portal</h1>
            <p className="text-slate-500 text-sm">Manage and review centre policies</p>
          </div>
          <button type="button" onClick={() => { setEditing(null); setDraft({ title: '', category: 'General' }); setShowForm(true); }} className="flex items-center gap-2 bg-indigo-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
            <Plus className="w-4 h-4" /> Add Policy
          </button>
        </div>

        <input className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Search policies..." value={search} onChange={e => setSearch(e.target.value)} />

        <div className="grid grid-cols-3 gap-3">
          {['Current', 'Due for Review', 'Overdue'].map(s => (
            <div key={s} className="bg-white rounded-xl border border-slate-100 p-4 text-center">
              <div className="text-2xl font-bold text-slate-800">{policies.filter(p => p.status === s).length}</div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[s]}`}>{s}</span>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs text-slate-500 uppercase">
              <tr>
                <th className="text-left px-4 py-3">Policy</th>
                <th className="text-left px-4 py-3">Category</th>
                <th className="text-left px-4 py-3">Last Reviewed</th>
                <th className="text-left px-4 py-3">Next Review</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-800">{p.title}</div>
                    <div className="text-xs text-slate-400">v{p.version}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{p.category}</td>
                  <td className="px-4 py-3 text-slate-600">{p.reviewed}</td>
                  <td className="px-4 py-3 text-slate-600">{p.nextReview}</td>
                  <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[p.status]}`}>{p.status}</span></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button type="button" onClick={() => setSelected(p.id)} className="text-slate-400 hover:text-indigo-600" title="View"><Eye className="w-4 h-4" /></button>
                      <button type="button" onClick={() => openEdit(p.id)} className="text-slate-400 hover:text-indigo-600" title="Edit"><Edit3 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {showForm ? (
          <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/50 p-4" role="dialog" aria-modal="true" aria-labelledby="policy-form-title">
            <form onSubmit={savePolicy} className="w-full max-w-md space-y-4 rounded-2xl bg-white p-6 shadow-2xl">
              <h2 id="policy-form-title" className="text-xl font-bold text-slate-900">{editing ? 'Edit policy' : 'Add policy'}</h2>
              <input aria-label="Policy title" required value={draft.title} onChange={event => setDraft(current => ({ ...current, title: event.target.value }))} placeholder="Policy title" className="w-full rounded-lg border border-slate-200 px-3 py-2" />
              <input aria-label="Policy category" required value={draft.category} onChange={event => setDraft(current => ({ ...current, category: event.target.value }))} placeholder="Category" className="w-full rounded-lg border border-slate-200 px-3 py-2" />
              <div className="flex gap-2"><button type="submit" className="flex-1 rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white">Save policy</button><button type="button" onClick={() => setShowForm(false)} className="rounded-lg border border-slate-200 px-4 py-2 text-slate-600">Cancel</button></div>
            </form>
          </div>
        ) : null}
        {selectedPolicy ? (
          <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/50 p-4" role="dialog" aria-modal="true" aria-labelledby="policy-preview-title">
            <div className="w-full max-w-lg space-y-4 rounded-2xl bg-white p-6 shadow-2xl">
              <h2 id="policy-preview-title" className="text-xl font-bold text-slate-900">{selectedPolicy.title}</h2>
              <p className="text-sm text-slate-600">Category: {selectedPolicy.category} · Version {selectedPolicy.version}</p>
              <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">Policy content preview. Attach the approved source document when cloud document storage is configured.</p>
              <button type="button" onClick={() => setSelected(null)} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white">Close</button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
