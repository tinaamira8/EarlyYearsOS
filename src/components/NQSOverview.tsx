import React, { useState } from 'react';
import { Shield, CheckCircle, AlertTriangle, Clock, ChevronDown, ChevronUp } from 'lucide-react';

const areas = [
  { id: 'QA1', title: 'QA1: Educational Program and Practice', rating: 'Meeting', score: 78, color: 'blue' },
  { id: 'QA2', title: 'QA2: Children\'s Health and Safety', rating: 'Exceeding', score: 92, color: 'green' },
  { id: 'QA3', title: 'QA3: Physical Environment', rating: 'Meeting', score: 81, color: 'blue' },
  { id: 'QA4', title: 'QA4: Staffing Arrangements', rating: 'Working Towards', score: 58, color: 'amber' },
  { id: 'QA5', title: 'QA5: Relationships with Children', rating: 'Exceeding', score: 95, color: 'green' },
  { id: 'QA6', title: 'QA6: Collaborative Partnerships', rating: 'Meeting', score: 74, color: 'blue' },
  { id: 'QA7', title: 'QA7: Governance and Leadership', rating: 'Meeting', score: 80, color: 'blue' },
];

const ratingColors: Record<string, string> = {
  'Exceeding': 'bg-emerald-100 text-emerald-700',
  'Meeting': 'bg-blue-100 text-blue-700',
  'Working Towards': 'bg-amber-100 text-amber-700',
};

interface NQSOverviewProps { onSelectArea?: (area: string) => void; }

export const NQSOverview: React.FC<NQSOverviewProps> = ({ onSelectArea }) => {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [evidenceArea, setEvidenceArea] = useState<string | null>(null);
  const overall = Math.round(areas.reduce((s, a) => s + a.score, 0) / areas.length);

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
            <Shield className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">NQS Overview</h1>
            <p className="text-slate-500 text-sm">National Quality Standard self-assessment</p>
          </div>
          <div className="ml-auto text-center">
            <div className="text-3xl font-bold text-indigo-600">{overall}%</div>
            <div className="text-xs text-slate-500">Overall Score</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {['Exceeding', 'Meeting', 'Working Towards'].map(r => (
            <div key={r} className="bg-white rounded-xl p-4 border border-slate-100 text-center">
              <div className="text-2xl font-bold text-slate-800">{areas.filter(a => a.rating === r).length}</div>
              <div className={`text-xs font-medium mt-1 px-2 py-0.5 rounded-full inline-block ${ratingColors[r]}`}>{r}</div>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          {areas.map(area => (
            <div key={area.id} className="bg-white rounded-xl border border-slate-100 overflow-hidden">
              <button
                onClick={() => setExpanded(expanded === area.id ? null : area.id)}
                className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors text-left"
              >
                <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-indigo-600">{area.id}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-800 text-sm">{area.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 bg-slate-100 rounded-full h-1.5">
                      <div className={`h-1.5 rounded-full ${area.score >= 85 ? 'bg-emerald-500' : area.score >= 65 ? 'bg-blue-500' : 'bg-amber-500'}`} style={{ width: `${area.score}%` }} />
                    </div>
                    <span className="text-xs text-slate-500">{area.score}%</span>
                  </div>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${ratingColors[area.rating]}`}>{area.rating}</span>
                {expanded === area.id ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>
              {expanded === area.id && (
                <div className="px-4 pb-4 border-t border-slate-100 bg-slate-50">
                  <div className="pt-3 flex gap-3">
                    <button onClick={() => onSelectArea?.(area.id)} className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition-colors">
                      Open QIP Goal Planner
                    </button>
                    <button type="button" onClick={() => setEvidenceArea(evidenceArea === area.id ? null : area.id)} className="text-xs border border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors">
                      View Evidence
                    </button>
                  </div>
                  {evidenceArea === area.id ? (
                    <div className="mt-3 rounded-lg border border-slate-200 bg-white p-3 text-xs text-slate-600" role="status">
                      Evidence register: self-assessment notes, staff reflections, policy reviews, and improvement actions for {area.id}.
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
