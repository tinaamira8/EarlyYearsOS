import React, { useState } from 'react';
import { CheckCircle, Circle, GraduationCap, Loader2, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { generateSchoolReadinessPlan } from '../services/geminiService';

const children = [
  { id: 1, name: 'Emma Wilson', age: '4y 9m', room: 'Pre-Kindy' },
  { id: 2, name: 'Ava Chen', age: '4y 2m', room: 'Pre-Kindy' },
  { id: 3, name: 'Jack Thompson', age: '4y 5m', room: 'Pre-Kindy' },
];

const indicators: Record<string, string[]> = {
  'Self-Care': ['Dresses and undresses independently', 'Uses toilet independently', 'Washes hands correctly', 'Manages lunch box and bag'],
  'Language & Communication': ['Uses sentences of 5+ words', 'Retells a simple story', 'Asks and answers questions', 'Listens and follows instructions in a group'],
  'Social Skills': ['Takes turns and shares', 'Resolves conflict with words', 'Plays cooperatively in groups', 'Shows empathy to peers'],
  'Early Literacy': ['Recognises own name in writing', 'Shows interest in books', 'Identifies some letters', 'Understands print carries meaning'],
  'Early Numeracy': ['Counts to 20 reliably', 'Recognises numbers to 10', 'Sorts by colour, shape, size', 'Understands concepts: more/less, first/last'],
};

export const SchoolReadiness: React.FC = () => {
  const [selected, setSelected] = useState(children[0]);
  const totalItems = Object.values(indicators).flat().length;
  const [checks, setChecks] = useState<Record<string, Record<string, boolean>>>(() => {
    const c: Record<string, Record<string, boolean>> = {};
    children.forEach(ch => {
      c[ch.id] = {};
      Object.values(indicators).flat().forEach((item, i) => { c[ch.id][item] = Math.random() > 0.4; });
    });
    return c;
  });
  const [recommendations, setRecommendations] = useState<Array<{ title: string; description?: string; readinessSkill?: string }>>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const toggle = (item: string) => setChecks(c => ({ ...c, [selected.id]: { ...c[selected.id], [item]: !c[selected.id][item] } }));
  const done = Object.values(checks[selected.id] || {}).filter(Boolean).length;

  const generatePlan = async () => {
    const needs = Object.entries(checks[selected.id] || {}).filter(([, complete]) => !complete).map(([item]) => item);
    if (!needs.length) return toast.success('All current readiness indicators are marked complete.');
    setIsGenerating(true);
    try {
      setRecommendations(await generateSchoolReadinessPlan(needs.slice(0, 6).join(', '), 'use the child's observed interests recorded by educators'));
      toast.success('Readiness activities drafted for educator review.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'AI generation failed.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-sky-100 rounded-xl flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-sky-600" />
          </div>
          <div className="flex-1"><h1 className="text-2xl font-bold text-slate-800">School Readiness</h1>
            <p className="text-slate-500 text-sm">Track school readiness indicators for each child</p></div>
          <button disabled={isGenerating} onClick={() => void generatePlan()} className="flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm text-white disabled:opacity-50">{isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />} Suggest activities</button>
        </div>

        {recommendations.length ? <div className="grid gap-3 rounded-xl border border-violet-200 bg-violet-50 p-4 sm:grid-cols-3">{recommendations.map((item, index) => <div key={`${item.title}-${index}`} className="rounded-lg bg-white p-3"><strong className="text-sm text-violet-900">{item.title}</strong><p className="mt-1 text-xs text-slate-600">{item.description || item.readinessSkill}</p></div>)}</div> : null}

        <div className="flex gap-3">
          {children.map(c => {
            const d = Object.values(checks[c.id] || {}).filter(Boolean).length;
            const pct = Math.round((d / totalItems) * 100);
            return (
              <button key={c.id} onClick={() => setSelected(c)} className={`flex-1 text-left bg-white rounded-xl border p-4 transition-all ${selected.id === c.id ? 'border-sky-500 ring-2 ring-sky-100' : 'border-slate-100'}`}>
                <p className="font-medium text-slate-800">{c.name}</p>
                <p className="text-xs text-slate-500">{c.room} · {c.age}</p>
                <div className="mt-2">
                  <div className="flex justify-between text-xs text-slate-400 mb-1"><span>Readiness</span><span>{pct}%</span></div>
                  <div className="bg-slate-100 rounded-full h-2"><div className={`h-2 rounded-full ${pct >= 80 ? 'bg-emerald-400' : pct >= 60 ? 'bg-amber-400' : 'bg-red-400'}`} style={{ width: `${pct}%` }} /></div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="bg-white rounded-xl border border-slate-100 p-5">
          <div className="flex justify-between items-center mb-5">
            <h3 className="font-semibold text-slate-800">{selected.name} — Readiness Checklist</h3>
            <span className="text-sm font-semibold text-sky-600">{done}/{totalItems} indicators met</span>
          </div>
          <div className="space-y-6">
            {Object.entries(indicators).map(([domain, items]) => (
              <div key={domain}>
                <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">{domain}</h4>
                <div className="space-y-2">
                  {items.map(item => (
                    <button key={item} onClick={() => toggle(item)} className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-50 text-left transition-colors">
                      {checks[selected.id]?.[item] ? <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" /> : <Circle className="w-5 h-5 text-slate-200 flex-shrink-0" />}
                      <span className={`text-sm ${checks[selected.id]?.[item] ? 'text-slate-500' : 'text-slate-700'}`}>{item}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
