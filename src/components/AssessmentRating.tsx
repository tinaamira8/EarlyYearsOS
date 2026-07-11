import React, { useState } from 'react';
import { Star, CheckCircle, Circle, AlertTriangle } from 'lucide-react';

const qualityAreas = [
  {
    id: 1, title: 'Educational Program and Practice',
    elements: [
      { id: '1.1', text: 'An approved learning framework informs the curriculum decision-making of educators' },
      { id: '1.2', text: 'Educators facilitate and extend each child\'s learning and development' },
      { id: '1.3', text: 'Educators and coordinators take a planned and reflective approach to implementing the program' },
    ],
  },
  {
    id: 2, title: 'Children\'s Health and Safety',
    elements: [
      { id: '2.1', text: 'Each child\'s health needs are supported' },
      { id: '2.2', text: 'Effective illness and injury management and hygiene practices are promoted and implemented' },
      { id: '2.3', text: 'Each child is kept safe and protected' },
    ],
  },
  {
    id: 3, title: 'Physical Environment',
    elements: [
      { id: '3.1', text: 'The design and location of the premises is appropriate for the operations of a service' },
      { id: '3.2', text: 'The environment is inclusive, promotes competence, independent exploration and learning through play' },
    ],
  },
  {
    id: 4, title: 'Staffing Arrangements',
    elements: [
      { id: '4.1', text: 'Staffing arrangements enhance children\'s learning and development' },
      { id: '4.2', text: 'Management, educators and staff are collaborative, respectful and ethical' },
    ],
  },
  {
    id: 5, title: 'Relationships with Children',
    elements: [
      { id: '5.1', text: 'Respectful and equitable relationships are maintained with each child' },
      { id: '5.2', text: 'Each child is supported to build and maintain sensitive and responsive relationships with other children and adults' },
    ],
  },
  {
    id: 6, title: 'Collaborative Partnerships with Families and Communities',
    elements: [
      { id: '6.1', text: 'Respectful relationships with families are developed and maintained' },
      { id: '6.2', text: 'Families are supported in their parenting role and their values and beliefs about child rearing are respected' },
      { id: '6.3', text: 'The service collaborates with other organisations and service providers to enhance children\'s learning' },
    ],
  },
  {
    id: 7, title: 'Governance and Leadership',
    elements: [
      { id: '7.1', text: 'Governance supports the operation of a quality service' },
      { id: '7.2', text: 'Effective leadership builds and promotes a positive organisational culture and professional learning community' },
    ],
  },
];

const ratings = ['Working Towards', 'Meeting', 'Exceeding'];
const ratingColors: Record<string, string> = {
  'Working Towards': 'bg-amber-100 text-amber-700',
  'Meeting': 'bg-emerald-100 text-emerald-700',
  'Exceeding': 'bg-blue-100 text-blue-700',
};

export const AssessmentRating: React.FC = () => {
  const [selected, setSelected] = useState<number | null>(null);
  const [ratings2, setRatings2] = useState<Record<string, string>>({
    '1.1': 'Exceeding', '1.2': 'Meeting', '1.3': 'Meeting',
    '2.1': 'Meeting', '2.2': 'Meeting', '2.3': 'Meeting',
    '3.1': 'Meeting', '3.2': 'Exceeding',
    '4.1': 'Meeting', '4.2': 'Exceeding',
    '5.1': 'Exceeding', '5.2': 'Meeting',
    '6.1': 'Meeting', '6.2': 'Meeting', '6.3': 'Working Towards',
    '7.1': 'Meeting', '7.2': 'Meeting',
  });

  const exceeding = Object.values(ratings2).filter(r => r === 'Exceeding').length;
  const meeting = Object.values(ratings2).filter(r => r === 'Meeting').length;
  const working = Object.values(ratings2).filter(r => r === 'Working Towards').length;

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
            <Star className="w-5 h-5 text-yellow-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Assessment & Rating</h1>
            <p className="text-slate-500 text-sm">Self-assessment against the National Quality Standard</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{exceeding}</div>
            <div className="text-xs text-blue-500 font-medium">Exceeding</div>
          </div>
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-emerald-600">{meeting}</div>
            <div className="text-xs text-emerald-500 font-medium">Meeting</div>
          </div>
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-amber-600">{working}</div>
            <div className="text-xs text-amber-500 font-medium">Working Towards</div>
          </div>
        </div>

        <div className="space-y-3">
          {qualityAreas.map(qa => (
            <div key={qa.id} className="bg-white rounded-xl border border-slate-100 overflow-hidden">
              <button onClick={() => setSelected(selected === qa.id ? null : qa.id)} className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-slate-50 transition-colors">
                <div className="w-9 h-9 rounded-lg bg-yellow-100 flex items-center justify-center text-yellow-700 font-bold text-sm flex-shrink-0">{qa.id}</div>
                <div className="flex-1"><p className="font-semibold text-slate-800 text-sm">QA {qa.id}: {qa.title}</p></div>
              </button>
              {selected === qa.id && (
                <div className="border-t border-slate-100 divide-y divide-slate-50">
                  {qa.elements.map(el => (
                    <div key={el.id} className="px-5 py-3 flex items-center justify-between gap-4">
                      <div>
                        <span className="text-xs font-bold text-slate-400 mr-2">Element {el.id}</span>
                        <span className="text-sm text-slate-700">{el.text}</span>
                      </div>
                      <div className="flex gap-1 flex-shrink-0">
                        {ratings.map(r => (
                          <button key={r} onClick={() => setRatings2(prev => ({ ...prev, [el.id]: r }))} className={`px-2 py-1 text-xs rounded font-medium transition-colors ${ratings2[el.id] === r ? ratingColors[r] : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>{r === 'Working Towards' ? 'Working' : r}</button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
