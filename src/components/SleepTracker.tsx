import React, { useState, useEffect } from 'react';
import { db } from '../services/database';
import { DbUser, DbChild } from '../services/types';
import { 
  Moon, Clock, CheckCircle2, AlertCircle, Play, Square, Baby 
} from 'lucide-react';
import toast from 'react-hot-toast';

interface SleepTrackerProps {
  user?: DbUser | null;
}

type SleepSession = {
  id: string;
  childId: string;
  startTime: number;
  lastCheckTime: number;
  status: 'sleeping' | 'awake';
};

export const SleepTracker: React.FC<SleepTrackerProps> = ({ user }) => {
  const [children, setChildren] = useState<DbChild[]>([]);
  const [sessions, setSessions] = useState<SleepSession[]>([]);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (user?.centreId) {
      db.children.getChildren(user.centreId).then(setChildren).catch(console.error);
    }
  }, [user]);

  // Update timer every minute for real-time check statuses
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 10000); // 10s updates for responsiveness
    return () => clearInterval(interval);
  }, []);

  const getChildSession = (childId: string) => sessions.find(s => s.childId === childId && s.status === 'sleeping');

  const startSleep = (childId: string) => {
    const time = Date.now();
    setSessions(prev => [...prev.filter(s => s.childId !== childId || s.status !== 'sleeping'), { id: Math.random().toString(), childId, startTime: time, lastCheckTime: time, status: 'sleeping' }]);
    toast.success("Sleep session started. 10-minute safe sleep checks initiated.");
  };

  const endSleep = (childId: string) => {
    setSessions(prev => prev.map(s => s.childId === childId && s.status === 'sleeping' ? { ...s, status: 'awake' } : s));
    toast.success("Child marked as awake.");
  };

  const logCheck = (childId: string) => {
    setSessions(prev => prev.map(s => s.childId === childId && s.status === 'sleeping' ? { ...s, lastCheckTime: Date.now() } : s));
    toast.success("Safe sleep check logged.");
  };

  const getCheckStatus = (lastCheckTime: number) => {
    const minutesSinceCheck = Math.floor((now - lastCheckTime) / 60000);
    if (minutesSinceCheck >= 10) return { alert: true, msg: `${minutesSinceCheck}m ago! Overdue!`, color: 'text-rose-600', bg: 'bg-rose-100', border: 'border-rose-300' };
    if (minutesSinceCheck >= 8) return { alert: true, msg: `${minutesSinceCheck}m ago. Due soon.`, color: 'text-amber-600', bg: 'bg-amber-100', border: 'border-amber-300' };
    return { alert: false, msg: `Checked ${minutesSinceCheck}m ago`, color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' };
  };

  return (
    <div className="h-full w-full bg-slate-50 flex flex-col p-6 md:p-10 overflow-y-auto">
      <div className="max-w-6xl mx-auto w-full space-y-8">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center">
                <Moon className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Sleep & Rest Tracker</h1>
                <p className="text-slate-500 text-sm mt-1">Manage safe sleep compliance natively with 10-minute check intervals.</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-slate-100 px-5 py-3 rounded-2xl border border-slate-200">
            <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></div>
            <span className="text-sm font-bold text-slate-800">{sessions.filter(s => s.status === 'sleeping').length} Children Sleeping</span>
          </div>
        </header>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {children.map(child => {
            const session = getChildSession(child.id);
            const isSleeping = !!session;
            const status = session ? getCheckStatus(session.lastCheckTime) : null;
            
            return (
              <div key={child.id} className={`bg-white rounded-3xl p-5 border-2 shadow-sm transition-all ${isSleeping ? 'border-indigo-400 bg-indigo-50/10' : 'border-slate-100'}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${isSleeping ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-500'}`}>
                      {child.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">{child.name}</h3>
                      <p className="text-xs text-slate-500 font-medium truncate w-24">ID: {child.id.substring(0,6)}</p>
                    </div>
                  </div>
                </div>

                {!isSleeping ? (
                  <button 
                    onClick={() => startSleep(child.id)}
                    className="w-full py-3 bg-slate-100 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <Play className="w-4 h-4" /> Start Sleep
                  </button>
                ) : (
                  <div className="space-y-3 mt-4">
                    <div className={`p-3 rounded-xl border ${status?.border} ${status?.bg} flex items-center justify-between`}>
                      <span className={`text-xs font-bold ${status?.color} flex items-center gap-1`}>
                        {status?.alert ? <AlertCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                        {status?.msg}
                      </span>
                      <button 
                        onClick={() => logCheck(child.id)}
                        className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-slate-50 text-slate-700 border border-slate-200"
                        title="Log 10-min Check"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <button 
                      onClick={() => endSleep(child.id)}
                      className="w-full py-2 bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
                    >
                      <Square className="w-3 h-3" /> Stop Sleep
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
