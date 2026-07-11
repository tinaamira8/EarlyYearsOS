import React, { useState } from 'react';
import { DbUser } from '../services/types';
import { 
  Bus, MapPin, Users, FileText, CheckSquare, 
  AlertTriangle, Plus, Calendar, ShieldCheck
} from 'lucide-react';
import toast from 'react-hot-toast';

interface ExcursionManagerProps {
  user?: DbUser | null;
}

type Excursion = {
  id: string;
  title: string;
  date: string;
  location: string;
  status: 'Planning' | 'Approved' | 'Completed';
  childrenCount: number;
  staffCount: number;
  riskAssessment: boolean;
  transpoPlan: boolean;
};

export const ExcursionManager: React.FC<ExcursionManagerProps> = ({ user }) => {
  const [excursions, setExcursions] = useState<Excursion[]>([
    { id: '1', title: 'Local Library Storytime', date: 'Oct 14, 2026', location: 'City Library', status: 'Approved', childrenCount: 22, staffCount: 4, riskAssessment: true, transpoPlan: true },
    { id: '2', title: 'Reptile Park Visit', date: 'Nov 02, 2026', location: 'Australian Reptile Park', status: 'Planning', childrenCount: 45, staffCount: 8, riskAssessment: false, transpoPlan: true },
  ]);
  const [view, setView] = useState<'active' | 'past'>('active');
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState<Excursion | null>(null);
  const [draft, setDraft] = useState({ title: '', date: '', location: '' });
  const displayedExcursions = excursions.filter(excursion => view === 'past' ? excursion.status === 'Completed' : excursion.status !== 'Completed');

  const addExcursion = (event: React.FormEvent) => {
    event.preventDefault();
    setExcursions(current => [...current, { id: String(Date.now()), title: draft.title.trim(), date: draft.date, location: draft.location.trim(), status: 'Planning', childrenCount: 0, staffCount: 1, riskAssessment: false, transpoPlan: false }]);
    setDraft({ title: '', date: '', location: '' });
    setShowForm(false);
    setView('active');
    toast.success('Excursion created');
  };

  return (
    <div className="h-full w-full bg-slate-50 flex flex-col p-6 md:p-10 overflow-y-auto">
      <div className="max-w-6xl mx-auto w-full space-y-8">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-white p-6 rounded-[2rem] shadow-sm border border-slate-200">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-sky-50 text-sky-600 rounded-2xl flex items-center justify-center">
                <Bus className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Excursion Manager</h1>
                <p className="text-slate-500 font-medium mt-1">Ratio logistics, permissions, and risk assessments for outings.</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => setShowForm(true)} className="px-5 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-lg flex items-center gap-2">
              <Plus className="w-5 h-5" /> New Excursion
            </button>
          </div>
        </header>

        {/* Dashboard Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Active Excursions Planner */}
          <div className="lg:col-span-2 space-y-6">
             <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-800">Upcoming Outings</h2>
                <div className="flex gap-2">
                   <button type="button" onClick={() => setView('active')} className={`px-3 py-1.5 border border-slate-200 shadow-sm text-sm font-bold rounded-lg ${view === 'active' ? 'bg-white text-slate-700' : 'text-slate-400'}`}>Active</button>
                   <button type="button" onClick={() => setView('past')} className={`px-3 py-1.5 text-sm font-bold ${view === 'past' ? 'bg-white text-slate-700 shadow-sm rounded-lg' : 'text-slate-400 hover:text-slate-600'}`}>Past</button>
                </div>
             </div>

             {displayedExcursions.map(ex => (
                <div key={ex.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:border-sky-300 transition-all group">
                   <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
                      <div>
                         <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-black text-slate-900 group-hover:text-sky-700 transition-colors">{ex.title}</h3>
                            <span className={`px-2.5 py-1 rounded text-xs font-black uppercase ${ex.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                               {ex.status}
                            </span>
                         </div>
                         <div className="flex items-center gap-4 text-sm font-semibold text-slate-500">
                            <span className="flex items-center gap-1"><Calendar className="w-4 h-4"/> {ex.date}</span>
                            <span className="flex items-center gap-1"><MapPin className="w-4 h-4"/> {ex.location}</span>
                         </div>
                      </div>
                      
                      <div className="flex gap-4">
                         <div className="text-center p-3 bg-slate-50 rounded-xl border border-slate-100 min-w-[80px]">
                            <p className="text-xs uppercase font-bold text-slate-400 mb-1">Ratio</p>
                            <p className="font-black text-slate-800 text-lg">1:{Math.round(ex.childrenCount/ex.staffCount)}</p>
                         </div>
                         <div className="text-center p-3 bg-slate-50 rounded-xl border border-slate-100 min-w-[80px]">
                            <p className="text-xs uppercase font-bold text-slate-400 mb-1">Party</p>
                            <p className="font-black text-slate-800 text-lg flex items-center justify-center gap-1"><Users className="w-4 h-4 text-sky-500"/>{ex.childrenCount}</p>
                         </div>
                      </div>
                   </div>

                   <div className="border-t border-slate-100 pt-4 flex flex-wrap gap-3">
                      <div className={`px-3 py-2 rounded-lg flex items-center gap-2 text-sm font-bold border ${ex.riskAssessment ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>
                         {ex.riskAssessment ? <CheckSquare className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                         Risk Assessment
                      </div>
                      <div className={`px-3 py-2 rounded-lg flex items-center gap-2 text-sm font-bold border ${ex.transpoPlan ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>
                         {ex.transpoPlan ? <CheckSquare className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                         Transport Plan
                      </div>
                      <div className="px-3 py-2 rounded-lg flex items-center gap-2 text-sm font-bold border bg-emerald-50 text-emerald-700 border-emerald-200">
                         <CheckSquare className="w-4 h-4" /> Ratio Met
                      </div>
                      <button type="button" onClick={() => setSelected(ex)} className="px-4 py-2 ml-auto text-sm font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors">
                         Open Dossier
                      </button>
                   </div>
                </div>
             ))}
             {displayedExcursions.length === 0 ? <p className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500">No {view} excursions.</p> : null}
          </div>

          {/* Guidelines & Quick Links */}
          <div className="lg:col-span-1 space-y-6">
             <div className="bg-sky-50 rounded-3xl p-6 border border-sky-100 shadow-sm text-sky-900">
                <div className="flex items-center gap-3 mb-4">
                   <ShieldCheck className="w-6 h-6 text-sky-600" />
                   <h3 className="font-bold text-lg">Ratio Cheat Sheet</h3>
                </div>
                <div className="space-y-4">
                   <div className="flex justify-between items-center bg-white/60 p-3 rounded-xl">
                      <span className="font-semibold text-sm">Standard (0-2yr)</span>
                      <span className="font-black text-sky-700">1:4</span>
                   </div>
                   <div className="flex justify-between items-center bg-white/60 p-3 rounded-xl">
                      <span className="font-semibold text-sm">Standard (3-5yr)</span>
                      <span className="font-black text-sky-700">1:10</span>
                   </div>
                   <div className="flex justify-between items-center bg-white/60 p-3 rounded-xl border-l-4 border-rose-400">
                      <span className="font-semibold text-sm">Near Water Hazard</span>
                      <span className="font-black text-rose-600">1:1 !!</span>
                   </div>
                </div>
             </div>

             <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col gap-3">
                <h3 className="font-bold text-slate-900 mb-2">Templated Forms</h3>
                <button onClick={() => toast.success("Template Copied to Desktop")} className="w-full text-left px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-xl font-semibold text-slate-700 text-sm transition-colors flex items-center gap-2">
                   <FileText className="w-4 h-4 text-slate-400" /> Parent Permission Slip
                </button>
                <button onClick={() => toast.success("Template Copied to Desktop")} className="w-full text-left px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-xl font-semibold text-slate-700 text-sm transition-colors flex items-center gap-2">
                   <FileText className="w-4 h-4 text-slate-400" /> Transport Vendor Log
                </button>
                <button onClick={() => toast.success("Template Copied to Desktop")} className="w-full text-left px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-xl font-semibold text-slate-700 text-sm transition-colors flex items-center gap-2">
                   <FileText className="w-4 h-4 text-slate-400" /> Pre-departure Checklist
                </button>
             </div>
          </div>

        </div>

        {showForm ? (
          <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/50 p-4" role="dialog" aria-modal="true" aria-labelledby="excursion-form-title">
            <form onSubmit={addExcursion} className="w-full max-w-md space-y-4 rounded-2xl bg-white p-6 shadow-2xl">
              <h2 id="excursion-form-title" className="text-xl font-bold text-slate-900">New excursion</h2>
              <input aria-label="Excursion title" required value={draft.title} onChange={event => setDraft(current => ({ ...current, title: event.target.value }))} placeholder="Excursion title" className="w-full rounded-lg border border-slate-200 px-3 py-2" />
              <input aria-label="Excursion date" type="date" required value={draft.date} onChange={event => setDraft(current => ({ ...current, date: event.target.value }))} className="w-full rounded-lg border border-slate-200 px-3 py-2" />
              <input aria-label="Excursion location" required value={draft.location} onChange={event => setDraft(current => ({ ...current, location: event.target.value }))} placeholder="Location" className="w-full rounded-lg border border-slate-200 px-3 py-2" />
              <div className="flex gap-2"><button type="submit" className="flex-1 rounded-lg bg-slate-900 px-4 py-2 font-medium text-white">Create excursion</button><button type="button" onClick={() => setShowForm(false)} className="rounded-lg border border-slate-200 px-4 py-2 text-slate-600">Cancel</button></div>
            </form>
          </div>
        ) : null}

        {selected ? (
          <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/50 p-4" role="dialog" aria-modal="true" aria-labelledby="excursion-dossier-title">
            <div className="w-full max-w-lg space-y-4 rounded-2xl bg-white p-6 shadow-2xl">
              <h2 id="excursion-dossier-title" className="text-xl font-bold text-slate-900">{selected.title}</h2>
              <p className="text-sm text-slate-600">{selected.date} · {selected.location}</p>
              <div className="grid grid-cols-2 gap-3 text-sm"><div className="rounded-xl bg-slate-50 p-3">Risk assessment: {selected.riskAssessment ? 'Complete' : 'Required'}</div><div className="rounded-xl bg-slate-50 p-3">Transport plan: {selected.transpoPlan ? 'Complete' : 'Required'}</div></div>
              <button type="button" onClick={() => setSelected(null)} className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white">Close dossier</button>
            </div>
          </div>
        ) : null}

      </div>
    </div>
  );
};
