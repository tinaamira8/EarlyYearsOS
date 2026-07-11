import React, { useState } from 'react';
import { Star, Plus, User } from 'lucide-react';

const mockChildren = [
  { id: 1, name: 'Leo Martinez', room: 'Toddlers', age: '3y 2m', observations: 8, goals: 3, milestones: ['Walking confidently', 'First words (10+)', 'Recognises family photos'] },
  { id: 2, name: 'Emma Wilson', room: 'Pre-Kindy', age: '4y 9m', observations: 12, goals: 5, milestones: ['Counts to 20', 'Writes name', 'Complex sentences', 'Cooperative play'] },
  { id: 3, name: 'Noah Kim', room: 'Toddlers', age: '2y 6m', observations: 6, goals: 4, milestones: ['Running', 'Two-word phrases', 'Parallel play'] },
  { id: 4, name: 'Ava Chen', room: 'Pre-Kindy', age: '4y 2m', observations: 10, goals: 4, milestones: ['Letter recognition', 'Number concepts', 'Self-care independent'] },
];

const domains = ['Physical', 'Language & Communication', 'Cognitive', 'Social-Emotional'];

export const ChildPortfolio: React.FC = () => {
  const [selected, setSelected] = useState(mockChildren[0]);
  const [tab, setTab] = useState<'overview' | 'goals'>('overview');
  const [goals, setGoals] = useState<Record<number, string[]>>({
    1: ['Improve fine motor skills through threading activities', 'Expand vocabulary — target 50+ words by next review', 'Develop turn-taking in group play'],
    2: ['Strengthen early writing confidence', 'Extend cooperative problem solving'],
    3: ['Build expressive language', 'Practise group participation'],
    4: ['Extend number concepts', 'Build transition confidence'],
  });
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [newGoal, setNewGoal] = useState('');
  const selectedGoals = goals[selected.id] || [];

  const addGoal = (event: React.FormEvent) => {
    event.preventDefault();
    setGoals(current => ({ ...current, [selected.id]: [...selectedGoals, newGoal.trim()] }));
    setNewGoal('');
    setShowGoalForm(false);
  };

  return (
    <div className="h-full flex overflow-hidden bg-slate-50">
      {/* Child list */}
      <div className="w-56 bg-white border-r border-slate-100 overflow-y-auto flex-shrink-0">
        <div className="p-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-800 text-sm">Children</h2>
        </div>
        {mockChildren.map(c => (
          <button key={c.id} onClick={() => setSelected(c)} className={`w-full text-left px-4 py-3 border-b border-slate-50 hover:bg-slate-50 transition-colors ${selected.id === c.id ? 'bg-indigo-50' : ''}`}>
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${selected.id === c.id ? 'bg-indigo-600' : 'bg-slate-300'}`}>{c.name[0]}</div>
              <div>
                <p className="text-sm font-medium text-slate-800">{c.name}</p>
                <p className="text-xs text-slate-500">{c.room} · {c.age}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Portfolio content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 text-xl font-bold">{selected.name[0]}</div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">{selected.name}</h1>
            <p className="text-slate-500">{selected.room} · Age {selected.age}</p>
          </div>
          <div className="ml-auto flex gap-4 text-center">
            <div><div className="text-xl font-bold text-indigo-600">{selected.observations}</div><div className="text-xs text-slate-500">Observations</div></div>
            <div><div className="text-xl font-bold text-emerald-600">{selectedGoals.length}</div><div className="text-xs text-slate-500">Active Goals</div></div>
          </div>
        </div>

        <div className="flex gap-2">
          {(['overview', 'goals'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 text-sm rounded-lg font-medium capitalize ${tab === t ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}>{t}</button>
          ))}
        </div>

        {tab === 'overview' && (
          <>
            <div>
              <h3 className="font-semibold text-slate-800 mb-3">Developmental Milestones</h3>
              <div className="grid grid-cols-2 gap-3">
                {selected.milestones.map((m, i) => (
                  <div key={i} className="bg-white rounded-xl border border-slate-100 p-3 flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    <span className="text-sm text-slate-700">{m}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 mb-3">Development Domains</h3>
              <div className="space-y-3">
                {domains.map((d, i) => (
                  <div key={d} className="bg-white rounded-xl border border-slate-100 p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-slate-800">{d}</span>
                      <span className="text-xs text-slate-500">{60 + i * 10}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${60 + i * 10}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {tab === 'goals' && (
          <div className="space-y-3">
            {selectedGoals.map((g, i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-100 p-4 flex items-start gap-3">
                <div className="w-6 h-6 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">{i + 1}</div>
                <p className="text-sm text-slate-700">{g}</p>
              </div>
            ))}
            <button type="button" onClick={() => setShowGoalForm(true)} className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700">
              <Plus className="w-4 h-4" /> Add Goal
            </button>
          </div>
        )}
        {showGoalForm ? (
          <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/50 p-4" role="dialog" aria-modal="true" aria-labelledby="add-goal-title">
            <form onSubmit={addGoal} className="w-full max-w-md space-y-4 rounded-2xl bg-white p-6 shadow-2xl">
              <h2 id="add-goal-title" className="text-xl font-bold text-slate-900">Add goal for {selected.name}</h2>
              <textarea aria-label="Goal" required value={newGoal} onChange={event => setNewGoal(event.target.value)} placeholder="Goal statement" rows={3} className="w-full rounded-lg border border-slate-200 px-3 py-2" />
              <div className="flex gap-2"><button type="submit" className="flex-1 rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white">Add goal</button><button type="button" onClick={() => setShowGoalForm(false)} className="rounded-lg border border-slate-200 px-4 py-2 text-slate-600">Cancel</button></div>
            </form>
          </div>
        ) : null}
      </div>
    </div>
  );
};
