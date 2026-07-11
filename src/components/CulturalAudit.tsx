import React, { useState } from 'react';
import { AlertCircle, CheckCircle, Globe, Loader2, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { generateCulturalAuditSuggestions } from '../services/geminiService';
import { usePersistedState } from '../hooks/usePersistedState';

const categories = [
  {
    name: 'Environment',
    items: [
      { text: 'Dual language labels in learning areas (English + community language)', done: true },
      { text: 'Aboriginal and Torres Strait Islander artwork displayed respectfully', done: true },
      { text: 'Flags of families\' cultural backgrounds displayed', done: false },
      { text: 'Books and resources reflect diverse families and cultures', done: true },
      { text: 'Dolls and figures represent diverse ethnicities', done: false },
    ],
  },
  {
    name: 'Program',
    items: [
      { text: 'Cultural celebration days planned and documented', done: true },
      { text: 'Families invited to share cultural knowledge and stories', done: true },
      { text: 'Bush tucker and cultural food experiences offered', done: false },
      { text: 'NAIDOC and Reconciliation Week activities embedded in program', done: true },
      { text: 'Home languages heard and valued in program', done: false },
    ],
  },
  {
    name: 'Documentation',
    items: [
      { text: 'Enrolment forms collect cultural background and language info', done: true },
      { text: 'Cultural considerations documented in learning plans', done: false },
      { text: 'Reflections on cultural inclusivity in QIP', done: true },
      { text: 'Staff cultural competency professional development recorded', done: false },
    ],
  },
];

export const CulturalAudit: React.FC = () => {
  const [audit, setAudit] = usePersistedState('cultural_audit', categories);
  const [suggestions, setSuggestions] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const generateSuggestions = async () => {
    const incomplete = audit.flatMap(category => category.items).filter(item => !item.done).map(item => item.text);
    if (!incomplete.length) return toast.success('All current audit items are complete.');
    setIsGenerating(true);
    try {
      setSuggestions(await generateCulturalAuditSuggestions(incomplete));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'AI generation failed.');
    } finally {
      setIsGenerating(false);
    }
  };

  const toggle = (catIdx: number, itemIdx: number) => {
    setAudit(a => a.map((cat, ci) => ci !== catIdx ? cat : {
      ...cat,
      items: cat.items.map((item, ii) => ii !== itemIdx ? item : { ...item, done: !item.done }),
    }));
  };

  const totalItems = audit.flatMap(c => c.items).length;
  const doneItems = audit.flatMap(c => c.items).filter(i => i.done).length;
  const pct = Math.round((doneItems / totalItems) * 100);

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
            <Globe className="w-5 h-5 text-orange-600" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-slate-800">Cultural Audit</h1>
            <p className="text-slate-500 text-sm">Review your centre's cultural inclusivity practices</p>
          </div>
          <button disabled={isGenerating} onClick={() => void generateSuggestions()} className="flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm text-white disabled:opacity-50">
            {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />} Suggest actions
          </button>
        </div>

        {suggestions ? <div className="whitespace-pre-wrap rounded-xl border border-violet-200 bg-violet-50 p-5 text-sm leading-relaxed text-slate-700"><strong className="mb-2 block text-violet-900">AI suggestions — consult community and Traditional Owners</strong>{suggestions}</div> : null}

        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-5 text-white flex items-center justify-between">
          <div>
            <p className="text-orange-100 text-sm">Overall Cultural Inclusivity Score</p>
            <p className="text-4xl font-bold mt-1">{pct}%</p>
            <p className="text-orange-200 text-sm mt-1">{doneItems} of {totalItems} items complete</p>
          </div>
          <div className="w-20 h-20 rounded-full border-4 border-white/30 flex items-center justify-center">
            <span className="text-2xl font-bold">{pct}%</span>
          </div>
        </div>

        <div className="space-y-4">
          {audit.map((cat, ci) => {
            const catDone = cat.items.filter(i => i.done).length;
            return (
              <div key={cat.name} className="bg-white rounded-xl border border-slate-100 overflow-hidden">
                <div className="px-5 py-3 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="font-semibold text-slate-800">{cat.name}</h3>
                  <span className="text-xs text-slate-500">{catDone}/{cat.items.length} complete</span>
                </div>
                <div className="divide-y divide-slate-50">
                  {cat.items.map((item, ii) => (
                    <button key={ii} onClick={() => toggle(ci, ii)} className="w-full flex items-start gap-3 px-5 py-3 hover:bg-slate-50 text-left transition-colors">
                      {item.done
                        ? <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                        : <AlertCircle className="w-5 h-5 text-slate-200 flex-shrink-0 mt-0.5" />}
                      <span className={`text-sm ${item.done ? 'text-slate-500 line-through' : 'text-slate-700'}`}>{item.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
