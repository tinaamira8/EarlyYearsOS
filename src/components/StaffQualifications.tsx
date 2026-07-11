import React, { useState } from 'react';
import { GraduationCap, Plus, AlertTriangle } from 'lucide-react';

const initialStaff = [
  { id: 1, name: 'Sarah Johnson', role: 'Room Leader', qual: 'Diploma ECE', wwcc: 'WWC1234567E', wwccExpiry: '2027-03-01', firstAid: '2026-09-01', cpr: '2026-09-01', foodSafety: '2028-01-01' },
  { id: 2, name: 'Mark Chen', role: 'Educator', qual: 'Cert III CYC', wwcc: 'WWC9876543E', wwccExpiry: '2026-06-20', firstAid: '2025-06-01', cpr: '2026-03-01', foodSafety: '2027-06-01' },
  { id: 3, name: 'Amy Davis', role: 'Director', qual: 'Bachelor ECE', wwcc: 'WWC5551234E', wwccExpiry: '2028-01-15', firstAid: '2026-12-01', cpr: '2026-12-01', foodSafety: '2027-12-01' },
  { id: 4, name: 'James Park', role: 'Educator', qual: 'Cert III ECE', wwcc: 'WWC7772468E', wwccExpiry: '2027-11-01', firstAid: '2027-02-01', cpr: '2027-02-01', foodSafety: '2026-09-01' },
];

const today = new Date();
const isExpired = (d: string) => new Date(d) < today;
const isDueSoon = (d: string) => { const diff = (new Date(d).getTime() - today.getTime()) / 86400000; return diff >= 0 && diff <= 90; };
const cellStyle = (d: string) => isExpired(d) ? 'text-red-600 font-semibold' : isDueSoon(d) ? 'text-amber-600 font-semibold' : 'text-slate-700';

export const StaffQualifications: React.FC = () => {
  const [staff, setStaff] = useState(initialStaff);
  const [showForm, setShowForm] = useState(false);
  const [draft, setDraft] = useState({ name: '', role: '', qual: '' });

  const addStaff = (event: React.FormEvent) => {
    event.preventDefault();
    setStaff(current => [...current, { id: Date.now(), name: draft.name.trim(), role: draft.role.trim(), qual: draft.qual.trim(), wwcc: 'Pending', wwccExpiry: '2027-12-31', firstAid: '2027-12-31', cpr: '2027-12-31', foodSafety: '2027-12-31' }]);
    setDraft({ name: '', role: '', qual: '' });
    setShowForm(false);
  };

  return (
  <div className="h-full overflow-y-auto p-6">
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center">
          <GraduationCap className="w-5 h-5 text-violet-600" />
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-slate-800">Staff Qualifications</h1>
          <p className="text-slate-500 text-sm">Track certifications and compliance documents</p>
        </div>
        <button type="button" onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-indigo-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-indigo-700">
          <Plus className="w-4 h-4" /> Add Staff
        </button>
      </div>

      <div className="flex items-center gap-4 text-xs">
        <div className="flex items-center gap-1"><span className="w-3 h-3 bg-red-100 rounded inline-block" /><span className="text-red-600">Expired</span></div>
        <div className="flex items-center gap-1"><span className="w-3 h-3 bg-amber-100 rounded inline-block" /><span className="text-amber-600">Due within 90 days</span></div>
        <div className="flex items-center gap-1"><span className="w-3 h-3 bg-emerald-100 rounded inline-block" /><span className="text-emerald-600">Current</span></div>
      </div>

      <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-xs text-slate-500 uppercase">
            <tr>
              <th className="text-left px-4 py-3">Staff Member</th>
              <th className="text-left px-4 py-3">Qualification</th>
              <th className="text-left px-4 py-3">WWCC Expiry</th>
              <th className="text-left px-4 py-3">First Aid Expiry</th>
              <th className="text-left px-4 py-3">CPR Expiry</th>
              <th className="text-left px-4 py-3">Food Safety</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {staff.map(s => (
              <tr key={s.id} className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  <div className="font-medium text-slate-800">{s.name}</div>
                  <div className="text-xs text-slate-500">{s.role}</div>
                </td>
                <td className="px-4 py-3 text-slate-700">{s.qual}</td>
                <td className={`px-4 py-3 ${cellStyle(s.wwccExpiry)}`}>{s.wwccExpiry}</td>
                <td className={`px-4 py-3 ${cellStyle(s.firstAid)}`}>{s.firstAid}</td>
                <td className={`px-4 py-3 ${cellStyle(s.cpr)}`}>{s.cpr}</td>
                <td className={`px-4 py-3 ${cellStyle(s.foodSafety)}`}>{s.foodSafety}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {staff.some(s => isExpired(s.firstAid) || isExpired(s.wwccExpiry)) && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-700">Some staff have expired certifications. Please arrange renewals immediately.</p>
        </div>
      )}
      {showForm ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/50 p-4" role="dialog" aria-modal="true" aria-labelledby="staff-qualification-title">
          <form onSubmit={addStaff} className="w-full max-w-md space-y-4 rounded-2xl bg-white p-6 shadow-2xl">
            <h2 id="staff-qualification-title" className="text-xl font-bold text-slate-900">Add staff qualification record</h2>
            <input aria-label="Staff name" required value={draft.name} onChange={event => setDraft(current => ({ ...current, name: event.target.value }))} placeholder="Staff name" className="w-full rounded-lg border border-slate-200 px-3 py-2" />
            <input aria-label="Staff role" required value={draft.role} onChange={event => setDraft(current => ({ ...current, role: event.target.value }))} placeholder="Role" className="w-full rounded-lg border border-slate-200 px-3 py-2" />
            <input aria-label="Qualification" required value={draft.qual} onChange={event => setDraft(current => ({ ...current, qual: event.target.value }))} placeholder="Qualification" className="w-full rounded-lg border border-slate-200 px-3 py-2" />
            <div className="flex gap-2"><button type="submit" className="flex-1 rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white">Add staff</button><button type="button" onClick={() => setShowForm(false)} className="rounded-lg border border-slate-200 px-4 py-2 text-slate-600">Cancel</button></div>
          </form>
        </div>
      ) : null}
    </div>
  </div>
  );
};
