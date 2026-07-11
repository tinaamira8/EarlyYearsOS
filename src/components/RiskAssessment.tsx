import React, { useState } from 'react';
import { AlertTriangle, Loader2, Plus, Sparkles, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { generateRiskAssessment } from '../services/geminiService';
import { usePersistedState } from '../hooks/usePersistedState';

const initialRisks = [
  { id: 1, hazard: 'Outdoor play equipment', likelihood: 2, consequence: 3, controls: 'Daily equipment inspection, soft fall surfaces, supervision', area: 'Outdoor' },
  { id: 2, hazard: 'Allergic reactions (anaphylaxis)', likelihood: 2, consequence: 5, controls: 'Action plans, EpiPen on-site, staff training, allergen-free zones', area: 'All areas' },
  { id: 3, hazard: 'Sun exposure', likelihood: 4, consequence: 2, controls: 'Sunscreen, hats mandatory, shade structures, limit outdoor 11-3pm', area: 'Outdoor' },
  { id: 4, hazard: 'Choking hazard (small objects)', likelihood: 2, consequence: 4, controls: 'Age-appropriate toys, regular checks, staff trained in first aid', area: 'Classrooms' },
  { id: 5, hazard: 'Unauthorised access / stranger danger', likelihood: 1, consequence: 5, controls: 'Secure entry, visitor sign-in, ID verification, CCTV', area: 'Entry' },
];

const ratingLabel = (l: number, c: number) => {
  const r = l * c;
  if (r >= 15) return { label: 'Extreme', color: 'text-red-700 bg-red-100' };
  if (r >= 8) return { label: 'High', color: 'text-orange-700 bg-orange-100' };
  if (r >= 4) return { label: 'Medium', color: 'text-amber-700 bg-amber-100' };
  return { label: 'Low', color: 'text-green-700 bg-green-100' };
};

export const RiskAssessment: React.FC = () => {
  const [risks, setRisks] = usePersistedState('risk_assessments', initialRisks);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ hazard: '', likelihood: 2, consequence: 2, controls: '', area: '' });
  const [isGenerating, setIsGenerating] = useState(false);

  const add = () => {
    if (!form.hazard) return;
    setRisks(r => [...r, { ...form, id: Date.now() }]);
    setForm({ hazard: '', likelihood: 2, consequence: 2, controls: '', area: '' });
    setShowForm(false);
  };

  const generateWithAi = async () => {
    if (!form.hazard.trim() || !form.area.trim()) return toast.error('Enter an activity and location first.');
    setIsGenerating(true);
    try {
      const result = await generateRiskAssessment(form.hazard, form.area, 'mixed early childhood age group') as { hazards?: Array<{ hazard: string; risk: string; control: string }> };
      const generated = (result.hazards || []).map((item, index) => ({
        id: Date.now() + index,
        hazard: item.hazard,
        likelihood: item.risk?.toLowerCase() === 'high' ? 4 : item.risk?.toLowerCase() === 'low' ? 1 : 2,
        consequence: item.risk?.toLowerCase() === 'high' ? 4 : 3,
        controls: item.control,
        area: form.area,
      }));
      if (!generated.length) throw new Error('The AI did not return any hazards.');
      setRisks(current => [...generated, ...current]);
      setShowForm(false);
      setForm({ hazard: '', likelihood: 2, consequence: 2, controls: '', area: '' });
      toast.success('Draft hazards added. Review all ratings and controls.');
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
          <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-slate-800">Risk Assessment</h1>
            <p className="text-slate-500 text-sm">Identify, assess and control workplace hazards</p>
          </div>
          <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-indigo-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
            <Plus className="w-4 h-4" /> Add Risk
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
            <h3 className="font-semibold text-slate-800">New Risk</h3>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-xs text-slate-500 mb-1 block">Hazard / Risk</label>
                <input className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" value={form.hazard} onChange={e => setForm(f => ({ ...f, hazard: e.target.value }))} /></div>
              <div><label className="text-xs text-slate-500 mb-1 block">Area</label>
                <input className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" value={form.area} onChange={e => setForm(f => ({ ...f, area: e.target.value }))} /></div>
              <div><label className="text-xs text-slate-500 mb-1 block">Likelihood (1-5)</label>
                <input type="number" min={1} max={5} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" value={form.likelihood} onChange={e => setForm(f => ({ ...f, likelihood: +e.target.value }))} /></div>
              <div><label className="text-xs text-slate-500 mb-1 block">Consequence (1-5)</label>
                <input type="number" min={1} max={5} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" value={form.consequence} onChange={e => setForm(f => ({ ...f, consequence: +e.target.value }))} /></div>
            </div>
            <div><label className="text-xs text-slate-500 mb-1 block">Control Measures</label>
              <textarea className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" rows={2} value={form.controls} onChange={e => setForm(f => ({ ...f, controls: e.target.value }))} /></div>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm border border-slate-200 rounded-lg hover:bg-slate-50">Cancel</button>
              <button disabled={isGenerating} onClick={() => void generateWithAi()} className="flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm text-white hover:bg-violet-700 disabled:opacity-50">
                {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />} Generate hazards
              </button>
              <button onClick={add} className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Save Risk</button>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs text-slate-500 uppercase">
              <tr>
                <th className="text-left px-4 py-3">Hazard</th>
                <th className="text-left px-4 py-3">Area</th>
                <th className="text-center px-4 py-3">L</th>
                <th className="text-center px-4 py-3">C</th>
                <th className="text-center px-4 py-3">Risk</th>
                <th className="text-left px-4 py-3">Controls</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {risks.map(r => {
                const { label, color } = ratingLabel(r.likelihood, r.consequence);
                return (
                  <tr key={r.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-800">{r.hazard}</td>
                    <td className="px-4 py-3 text-slate-500">{r.area}</td>
                    <td className="px-4 py-3 text-center">{r.likelihood}</td>
                    <td className="px-4 py-3 text-center">{r.consequence}</td>
                    <td className="px-4 py-3 text-center"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${color}`}>{label}</span></td>
                    <td className="px-4 py-3 text-slate-600 max-w-xs text-xs">{r.controls}</td>
                    <td className="px-4 py-3"><button onClick={() => setRisks(rs => rs.filter(x => x.id !== r.id))}><Trash2 className="w-4 h-4 text-slate-300 hover:text-red-500" /></button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-400">L = Likelihood, C = Consequence. Risk Rating = L × C</p>
      </div>
    </div>
  );
};
