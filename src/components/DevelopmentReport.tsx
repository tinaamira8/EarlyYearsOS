import React, { useState } from 'react';
import { Activity, Loader2, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { generateDevelopmentSummary } from '../services/geminiService';

const children = [
  { id: 1, name: 'Leo Martinez', room: 'Toddlers', ageGroup: '2-3 years' },
  { id: 2, name: 'Emma Wilson', room: 'Pre-Kindy', ageGroup: '4-5 years' },
  { id: 3, name: 'Noah Kim', room: 'Toddlers', ageGroup: '2-3 years' },
  { id: 4, name: 'Mia Johnson', room: 'Babies', ageGroup: '0-1 years' },
];

const domains: Record<string, string[]> = {
  'Physical Development': ['Gross motor skills (running, jumping, climbing)', 'Fine motor skills (cutting, drawing, puzzles)', 'Body coordination and balance'],
  'Social & Emotional': ['Self-regulation and emotional management', 'Building friendships with peers', 'Showing empathy and care'],
  'Communication & Language': ['Expressive language (speaking, vocabulary)', 'Receptive language (listening, understanding)', 'Emergent literacy (interest in books, letters)'],
  'Cognitive Development': ['Problem solving and inquiry', 'Mathematical understanding', 'Creativity and imagination'],
};

const levels = ['Below expected', 'Approaching expected', 'At expected level', 'Beyond expected'];
const levelColors = ['bg-red-100 text-red-700', 'bg-amber-100 text-amber-700', 'bg-emerald-100 text-emerald-700', 'bg-blue-100 text-blue-700'];

export const DevelopmentReport: React.FC = () => {
  const [selected, setSelected] = useState(children[0]);
  const [ratings, setRatings] = useState<Record<string, string>>({});
  const [summary, setSummary] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const setRating = (item: string, level: string) => setRatings(r => ({ ...r, [item]: level }));

  const generateSummary = async () => {
    const entries = Object.entries(ratings).filter(([key]) => key.startsWith(`${selected.id}:`));
    if (!entries.length) return toast.error('Complete at least one developmental rating first.');
    setIsGenerating(true);
    try {
      const evidence = entries.map(([key, value]) => `${key.split(':').slice(1).join(':')}: ${value}`).join('; ');
      setSummary(await generateDevelopmentSummary('the child', 'Term 2', evidence, 'Suggest educator-led next steps based only on these ratings.'));
      toast.success('Development summary drafted for educator review.');
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
            <Activity className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="flex-1"><h1 className="text-2xl font-bold text-slate-800">Development Report</h1>
            <p className="text-slate-500 text-sm">Developmental progress across key domains</p></div>
          <button disabled={isGenerating} type="button" onClick={() => void generateSummary()} className="flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm text-white disabled:opacity-50">{isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />} Draft summary</button>
          <button type="button" onClick={() => window.print()} className="bg-indigo-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-indigo-700">Generate PDF</button>
        </div>

        {summary ? <div className="whitespace-pre-wrap rounded-xl border border-violet-200 bg-white p-5 text-sm leading-relaxed text-slate-700"><strong className="mb-2 block text-violet-900">AI-assisted summary — educator review required</strong>{summary}</div> : null}

        <div className="flex gap-3 flex-wrap">
          {children.map(c => (
            <button key={c.id} onClick={() => setSelected(c)} className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${selected.id === c.id ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white border-slate-200 text-slate-700'}`}>{c.name}</button>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-slate-100 p-5">
          <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-semibold text-slate-800 text-lg">{selected.name}</h3>
              <p className="text-xs text-slate-500">{selected.room} · Age group: {selected.ageGroup}</p>
            </div>
            <div className="text-xs text-slate-400">Period: Term 2 2026</div>
          </div>

          <div className="space-y-6">
            {Object.entries(domains).map(([domain, items]) => (
              <div key={domain}>
                <h4 className="font-semibold text-slate-700 text-sm uppercase tracking-wide mb-3">{domain}</h4>
                <div className="space-y-3">
                  {items.map(item => (
                    <div key={item} className="flex items-center justify-between gap-4 py-2 border-b border-slate-50">
                      <span className="text-sm text-slate-700 flex-1">{item}</span>
                      <div className="flex gap-1">
                        {levels.map((level, i) => (
                          <button key={level} onClick={() => setRating(`${selected.id}:${item}`, level)} title={level} className={`w-6 h-6 rounded text-xs transition-all ${ratings[`${selected.id}:${item}`] === level ? levelColors[i] + ' ring-2 ring-offset-1 ring-indigo-400' : 'bg-slate-100 hover:bg-slate-200'}`}>{i + 1}</button>
                        ))}
                      </div>
                      {ratings[`${selected.id}:${item}`] && (
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium w-40 text-center ${levelColors[levels.indexOf(ratings[`${selected.id}:${item}`])]}`}>{ratings[`${selected.id}:${item}`]}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-400">
          {levels.map((level, i) => <div key={level} className="flex items-center gap-1"><span className={`w-4 h-4 rounded ${levelColors[i]} flex items-center justify-center font-bold text-[10px]`}>{i + 1}</span>{level}</div>)}
        </div>
      </div>
    </div>
  );
};
