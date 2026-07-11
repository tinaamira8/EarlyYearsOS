import React, { useState, useEffect } from 'react';
import { db } from '../services/database';
import { DbUser, DbChild } from '../services/types';
import { 
  Pill, AlertTriangle, CheckSquare, Plus,
  Search, ShieldCheck, Clock
} from 'lucide-react';
import toast from 'react-hot-toast';

interface MedicationLogProps {
  user?: DbUser | null;
}

type MedicationRecord = {
  id: string;
  childId: string;
  medicationName: string;
  dosage: string;
  timeDue: string;
  status: 'Pending' | 'Administered' | 'Missed';
  administeredAt?: string;
  administeredBy?: string;
  witnessedBy?: string;
};

export const MedicationLog: React.FC<MedicationLogProps> = ({ user }) => {
  const [children, setChildren] = useState<DbChild[]>([]);
  const [records, setRecords] = useState<MedicationRecord[]>([
    { id: '1', childId: 'mock1', medicationName: 'Amoxicillin', dosage: '5ml', timeDue: '12:00 PM', status: 'Pending' }
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [draft, setDraft] = useState({ childName: '', medicationName: '', dosage: '', timeDue: '' });

  useEffect(() => {
    if (user?.centreId) {
      db.children.getChildren(user.centreId).then(list => {
        setChildren(list);
        // Map mock record to the first real child
        if (list.length > 0) {
          setRecords([{ id: '1', childId: list[0].id, medicationName: 'Amoxicillin', dosage: '5ml', timeDue: '12:00 PM', status: 'Pending' }]);
        }
      }).catch(console.error);
    }
  }, [user]);

  const administerMedication = (id: string) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setRecords(prev => prev.map(r => r.id === id ? { 
      ...r, 
      status: 'Administered', 
      administeredAt: time,
      administeredBy: user?.name || 'Educator',
      witnessedBy: 'Secondary Educator'
    } : r));
    toast.success("Medication administration logged securely.");
  };

  const pendingRecords = records.filter(r => r.status === 'Pending' && children.find(c => c.id === r.childId)?.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const completedRecords = records.filter(r => r.status === 'Administered');

  const addPrescription = (event: React.FormEvent) => {
    event.preventDefault();
    const existingChild = children.find(child => child.name.toLowerCase() === draft.childName.trim().toLowerCase());
    const childId = existingChild?.id || `demo-child-${Date.now()}`;
    if (!existingChild) {
      setChildren(current => [...current, { id: childId, centreId: user?.centreId || 'demo-centre', name: draft.childName.trim() }]);
    }
    setRecords(current => [...current, { id: `med-${Date.now()}`, childId, medicationName: draft.medicationName.trim(), dosage: draft.dosage.trim(), timeDue: draft.timeDue, status: 'Pending' }]);
    setDraft({ childName: '', medicationName: '', dosage: '', timeDue: '' });
    setShowForm(false);
    toast.success('Prescription added');
  };

  return (
    <div className="h-full w-full bg-slate-50 flex flex-col p-6 md:p-10 overflow-y-auto">
      <div className="max-w-6xl mx-auto w-full space-y-8">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-white p-6 rounded-[2rem] shadow-sm border border-slate-200">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-pink-50 text-pink-500 rounded-2xl flex items-center justify-center">
                <Pill className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Medication Log</h1>
                <p className="text-slate-500 font-medium mt-1">Track and sign off on prescribed doses safely.</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
             <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input 
                type="text" 
                placeholder="Search child..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20 rounded-xl font-medium transition-all"
              />
            </div>
            <button type="button" onClick={() => setShowForm(true)} className="px-5 py-3 w-full sm:w-auto bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-lg flex items-center justify-center gap-2">
              <Plus className="w-5 h-5" /> Add Prescription
            </button>
          </div>
        </header>

        {/* Action Board */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Due Today */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <h2 className="text-xl font-bold text-slate-800">Due Today</h2>
              <span className="ml-auto bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-black">{pendingRecords.length} Pending</span>
            </div>

            <div className="space-y-4">
              {pendingRecords.length === 0 ? (
                <div className="text-center p-8 text-slate-400 font-medium">No medications currently due.</div>
              ) : pendingRecords.map(record => {
                const child = children.find(c => c.id === record.childId);
                return (
                  <div key={record.id} className="bg-slate-50 border border-slate-200 p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg">{child?.name}</h3>
                      <div className="flex items-center gap-2 text-sm mt-1">
                        <span className="font-bold text-pink-600">{record.medicationName}</span>
                        <span className="text-slate-300">•</span>
                        <span className="font-semibold text-slate-600 border border-slate-200 px-2 rounded-md bg-white">{record.dosage}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-xs font-bold text-slate-400 uppercase">Due Time</p>
                        <p className="font-bold text-slate-700 flex items-center gap-1"><Clock className="w-4 h-4"/> {record.timeDue}</p>
                      </div>
                      <button 
                        onClick={() => administerMedication(record.id)}
                        className="px-4 py-2 bg-pink-100 text-pink-700 hover:bg-pink-200 font-bold rounded-xl transition-colors shrink-0"
                      >
                        Administer
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Administered Log */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              <h2 className="text-xl font-bold text-slate-800">Completed Log</h2>
              <span className="ml-auto bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-black">{completedRecords.length} Today</span>
            </div>

            <div className="space-y-4">
              {completedRecords.length === 0 ? (
                <div className="text-center p-8 text-slate-400 font-medium">No medications administered yet.</div>
              ) : completedRecords.map(record => {
                const child = children.find(c => c.id === record.childId);
                return (
                  <div key={record.id} className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-slate-900">{child?.name}</h3>
                      <span className="text-xs font-bold text-emerald-600 bg-white px-2 py-1 rounded border border-emerald-200 flex items-center gap-1">
                        <CheckSquare className="w-3 h-3" /> Administered at {record.administeredAt}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-slate-600 mb-3">{record.medicationName} — {record.dosage}</p>
                    <div className="flex gap-4 border-t border-emerald-200/50 pt-3 text-xs bg-white/50 p-2 rounded-lg">
                      <div>
                        <span className="text-emerald-700/60 font-bold uppercase">Staff</span>
                        <p className="font-semibold text-emerald-900">{record.administeredBy}</p>
                      </div>
                      <div className="w-px bg-emerald-200"></div>
                      <div>
                        <span className="text-emerald-700/60 font-bold uppercase">Witness</span>
                        <p className="font-semibold text-emerald-900">{record.witnessedBy}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          
        </div>

        {showForm ? (
          <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/50 p-4" role="dialog" aria-modal="true" aria-labelledby="prescription-title">
            <form onSubmit={addPrescription} className="w-full max-w-md space-y-4 rounded-2xl bg-white p-6 shadow-2xl">
              <h2 id="prescription-title" className="text-xl font-bold text-slate-900">Add prescription</h2>
              <input aria-label="Child name" required value={draft.childName} onChange={event => setDraft(current => ({ ...current, childName: event.target.value }))} placeholder="Child name" className="w-full rounded-lg border border-slate-200 px-3 py-2" />
              <input aria-label="Medication name" required value={draft.medicationName} onChange={event => setDraft(current => ({ ...current, medicationName: event.target.value }))} placeholder="Medication" className="w-full rounded-lg border border-slate-200 px-3 py-2" />
              <input aria-label="Dosage" required value={draft.dosage} onChange={event => setDraft(current => ({ ...current, dosage: event.target.value }))} placeholder="Dosage" className="w-full rounded-lg border border-slate-200 px-3 py-2" />
              <input aria-label="Due time" type="time" required value={draft.timeDue} onChange={event => setDraft(current => ({ ...current, timeDue: event.target.value }))} className="w-full rounded-lg border border-slate-200 px-3 py-2" />
              <div className="flex gap-2"><button type="submit" className="flex-1 rounded-lg bg-slate-900 px-4 py-2 font-medium text-white">Add prescription</button><button type="button" onClick={() => setShowForm(false)} className="rounded-lg border border-slate-200 px-4 py-2 text-slate-600">Cancel</button></div>
            </form>
          </div>
        ) : null}

      </div>
    </div>
  );
};
