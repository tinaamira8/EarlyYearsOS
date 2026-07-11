import React, { useState, useEffect } from 'react';
import { db } from '../services/database';
import { DbUser, DbChild, DbHealthRecord } from '../services/types';
import { 
  HeartPulse, Search, Filter, AlertTriangle, FileWarning, 
  CheckCircle2, Clock, Activity, Download, Plus 
} from 'lucide-react';

interface MedicalManagerProps {
  user?: DbUser | null;
}

export const MedicalManager: React.FC<MedicalManagerProps> = ({ user }) => {
  const [children, setChildren] = useState<DbChild[]>([]);
  const [healthRecords, setHealthRecords] = useState<DbHealthRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'action-plans' | 'expired'>('all');
  const [showForm, setShowForm] = useState(false);
  const [draft, setDraft] = useState({ name: '', condition: '', severity: 'Medium' as 'High' | 'Medium' | 'Low' });

  useEffect(() => {
    if (user?.centreId) {
      // First load all children
      db.children.getChildren(user.centreId).then(childList => {
        // Find those who actually have a medical condition registered
        const medicalChildren = childList.filter(c => c.medicalCondition);
        setChildren(medicalChildren);
      });
      // Load detailed health records metadata
      db.children.getHealthRecords(user.centreId).then(setHealthRecords);
    }
  }, [user]);

  // Combine db.children and db.health_records logic simply for UI display
  const displayItems = children.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase())).filter(c => {
    if (filterMode === 'all') return true;
    if (filterMode === 'action-plans') return !!c.actionPlanDate;
    
    // Check if plan is expired
    if (filterMode === 'expired' && c.actionPlanDate) {
      const expiry = new Date(c.actionPlanDate);
      expiry.setFullYear(expiry.getFullYear() + 1); // Mock 1 year validity rule
      return expiry < new Date();
    }
    return false;
  });

  const addRecord = (event: React.FormEvent) => {
    event.preventDefault();
    setChildren(current => [...current, { id: String(Date.now()), centreId: user?.centreId || 'demo-centre', name: draft.name.trim(), medicalCondition: draft.condition.trim(), severity: draft.severity, actionPlanDate: new Date().toISOString().slice(0, 10) }]);
    setDraft({ name: '', condition: '', severity: 'Medium' });
    setShowForm(false);
  };

  return (
    <div className="h-full w-full bg-slate-50 flex flex-col p-6 md:p-10 overflow-y-auto">
      <div className="max-w-7xl mx-auto w-full space-y-8">
        
        {/* Header Options */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center">
                <HeartPulse className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Medical & Wellness</h1>
                <p className="text-slate-500 text-sm mt-1">Track allergies, action plans, and health records.</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input 
                type="text" 
                placeholder="Find a child..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-rose-400 focus:ring-2 focus:ring-rose-400/20 rounded-xl text-sm transition-all"
              />
            </div>
            <button type="button" onClick={() => setShowForm(true)} className="px-5 py-2.5 bg-rose-500 text-white text-sm font-semibold rounded-xl hover:bg-rose-600 transition-colors shadow-md shadow-rose-500/20 flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add Record
            </button>
          </div>
        </header>

        {/* Dashboard Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-500 shrink-0">
              <FileWarning className="w-6 h-6" />
            </div>
            <div>
              <p className="text-3xl font-black text-slate-900">{children.length}</p>
              <p className="text-sm font-semibold text-slate-500">Active Action Plans</p>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-500 shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-3xl font-black text-slate-900">2</p>
              <p className="text-sm font-semibold text-slate-500">Expiring in 30 Days</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-3xl font-black text-slate-900">100%</p>
              <p className="text-sm font-semibold text-slate-500">Staff First-Aid Certified</p>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden flex flex-col">
          <div className="flex items-center gap-2 p-4 bg-slate-50 border-b border-slate-200">
            <Filter className="w-4 h-4 text-slate-400" />
            <button onClick={() => setFilterMode('all')} className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-colors ${filterMode === 'all' ? 'bg-slate-200 text-slate-800' : 'text-slate-500 hover:bg-slate-100'}`}>All Records</button>
            <button onClick={() => setFilterMode('action-plans')} className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-colors ${filterMode === 'action-plans' ? 'bg-slate-200 text-slate-800' : 'text-slate-500 hover:bg-slate-100'}`}>With Action Plans</button>
            <button onClick={() => setFilterMode('expired')} className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-colors ${filterMode === 'expired' ? 'bg-red-100 text-red-700' : 'text-slate-500 hover:bg-slate-100'}`}>Expiring/Expired</button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b border-slate-200">
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Child Name</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Condition</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Severity</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Action Plan / Expiry</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {displayItems.length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-500">No medical records match your criteria.</td></tr>
                ) : (
                  displayItems.map(child => (
                    <tr key={child.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600">
                            {child.name.charAt(0)}
                          </div>
                          <span className="font-bold text-slate-900">{child.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-semibold text-slate-700">{child.medicalCondition || "N/A"}</span>
                        {child.allergies && child.allergies.length > 0 && (
                          <div className="text-xs text-slate-500 mt-1">Allergies: {child.allergies.join(', ')}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                          child.severity === 'High' ? 'bg-red-100 text-red-700' :
                          child.severity === 'Medium' ? 'bg-amber-100 text-amber-700' :
                          'bg-emerald-100 text-emerald-700'
                        }`}>
                          {child.severity || "Unknown"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {child.actionPlanDate ? (
                          <div className="flex items-center gap-2 text-slate-700 font-medium text-sm">
                            <Clock className="w-4 h-4 text-slate-400" />
                            {child.actionPlanDate}
                          </div>
                        ) : (
                          <span className="text-slate-400 text-italic text-sm">No Action Plan</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button type="button" aria-label={`Print health record for ${child.name}`} onClick={() => window.print()} className="p-2 text-slate-400 hover:text-brand-azure hover:bg-blue-50 rounded-lg transition-colors">
                          <Download className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {showForm ? (
          <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/50 p-4" role="dialog" aria-modal="true" aria-labelledby="medical-record-title">
            <form onSubmit={addRecord} className="w-full max-w-md space-y-4 rounded-2xl bg-white p-6 shadow-2xl">
              <h2 id="medical-record-title" className="text-xl font-bold text-slate-900">Add medical record</h2>
              <input aria-label="Child name" required value={draft.name} onChange={event => setDraft(current => ({ ...current, name: event.target.value }))} placeholder="Child name" className="w-full rounded-lg border border-slate-200 px-3 py-2" />
              <input aria-label="Medical condition" required value={draft.condition} onChange={event => setDraft(current => ({ ...current, condition: event.target.value }))} placeholder="Medical condition" className="w-full rounded-lg border border-slate-200 px-3 py-2" />
              <select aria-label="Severity" value={draft.severity} onChange={event => setDraft(current => ({ ...current, severity: event.target.value as typeof current.severity }))} className="w-full rounded-lg border border-slate-200 px-3 py-2"><option>Low</option><option>Medium</option><option>High</option></select>
              <div className="flex gap-2"><button type="submit" className="flex-1 rounded-lg bg-rose-600 px-4 py-2 font-medium text-white">Add record</button><button type="button" onClick={() => setShowForm(false)} className="rounded-lg border border-slate-200 px-4 py-2 text-slate-600">Cancel</button></div>
            </form>
          </div>
        ) : null}

      </div>
    </div>
  );
};
