import React, { useState } from 'react';
import { UserCheck, CheckCircle, Circle } from 'lucide-react';
import { usePersistedState } from '../hooks/usePersistedState';

const checklistItems = [
  'Identity verification (ID sighted)', 'WWCC verified and recorded', 'Contract signed',
  'Induction handbook provided', 'Centre tour completed', 'Emergency procedures reviewed',
  'Child safe training completed', 'Policies acknowledged and signed', 'Buddy assigned',
  'IT access set up', 'Uniform/dress code briefing', '30-day check-in scheduled',
];

const initialStaff = [
  { id: 1, name: 'Jessica Turner', role: 'Educator', startDate: '2026-05-01', checks: new Array(checklistItems.length).fill(false).map((_, i) => i < 7) },
  { id: 2, name: 'Ryan Wong', role: 'Room Leader', startDate: '2026-05-15', checks: new Array(checklistItems.length).fill(false).map((_, i) => i < 3) },
];

export const StaffOnboarding: React.FC = () => {
  const [staff, setStaff] = usePersistedState('staff_onboarding', initialStaff);
  const [selected, setSelected] = useState(initialStaff[0]);

  const toggle = (idx: number) => {
    const updated = staff.map(s => s.id === selected.id
      ? { ...s, checks: s.checks.map((c, i) => i === idx ? !c : c) }
      : s
    );
    setStaff(updated);
    setSelected(updated.find(s => s.id === selected.id)!);
  };

  const progress = selected.checks.filter(Boolean).length;
  const pct = Math.round((progress / checklistItems.length) * 100);

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-sky-100 rounded-xl flex items-center justify-center">
            <UserCheck className="w-5 h-5 text-sky-600" />
          </div>
          <div><h1 className="text-2xl font-bold text-slate-800">Staff Onboarding</h1>
            <p className="text-slate-500 text-sm">Track new staff onboarding progress</p></div>
        </div>

        <div className="flex gap-3">
          {staff.map(s => {
            const p = Math.round((s.checks.filter(Boolean).length / checklistItems.length) * 100);
            return (
              <button key={s.id} onClick={() => setSelected(s)} className={`flex-1 text-left bg-white rounded-xl border p-4 transition-all ${selected.id === s.id ? 'border-sky-500 ring-2 ring-sky-200' : 'border-slate-100'}`}>
                <div className="flex justify-between">
                  <div className="font-medium text-slate-800">{s.name}</div>
                  <span className="text-xs text-slate-500">{p}%</span>
                </div>
                <div className="text-xs text-slate-500">{s.role} · Started {s.startDate}</div>
                <div className="mt-2 bg-slate-100 rounded-full h-1.5">
                  <div className="bg-sky-500 h-1.5 rounded-full" style={{ width: `${p}%` }} />
                </div>
              </button>
            );
          })}
        </div>

        <div className="bg-white rounded-xl border border-slate-100 p-5">
          <div className="flex justify-between mb-4">
            <h3 className="font-semibold text-slate-800">Onboarding Checklist — {selected.name}</h3>
            <span className="text-sm text-sky-600 font-semibold">{progress}/{checklistItems.length} complete ({pct}%)</span>
          </div>
          <div className="space-y-2">
            {checklistItems.map((item, i) => (
              <button key={i} onClick={() => toggle(i)} className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 text-left transition-colors">
                {selected.checks[i] ? <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" /> : <Circle className="w-5 h-5 text-slate-300 flex-shrink-0" />}
                <span className={`text-sm ${selected.checks[i] ? 'line-through text-slate-400' : 'text-slate-700'}`}>{item}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
