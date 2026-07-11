import React, { useState } from 'react';
import { Accessibility, Plus } from 'lucide-react';

const initialPlans = [
  { id: 1, child: 'Noah Kim', age: '2y 6m', room: 'Toddlers', need: 'Speech delay', funding: 'NDIS', planStart: '2026-02-01', reviewDate: '2026-08-01', goals: ['Increase receptive vocabulary to 50 words', 'Initiate communication with peers', 'Follow 2-step instructions'], strategies: ['Visual schedules', 'Augmentative communication supports', 'Speech therapy sessions Tuesdays'] },
  { id: 2, child: 'Mia Johnson', age: '2y 4m', room: 'Babies', need: 'Global developmental delay', funding: 'Inclusion Support Program', planStart: '2026-01-10', reviewDate: '2026-07-10', goals: ['Develop fine motor control', 'Increase engagement with peers', 'Develop object permanence'], strategies: ['Adapted play materials', 'Additional educator support during group times', 'Occupational therapy recommendations implemented'] },
];

export const InclusionSupport: React.FC = () => {
  const [selected, setSelected] = useState<number | null>(null);
  const [plans, setPlans] = useState(initialPlans);
  const [showForm, setShowForm] = useState(false);
  const [draft, setDraft] = useState({ child: '', need: '' });

  const addPlan = (event: React.FormEvent) => {
    event.preventDefault();
    const id = Date.now();
    setPlans(current => [...current, { id, child: draft.child.trim(), age: 'Not set', room: 'Unassigned', need: draft.need.trim(), funding: 'Pending', planStart: new Date().toISOString().slice(0, 10), reviewDate: 'Not set', goals: ['Define first measurable goal'], strategies: ['Schedule planning meeting with family'] }]);
    setDraft({ child: '', need: '' });
    setShowForm(false);
    setSelected(id);
  };

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center">
            <Accessibility className="w-5 h-5 text-teal-600" />
          </div>
          <div className="flex-1"><h1 className="text-2xl font-bold text-slate-800">Inclusion Support</h1>
            <p className="text-slate-500 text-sm">Individual support plans for children with additional needs</p></div>
          <button type="button" onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-indigo-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-indigo-700">
            <Plus className="w-4 h-4" /> New Plan
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {plans.map(p => (
            <div key={p.id} className={`bg-white rounded-xl border cursor-pointer transition-all overflow-hidden ${selected === p.id ? 'border-teal-400 ring-2 ring-teal-100' : 'border-slate-100 hover:border-slate-200'}`} onClick={() => setSelected(selected === p.id ? null : p.id)}>
              <div className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-800">{p.child}</h3>
                    <p className="text-xs text-slate-500">{p.room} · Age {p.age}</p>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-teal-100 text-teal-700 font-medium">{p.funding}</span>
                </div>
                <p className="text-sm text-slate-600 mt-2"><span className="font-medium">Need:</span> {p.need}</p>
                <div className="flex gap-4 mt-2 text-xs text-slate-500">
                  <span>Plan from: {p.planStart}</span>
                  <span>Review: {p.reviewDate}</span>
                </div>
              </div>
              {selected === p.id && (
                <div className="border-t border-slate-100 bg-slate-50 p-5 space-y-4">
                  <div>
                    <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">Goals</h4>
                    <ul className="space-y-1.5">
                      {p.goals.map((g, i) => <li key={i} className="text-sm text-slate-700 flex items-start gap-2"><span className="text-teal-500 font-bold mt-0.5">→</span>{g}</li>)}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">Strategies</h4>
                    <ul className="space-y-1.5">
                      {p.strategies.map((s, i) => <li key={i} className="text-sm text-slate-700 flex items-start gap-2"><span className="text-emerald-500">✓</span>{s}</li>)}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        {showForm ? (
          <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/50 p-4" role="dialog" aria-modal="true" aria-labelledby="inclusion-plan-title">
            <form onSubmit={addPlan} className="w-full max-w-md space-y-4 rounded-2xl bg-white p-6 shadow-2xl">
              <h2 id="inclusion-plan-title" className="text-xl font-bold text-slate-900">New inclusion plan</h2>
              <input aria-label="Child name" required value={draft.child} onChange={event => setDraft(current => ({ ...current, child: event.target.value }))} placeholder="Child name" className="w-full rounded-lg border border-slate-200 px-3 py-2" />
              <textarea aria-label="Support need" required value={draft.need} onChange={event => setDraft(current => ({ ...current, need: event.target.value }))} placeholder="Support need" rows={3} className="w-full rounded-lg border border-slate-200 px-3 py-2" />
              <div className="flex gap-2"><button type="submit" className="flex-1 rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white">Create plan</button><button type="button" onClick={() => setShowForm(false)} className="rounded-lg border border-slate-200 px-4 py-2 text-slate-600">Cancel</button></div>
            </form>
          </div>
        ) : null}
      </div>
    </div>
  );
};
