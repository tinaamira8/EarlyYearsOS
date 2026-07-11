import React, { useState } from 'react';
import { Heart, Plus, Trash2 } from 'lucide-react';

const staffNames = ['Sarah Johnson', 'Mark Chen', 'Amy Davis', 'James Park', 'Jessica Turner'];
const questions = ['How are you feeling overall today?', 'How manageable is your workload?', 'Do you feel supported by your team?', 'How satisfied are you with your work-life balance?', 'How motivated are you in your role?'];

const mockHistory = [
  { month: 'Jan', avg: 3.8 }, { month: 'Feb', avg: 3.5 }, { month: 'Mar', avg: 4.0 },
  { month: 'Apr', avg: 3.7 }, { month: 'May', avg: 4.2 },
];

export const WellbeingTrends: React.FC = () => {
  const [tab, setTab] = useState<'overview' | 'checkin'>('overview');
  const [form, setForm] = useState({ staff: staffNames[0], answers: questions.map(() => 3) });
  const [submitted, setSubmitted] = useState(false);

  const submit = () => { setSubmitted(true); setTimeout(() => { setSubmitted(false); setTab('overview'); }, 1500); };
  const maxBar = Math.max(...mockHistory.map(h => h.avg));

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-pink-100 rounded-xl flex items-center justify-center">
            <Heart className="w-5 h-5 text-pink-600" />
          </div>
          <div className="flex-1"><h1 className="text-2xl font-bold text-slate-800">Staff Wellbeing</h1>
            <p className="text-slate-500 text-sm">Wellbeing check-ins and team trends</p></div>
        </div>

        <div className="flex gap-2">
          <button onClick={() => setTab('overview')} className={`px-4 py-2 text-sm rounded-lg font-medium ${tab === 'overview' ? 'bg-pink-600 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}>Team Overview</button>
          <button onClick={() => setTab('checkin')} className={`px-4 py-2 text-sm rounded-lg font-medium ${tab === 'checkin' ? 'bg-pink-600 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}>New Check-in</button>
        </div>

        {tab === 'overview' && (
          <>
            <div className="bg-white rounded-xl border border-slate-100 p-5">
              <h3 className="font-semibold text-slate-800 mb-4">Monthly Average Wellbeing Score (out of 5)</h3>
              <div className="flex items-end gap-3 h-32">
                {mockHistory.map(m => (
                  <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-xs font-semibold text-pink-600">{m.avg}</span>
                    <div className="w-full bg-pink-100 rounded-t" style={{ height: `${(m.avg / 5) * 100}%` }}>
                      <div className="w-full h-full bg-pink-400 rounded-t" />
                    </div>
                    <span className="text-xs text-slate-500">{m.month}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-100 p-5">
              <h3 className="font-semibold text-slate-800 mb-4">Team Averages by Question</h3>
              <div className="space-y-3">
                {questions.map((q, i) => {
                  const score = 3 + Math.random() * 1.5;
                  return (
                    <div key={i}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-600">{q}</span>
                        <span className="font-semibold text-pink-600">{score.toFixed(1)}/5</span>
                      </div>
                      <div className="bg-slate-100 rounded-full h-2"><div className="bg-pink-400 h-2 rounded-full" style={{ width: `${(score / 5) * 100}%` }} /></div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {tab === 'checkin' && (
          <div className="bg-white rounded-xl border border-slate-100 p-5 space-y-5">
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Staff Member</label>
              <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" value={form.staff} onChange={e => setForm(f => ({ ...f, staff: e.target.value }))}>
                {staffNames.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            {questions.map((q, i) => (
              <div key={i}>
                <label className="text-sm text-slate-700 mb-2 block">{q}</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(n => (
                    <button key={n} onClick={() => setForm(f => ({ ...f, answers: f.answers.map((a, ai) => ai === i ? n : a) }))} className={`w-10 h-10 rounded-lg font-semibold text-sm transition-colors ${form.answers[i] === n ? 'bg-pink-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-pink-100'}`}>{n}</button>
                  ))}
                  <span className="text-xs text-slate-400 self-center ml-1">{['', 'Poor', 'Below avg', 'Average', 'Good', 'Excellent'][form.answers[i]]}</span>
                </div>
              </div>
            ))}
            <button onClick={submit} className={`w-full py-2.5 rounded-lg text-sm font-medium transition-all ${submitted ? 'bg-emerald-600 text-white' : 'bg-pink-600 text-white hover:bg-pink-700'}`}>
              {submitted ? '✓ Check-in Submitted!' : 'Submit Check-in'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
