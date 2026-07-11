import React, { useState } from 'react';
import { Users, Plus, ChevronRight } from 'lucide-react';
import { usePersistedState } from '../hooks/usePersistedState';

const tours = [
  { id: 1, family: 'Thompson Family', children: 'Emily, 2y', date: '2026-05-28', time: '10:00 AM', status: 'Confirmed', staff: 'Amy Davis' },
  { id: 2, family: 'Nguyen Family', children: 'Liam, 3y', date: '2026-05-30', time: '2:00 PM', status: 'Pending', staff: 'Sarah Johnson' },
  { id: 3, family: 'Rossi Family', children: 'Sofia, 18 months', date: '2026-06-02', time: '9:30 AM', status: 'Confirmed', staff: 'Amy Davis' },
];

const initialFamilies = [
  { id: 1, name: 'Martinez Family', children: 'Leo (2y)', room: 'Toddlers', status: 'Enrolled', enrolDate: '2025-09-01', daysPerWeek: 5 },
  { id: 2, name: 'Wilson Family', children: 'Emma (4y)', room: 'Pre-Kindy', status: 'Enrolled', enrolDate: '2024-01-15', daysPerWeek: 4 },
  { id: 3, name: 'Kim Family', children: 'Noah (2y)', room: 'Toddlers', status: 'Enrolled', enrolDate: '2026-03-01', daysPerWeek: 3 },
  { id: 4, name: 'Thompson Family', children: 'Emily (pending)', room: '-', status: 'Inquiry', enrolDate: '-', daysPerWeek: 0 },
  { id: 5, name: 'Nguyen Family', children: 'Liam (pending)', room: '-', status: 'Waitlisted', enrolDate: '-', daysPerWeek: 0 },
];

const statusColors: Record<string, string> = { Enrolled: 'bg-emerald-100 text-emerald-700', Inquiry: 'bg-blue-100 text-blue-700', Waitlisted: 'bg-amber-100 text-amber-700', Confirmed: 'bg-emerald-100 text-emerald-700', Pending: 'bg-amber-100 text-amber-700' };

export const EnrolmentManager: React.FC = () => {
  const [tab, setTab] = useState<'families' | 'tours'>('families');
  const [families, setFamilies] = usePersistedState('enrolment_families', initialFamilies);
  const [showForm, setShowForm] = useState(false);
  const [draft, setDraft] = useState({ family: '', child: '', room: 'Unassigned' });

  const addEnrolment = (event: React.FormEvent) => {
    event.preventDefault();
    setFamilies(current => [...current, { id: Date.now(), name: draft.family.trim(), children: draft.child.trim(), room: draft.room.trim(), status: 'Enrolled', enrolDate: new Date().toISOString().slice(0, 10), daysPerWeek: 1 }]);
    setDraft({ family: '', child: '', room: 'Unassigned' });
    setShowForm(false);
    setTab('families');
  };

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
            <Users className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="flex-1"><h1 className="text-2xl font-bold text-slate-800">Enrolment Manager</h1>
            <p className="text-slate-500 text-sm">Manage enrolments, tours and family records</p></div>
          <button type="button" onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-indigo-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-indigo-700">
            <Plus className="w-4 h-4" /> New Enrolment
          </button>
        </div>

        <div className="flex gap-2">
          <button onClick={() => setTab('families')} className={`px-4 py-2 text-sm rounded-lg font-medium ${tab === 'families' ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}>Families</button>
          <button onClick={() => setTab('tours')} className={`px-4 py-2 text-sm rounded-lg font-medium ${tab === 'tours' ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}>Upcoming Tours</button>
        </div>

        {tab === 'families' && (
          <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-xs text-slate-500 uppercase">
                <tr>
                  <th className="text-left px-4 py-3">Family</th>
                  <th className="text-left px-4 py-3">Children</th>
                  <th className="text-left px-4 py-3">Room</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-left px-4 py-3">Days</th>
                  <th className="text-left px-4 py-3">Since</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {families.map(f => (
                  <tr key={f.id} className="hover:bg-slate-50 cursor-pointer">
                    <td className="px-4 py-3 font-medium text-slate-800">{f.name}</td>
                    <td className="px-4 py-3 text-slate-600">{f.children}</td>
                    <td className="px-4 py-3 text-slate-600">{f.room}</td>
                    <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[f.status]}`}>{f.status}</span></td>
                    <td className="px-4 py-3 text-slate-600">{f.daysPerWeek ? `${f.daysPerWeek}d/wk` : '-'}</td>
                    <td className="px-4 py-3 text-slate-500">{f.enrolDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'tours' && (
          <div className="space-y-3">
            {tours.map(t => (
              <div key={t.id} className="bg-white rounded-xl border border-slate-100 p-4 flex items-center gap-4">
                <div className="bg-indigo-100 rounded-xl p-3 text-center flex-shrink-0">
                  <div className="text-xs font-bold text-indigo-700">{t.date.split('-')[2]}</div>
                  <div className="text-xs text-indigo-500">{new Date(t.date).toLocaleDateString('en', { month: 'short' })}</div>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-800">{t.family}</p>
                  <p className="text-xs text-slate-500">{t.children} · {t.time} · Led by {t.staff}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[t.status]}`}>{t.status}</span>
                <ChevronRight className="w-4 h-4 text-slate-300" />
              </div>
            ))}
          </div>
        )}
        {showForm ? (
          <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/50 p-4" role="dialog" aria-modal="true" aria-labelledby="enrolment-title">
            <form onSubmit={addEnrolment} className="w-full max-w-md space-y-4 rounded-2xl bg-white p-6 shadow-2xl">
              <h2 id="enrolment-title" className="text-xl font-bold text-slate-900">New enrolment</h2>
              <input aria-label="Family name" required value={draft.family} onChange={event => setDraft(current => ({ ...current, family: event.target.value }))} placeholder="Family name" className="w-full rounded-lg border border-slate-200 px-3 py-2" />
              <input aria-label="Child details" required value={draft.child} onChange={event => setDraft(current => ({ ...current, child: event.target.value }))} placeholder="Child name and age" className="w-full rounded-lg border border-slate-200 px-3 py-2" />
              <input aria-label="Room" required value={draft.room} onChange={event => setDraft(current => ({ ...current, room: event.target.value }))} placeholder="Room" className="w-full rounded-lg border border-slate-200 px-3 py-2" />
              <div className="flex gap-2"><button type="submit" className="flex-1 rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white">Create enrolment</button><button type="button" onClick={() => setShowForm(false)} className="rounded-lg border border-slate-200 px-4 py-2 text-slate-600">Cancel</button></div>
            </form>
          </div>
        ) : null}
      </div>
    </div>
  );
};
