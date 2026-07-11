import React, { useState } from 'react';
import { Award, ChevronDown, ChevronRight } from 'lucide-react';

const standards = [
  { id: 1, title: 'Know children and how they learn', description: 'Understand child development, learning styles and individual differences.', elements: ['Understand learning stages and sequences', 'Know students and how they learn', 'Value and promote cultural diversity'] },
  { id: 2, title: 'Know the content and how to teach it', description: 'Know the early learning framework and how to plan effective learning experiences.', elements: ['Content and curriculum knowledge', 'Content selection and organisation', 'Curriculum, assessment and reporting'] },
  { id: 3, title: 'Plan for and implement effective teaching and learning', description: 'Design engaging, play-based learning environments.', elements: ['Establish challenging learning goals', 'Plan, structure and sequence learning programs', 'Use teaching strategies and behaviour guidance'] },
  { id: 4, title: 'Create and maintain supportive and safe learning environments', description: 'Build safe, inclusive and respectful learning communities.', elements: ['Support children\'s participation', 'Manage learning environments', 'Maintain safe environments'] },
  { id: 5, title: 'Assess, provide feedback and report on learning', description: 'Observe, document and report on children\'s learning.', elements: ['Assess learning and development', 'Provide feedback', 'Make consistent and comparable judgements'] },
  { id: 6, title: 'Engage in professional learning', description: 'Improve professional knowledge and practice through ongoing learning.', elements: ['Identify and plan for professional needs', 'Engage with colleagues and improve practice', 'Apply professional learning'] },
  { id: 7, title: 'Engage professionally with colleagues, parents/carers and the community', description: 'Build collaborative partnerships with families and the broader community.', elements: ['Meet professional ethics and responsibilities', 'Comply with legislative and regulatory requirements', 'Engage with parents/carers, colleagues and community'] },
];

const ratings = ['Not Yet', 'Beginning', 'Developing', 'Proficient', 'Expert'];
const ratingColors: Record<string, string> = {
  'Not Yet': 'bg-slate-100 text-slate-500', 'Beginning': 'bg-amber-100 text-amber-700', 'Developing': 'bg-blue-100 text-blue-700',
  'Proficient': 'bg-indigo-100 text-indigo-700', 'Expert': 'bg-emerald-100 text-emerald-700',
};

export const ProfessionalStandardsMapping: React.FC = () => {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [myRatings, setMyRatings] = useState<Record<number, string>>({ 1: 'Proficient', 2: 'Developing', 3: 'Proficient', 4: 'Expert', 5: 'Developing', 6: 'Beginning', 7: 'Proficient' });

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
            <Award className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Professional Standards Mapping</h1>
            <p className="text-slate-500 text-sm">Self-assess against the Australian Professional Standards</p>
          </div>
        </div>

        <div className="space-y-3">
          {standards.map(s => (
            <div key={s.id} className="bg-white rounded-xl border border-slate-100 overflow-hidden">
              <button onClick={() => setExpanded(expanded === s.id ? null : s.id)} className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 text-left transition-colors">
                <div className="w-9 h-9 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-700 font-bold text-sm flex-shrink-0">{s.id}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-800 text-sm">Standard {s.id}: {s.title}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${ratingColors[myRatings[s.id] || 'Not Yet']}`}>{myRatings[s.id] || 'Not Yet'}</span>
                {expanded === s.id ? <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" /> : <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" />}
              </button>
              {expanded === s.id && (
                <div className="px-4 pb-4 border-t border-slate-100 bg-slate-50">
                  <p className="text-xs text-slate-500 mt-3 mb-3">{s.description}</p>
                  <ul className="space-y-1 mb-4">
                    {s.elements.map((el, i) => <li key={i} className="text-xs text-slate-600 flex items-start gap-2"><span className="text-indigo-400">•</span>{el}</li>)}
                  </ul>
                  <div>
                    <label className="text-xs font-medium text-slate-600 mb-2 block">My self-assessment rating:</label>
                    <div className="flex gap-2 flex-wrap">
                      {ratings.map(r => (
                        <button key={r} onClick={() => setMyRatings(prev => ({ ...prev, [s.id]: r }))} className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-colors ${myRatings[s.id] === r ? ratingColors[r] + ' ring-2 ring-offset-1 ring-indigo-400' : 'bg-white border border-slate-200 text-slate-600'}`}>{r}</button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
