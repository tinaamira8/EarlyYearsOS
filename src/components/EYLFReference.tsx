import React, { useState } from 'react';
import { BookOpen, Search, ChevronDown, ChevronRight } from 'lucide-react';

const outcomes = [
  {
    id: 1, title: 'Children Have a Strong Sense of Identity',
    color: 'rose',
    elements: [
      'Children feel safe, secure, and supported',
      'Children develop their emerging autonomy, inter-dependence, resilience and sense of agency',
      'Children develop knowledgeable and confident self-identities',
      'Children learn to interact in relation to others with care, empathy and respect',
    ],
    examples: ['Building trusting relationships with educators', 'Celebrating cultural heritage and home languages', 'Encouraging decision-making in daily routines'],
  },
  {
    id: 2, title: 'Children Are Connected With and Contribute to Their World',
    color: 'green',
    elements: [
      'Children develop a sense of belonging to groups and communities',
      'Children respond to diversity with respect',
      'Children become aware of fairness',
      'Children become socially responsible and show respect for the environment',
    ],
    examples: ['Community projects and excursions', 'Sustainability practices (composting, recycling)', 'Learning about First Nations peoples and cultures'],
  },
  {
    id: 3, title: 'Children Have a Strong Sense of Wellbeing',
    color: 'amber',
    elements: [
      'Children become strong in their social and emotional wellbeing',
      'Children take increasing responsibility for their own health and physical wellbeing',
    ],
    examples: ['Daily yoga and mindfulness for children', 'Healthy eating discussions', 'Physical outdoor play routines'],
  },
  {
    id: 4, title: 'Children Are Confident and Involved Learners',
    color: 'blue',
    elements: [
      'Children develop dispositions for learning such as curiosity, cooperation, confidence, creativity',
      'Children develop a range of skills and processes such as problem solving, inquiry, experimentation',
      'Children transfer and adapt what they have learned from one context to another',
      'Children resource their own learning through connecting with people, place, technologies and natural materials',
    ],
    examples: ['Open-ended investigation provocations', 'STEM activities and science experiments', 'Building on children\'s questions and wonderings'],
  },
  {
    id: 5, title: 'Children Are Effective Communicators',
    color: 'purple',
    elements: [
      'Children interact verbally and non-verbally with others for a range of purposes',
      'Children engage with a range of texts and gain meaning from these texts',
      'Children express ideas and make meaning using a range of media',
      'Children begin to understand how symbols and pattern systems work',
      'Children use information and communication technologies to access information, investigate ideas and represent their thinking',
    ],
    examples: ['Storytelling and book reading', 'Drawing, painting and mark-making', 'Morning group discussion and show and tell'],
  },
];

const colorMap: Record<string, string> = {
  rose: 'bg-rose-100 text-rose-700 border-rose-200',
  green: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  amber: 'bg-amber-100 text-amber-700 border-amber-200',
  blue: 'bg-blue-100 text-blue-700 border-blue-200',
  purple: 'bg-purple-100 text-purple-700 border-purple-200',
};

export const EYLFReference: React.FC = () => {
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<number | null>(null);

  const filtered = outcomes.filter(o => !search || o.title.toLowerCase().includes(search.toLowerCase()) || o.elements.some(e => e.toLowerCase().includes(search.toLowerCase())));

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-indigo-600" />
          </div>
          <div><h1 className="text-2xl font-bold text-slate-800">EYLF Reference</h1>
            <p className="text-slate-500 text-sm">Early Years Learning Framework outcomes and elements</p></div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Search outcomes..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        <div className="space-y-3">
          {filtered.map(o => (
            <div key={o.id} className={`rounded-xl border bg-white overflow-hidden`}>
              <button onClick={() => setExpanded(expanded === o.id ? null : o.id)} className="w-full flex items-center gap-4 p-4 text-left hover:bg-slate-50 transition-colors">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold border ${colorMap[o.color]}`}>{o.id}</div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-800 text-sm">Outcome {o.id}</p>
                  <p className="text-sm text-slate-600">{o.title}</p>
                </div>
                {expanded === o.id ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
              </button>
              {expanded === o.id && (
                <div className="px-4 pb-4 border-t border-slate-100 bg-slate-50">
                  <div className="pt-4 space-y-4">
                    <div>
                      <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">Learning Elements</h4>
                      <ul className="space-y-1.5">
                        {o.elements.map((el, i) => <li key={i} className="text-sm text-slate-700 flex items-start gap-2"><span className="text-indigo-400 mt-1">•</span>{el}</li>)}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">Practice Examples</h4>
                      <ul className="space-y-1.5">
                        {o.examples.map((ex, i) => <li key={i} className="text-sm text-emerald-700 flex items-start gap-2"><span className="text-emerald-400 mt-1">✓</span>{ex}</li>)}
                      </ul>
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
