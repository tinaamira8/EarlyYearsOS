import React, { useState } from 'react';
import { FileSignature, Loader2, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { generateTransitionStatement } from '../services/geminiService';

const children = [
  { id: 1, name: 'Emma Wilson', dob: '2021-07-22', room: 'Pre-Kindy', destSchool: 'Sunshine State Primary', status: 'Draft' },
  { id: 2, name: 'Ava Chen', dob: '2020-05-18', room: 'Pre-Kindy', destSchool: 'Rainbow Valley Public', status: 'Complete' },
];

const template = {
  strengths: '',
  dispositions: '',
  relationships: '',
  keyExperiences: '',
  additionalInfo: '',
};

export const TransitionStatements: React.FC = () => {
  const [selected, setSelected] = useState(children[0]);
  const [forms, setForms] = useState<Record<number, typeof template>>({
    1: { strengths: 'Emma is a confident and enthusiastic learner who approaches new challenges with persistence and joy. She has a strong sense of identity and communicates her thoughts clearly.', dispositions: 'Curiosity, creativity, persistence, and empathy. Emma shows a genuine love of learning, especially around science and nature exploration.', relationships: 'Emma has formed strong friendships with peers and responds well to adult guidance. She is empathetic and often supports other children.', keyExperiences: 'Participated in our Bugs and Mini-Beasts inquiry project, collaborative mural project, and school readiness program.', additionalInfo: 'Emma\'s family are supportive and engaged. She is ready and excited for the transition to school.' },
    2: template,
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const update = (field: keyof typeof template, value: string) => setForms(f => ({ ...f, [selected.id]: { ...f[selected.id], [field]: value } }));

  const generateDraft = async () => {
    const current = forms[selected.id] || template;
    if (!Object.values(current).some(value => value.trim())) return toast.error('Add educator notes before generating a transition draft.');
    setIsGenerating(true);
    try {
      const result = await generateTransitionStatement('the child', current.strengths, `${current.dispositions}\n${current.keyExperiences}`, current.relationships, current.additionalInfo);
      setForms(existing => ({ ...existing, [selected.id]: result }));
      toast.success('Transition draft generated. Educator review is required.');
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
          <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
            <FileSignature className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="flex-1"><h1 className="text-2xl font-bold text-slate-800">Transition Statements</h1>
            <p className="text-slate-500 text-sm">Prepare transition to school statements for graduating children</p></div>
        </div>

        <div className="flex gap-3">
          {children.map(c => (
            <button key={c.id} onClick={() => setSelected(c)} className={`flex-1 text-left bg-white rounded-xl border p-4 transition-all ${selected.id === c.id ? 'border-indigo-500 ring-2 ring-indigo-100' : 'border-slate-100'}`}>
              <p className="font-medium text-slate-800">{c.name}</p>
              <p className="text-xs text-slate-500">{c.destSchool}</p>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium mt-1 inline-block ${c.status === 'Complete' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{c.status}</span>
            </button>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-slate-100 p-6 space-y-5">
          <div className="flex justify-between items-center border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-semibold text-slate-800 text-lg">{selected.name}</h3>
              <p className="text-xs text-slate-500">DOB: {selected.dob} · Transitioning to: {selected.destSchool}</p>
            </div>
            <button disabled={isGenerating} type="button" onClick={() => void generateDraft()} className="flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm text-white hover:bg-violet-700 disabled:opacity-50">
              {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />} Draft with AI
            </button>
            <button type="button" onClick={() => window.print()} className="bg-indigo-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-indigo-700">Save & Print</button>
          </div>

          {[
            { key: 'strengths' as const, label: "Child's Strengths, Interests and Abilities" },
            { key: 'dispositions' as const, label: 'Learning Dispositions' },
            { key: 'relationships' as const, label: 'Relationships and Social Development' },
            { key: 'keyExperiences' as const, label: 'Key Learning Experiences' },
            { key: 'additionalInfo' as const, label: 'Additional Information for Receiving School' },
          ].map(f => (
            <div key={f.key}>
              <label className="text-sm font-semibold text-slate-700 mb-1.5 block">{f.label}</label>
              <textarea className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500" rows={4} value={forms[selected.id]?.[f.key] || ''} onChange={e => update(f.key, e.target.value)} placeholder={`Enter ${f.label.toLowerCase()}...`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
