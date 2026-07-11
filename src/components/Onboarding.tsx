import React, { useState } from 'react';
import { UserPlus, CheckCircle, Circle, Clock } from 'lucide-react';

const steps = [
  {
    title: 'Pre-Start Essentials',
    tasks: [
      { key: 'wwcc', label: 'Working With Children Check verified', done: true },
      { key: 'ref1', label: 'Reference checks completed (x2)', done: true },
      { key: 'police', label: 'Police check sighted and recorded', done: true },
      { key: 'first_aid', label: 'First aid certificate sighted', done: false },
      { key: 'contract', label: 'Employment contract signed', done: true },
      { key: 'super', label: 'Superannuation form completed', done: true },
      { key: 'bank', label: 'Bank details submitted to payroll', done: true },
    ],
  },
  {
    title: 'Day 1 Orientation',
    tasks: [
      { key: 'intro', label: 'Introduced to team and toured centre', done: true },
      { key: 'handbooks', label: 'Staff handbook provided and discussed', done: false },
      { key: 'policies', label: 'Key policies reviewed and signed', done: false },
      { key: 'login', label: 'System login credentials set up', done: false },
      { key: 'ppe', label: 'PPE and uniform provided', done: true },
    ],
  },
  {
    title: 'First Week',
    tasks: [
      { key: 'shadow', label: 'Shadowed experienced educator for 3 days', done: false },
      { key: 'children', label: 'Introduced to children\'s records and portfolios', done: false },
      { key: 'routine', label: 'Familiar with daily routine', done: false },
      { key: 'safeguarding', label: 'Child safeguarding training completed', done: false },
    ],
  },
  {
    title: 'Probation Review',
    tasks: [
      { key: '1month', label: '1-month check-in meeting completed', done: false },
      { key: '3month', label: '3-month performance review scheduled', done: false },
      { key: 'goals', label: 'Professional development goals set', done: false },
    ],
  },
];

interface OnboardingProps {
  user?: unknown;
  onComplete?: () => void | Promise<void>;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [checklist, setChecklist] = useState(steps);
  const [newStaff, setNewStaff] = useState('Jessica Turner');

  const toggle = (stepIdx: number, taskKey: string) => {
    setChecklist(prev => prev.map((step, si) => si !== stepIdx ? step : {
      ...step,
      tasks: step.tasks.map(t => t.key === taskKey ? { ...t, done: !t.done } : t),
    }));
  };

  const totalTasks = checklist.flatMap(s => s.tasks).length;
  const doneTasks = checklist.flatMap(s => s.tasks).filter(t => t.done).length;
  const pct = Math.round((doneTasks / totalTasks) * 100);

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
            <UserPlus className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Onboarding Checklist</h1>
            <p className="text-slate-500 text-sm">Track new staff onboarding progress</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-100 p-5 flex items-center gap-5">
          <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold text-xl flex-shrink-0">{newStaff[0]}</div>
          <div className="flex-1">
            <h3 className="font-semibold text-slate-800 text-lg">{newStaff}</h3>
            <p className="text-xs text-slate-500">New Educator · Started 19 May 2026</p>
            <div className="flex items-center gap-3 mt-2">
              <div className="flex-1 bg-slate-100 rounded-full h-2">
                <div className="bg-indigo-500 h-2 rounded-full transition-all" style={{ width: `${pct}%` }} />
              </div>
              <span className="text-xs font-semibold text-indigo-600">{pct}% complete</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {checklist.map((step, si) => {
            const stepDone = step.tasks.filter(t => t.done).length;
            const allDone = stepDone === step.tasks.length;
            return (
              <div key={step.title} className="bg-white rounded-xl border border-slate-100 overflow-hidden">
                <div className="px-5 py-3 border-b border-slate-50 flex items-center justify-between">
                  <h3 className={`font-semibold text-sm ${allDone ? 'text-emerald-600' : 'text-slate-800'}`}>{allDone ? '✓ ' : ''}{step.title}</h3>
                  <span className="text-xs text-slate-400">{stepDone}/{step.tasks.length}</span>
                </div>
                <div className="divide-y divide-slate-50">
                  {step.tasks.map(task => (
                    <button key={task.key} onClick={() => toggle(si, task.key)} className="w-full flex items-center gap-3 px-5 py-3 hover:bg-slate-50 text-left">
                      {task.done ? <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" /> : <Circle className="w-5 h-5 text-slate-200 flex-shrink-0" />}
                      <span className={`text-sm ${task.done ? 'line-through text-slate-400' : 'text-slate-700'}`}>{task.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {onComplete ? (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => void onComplete()}
              className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
            >
              Finish onboarding
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};
