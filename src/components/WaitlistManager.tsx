import React, { useState } from 'react';
import { DbUser } from '../services/types';
import { Users, Filter, Plus, Phone, Calendar, CheckSquare, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import { usePersistedState } from '../hooks/usePersistedState';

interface WaitlistManagerProps {
  user?: DbUser | null;
}

type EnrolmentLead = {
  id: string;
  parentName: string;
  childName: string;
  requestedDate: string;
  status: 'New' | 'Tour Booked' | 'Waitlisted' | 'Offered';
};

export const WaitlistManager: React.FC<WaitlistManagerProps> = ({ user }) => {
  const [leads, setLeads] = usePersistedState<EnrolmentLead[]>('waitlist_leads', [
    { id: '1', parentName: 'Sarah Jenkins', childName: 'Leo (6mo)', requestedDate: 'Jan 2027', status: 'New' },
    { id: '2', parentName: 'Michael Oak', childName: 'Mia (2yr)', requestedDate: 'Oct 2026', status: 'Tour Booked' },
    { id: '3', parentName: 'Emma R.', childName: 'Toby (3yr)', requestedDate: 'Jul 2026', status: 'Waitlisted' },
    { id: '4', parentName: 'Liam H.', childName: 'Ava (1yr)', requestedDate: 'ASAP', status: 'Offered' },
  ]);
  const [showAddFamily, setShowAddFamily] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'All' | EnrolmentLead['status']>('All');
  const [draft, setDraft] = useState({ parentName: '', childName: '', requestedDate: '' });

  const updateStatus = (id: string, newStatus: EnrolmentLead['status']) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status: newStatus } : l));
    toast.success(`Updated status to ${newStatus}`);
  };

  const columns: EnrolmentLead['status'][] = ['New', 'Tour Booked', 'Waitlisted', 'Offered'];

  const addFamily = (event: React.FormEvent) => {
    event.preventDefault();
    setLeads(current => [...current, { id: String(Date.now()), parentName: draft.parentName.trim(), childName: draft.childName.trim(), requestedDate: draft.requestedDate.trim(), status: 'New' }]);
    setDraft({ parentName: '', childName: '', requestedDate: '' });
    setShowAddFamily(false);
    toast.success('Family added to the waitlist');
  };

  return (
    <div className="h-full w-full bg-slate-50 flex flex-col p-6 md:p-10 overflow-y-auto">
      <div className="max-w-7xl mx-auto w-full space-y-8">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-white p-6 rounded-[2rem] shadow-sm border border-slate-200">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Waitlist CRM</h1>
                <p className="text-slate-500 font-medium mt-1">Manage leads, tours, and enrolment offers seamlessly.</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button type="button" aria-label="Filter waitlist" aria-pressed={showFilters} onClick={() => setShowFilters(value => !value)} className="p-3 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors shadow-sm">
              <Filter className="w-5 h-5" />
            </button>
            <button type="button" onClick={() => setShowAddFamily(true)} className="px-5 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-lg flex items-center gap-2">
              <Plus className="w-5 h-5" /> Add Family
            </button>
          </div>
        </header>

        {showFilters ? (
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4">
            <label className="text-sm font-medium text-slate-700" htmlFor="waitlist-status-filter">Status</label>
            <select id="waitlist-status-filter" value={statusFilter} onChange={event => setStatusFilter(event.target.value as typeof statusFilter)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
              <option>All</option>{columns.map(status => <option key={status}>{status}</option>)}
            </select>
          </div>
        ) : null}

        {/* Kanban Board */}
        <div className="flex gap-6 overflow-x-auto pb-4">
          {columns.map(col => {
            const colLeads = leads.filter(l => l.status === col && (statusFilter === 'All' || l.status === statusFilter));
            return (
              <div key={col} className="bg-slate-200/50 rounded-3xl p-4 min-w-[300px] flex-1 border border-slate-200">
                <div className="flex items-center justify-between mb-4 px-2">
                  <h3 className="font-bold text-slate-800 text-lg">{col}</h3>
                  <span className="bg-white border border-slate-200 text-slate-700 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                    {colLeads.length}
                  </span>
                </div>
                
                <div className="space-y-4">
                  {colLeads.map(lead => (
                    <div key={lead.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-300 transition-all group">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-slate-900">{lead.parentName}</h4>
                      </div>
                      <p className="text-sm font-semibold text-blue-600 mb-1">{lead.childName}</p>
                      <p className="text-xs font-medium text-slate-500 mb-4 bg-slate-50 inline-block px-2 py-1 rounded">Req: {lead.requestedDate}</p>
                      
                      <div className="flex gap-2 mb-4">
                        <button type="button" onClick={() => toast.success(`Call task created for ${lead.parentName}`)} className="p-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors" title="Call">
                          <Phone className="w-4 h-4" />
                        </button>
                        <button type="button" onClick={() => toast.success(`Email draft opened for ${lead.parentName}`)} className="p-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors" title="Email">
                          <Mail className="w-4 h-4" />
                        </button>
                        <button type="button" onClick={() => updateStatus(lead.id, 'Tour Booked')} className="p-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors" title="Schedule Tour">
                          <Calendar className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Rapid Status Change */}
                      <div className="pt-3 border-t border-slate-100 flex gap-2">
                         {col !== 'Tour Booked' && <button onClick={() => updateStatus(lead.id, 'Tour Booked')} className="text-[10px] uppercase font-bold text-slate-500 hover:text-blue-600">Track Tour</button>}
                         {col !== 'Waitlisted' && <button onClick={() => updateStatus(lead.id, 'Waitlisted')} className="text-[10px] uppercase font-bold text-slate-500 hover:text-blue-600">Waitlist</button>}
                         {col !== 'Offered' && <button onClick={() => updateStatus(lead.id, 'Offered')} className="text-[10px] uppercase font-bold text-emerald-600 hover:text-emerald-700 ml-auto flex items-center gap-1"><CheckSquare className="w-3 h-3"/> Offer Spot</button>}
                      </div>
                    </div>
                  ))}
                  {colLeads.length === 0 && (
                    <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center text-sm font-medium text-slate-400">
                      Empty
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {showAddFamily ? (
          <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/50 p-4" role="dialog" aria-modal="true" aria-labelledby="add-family-title">
            <form onSubmit={addFamily} className="w-full max-w-md space-y-4 rounded-2xl bg-white p-6 shadow-2xl">
              <h2 id="add-family-title" className="text-xl font-bold text-slate-900">Add family</h2>
              <input aria-label="Parent name" required value={draft.parentName} onChange={event => setDraft(current => ({ ...current, parentName: event.target.value }))} placeholder="Parent name" className="w-full rounded-lg border border-slate-200 px-3 py-2" />
              <input aria-label="Child details" required value={draft.childName} onChange={event => setDraft(current => ({ ...current, childName: event.target.value }))} placeholder="Child name and age" className="w-full rounded-lg border border-slate-200 px-3 py-2" />
              <input aria-label="Requested start" required value={draft.requestedDate} onChange={event => setDraft(current => ({ ...current, requestedDate: event.target.value }))} placeholder="Requested start" className="w-full rounded-lg border border-slate-200 px-3 py-2" />
              <div className="flex gap-2"><button type="submit" className="flex-1 rounded-lg bg-slate-900 px-4 py-2 font-medium text-white">Add family</button><button type="button" onClick={() => setShowAddFamily(false)} className="rounded-lg border border-slate-200 px-4 py-2 text-slate-600">Cancel</button></div>
            </form>
          </div>
        ) : null}

      </div>
    </div>
  );
};
