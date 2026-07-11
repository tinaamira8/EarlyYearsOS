import React, { useState } from 'react';
import { BookMarked, Eye, Loader2, Save, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { generatePhilosophy } from '../services/geminiService';

const defaultPhilosophy = {
  vision: 'We envision a community where every child is valued, respected, and given the opportunity to thrive. We believe in nurturing the whole child — their curiosity, creativity, confidence, and connection to others.',
  values: '• Respect — for children, families, educators, and our environment\n• Inclusion — every child and family is welcomed and valued\n• Collaboration — we partner with families as co-educators\n• Excellence — we continually reflect and grow as professionals\n• Wonder — we celebrate children\'s natural curiosity',
  reggioEmilia: 'We draw deeply from the Reggio Emilia Approach, recognising children as capable, competent, and full of potential. Our environment is designed as the "third teacher" — beautiful, purposeful spaces filled with natural materials and open-ended provocations that invite curiosity and investigation.\n\nDocumentation is central to our practice. Educators make children\'s learning visible through photographs, transcribed conversations, and learning stories, creating a culture of shared reflection between children, families, and educators.\n\nWe believe in the "hundred languages of children" — honouring every child\'s unique way of expressing ideas through art, construction, dramatic play, movement, and conversation. Projects emerge from children\'s genuine questions and interests, supported by educators who listen, observe, and thoughtfully extend learning.',
  montessori: 'We integrate key Montessori principles into our program, fostering independence, self-direction, and a love of learning. Our learning environments are carefully prepared with child-sized furniture, accessible materials, and clear organisation so children can make meaningful choices about their learning.\n\nWe respect each child\'s individual developmental timeline and provide uninterrupted work periods where children can engage deeply with activities at their own pace. Practical life experiences — pouring, food preparation, caring for plants, tidying — build confidence, concentration, and real-world skills.\n\nOur educators act as guides rather than directors, observing each child closely to understand their readiness and interests, then introducing materials and experiences that match their developmental stage. Mixed-age groupings allow younger children to learn from older peers and older children to consolidate their learning through mentoring.',
  commitments: '• To provide a safe, inclusive, and stimulating environment\n• To build respectful relationships with children and families\n• To engage in ongoing professional learning and critical reflection\n• To embed Aboriginal and Torres Strait Islander perspectives in our program\n• To care for our natural environment and teach sustainability',
};

export const PhilosophyBuilder: React.FC = () => {
  const [content, setContent] = useState(defaultPhilosophy);
  const [preview, setPreview] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const generateDraft = async () => {
    setIsGenerating(true);
    try {
      const result = await generatePhilosophy(content.values, content.reggioEmilia + '\n' + content.montessori);
      setContent(c => ({ ...c, vision: result.vision, values: result.values, commitments: result.commitments }));
      toast.success('Philosophy draft generated for team and family review.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'AI generation failed.');
    } finally {
      setIsGenerating(false);
    }
  };

  const sections: { key: keyof typeof defaultPhilosophy; label: string; icon: string; accent?: string }[] = [
    { key: 'vision', label: 'Our Vision', icon: '🌟' },
    { key: 'values', label: 'Our Values', icon: '💎' },
    { key: 'reggioEmilia', label: 'Reggio Emilia Approach', icon: '🎨', accent: 'border-l-4 border-l-rose-300' },
    { key: 'montessori', label: 'Montessori Approach', icon: '🧩', accent: 'border-l-4 border-l-teal-300' },
    { key: 'commitments', label: 'Our Commitments', icon: '🤝' },
  ];

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
            <BookMarked className="w-5 h-5 text-amber-600" />
          </div>
          <div className="flex-1"><h1 className="text-2xl font-bold text-slate-800">Philosophy Builder</h1>
            <p className="text-slate-500 text-sm">Shape and document your centre's educational philosophy</p></div>
          <button onClick={() => setPreview(!preview)} className={`px-4 py-2 text-sm rounded-lg font-medium flex items-center gap-2 ${preview ? 'bg-amber-500 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}>
            <Eye className="w-4 h-4" /> {preview ? 'Edit' : 'Preview'}
          </button>
          <button disabled={isGenerating} onClick={() => void generateDraft()} className="flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">
            {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />} Refine with AI
          </button>
          <button onClick={save} className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg font-medium transition-all ${saved ? 'bg-emerald-600 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}>
            <Save className="w-4 h-4" /> {saved ? 'Saved!' : 'Save'}
          </button>
        </div>

        {!preview ? (
          <div className="space-y-4">
            {sections.map(s => (
              <div key={s.key} className={`bg-white rounded-xl border border-slate-100 p-5 ${s.accent || ''}`}>
                <label className="font-semibold text-slate-800 mb-2 block">{s.icon} {s.label}</label>
                <textarea className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm leading-relaxed resize-none" rows={s.key === 'reggioEmilia' || s.key === 'montessori' ? 8 : 5} value={content[s.key]} onChange={e => setContent(c => ({ ...c, [s.key]: e.target.value }))} />
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border-2 border-amber-100 overflow-hidden shadow-sm">
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-8 text-center">
              <h2 className="text-2xl font-bold">Sunshine Early Learning Centre</h2>
              <p className="text-amber-100 mt-1">Educational Philosophy</p>
            </div>
            <div className="p-8 space-y-8">
              {sections.map(s => (
                <div key={s.key}>
                  <h3 className="text-lg font-bold text-amber-700 mb-3">{s.icon} {s.label}</h3>
                  <pre className="text-slate-700 font-sans text-sm leading-relaxed whitespace-pre-wrap">{content[s.key]}</pre>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
