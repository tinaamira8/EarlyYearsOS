import React, { useState } from 'react';
import { Loader2, Newspaper, Printer, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { generateNewsletter } from '../services/geminiService';

export const NewsletterGen: React.FC = () => {
  const [form, setForm] = useState({
    month: 'June 2026',
    directorMsg: 'Welcome to our June newsletter! We\'ve had a wonderful month full of learning and exploration. Thank you to all families for your continued support and partnership.',
    events: '• 2 June — Queen\'s Birthday public holiday (centre closed)\n• 10 June — Parent information night, 6:30pm\n• 20 June — Harmony Week celebrations\n• 30 June — Last day of Term 2',
    reminders: '• Please update your family emergency contacts\n• Sun hats are required every day for outdoor play\n• Ensure your CCS activity test is up to date\n• Blue room hat day — bring a decorated hat on June 15!',
    curriculum: 'This month our Pre-Kindy room is exploring "Our World Through Science". Children have been experimenting with water, shadows, and plants. Toddlers are enjoying sensory play and music exploration.',
  });
  const [preview, setPreview] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const draftWithAi = async () => {
    setIsGenerating(true);
    try {
      const result = await generateNewsletter(form.month, form.curriculum, form.reminders);
      setForm(current => ({ ...current, ...result }));
      toast.success('Newsletter draft generated. Review it before publishing.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'AI generation failed.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-pink-100 rounded-xl flex items-center justify-center">
            <Newspaper className="w-5 h-5 text-pink-600" />
          </div>
          <div className="flex-1"><h1 className="text-2xl font-bold text-slate-800">Newsletter Generator</h1>
            <p className="text-slate-500 text-sm">Create and preview centre newsletters</p></div>
          <button disabled={isGenerating} onClick={() => void draftWithAi()} className="flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-50">
            {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />} Draft with AI
          </button>
          <button onClick={() => setPreview(!preview)} className={`px-4 py-2 text-sm rounded-lg font-medium transition-colors ${preview ? 'bg-pink-600 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}>
            {preview ? 'Edit Mode' : 'Preview'}
          </button>
          <button type="button" onClick={() => window.print()} className="flex items-center gap-2 border border-slate-200 text-slate-600 text-sm px-4 py-2 rounded-lg hover:bg-slate-50">
            <Printer className="w-4 h-4" /> Print
          </button>
        </div>

        <div className={`${preview ? '' : 'grid grid-cols-2 gap-6'}`}>
          {!preview && (
            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-slate-100 p-5 space-y-4">
                <h3 className="font-semibold text-slate-800">Newsletter Content</h3>
                {[
                  { key: 'month', label: 'Month / Issue', type: 'input' },
                  { key: 'directorMsg', label: "Director's Message", type: 'textarea' },
                  { key: 'events', label: 'Upcoming Events', type: 'textarea' },
                  { key: 'reminders', label: 'Important Reminders', type: 'textarea' },
                  { key: 'curriculum', label: 'Curriculum Highlights', type: 'textarea' },
                ].map(f => (
                  <div key={f.key}>
                    <label className="text-xs text-slate-500 mb-1 block font-medium">{f.label}</label>
                    {f.type === 'input'
                      ? <input className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" value={form[f.key as keyof typeof form]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} />
                      : <textarea className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" rows={4} value={form[f.key as keyof typeof form]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} />
                    }
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className={`${preview ? 'max-w-2xl mx-auto' : ''}`}>
            <div className="bg-white rounded-xl border-2 border-indigo-100 overflow-hidden shadow-sm">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
                <div className="text-xs uppercase tracking-wider opacity-80">Sunshine Early Learning Centre</div>
                <h2 className="text-2xl font-bold mt-1">Centre Newsletter</h2>
                <div className="text-indigo-200 text-sm mt-0.5">{form.month}</div>
              </div>
              <div className="p-6 space-y-5">
                <div>
                  <h3 className="text-sm font-bold text-indigo-700 uppercase tracking-wide mb-2">Director's Message</h3>
                  <p className="text-sm text-slate-700 leading-relaxed">{form.directorMsg}</p>
                </div>
                <div className="border-t border-slate-100 pt-4">
                  <h3 className="text-sm font-bold text-indigo-700 uppercase tracking-wide mb-2">📅 Upcoming Events</h3>
                  <pre className="text-sm text-slate-700 font-sans whitespace-pre-wrap">{form.events}</pre>
                </div>
                <div className="border-t border-slate-100 pt-4">
                  <h3 className="text-sm font-bold text-indigo-700 uppercase tracking-wide mb-2">📌 Important Reminders</h3>
                  <pre className="text-sm text-slate-700 font-sans whitespace-pre-wrap">{form.reminders}</pre>
                </div>
                <div className="border-t border-slate-100 pt-4">
                  <h3 className="text-sm font-bold text-indigo-700 uppercase tracking-wide mb-2">🎓 Curriculum Highlights</h3>
                  <p className="text-sm text-slate-700 leading-relaxed">{form.curriculum}</p>
                </div>
                <div className="bg-indigo-50 rounded-lg p-3 text-center text-xs text-indigo-500">
                  Sunshine Early Learning Centre · 123 Learning Lane · Phone: (07) 1234 5678
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
