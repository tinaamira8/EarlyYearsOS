import React, { useRef, useState } from 'react';
import { DbUser } from '../services/types';
import { 
  ShieldAlert, ShieldCheck, FileWarning, AlertTriangle, 
  Plus, Search, Download, CheckCircle2 
} from 'lucide-react';
import toast from 'react-hot-toast';

interface SafetyCenterProps {
  user?: DbUser | null;
}

type SafetyRecord = {
  id: string;
  date: string;
  type: 'Incident' | 'Hazard' | 'Injury';
  title: string;
  status: 'Open' | 'Under Investigation' | 'Closed';
  reporter: string;
};

export const SafetyCenter: React.FC<SafetyCenterProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'reports' | 'policies'>('reports');
  const [records, setRecords] = useState<SafetyRecord[]>([
    { id: '1', date: '2026-03-20', type: 'Injury', title: 'Tripped on playground mat', status: 'Closed', reporter: 'Sarah Jenkins' },
    { id: '2', date: '2026-04-02', type: 'Hazard', title: 'Loose railing near front gate', status: 'Open', reporter: 'Michael O.' },
    { id: '3', date: '2026-04-05', type: 'Incident', title: 'Allergic reaction to unknown food source', status: 'Under Investigation', reporter: 'Anna P.' },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [showReportForm, setShowReportForm] = useState(false);
  const [reportDraft, setReportDraft] = useState({ title: '', type: 'Incident' as SafetyRecord['type'] });
  const [policyFiles, setPolicyFiles] = useState<string[]>([]);
  const policyUploadRef = useRef<HTMLInputElement>(null);

  const displayRecords = records.filter(r => r.title.toLowerCase().includes(searchQuery.toLowerCase()) || r.status.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleNewReport = () => {
    setShowReportForm(true);
  };

  const addReport = (event: React.FormEvent) => {
    event.preventDefault();
    setRecords(current => [{ id: String(Date.now()), date: new Date().toISOString().slice(0, 10), type: reportDraft.type, title: reportDraft.title.trim(), status: 'Open', reporter: user?.name || 'Demo User' }, ...current]);
    setReportDraft({ title: '', type: 'Incident' });
    setShowReportForm(false);
    toast.success('Safety report created');
  };

  const addPolicyFiles = (files: FileList | null) => {
    if (!files?.length) return;
    setPolicyFiles(current => [...current, ...Array.from(files).map(file => file.name)]);
    toast.success('Policy document added');
  };

  return (
    <div className="h-full w-full bg-slate-50 flex flex-col p-6 md:p-10 overflow-y-auto">
      <div className="max-w-7xl mx-auto w-full space-y-8">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-white p-6 rounded-[2rem] shadow-sm border border-slate-200">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Safety Center</h1>
                <p className="text-slate-500 font-medium mt-1">Manage Incidents, Injuries, Trauma, and Illness reports.</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <button onClick={handleNewReport} className="px-5 py-3 w-full md:w-auto bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20 flex items-center justify-center gap-2">
              <Plus className="w-5 h-5" /> New Safety Report
            </button>
          </div>
        </header>

        {/* Dashboard Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-emerald-500 p-6 rounded-3xl shadow-sm shadow-emerald-500/20 text-white flex items-center justify-between">
            <div>
              <p className="text-5xl font-black mb-1">14</p>
              <p className="text-emerald-100 font-bold uppercase tracking-wider text-xs">Days Since Last Injury</p>
            </div>
            <div className="w-16 h-16 rounded-full bg-emerald-400/30 flex items-center justify-center">
              <ShieldCheck className="w-8 h-8 text-emerald-100" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-3xl font-black text-slate-900 mb-1">{records.filter(r => r.status === 'Open' || r.status === 'Under Investigation').length}</p>
              <p className="text-slate-500 font-bold uppercase tracking-wider text-xs">Active Investigations</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-amber-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-3xl font-black text-slate-900 mb-1">2</p>
              <p className="text-slate-500 font-bold uppercase tracking-wider text-xs">Reported Hazards</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center">
              <FileWarning className="w-6 h-6 text-rose-500" />
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="bg-white border border-slate-200 rounded-[2rem] shadow-sm overflow-hidden flex flex-col">
          <div className="flex items-center justify-between p-4 bg-slate-50 border-b border-slate-200">
            <div className="flex items-center bg-slate-200/50 p-1 rounded-xl">
              <button 
                onClick={() => setActiveTab('reports')} 
                className={`px-6 py-2 rounded-lg text-sm font-bold transition-colors ${activeTab === 'reports' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Incident Records
              </button>
              <button 
                onClick={() => setActiveTab('policies')} 
                className={`px-6 py-2 rounded-lg text-sm font-bold transition-colors ${activeTab === 'policies' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Policy Documents
              </button>
            </div>

            <div className="relative w-64 hidden sm:block">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input 
                type="text" 
                placeholder="Search records..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 focus:border-rose-400 focus:ring-1 focus:ring-rose-400 rounded-lg text-sm transition-all"
              />
            </div>
          </div>

          <div className="overflow-x-auto min-h-[400px]">
            {activeTab === 'reports' ? (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white border-b border-slate-100">
                    <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-wider w-1/3">Subject / Title</th>
                    <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {displayRecords.length === 0 ? (
                    <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-500 font-medium">No records found matching your search.</td></tr>
                  ) : (
                    displayRecords.map(record => (
                      <tr key={record.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-700">{record.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-bold uppercase ${
                            record.type === 'Injury' ? 'bg-red-50 text-red-700' :
                            record.type === 'Hazard' ? 'bg-amber-50 text-amber-700' :
                            'bg-indigo-50 text-indigo-700'
                          }`}>
                            {record.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-semibold text-slate-900 border-none">{record.title}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            {record.status === 'Closed' ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <ShieldAlert className="w-4 h-4 text-amber-500" />}
                            <span className="text-sm font-bold text-slate-600">{record.status}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <button type="button" onClick={() => window.print()} className="p-2 text-slate-400 hover:text-rose-600 bg-white hover:bg-rose-50 border border-slate-200 rounded-lg shadow-sm transition-all inline-flex items-center gap-2 text-xs font-bold px-3">
                            <Download className="w-4 h-4" /> Export PDF
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            ) : (
              <div className="p-12 text-center flex flex-col items-center justify-center">
                <FileWarning className="w-12 h-12 text-slate-300 mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">Policy Documents Manager</h3>
                <p className="text-slate-500 max-w-sm mb-6">Upload and govern centre safety policies, risk assessments, and emergency evacuation maps.</p>
                <input ref={policyUploadRef} type="file" multiple className="hidden" onChange={event => addPolicyFiles(event.target.files)} />
                <button type="button" onClick={() => policyUploadRef.current?.click()} className="px-6 py-2.5 bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300 font-bold rounded-lg transition-colors">
                  Upload Document
                </button>
                {policyFiles.length ? <ul className="mt-4 space-y-1 text-sm text-slate-600">{policyFiles.map(file => <li key={file}>{file}</li>)}</ul> : null}
              </div>
            )}
          </div>
        </div>

        {showReportForm ? (
          <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/50 p-4" role="dialog" aria-modal="true" aria-labelledby="safety-report-title">
            <form onSubmit={addReport} className="w-full max-w-md space-y-4 rounded-2xl bg-white p-6 shadow-2xl">
              <h2 id="safety-report-title" className="text-xl font-bold text-slate-900">New safety report</h2>
              <select aria-label="Report type" value={reportDraft.type} onChange={event => setReportDraft(current => ({ ...current, type: event.target.value as SafetyRecord['type'] }))} className="w-full rounded-lg border border-slate-200 px-3 py-2"><option>Incident</option><option>Hazard</option><option>Injury</option></select>
              <textarea aria-label="Report title" required value={reportDraft.title} onChange={event => setReportDraft(current => ({ ...current, title: event.target.value }))} placeholder="Describe the issue" rows={3} className="w-full rounded-lg border border-slate-200 px-3 py-2" />
              <div className="flex gap-2"><button type="submit" className="flex-1 rounded-lg bg-slate-900 px-4 py-2 font-medium text-white">Create report</button><button type="button" onClick={() => setShowReportForm(false)} className="rounded-lg border border-slate-200 px-4 py-2 text-slate-600">Cancel</button></div>
            </form>
          </div>
        ) : null}

      </div>
    </div>
  );
};
