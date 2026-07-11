import React, { useState } from 'react';
import { Loader2, PenSquare, Plus, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { generateCriticalReflection } from '../services/geminiService';
import { usePersistedState } from '../hooks/usePersistedState';

const prompts = [
  'What happened? (Describe the event, activity, or situation)',
  'What values and beliefs shaped this situation?',
  'What does research or theory tell us about this?',
  'How will this inform our future practice?',
];

const initialReflections = [
  { id: 1, date: '2026-05-20', topic: 'Outdoor play risk management', author: 'Amy Davis', content: 'After reviewing our outdoor supervision practices, I noticed children were not being afforded enough opportunity for risk-taking play. Research by Brussoni et al. (2015) supports the benefits of risky play for development...' },
  { id: 2, date: '2026-05-15', topic: 'Supporting dual language learners', author: 'Sarah Johnson', content: 'We welcomed a new family whose primary language is Mandarin. This prompted me to reflect on our approach to bilingual children and whether our environment truly reflects cultural diversity...' },
];

export const CriticalReflection: React.FC = () => {
  const [reflections, setReflections] = usePersistedState('critical_reflections', initialReflections);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ topic: '', author: 'Amy Davis', answers: prompts.map(() => '') });
  const [isGenerating, setIsGenerating] = useState(false);

  const generateDraft = async () => {
    if (!form.topic.trim()) return toast.error('Enter a reflection topic first.');
    setIsGenerating(true);
    try {
      const draft = await generateCriticalReflection(form.topic, form.answers.filter(Boolean).join('\n'));
      setForm(current => ({ ...current, answers: current.answers.map((answer, index) => index === 3 ? draft : answer) }));
      toast.success('AI suggestions added to future practice for review.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'AI generation failed.');
    } finally {
      setIsGenerating(false);
    }
  };

  const save = () => {
    if (!form.topic) return;
    const content = form.answers.filter(Boolean).join('\n\n');
    setReflections(r => [...r, { id: Date.now(), date: new Date().toISOString().split('T')[0], topic: form.topic, author: form.author, content }]);
    setForm({ topic: '', author: 'Amy Davis', answers: prompts.map(() => '') });
    setShowForm(false);
  };

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
            <PenSquare className="w-5 h-5 text-purple-600" />
          </div>
          <div className="flex-1"><h1 className="text-2xl font-bold text-slate-800">Critical Reflection</h1>
            <p className="text-slate-500 text-sm">Structured professional reflection journal</p></div>
          <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-indigo-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-indigo-700">
            <Plus className="w-4 h-4" /> New Reflection
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
            <h3 className="font-semibold text-slate-800">New Critical Reflection</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2"><label className="text-xs text-slate-500 mb-1 block">Reflection Topic</label>
                <input className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" value={form.topic} onChange={e => setForm(f => ({ ...f, topic: e.target.value }))} /></div>
              <div><label className="text-xs text-slate-500 mb-1 block">Author</label>
                <input className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" value={form.author} onChange={e => setForm(f => ({ ...f, author: e.target.value }))} /></div>
            </div>
            {prompts.map((prompt, i) => (
              <div key={i}>
                <label className="text-xs font-medium text-purple-700 mb-1 block">{prompt}</label>
                <textarea className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" rows={3} value={form.answers[i]} onChange={e => setForm(f => ({ ...f, answers: f.answers.map((a, ai) => ai === i ? e.target.value : a) }))} />
              </div>
            ))}
            <div className="flex gap-2 justify-end">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm border border-slate-200 rounded-lg">Cancel</button>
              <button disabled={isGenerating} onClick={() => void generateDraft()} className="flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm text-white disabled:opacity-50">
                {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />} Suggest with AI
              </button>
              <button onClick={save} className="px-4 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700">Save Reflection</button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {reflections.map(r => (
            <div key={r.id} className="bg-white rounded-xl border border-slate-100 p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-slate-800">{r.topic}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{r.author} · {r.date}</p>
                </div>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">{r.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
