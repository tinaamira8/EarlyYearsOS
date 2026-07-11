import React, { useState } from 'react';
import { Star, Plus, Sparkles, Loader2, Wand2, BookOpen, FileText, X, Search, Lightbulb, ClipboardList, Play, RotateCcw, ChevronDown, ChevronUp, Save, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import { safeGenerateContent } from '../services/geminiService';
import { usePersistedState } from '../hooks/usePersistedState';
import { exportLearningStoryPDF } from '../services/exportEngine';
import { ImageUpload } from './ImageUpload';

type PlanningCycle = { analyse: string; plan: string; implement: string; reflect: string };

type JournalEntry = {
  id: number; date: string; educator: string; type: string; child: string;
  title: string; text: string; outcomes: string[]; cycle: PlanningCycle;
  photos?: string[];
};

const emptyCycle: PlanningCycle = { analyse: '', plan: '', implement: '', reflect: '' };

const entries: JournalEntry[] = [
  { id: 1, date: '2026-05-23', educator: 'Sarah Johnson', type: 'Learning Story', child: 'Leo Martinez', title: 'Leo the Builder', text: 'Today, Leo spent 40 minutes at the block area, carefully constructing a "rocket ship". He narrated his actions, explaining each part and inviting friends to join. This beautiful moment shows his emerging sense of agency, creativity, and collaborative play...', outcomes: ['Outcome 1', 'Outcome 4', 'Outcome 5'], cycle: { analyse: 'Leo demonstrated sustained concentration and creative thinking. His narration of the building process shows advanced language development and the ability to sequence ideas. He invited peers to join, demonstrating emerging leadership and collaborative dispositions.', plan: 'Extend Leo\'s construction interest by introducing more complex building materials (cardboard boxes, tubes, tape). Set up a "design studio" provocation with blueprint paper and pencils so he can plan before building.', implement: '', reflect: '' } },
  { id: 2, date: '2026-05-22', educator: 'Amy Davis', type: 'Observation', child: 'Emma Wilson', title: 'Emma\'s Nature Curiosity', text: 'During outdoor play, Emma found a caterpillar on a leaf. She showed peers and asked "will it turn into a butterfly?" — a wonderful moment of scientific thinking and curiosity.', outcomes: ['Outcome 2', 'Outcome 4'], cycle: { analyse: 'Emma is showing a natural curiosity about the living world and life cycles. Her question about metamorphosis indicates she already has some prior knowledge. Sharing the discovery with peers shows social confidence and a desire to co-construct knowledge.', plan: 'Source a butterfly observation kit so children can watch the full life cycle. Provide non-fiction books about caterpillars and butterflies. Plan a small-group investigation using magnifying glasses in the garden.', implement: 'Ordered a painted lady butterfly kit. Set up a nature investigation table with magnifying glasses, clipboards and insect identification cards. Read "The Very Hungry Caterpillar" at group time to spark further discussion.', reflect: 'The butterfly kit arrived and the children were captivated. Emma took ownership of daily observation checks. Several other children joined the investigation, suggesting this could become a longer project on mini-beasts.' } },
  { id: 3, date: '2026-05-21', educator: 'Sarah Johnson', type: 'Learning Story', child: 'Noah Kim', title: 'Noah Finds His Voice', text: 'Over the past two weeks, Noah has been increasingly initiating communication with educators and peers. Today he asked for his favourite book by pointing and using two-word sentences — a significant milestone!', outcomes: ['Outcome 1', 'Outcome 5'], cycle: { analyse: '', plan: '', implement: '', reflect: '' } },
];

const types = ['Learning Story', 'Observation', 'Portfolio Entry', 'Milestone', 'Anecdote'];
const outcomeOptions = ['Outcome 1', 'Outcome 2', 'Outcome 3', 'Outcome 4', 'Outcome 5'];
const OUTCOME_LABELS: Record<string, string> = {
  'Outcome 1': 'Children have a strong sense of identity',
  'Outcome 2': 'Children are connected with and contribute to their world',
  'Outcome 3': 'Children have a strong sense of wellbeing',
  'Outcome 4': 'Children are confident and involved learners',
  'Outcome 5': 'Children are effective communicators',
};

const AI_PROMPTS = {
  expand: (jottings: string, child: string, type: string) =>
    `You are an experienced Australian Early Childhood Educator. A staff member has written quick jottings about a child. Expand these jottings into a professional ${type} suitable for a portfolio or digital journal.\n\nChild: ${child}\nJottings: ${jottings}\n\nWrite 2-3 paragraphs in warm, professional educator language. Use first-person plural ("we noticed", "we observed"). Include what the child did, what it tells us about their learning, and how we can extend this. Do NOT include headings or bullet points — write flowing narrative text only.`,

  title: (text: string, child: string) =>
    `Suggest a short, engaging title (5-8 words max) for this learning story or observation about a child named ${child}. Return ONLY the title, nothing else.\n\nText: ${text}`,

  outcomes: (text: string) =>
    `Based on this observation or learning story, which EYLF V2.0 Learning Outcomes are most relevant? Return ONLY a JSON array of outcome numbers like [1, 4, 5]. Choose 1-3 outcomes.\n\nOutcome 1: Children have a strong sense of identity\nOutcome 2: Children are connected with and contribute to their world\nOutcome 3: Children have a strong sense of wellbeing\nOutcome 4: Children are confident and involved learners\nOutcome 5: Children are effective communicators\n\nText: ${text}`,

  improve: (text: string) =>
    `You are an expert ECE documentation writer. Improve this observation/learning story text. Make it more professional, EYLF-aligned, and reflective. Keep the same meaning and events but enhance the language, add educator reflection, and suggest next steps. Return ONLY the improved text (2-3 paragraphs), no headings or preamble.\n\nOriginal: ${text}`,
};

export const DigitalJournal: React.FC = () => {
  const [docs, setDocs] = usePersistedState<JournalEntry[]>('digital_journal_entries', entries);
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [form, setForm] = useState({ date: new Date().toISOString().split('T')[0], educator: 'Sarah Johnson', type: 'Learning Story', child: 'Leo Martinez', title: '', text: '', outcomes: [] as string[], cycle: { ...emptyCycle }, photos: [] as string[] });
  const [aiLoading, setAiLoading] = useState<string | null>(null);
  const [showAiPanel, setShowAiPanel] = useState(false);
  const [expandedCycle, setExpandedCycle] = useState<string | null>(null);
  const [cycleEdits, setCycleEdits] = useState<Record<number, PlanningCycle>>({});

  const add = () => {
    if (!form.title) return toast.error('Enter a title for the entry.');
    if (!form.text.trim()) return toast.error('Write some text or use AI to help.');
    setDocs(d => [{ ...form, id: Date.now() } as JournalEntry, ...d]);
    setForm({ date: new Date().toISOString().split('T')[0], educator: 'Sarah Johnson', type: 'Learning Story', child: 'Leo Martinez', title: '', text: '', outcomes: [], cycle: { ...emptyCycle }, photos: [] });
    setShowForm(false);
    setShowAiPanel(false);
    toast.success('Journal entry saved.');
  };

  const toggleOutcome = (o: string) => setForm(f => ({ ...f, outcomes: f.outcomes.includes(o) ? f.outcomes.filter(x => x !== o) : [...f.outcomes, o] }));

  const aiAction = async (action: 'expand' | 'title' | 'outcomes' | 'improve') => {
    if (action !== 'title' && !form.text.trim()) {
      return toast.error('Write some jottings or notes first — even a sentence is enough for AI to work with.');
    }
    if (action === 'title' && !form.text.trim() && !form.child.trim()) {
      return toast.error('Add some text or a child name first.');
    }

    setAiLoading(action);
    try {
      let prompt = '';
      switch (action) {
        case 'expand': prompt = AI_PROMPTS.expand(form.text, form.child, form.type); break;
        case 'title': prompt = AI_PROMPTS.title(form.text || form.child, form.child); break;
        case 'outcomes': prompt = AI_PROMPTS.outcomes(form.text); break;
        case 'improve': prompt = AI_PROMPTS.improve(form.text); break;
      }

      const result = await safeGenerateContent(prompt);

      switch (action) {
        case 'expand':
          setForm(f => ({ ...f, text: result }));
          toast.success('Jottings expanded into a full narrative. Review and edit as needed.');
          break;
        case 'title':
          setForm(f => ({ ...f, title: result.replace(/["']/g, '').trim() }));
          toast.success('Title suggested.');
          break;
        case 'outcomes': {
          const match = result.match(/\[[\d,\s]+\]/);
          if (match) {
            const nums: number[] = JSON.parse(match[0]);
            setForm(f => ({ ...f, outcomes: nums.map(n => `Outcome ${n}`) }));
            toast.success(`${nums.length} EYLF outcome${nums.length > 1 ? 's' : ''} linked.`);
          } else {
            toast.error('Could not parse outcomes. Try again.');
          }
          break;
        }
        case 'improve':
          setForm(f => ({ ...f, text: result }));
          toast.success('Text improved. Review the changes.');
          break;
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'AI generation failed.');
    } finally {
      setAiLoading(null);
    }
  };

  const isLoading = aiLoading !== null;

  const CYCLE_STEPS = [
    { key: 'analyse' as const, label: 'Analyse', icon: Search, color: 'blue', desc: 'What learning is happening? What does this tell us about the child?' },
    { key: 'plan' as const, label: 'Plan', icon: ClipboardList, color: 'violet', desc: 'What experiences, interactions or resources will extend this learning?' },
    { key: 'implement' as const, label: 'Implement', icon: Play, color: 'emerald', desc: 'What did we do? How did we set up the environment or provocations?' },
    { key: 'reflect' as const, label: 'Reflect', icon: RotateCcw, color: 'amber', desc: 'What happened? What worked well? What would we change?' },
  ];

  const colorMap: Record<string, { bg: string; border: string; text: string; light: string; dot: string }> = {
    blue:    { bg: 'bg-blue-50',    border: 'border-blue-200',    text: 'text-blue-700',    light: 'text-blue-500',    dot: 'bg-blue-500' },
    violet:  { bg: 'bg-violet-50',  border: 'border-violet-200',  text: 'text-violet-700',  light: 'text-violet-500',  dot: 'bg-violet-500' },
    emerald: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', light: 'text-emerald-500', dot: 'bg-emerald-500' },
    amber:   { bg: 'bg-amber-50',   border: 'border-amber-200',   text: 'text-amber-700',   light: 'text-amber-500',   dot: 'bg-amber-500' },
  };

  const getCycleValue = (docId: number, key: keyof PlanningCycle) => {
    if (cycleEdits[docId]?.[key] !== undefined) return cycleEdits[docId][key];
    const doc = docs.find(d => d.id === docId);
    return doc?.cycle[key] ?? '';
  };

  const setCycleValue = (docId: number, key: keyof PlanningCycle, value: string) => {
    setCycleEdits(prev => ({
      ...prev,
      [docId]: { ...(prev[docId] || docs.find(d => d.id === docId)!.cycle), [key]: value },
    }));
  };

  const saveCycle = (docId: number) => {
    const edits = cycleEdits[docId];
    if (!edits) return;
    setDocs(prev => prev.map(d => d.id === docId ? { ...d, cycle: { ...d.cycle, ...edits } } : d));
    setCycleEdits(prev => { const n = { ...prev }; delete n[docId]; return n; });
    toast.success('Planning cycle saved.');
  };

  const aiCycleStep = async (docId: number, key: keyof PlanningCycle) => {
    const doc = docs.find(d => d.id === docId);
    if (!doc) return;
    setAiLoading(`cycle-${key}-${docId}`);
    try {
      const prompts: Record<keyof PlanningCycle, string> = {
        analyse: `You are an experienced Australian Early Childhood Educator. Based on this observation about ${doc.child}, write a brief analysis (2-3 sentences). What learning is taking place? What dispositions, skills or knowledge is the child demonstrating? Link to EYLF outcomes where relevant.\n\nObservation: ${doc.text}`,
        plan: `You are an experienced Australian Early Childhood Educator. Based on this observation and analysis about ${doc.child}, suggest 2-3 next steps or planned experiences to extend the child's learning. Be specific and practical.\n\nObservation: ${doc.text}\nAnalysis: ${getCycleValue(docId, 'analyse')}`,
        implement: `You are an experienced Australian Early Childhood Educator. Based on the planned learning extensions for ${doc.child}, write a brief implementation note (2-3 sentences) describing how you set up the environment, introduced the experience, and what resources you used.\n\nPlan: ${getCycleValue(docId, 'plan')}`,
        reflect: `You are an experienced Australian Early Childhood Educator. Based on the full planning cycle for ${doc.child}, write a brief reflection (2-3 sentences). What happened? What worked well? What would you do differently? How did the child respond?\n\nObservation: ${doc.text}\nAnalysis: ${getCycleValue(docId, 'analyse')}\nPlan: ${getCycleValue(docId, 'plan')}\nImplementation: ${getCycleValue(docId, 'implement')}`,
      };
      const result = await safeGenerateContent(prompts[key]);
      setCycleValue(docId, key, result.trim());
      toast.success(`${key.charAt(0).toUpperCase() + key.slice(1)} drafted by AI. Review and edit as needed.`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'AI generation failed.');
    } finally {
      setAiLoading(null);
    }
  };

  const cycleStepKey = (docId: number, key: string) => `${docId}-${key}`;

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
            <Star className="w-5 h-5 text-amber-600" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-slate-800">Digital Journal</h1>
            <p className="text-slate-500 text-sm">Learning stories, observations and portfolio entries</p>
          </div>
          <button onClick={() => { setShowForm(!showForm); setShowAiPanel(false); }} className="flex items-center gap-2 bg-indigo-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-indigo-700">
            <Plus className="w-4 h-4" /> New Entry
          </button>
        </div>

        {/* New Entry Form */}
        {showForm && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 space-y-4">
              {/* Top fields */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-600 mb-1 block">Type</label>
                  <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                    {types.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600 mb-1 block">Child</label>
                  <input className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none" value={form.child} onChange={e => setForm(f => ({ ...f, child: e.target.value }))} placeholder="Child's name" />
                </div>
              </div>

              {/* Title with AI suggest */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-slate-600">Title</label>
                  <button disabled={isLoading} onClick={() => void aiAction('title')} className="text-xs text-violet-600 font-semibold hover:text-violet-700 disabled:opacity-50 flex items-center gap-1">
                    {aiLoading === 'title' ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />} Suggest title
                  </button>
                </div>
                <input className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Leo's Block Building Adventure" />
              </div>

              {/* Narrative with AI toolbar */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-slate-600">Narrative</label>
                  <button onClick={() => setShowAiPanel(p => !p)} className={`text-xs font-semibold flex items-center gap-1 transition-colors ${showAiPanel ? 'text-violet-700' : 'text-violet-600 hover:text-violet-700'}`}>
                    <Wand2 className="w-3 h-3" /> AI Writing Help
                  </button>
                </div>
                <textarea
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  rows={6}
                  value={form.text}
                  onChange={e => setForm(f => ({ ...f, text: e.target.value }))}
                  placeholder="Write your jottings here — even a few rough notes. AI can help expand them into a full narrative..."
                />
              </div>

              {/* AI Writing Panel */}
              {showAiPanel && (
                <div className="bg-violet-50 border border-violet-200 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-violet-900 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-violet-500" /> AI Writing Assistant
                    </h4>
                    <button onClick={() => setShowAiPanel(false)} className="text-violet-400 hover:text-violet-600"><X className="w-4 h-4" /></button>
                  </div>
                  <p className="text-xs text-violet-700">Write rough jottings, dot points, or a few sentences — then let AI help you turn them into professional documentation.</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      disabled={isLoading}
                      onClick={() => void aiAction('expand')}
                      className="flex items-center gap-2 px-3 py-2.5 bg-white border border-violet-200 rounded-lg text-sm font-semibold text-violet-800 hover:bg-violet-100 disabled:opacity-50 transition-colors"
                    >
                      {aiLoading === 'expand' ? <Loader2 className="w-4 h-4 animate-spin" /> : <BookOpen className="w-4 h-4 text-violet-500" />}
                      <div className="text-left">
                        <div className="text-xs font-bold">Expand Jottings</div>
                        <div className="text-[10px] text-violet-500 font-normal">Turn notes into a full narrative</div>
                      </div>
                    </button>
                    <button
                      disabled={isLoading}
                      onClick={() => void aiAction('improve')}
                      className="flex items-center gap-2 px-3 py-2.5 bg-white border border-violet-200 rounded-lg text-sm font-semibold text-violet-800 hover:bg-violet-100 disabled:opacity-50 transition-colors"
                    >
                      {aiLoading === 'improve' ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4 text-violet-500" />}
                      <div className="text-left">
                        <div className="text-xs font-bold">Improve Writing</div>
                        <div className="text-[10px] text-violet-500 font-normal">Make it more professional</div>
                      </div>
                    </button>
                    <button
                      disabled={isLoading}
                      onClick={() => void aiAction('title')}
                      className="flex items-center gap-2 px-3 py-2.5 bg-white border border-violet-200 rounded-lg text-sm font-semibold text-violet-800 hover:bg-violet-100 disabled:opacity-50 transition-colors"
                    >
                      {aiLoading === 'title' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-violet-500" />}
                      <div className="text-left">
                        <div className="text-xs font-bold">Suggest Title</div>
                        <div className="text-[10px] text-violet-500 font-normal">Generate a catchy title</div>
                      </div>
                    </button>
                    <button
                      disabled={isLoading}
                      onClick={() => void aiAction('outcomes')}
                      className="flex items-center gap-2 px-3 py-2.5 bg-white border border-violet-200 rounded-lg text-sm font-semibold text-violet-800 hover:bg-violet-100 disabled:opacity-50 transition-colors"
                    >
                      {aiLoading === 'outcomes' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Star className="w-4 h-4 text-violet-500" />}
                      <div className="text-left">
                        <div className="text-xs font-bold">Link EYLF Outcomes</div>
                        <div className="text-[10px] text-violet-500 font-normal">Auto-detect relevant outcomes</div>
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {/* EYLF Outcomes */}
              <div>
                <label className="text-xs font-medium text-slate-600 mb-2 block">EYLF Learning Outcomes</label>
                <div className="flex flex-wrap gap-2">
                  {outcomeOptions.map(o => (
                    <button
                      key={o}
                      onClick={() => toggleOutcome(o)}
                      title={OUTCOME_LABELS[o]}
                      className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-colors ${form.outcomes.includes(o) ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                    >
                      {o}
                    </button>
                  ))}
                </div>
                {form.outcomes.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {form.outcomes.map(o => (
                      <p key={o} className="text-[11px] text-indigo-600"><span className="font-bold">{o}:</span> {OUTCOME_LABELS[o]}</p>
                    ))}
                  </div>
                )}
              </div>

              {/* Photo Upload */}
              <div>
                <label className="text-xs font-medium text-slate-600 mb-2 block">Photos</label>
                <ImageUpload images={form.photos} onChange={photos => setForm(f => ({ ...f, photos }))} maxImages={6} bucket="journal" />
              </div>
            </div>

            {/* Form Actions */}
            <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex gap-2 justify-end">
              <button onClick={() => { setShowForm(false); setShowAiPanel(false); }} className="px-4 py-2 text-sm border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-100">Cancel</button>
              <button onClick={add} className="px-4 py-2 text-sm bg-amber-500 text-white rounded-lg font-semibold hover:bg-amber-600">Save Entry</button>
            </div>
          </div>
        )}

        {/* Journal Entries */}
        <div className="space-y-4">
          {docs.map(doc => {
            const isOpen = selected === doc.id;
            const hasCycleContent = doc.cycle.analyse || doc.cycle.plan || doc.cycle.implement || doc.cycle.reflect;
            const filledSteps = CYCLE_STEPS.filter(s => getCycleValue(doc.id, s.key));
            const hasEdits = !!cycleEdits[doc.id];

            return (
              <div key={doc.id} className={`bg-white rounded-xl border ${isOpen ? 'border-amber-200 shadow-md' : 'border-slate-100 hover:border-slate-200'} transition-all`}>
                <div className="p-5 cursor-pointer" onClick={() => { setSelected(isOpen ? null : doc.id); setExpandedCycle(null); }}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">{doc.type}</span>
                        <span className="text-xs text-slate-400">{doc.date}</span>
                        {hasCycleContent && (
                          <span className="text-xs bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                            <RotateCcw className="w-3 h-3" /> {filledSteps.length}/4 cycle
                          </span>
                        )}
                      </div>
                      <h3 className="font-semibold text-slate-800">{doc.title}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">{doc.child} · {doc.educator}</p>
                    </div>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400 mt-1" /> : <ChevronDown className="w-4 h-4 text-slate-400 mt-1" />}
                  </div>
                  <p className={`text-sm text-slate-700 mt-3 leading-relaxed ${isOpen ? '' : 'line-clamp-2'}`}>{doc.text}</p>
                  {doc.outcomes.length > 0 && (
                    <div className="flex gap-1.5 mt-3">
                      {doc.outcomes.map(o => <span key={o} className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded">{o}</span>)}
                    </div>
                  )}
                  {doc.photos && doc.photos.length > 0 && (
                    <div className="flex gap-2 mt-3 overflow-x-auto">
                      {doc.photos.map((src, i) => (
                        <img key={i} src={src} alt={`Photo ${i + 1}`} className="w-16 h-16 rounded-lg object-cover border border-slate-200 flex-shrink-0" />
                      ))}
                    </div>
                  )}
                </div>

                {isOpen && (
                  <div className="border-t border-slate-100 px-5 pb-5">
                    <div className="flex items-center justify-between mt-4 mb-3">
                      <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                        <RotateCcw className="w-4 h-4 text-slate-400" /> Planning Cycle
                      </h4>
                      <div className="flex items-center gap-2">
                        <button onClick={() => exportLearningStoryPDF(doc)} className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-lg">
                          <Download className="w-3 h-3" /> Export PDF
                        </button>
                        {hasEdits && (
                          <button onClick={() => saveCycle(doc.id)} className="flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg">
                            <Save className="w-3 h-3" /> Save Changes
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      {CYCLE_STEPS.map(step => {
                        const stepKey = cycleStepKey(doc.id, step.key);
                        const isExpanded = expandedCycle === stepKey;
                        const value = getCycleValue(doc.id, step.key);
                        const c = colorMap[step.color];
                        const Icon = step.icon;
                        const loading = aiLoading === `cycle-${step.key}-${doc.id}`;

                        return (
                          <div key={step.key} className={`rounded-xl border ${isExpanded ? c.border : 'border-slate-100'} overflow-hidden transition-all`}>
                            <button
                              onClick={() => setExpandedCycle(isExpanded ? null : stepKey)}
                              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${isExpanded ? c.bg : 'hover:bg-slate-50'}`}
                            >
                              <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${isExpanded ? c.bg : 'bg-slate-100'}`}>
                                <Icon className={`w-3.5 h-3.5 ${isExpanded ? c.light : 'text-slate-400'}`} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <span className={`text-sm font-semibold ${isExpanded ? c.text : 'text-slate-700'}`}>{step.label}</span>
                                {!isExpanded && value && (
                                  <p className="text-xs text-slate-400 truncate mt-0.5">{value}</p>
                                )}
                              </div>
                              {value ? (
                                <span className={`w-2 h-2 rounded-full ${c.dot}`} />
                              ) : (
                                <span className="text-[10px] text-slate-400 font-medium">Empty</span>
                              )}
                              {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
                            </button>

                            {isExpanded && (
                              <div className={`px-4 pb-4 ${c.bg}`}>
                                <p className="text-[11px] text-slate-500 mb-2">{step.desc}</p>
                                <textarea
                                  className={`w-full border ${c.border} rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:outline-none bg-white`}
                                  rows={3}
                                  value={value}
                                  onChange={e => setCycleValue(doc.id, step.key, e.target.value)}
                                  placeholder={`Write your ${step.label.toLowerCase()} here...`}
                                />
                                <div className="flex justify-end mt-2">
                                  <button
                                    disabled={isLoading}
                                    onClick={() => void aiCycleStep(doc.id, step.key)}
                                    className={`flex items-center gap-1.5 text-xs font-semibold ${c.text} hover:opacity-80 disabled:opacity-50 bg-white border ${c.border} px-3 py-1.5 rounded-lg`}
                                  >
                                    {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                                    AI Draft {step.label}
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
