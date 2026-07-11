import React, { useState } from 'react';
import { Megaphone, TrendingUp, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

const inquiries = [
  { id: 1, family: 'Thompson Family', child: 'Emily, 2 years', date: '2026-05-20', source: 'Website', status: 'Tour Booked', notes: 'Tour booked for 28 May 10am' },
  { id: 2, family: 'Nguyen Family', child: 'Liam, 3 years', date: '2026-05-18', source: 'Facebook', status: 'Waitlisted', notes: 'Pre-Kindy spot expected Jan 2027' },
  { id: 3, family: 'Patel Family', child: 'Priya, 18 months', date: '2026-05-15', source: 'Referral', status: 'Enrolled', notes: 'Starting 1 June in babies room' },
  { id: 4, family: 'Smith Family', child: 'Jack, 4 years', date: '2026-05-10', source: 'Google', status: 'No Vacancy', notes: 'Added to waitlist, notified family' },
];

const initialTemplates = [
  { title: 'Centre Opening Hours', content: '🌟 We\'re open Monday to Friday, 6:30am–6:00pm. Contact us to arrange a tour and discover why families love us!' },
  { title: 'Waitlist Announcement', content: '📋 Limited spots available for 2026! Secure your child\'s place at our award-winning early learning centre. Register your interest today.' },
  { title: 'Community Event Invite', content: '🎉 Join us for our upcoming community morning! Meet our educators, explore the centre and enjoy morning tea together. All welcome!' },
];

const statusColors: Record<string, string> = {
  'Tour Booked': 'bg-blue-100 text-blue-700',
  'Waitlisted': 'bg-amber-100 text-amber-700',
  'Enrolled': 'bg-emerald-100 text-emerald-700',
  'No Vacancy': 'bg-slate-100 text-slate-600',
};

export const MarketingStudio: React.FC = () => {
  const [tab, setTab] = useState<'overview' | 'inquiries' | 'templates'>('overview');
  const [templates, setTemplates] = useState(initialTemplates);
  const [showTemplateForm, setShowTemplateForm] = useState(false);
  const [templateTitle, setTemplateTitle] = useState('');
  const [templateContent, setTemplateContent] = useState('');

  const copyTemplate = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast.success('Template copied');
    } catch {
      toast.error('Clipboard access is unavailable');
    }
  };

  const createTemplate = (event: React.FormEvent) => {
    event.preventDefault();
    if (!templateTitle.trim() || !templateContent.trim()) return;
    setTemplates(current => [...current, { title: templateTitle.trim(), content: templateContent.trim() }]);
    setTemplateTitle('');
    setTemplateContent('');
    setShowTemplateForm(false);
    toast.success('Template created');
  };

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-fuchsia-100 rounded-xl flex items-center justify-center">
            <Megaphone className="w-5 h-5 text-fuchsia-600" />
          </div>
          <div className="flex-1"><h1 className="text-2xl font-bold text-slate-800">Marketing Studio</h1>
            <p className="text-slate-500 text-sm">Enrolment inquiries and promotional tools</p></div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-slate-100 p-4 text-center">
            <div className="text-2xl font-bold text-indigo-600">94%</div>
            <div className="text-xs text-slate-500">Occupancy Rate</div>
          </div>
          <div className="bg-white rounded-xl border border-slate-100 p-4 text-center">
            <div className="text-2xl font-bold text-amber-600">12</div>
            <div className="text-xs text-slate-500">Waitlist Families</div>
          </div>
          <div className="bg-white rounded-xl border border-slate-100 p-4 text-center">
            <div className="text-2xl font-bold text-emerald-600">4</div>
            <div className="text-xs text-slate-500">Inquiries This Month</div>
          </div>
          <div className="bg-white rounded-xl border border-slate-100 p-4 text-center">
            <div className="text-2xl font-bold text-rose-600">2</div>
            <div className="text-xs text-slate-500">Vacancies Available</div>
          </div>
        </div>

        <div className="flex gap-2">
          {(['overview', 'inquiries', 'templates'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 text-sm rounded-lg font-medium capitalize ${tab === t ? 'bg-fuchsia-600 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}>{t}</button>
          ))}
        </div>

        {tab === 'inquiries' && (
          <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-xs text-slate-500 uppercase">
                <tr><th className="text-left px-4 py-3">Family</th><th className="text-left px-4 py-3">Date</th><th className="text-left px-4 py-3">Source</th><th className="text-left px-4 py-3">Status</th><th className="text-left px-4 py-3">Notes</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {inquiries.map(i => (
                  <tr key={i.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3"><div className="font-medium text-slate-800">{i.family}</div><div className="text-xs text-slate-500">{i.child}</div></td>
                    <td className="px-4 py-3 text-slate-600">{i.date}</td>
                    <td className="px-4 py-3 text-slate-600">{i.source}</td>
                    <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[i.status]}`}>{i.status}</span></td>
                    <td className="px-4 py-3 text-xs text-slate-500">{i.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'templates' && (
          <div className="space-y-4">
            {templates.map((t, i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-100 p-5">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-slate-800">{t.title}</h3>
                  <button type="button" onClick={() => copyTemplate(t.content)} className="text-xs text-indigo-600 border border-indigo-200 px-3 py-1 rounded-lg hover:bg-indigo-50">Copy</button>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">{t.content}</p>
              </div>
            ))}
            {showTemplateForm ? (
              <form onSubmit={createTemplate} className="space-y-3 rounded-xl border border-indigo-100 bg-white p-4">
                <input aria-label="Template title" value={templateTitle} onChange={event => setTemplateTitle(event.target.value)} placeholder="Template title" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" required />
                <textarea aria-label="Template content" value={templateContent} onChange={event => setTemplateContent(event.target.value)} placeholder="Template content" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" rows={3} required />
                <div className="flex gap-2">
                  <button type="submit" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white">Save template</button>
                  <button type="button" onClick={() => setShowTemplateForm(false)} className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600">Cancel</button>
                </div>
              </form>
            ) : (
              <button type="button" onClick={() => setShowTemplateForm(true)} className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700"><Plus className="w-4 h-4" /> Create Template</button>
            )}
          </div>
        )}

        {tab === 'overview' && (
          <div className="bg-white rounded-xl border border-slate-100 p-5">
            <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-slate-400" /> Inquiry Sources (Last 3 months)</h3>
            <div className="space-y-3">
              {[{ source: 'Website', count: 8, pct: 40 }, { source: 'Facebook', count: 6, pct: 30 }, { source: 'Referral', count: 4, pct: 20 }, { source: 'Google', count: 2, pct: 10 }].map(s => (
                <div key={s.source}>
                  <div className="flex justify-between text-sm mb-1"><span className="text-slate-700">{s.source}</span><span className="text-slate-500">{s.count} inquiries ({s.pct}%)</span></div>
                  <div className="bg-slate-100 rounded-full h-2"><div className="bg-fuchsia-500 h-2 rounded-full" style={{ width: `${s.pct}%` }} /></div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
