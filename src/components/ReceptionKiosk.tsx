import React, { useState } from 'react';
import { LogIn, LogOut, Users, Clock, ClipboardList } from 'lucide-react';
import { usePersistedState } from '../hooks/usePersistedState';
import { generateId } from '../hooks/usePersistedState';

type AttendanceChild = {
  id: number; name: string; room: string; expectedIn: string;
  status: string; signedIn: string | null; signedOut: string | null;
};

type AuditEntry = {
  id: string; childId: number; childName: string; action: 'sign-in' | 'sign-out' | 'absent';
  timestamp: string; date: string;
};

const todayChildren: AttendanceChild[] = [
  { id: 1, name: 'Leo Martinez', room: 'Toddlers', expectedIn: '08:00', status: 'present', signedIn: '07:58', signedOut: null },
  { id: 2, name: 'Emma Wilson', room: 'Pre-Kindy', expectedIn: '08:30', status: 'present', signedIn: '08:27', signedOut: null },
  { id: 3, name: 'Noah Kim', room: 'Toddlers', expectedIn: '09:00', status: 'not-in', signedIn: null, signedOut: null },
  { id: 4, name: 'Ava Chen', room: 'Pre-Kindy', expectedIn: '08:00', status: 'present', signedIn: '08:05', signedOut: null },
  { id: 5, name: 'Mia Johnson', room: 'Babies', expectedIn: '07:30', status: 'absent', signedIn: null, signedOut: null },
  { id: 6, name: 'Jack Thompson', room: 'Pre-Kindy', expectedIn: '08:00', status: 'not-in', signedIn: null, signedOut: null },
  { id: 7, name: 'Priya Patel', room: 'Babies', expectedIn: '07:30', status: 'present', signedIn: '07:35', signedOut: null },
];

export const ReceptionKiosk: React.FC = () => {
  const [children, setChildren] = usePersistedState<AttendanceChild[]>('reception_attendance', todayChildren);
  const [auditLog, setAuditLog] = usePersistedState<AuditEntry[]>('reception_audit_log', []);
  const [search, setSearch] = useState('');
  const [showLog, setShowLog] = useState(false);

  const now = () => new Date().toTimeString().substring(0, 5);
  const today = () => new Date().toISOString().split('T')[0];
  const fullTimestamp = () => new Date().toISOString();

  const addAudit = (childId: number, childName: string, action: AuditEntry['action']) => {
    setAuditLog(log => [{
      id: generateId(), childId, childName, action,
      timestamp: fullTimestamp(), date: today(),
    }, ...log].slice(0, 500));
  };

  const signIn = (id: number) => {
    const time = now();
    const child = children.find(c => c.id === id);
    if (child) addAudit(id, child.name, 'sign-in');
    setChildren(c => c.map(ch => ch.id === id ? { ...ch, status: 'present', signedIn: time, signedOut: null } : ch));
  };

  const signOut = (id: number) => {
    const time = now();
    const child = children.find(c => c.id === id);
    if (child) addAudit(id, child.name, 'sign-out');
    setChildren(c => c.map(ch => ch.id === id ? { ...ch, status: 'signed-out', signedOut: time } : ch));
  };

  const markAbsent = (id: number) => {
    const child = children.find(c => c.id === id);
    if (child) addAudit(id, child.name, 'absent');
    setChildren(c => c.map(ch => ch.id === id ? { ...ch, status: 'absent' } : ch));
  };

  const present = children.filter(c => c.status === 'present').length;
  const filtered = search ? children.filter(c => c.name.toLowerCase().includes(search.toLowerCase())) : children;
  const todayLog = auditLog.filter(e => e.date === today());

  return (
    <div className="h-full overflow-y-auto bg-slate-900 p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">Reception Kiosk</h1>
          <p className="text-slate-400 mt-1">Sign children in and out</p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/10 rounded-2xl p-5 text-center">
            <div className="text-4xl font-bold text-white">{present}</div>
            <div className="text-slate-300 text-sm mt-1 flex items-center justify-center gap-1"><Users className="w-3.5 h-3.5" /> Present Now</div>
          </div>
          <div className="bg-white/10 rounded-2xl p-5 text-center">
            <div className="text-4xl font-bold text-emerald-400">{children.filter(c => c.signedIn).length}</div>
            <div className="text-slate-300 text-sm mt-1">Signed In Today</div>
          </div>
          <div className="bg-white/10 rounded-2xl p-5 text-center">
            <div className="text-4xl font-bold text-amber-400">{children.filter(c => c.status === 'not-in').length}</div>
            <div className="text-slate-300 text-sm mt-1">Expected / Pending</div>
          </div>
        </div>

        <div className="flex gap-3">
          <input className="flex-1 bg-white/10 border border-white/20 text-white placeholder-slate-400 rounded-2xl px-5 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-400" placeholder="Search child name..." value={search} onChange={e => setSearch(e.target.value)} />
          <button onClick={() => setShowLog(!showLog)} className={`px-4 py-3 rounded-2xl flex items-center gap-2 text-sm font-medium transition-colors ${showLog ? 'bg-indigo-500 text-white' : 'bg-white/10 text-slate-300 hover:bg-white/20'}`}>
            <ClipboardList className="w-4 h-4" /> Log
          </button>
        </div>

        {showLog ? (
          <div className="space-y-2">
            <h3 className="text-white font-semibold text-lg">Today's Attendance Log ({todayLog.length} entries)</h3>
            {todayLog.length === 0 && <p className="text-slate-400 text-sm">No entries yet today.</p>}
            {todayLog.map(entry => (
              <div key={entry.id} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${entry.action === 'sign-in' ? 'bg-emerald-500/20' : entry.action === 'sign-out' ? 'bg-slate-500/20' : 'bg-red-500/20'}`}>
                  {entry.action === 'sign-in' ? <LogIn className="w-4 h-4 text-emerald-400" /> : entry.action === 'sign-out' ? <LogOut className="w-4 h-4 text-slate-400" /> : <Clock className="w-4 h-4 text-red-400" />}
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">{entry.childName}</p>
                  <p className="text-slate-400 text-xs">{entry.action === 'sign-in' ? 'Signed in' : entry.action === 'sign-out' ? 'Signed out' : 'Marked absent'}</p>
                </div>
                <span className="text-slate-500 text-xs font-mono">{new Date(entry.timestamp).toLocaleTimeString()}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(child => (
              <div key={child.id} className={`rounded-2xl p-4 flex items-center gap-4 ${child.status === 'present' ? 'bg-emerald-900/50 border border-emerald-600/40' : child.status === 'signed-out' ? 'bg-white/5 border border-white/10 opacity-60' : 'bg-white/10 border border-white/20'}`}>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0 ${child.status === 'present' ? 'bg-emerald-500' : child.status === 'absent' ? 'bg-red-500' : 'bg-slate-500'}`}>{child.name[0]}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white text-lg">{child.name}</p>
                  <p className="text-slate-400 text-sm">{child.room} · Expected {child.expectedIn}</p>
                  {child.signedIn && <p className="text-emerald-400 text-xs">Signed in at {child.signedIn}</p>}
                  {child.signedOut && <p className="text-slate-400 text-xs">Signed out at {child.signedOut}</p>}
                  {child.status === 'absent' && <p className="text-red-400 text-xs">Marked absent</p>}
                </div>
                <div className="flex gap-2">
                  {child.status === 'not-in' && (
                    <>
                      <button onClick={() => signIn(child.id)} className="bg-emerald-500 text-white px-4 py-2.5 rounded-xl font-medium flex items-center gap-2 hover:bg-emerald-600 transition-colors text-sm">
                        <LogIn className="w-4 h-4" /> Sign In
                      </button>
                      <button onClick={() => markAbsent(child.id)} className="bg-red-500/20 text-red-300 border border-red-500/30 px-3 py-2.5 rounded-xl text-sm hover:bg-red-500/30">Absent</button>
                    </>
                  )}
                  {child.status === 'present' && (
                    <button onClick={() => signOut(child.id)} className="bg-slate-600 text-white px-4 py-2.5 rounded-xl font-medium flex items-center gap-2 hover:bg-slate-500 text-sm">
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
