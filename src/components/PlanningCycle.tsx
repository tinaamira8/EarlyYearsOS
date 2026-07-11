import React, { useState } from 'react';
import { RefreshCw, ChevronRight, Clock } from 'lucide-react';

const phases = [
  {
    id: 1, name: 'Observe', icon: '👁️', color: 'bg-blue-100 text-blue-700 border-blue-200',
    description: 'Gather information about children\'s learning, development, interests and wellbeing through observation.',
    activities: ['Anecdotal observations', 'Photo documentation', 'Work samples', 'Parent input', 'Child voice'],
    tools: ['Observation Writer', 'Digital Journal', 'Child Portfolio', 'Media Studio'],
  },
  {
    id: 2, name: 'Analyse', icon: '🔍', color: 'bg-purple-100 text-purple-700 border-purple-200',
    description: 'Interpret observations in relation to EYLF outcomes, developmental milestones and children\'s strengths.',
    activities: ['Link to EYLF outcomes', 'Identify interests and strengths', 'Review developmental progress', 'Team discussion'],
    tools: ['Development Report', 'EYLF Reference', 'Critical Reflection'],
  },
  {
    id: 3, name: 'Plan', icon: '📋', color: 'bg-amber-100 text-amber-700 border-amber-200',
    description: 'Use analysis to plan intentional learning experiences that extend children\'s learning.',
    activities: ['Group and individual planning', 'Select learning experiences', 'Plan the environment', 'Collaborate with families'],
    tools: ['Activity Planner', 'Curriculum Board', 'Routine Manager', 'Goal Planner'],
  },
  {
    id: 4, name: 'Implement', icon: '▶️', color: 'bg-green-100 text-green-700 border-green-200',
    description: 'Put the planned program into action, being responsive to children\'s cues and adjusting in the moment.',
    activities: ['Deliver planned experiences', 'Facilitate child-led play', 'Scaffold learning', 'Use teaching strategies'],
    tools: ['Daily Care', 'Routine Manager', 'Reception Kiosk'],
  },
  {
    id: 5, name: 'Reflect', icon: '💭', color: 'bg-rose-100 text-rose-700 border-rose-200',
    description: 'Evaluate the effectiveness of the program and your own practice to inform future planning.',
    activities: ['Team reflection meetings', 'Individual critical reflection', 'QIP review', 'Family feedback'],
    tools: ['Critical Reflection', 'Philosophy Builder', 'Professional Standards Mapping'],
  },
];

export const PlanningCycle: React.FC = () => {
  const [selected, setSelected] = useState<number | null>(1);
  const sel = phases.find(p => p.id === selected);

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
            <RefreshCw className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Planning Cycle</h1>
            <p className="text-slate-500 text-sm">The Observe → Analyse → Plan → Implement → Reflect cycle</p>
          </div>
        </div>

        {/* Visual cycle */}
        <div className="flex items-center justify-center gap-2 bg-white rounded-2xl border border-slate-100 p-6 overflow-x-auto">
          {phases.map((phase, i) => (
            <React.Fragment key={phase.id}>
              <button onClick={() => setSelected(phase.id)} className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all min-w-[90px] ${selected === phase.id ? phase.color + ' shadow-md scale-105' : 'bg-slate-50 border-slate-200 hover:border-slate-300'}`}>
                <span className="text-2xl">{phase.icon}</span>
                <span className={`text-xs font-bold ${selected === phase.id ? '' : 'text-slate-600'}`}>{phase.name}</span>
              </button>
              {i < phases.length - 1 && <ChevronRight className="w-4 h-4 text-slate-300 flex-shrink-0" />}
            </React.Fragment>
          ))}
          <ChevronRight className="w-4 h-4 text-slate-200 flex-shrink-0" />
          <div className="text-2xl text-slate-300 flex-shrink-0">↩</div>
        </div>

        {sel && (
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-slate-100 p-5">
              <div className={`inline-flex items-center gap-2 text-sm font-bold px-3 py-1.5 rounded-lg border mb-3 ${sel.color}`}>
                <span>{sel.icon}</span> {sel.name}
              </div>
              <p className="text-sm text-slate-700 leading-relaxed mb-4">{sel.description}</p>
              <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">Key Activities</h4>
              <ul className="space-y-1.5">
                {sel.activities.map((a, i) => <li key={i} className="text-sm text-slate-700 flex items-start gap-2"><span className="text-indigo-400 mt-0.5">→</span>{a}</li>)}
              </ul>
            </div>
            <div className="bg-white rounded-xl border border-slate-100 p-5">
              <h4 className="text-xs font-semibold text-slate-500 uppercase mb-3">Linked Tools in EarlyYearsOS</h4>
              <div className="space-y-2">
                {sel.tools.map((tool, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-indigo-50 rounded-xl">
                    <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="w-4 h-4 text-indigo-600" />
                    </div>
                    <span className="text-sm font-medium text-indigo-800">{tool}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
