import React, { useState } from 'react';
import { Clock, LogIn, LogOut, User, Calendar, Timer } from 'lucide-react';
import { DbUser } from '../services/types';
import { usePersistedState } from '../hooks/usePersistedState';
import toast from 'react-hot-toast';

interface StaffTimesheetProps { user?: DbUser | null; }

interface TimeEntry {
  id: string;
  staffName: string;
  date: string;
  clockIn: string;
  clockOut?: string;
  breakMinutes: number;
}

const demoStaff = ['Sarah Johnson', 'Lisa Chen', 'Mike Ross', 'Amy Davis', 'Ben Taylor'];

export const StaffTimesheet: React.FC<StaffTimesheetProps> = ({ user }) => {
  const [entries, setEntries] = usePersistedState<TimeEntry[]>('staff_timesheet', []);
  const [selectedStaff, setSelectedStaff] = useState(user?.name || demoStaff[0]);
  const today = new Date().toISOString().split('T')[0];
  const now = () => new Date().toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit', hour12: false });

  const todayEntry = entries.find(e => e.staffName === selectedStaff && e.date === today && !e.clockOut);
  const isClockedIn = !!todayEntry;

  const handleClockIn = () => {
    const entry: TimeEntry = { id: `te-${Date.now()}`, staffName: selectedStaff, date: today, clockIn: now(), breakMinutes: 0 };
    setEntries(prev => [...prev, entry]);
    toast.success(`${selectedStaff} clocked in at ${entry.clockIn}`);
  };

  const handleClockOut = () => {
    if (!todayEntry) return;
    setEntries(prev => prev.map(e => e.id === todayEntry.id ? { ...e, clockOut: now() } : e));
    toast.success(`${selectedStaff} clocked out at ${now()}`);
  };

  const addBreak = (minutes: number) => {
    if (!todayEntry) return;
    setEntries(prev => prev.map(e => e.id === todayEntry.id ? { ...e, breakMinutes: e.breakMinutes + minutes } : e));
    toast.success(`${minutes} min break logged`);
  };

  const calcHours = (entry: TimeEntry): string => {
    const [inH, inM] = entry.clockIn.split(':').map(Number);
    const out = entry.clockOut || now();
    const [outH, outM] = out.split(':').map(Number);
    const totalMin = (outH * 60 + outM) - (inH * 60 + inM) - entry.breakMinutes;
    if (totalMin <= 0) return '0.0';
    return (totalMin / 60).toFixed(1);
  };

  const weekEntries = entries.filter(e => {
    const d = new Date(e.date);
    const start = new Date(today);
    start.setDate(start.getDate() - start.getDay() + 1);
    return e.staffName === selectedStaff && d >= start && d <= new Date(today);
  });

  const weekTotal = weekEntries.reduce((sum, e) => {
    if (!e.clockOut) return sum;
    const [inH, inM] = e.clockIn.split(':').map(Number);
    const [outH, outM] = e.clockOut.split(':').map(Number);
    return sum + ((outH * 60 + outM) - (inH * 60 + inM) - e.breakMinutes) / 60;
  }, 0);

  return (
    <div className="h-full w-full bg-slate-50 overflow-y-auto p-4 md:p-10">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center">
              <Clock className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900">Staff Timesheet</h1>
              <p className="text-slate-500 text-sm">Clock in/out and track working hours</p>
            </div>
          </div>
          <select value={selectedStaff} onChange={e => setSelectedStaff(e.target.value)} className="px-4 py-2 rounded-xl border border-slate-300 text-sm font-medium">
            {demoStaff.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm text-center">
            <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-3 ${isClockedIn ? 'bg-emerald-100' : 'bg-slate-100'}`}>
              <User className={`w-8 h-8 ${isClockedIn ? 'text-emerald-600' : 'text-slate-400'}`} />
            </div>
            <p className="font-bold text-slate-900">{selectedStaff}</p>
            <p className={`text-sm font-medium mt-1 ${isClockedIn ? 'text-emerald-600' : 'text-slate-400'}`}>
              {isClockedIn ? `Clocked in since ${todayEntry?.clockIn}` : 'Not clocked in'}
            </p>
            <div className="flex gap-2 mt-4">
              {!isClockedIn ? (
                <button onClick={handleClockIn} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors">
                  <LogIn className="w-4 h-4" /> Clock In
                </button>
              ) : (
                <>
                  <button onClick={handleClockOut} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-rose-600 text-white rounded-xl font-bold hover:bg-rose-700 transition-colors">
                    <LogOut className="w-4 h-4" /> Clock Out
                  </button>
                </>
              )}
            </div>
            {isClockedIn && (
              <div className="flex gap-2 mt-2">
                <button onClick={() => addBreak(15)} className="flex-1 text-xs py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium">+15m break</button>
                <button onClick={() => addBreak(30)} className="flex-1 text-xs py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium">+30m break</button>
                <button onClick={() => addBreak(60)} className="flex-1 text-xs py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium">+60m break</button>
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm text-center">
            <Timer className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Today</p>
            <p className="text-3xl font-black text-slate-900 mt-1">{todayEntry ? calcHours(todayEntry) : '0.0'}h</p>
          </div>

          <div className="bg-gradient-to-br from-indigo-900 to-violet-900 rounded-2xl p-6 shadow-sm text-center text-white">
            <Calendar className="w-8 h-8 text-indigo-200 mx-auto mb-2" />
            <p className="text-xs font-bold uppercase tracking-wider text-indigo-300">This Week</p>
            <p className="text-3xl font-black mt-1">{weekTotal.toFixed(1)}h</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200">
            <h3 className="font-bold text-slate-900">Recent Entries</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {entries.filter(e => e.staffName === selectedStaff).slice(-10).reverse().map(entry => (
              <div key={entry.id} className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-slate-500 w-24">{entry.date}</span>
                  <span className="text-sm font-semibold text-emerald-600">{entry.clockIn}</span>
                  <span className="text-slate-400">→</span>
                  <span className="text-sm font-semibold text-rose-600">{entry.clockOut || '—'}</span>
                </div>
                <div className="flex items-center gap-4">
                  {entry.breakMinutes > 0 && <span className="text-xs text-amber-600 font-medium">{entry.breakMinutes}m break</span>}
                  <span className="text-sm font-bold text-slate-900 w-12 text-right">{entry.clockOut ? calcHours(entry) : '—'}h</span>
                </div>
              </div>
            ))}
            {entries.filter(e => e.staffName === selectedStaff).length === 0 && (
              <p className="text-sm text-slate-400 italic p-4">No entries yet. Clock in to start tracking.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
