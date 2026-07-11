import React, { useState } from 'react';
import { CalendarDays, Plus, CheckCircle } from 'lucide-react';
import { usePersistedState } from '../hooks/usePersistedState';

const rooms = ['Babies Room', 'Toddlers Room', 'Pre-Kindy Room', 'Outdoor Area', 'Hall', 'Staff Room'];
const resourceTypes = ['Room', 'Equipment', 'Vehicle', 'Technology'];

const initialBookings = [
  { id: 1, resource: 'Hall', type: 'Room', date: '2026-06-02', time: '6:00 PM – 8:30 PM', purpose: 'Parent Information Night', bookedBy: 'Amy Davis' },
  { id: 2, resource: 'Outdoor Area', type: 'Room', date: '2026-05-29', time: '9:00 AM – 11:00 AM', purpose: 'Community Playgroup', bookedBy: 'Sarah Johnson' },
  { id: 3, resource: 'iPad Set (x3)', type: 'Technology', date: '2026-05-28', time: '9:00 AM – 12:00 PM', purpose: 'Pre-Kindy digital literacy session', bookedBy: 'Mark Chen' },
  { id: 4, resource: 'Centre Van', type: 'Vehicle', date: '2026-06-10', time: '9:00 AM – 3:00 PM', purpose: 'Excursion to Brisbane Botanic Gardens', bookedBy: 'Amy Davis' },
];

export const ResourceBooking: React.FC = () => {
  const [bookings, setBookings] = usePersistedState('resource_bookings', initialBookings);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ resource: 'Hall', type: 'Room', date: '', time: '', purpose: '', bookedBy: 'Amy Davis' });

  const add = () => {
    if (!form.date || !form.purpose) return;
    setBookings(b => [...b, { ...form, id: Date.now() }]);
    setForm({ resource: 'Hall', type: 'Room', date: '', time: '', purpose: '', bookedBy: 'Amy Davis' });
    setShowForm(false);
  };

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center">
            <CalendarDays className="w-5 h-5 text-teal-600" />
          </div>
          <div className="flex-1"><h1 className="text-2xl font-bold text-slate-800">Resource Booking</h1>
            <p className="text-slate-500 text-sm">Book rooms, equipment and centre vehicles</p></div>
          <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-teal-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-teal-700">
            <Plus className="w-4 h-4" /> New Booking
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
            <h3 className="font-semibold text-slate-800">New Booking</h3>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-xs text-slate-500 mb-1 block">Resource Type</label>
                <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                  {resourceTypes.map(t => <option key={t}>{t}</option>)}
                </select></div>
              <div><label className="text-xs text-slate-500 mb-1 block">Specific Resource</label>
                <input className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" value={form.resource} onChange={e => setForm(f => ({ ...f, resource: e.target.value }))} /></div>
              <div><label className="text-xs text-slate-500 mb-1 block">Date</label>
                <input type="date" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} /></div>
              <div><label className="text-xs text-slate-500 mb-1 block">Time</label>
                <input className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" placeholder="e.g. 9:00 AM – 12:00 PM" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} /></div>
              <div className="col-span-2"><label className="text-xs text-slate-500 mb-1 block">Purpose</label>
                <input className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" value={form.purpose} onChange={e => setForm(f => ({ ...f, purpose: e.target.value }))} /></div>
            </div>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm border border-slate-200 rounded-lg">Cancel</button>
              <button onClick={add} className="px-4 py-2 text-sm bg-teal-600 text-white rounded-lg">Confirm Booking</button>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs text-slate-500 uppercase">
              <tr>
                <th className="text-left px-4 py-3">Resource</th>
                <th className="text-left px-4 py-3">Date</th>
                <th className="text-left px-4 py-3">Time</th>
                <th className="text-left px-4 py-3">Purpose</th>
                <th className="text-left px-4 py-3">Booked By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {bookings.map(b => (
                <tr key={b.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-800">{b.resource}</div>
                    <div className="text-xs text-slate-400">{b.type}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{b.date}</td>
                  <td className="px-4 py-3 text-slate-600 text-xs">{b.time}</td>
                  <td className="px-4 py-3 text-slate-700">{b.purpose}</td>
                  <td className="px-4 py-3 text-slate-500">{b.bookedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
