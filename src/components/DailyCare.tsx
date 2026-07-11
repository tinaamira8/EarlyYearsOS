import React, { useState, useEffect } from 'react';
import { db } from '../services/database';
import { DbUser, DbChild } from '../services/types';
import {
  Utensils, Baby, Moon, Sun, Search,
  Baby as BabyIcon, CheckCircle2, Clock, Calendar, Droplets
} from 'lucide-react';
import toast from 'react-hot-toast';
import { usePersistedState } from '../hooks/usePersistedState';

interface DailyCareProps {
  user?: DbUser | null;
}

type CareEvent = {
  id: string;
  childId: string;
  type: 'meal' | 'nappy' | 'sleep' | 'sunscreen';
  detail: string;
  time: string;
};

export const DailyCare: React.FC<DailyCareProps> = ({ user }) => {
  const [children, setChildren] = useState<DbChild[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [events, setEvents] = usePersistedState<CareEvent[]>('daily_care_events', []);
  const [nappyMenu, setNappyMenu] = useState<string | null>(null);

  useEffect(() => {
    if (user?.centreId) {
      db.children.getChildren(user.centreId).then(setChildren).catch(console.error);
    }
  }, [user]);

  const addEvent = (childId: string, type: CareEvent['type'], detail: string) => {
    const newEvent: CareEvent = {
      id: Math.random().toString(),
      childId,
      type,
      detail,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setEvents(prev => [...prev, newEvent]);
    toast.success(`Logged ${type} for child.`);
  };

  const getChildEvents = (childId: string) => events.filter(e => e.childId === childId);

  const displayChildren = children.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="h-full w-full bg-slate-50 flex flex-col overflow-y-auto p-6 md:p-10">
      <div className="max-w-6xl mx-auto w-full space-y-8">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-sky-50 text-sky-500 rounded-2xl flex items-center justify-center">
                <BabyIcon className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Daily Care Routine</h1>
                <p className="text-slate-500 text-sm mt-1">Log meals, sleep, sunscreen, and nappy changes efficiently.</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input 
                type="text" 
                placeholder="Search children..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 rounded-xl text-sm transition-all"
              />
            </div>
          </div>
        </header>

        {/* Global Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-orange-50 border border-orange-100 p-4 rounded-2xl flex flex-col items-center justify-center text-center">
            <Utensils className="w-6 h-6 text-orange-500 mb-2" />
            <h3 className="font-bold text-slate-900">{events.filter(e => e.type === 'meal').length}</h3>
            <p className="text-xs text-orange-600 font-semibold uppercase tracking-wider">Meals Recorded</p>
          </div>
          <div className="bg-sky-50 border border-sky-100 p-4 rounded-2xl flex flex-col items-center justify-center text-center">
            <Baby className="w-6 h-6 text-sky-500 mb-2" />
            <h3 className="font-bold text-slate-900">{events.filter(e => e.type === 'nappy').length}</h3>
            <p className="text-xs text-sky-600 font-semibold uppercase tracking-wider">Nappies Changed</p>
          </div>
          <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-2xl flex flex-col items-center justify-center text-center">
            <Moon className="w-6 h-6 text-indigo-500 mb-2" />
            <h3 className="font-bold text-slate-900">{events.filter(e => e.type === 'sleep').length}</h3>
            <p className="text-xs text-indigo-600 font-semibold uppercase tracking-wider">Sleeps Logged</p>
          </div>
          <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex flex-col items-center justify-center text-center">
            <Sun className="w-6 h-6 text-amber-500 mb-2" />
            <h3 className="font-bold text-slate-900">{events.filter(e => e.type === 'sunscreen').length}</h3>
            <p className="text-xs text-amber-600 font-semibold uppercase tracking-wider">Sunscreen Applied</p>
          </div>
        </div>

        {/* Children Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {displayChildren.map(child => (
            <div key={child.id} className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-lg">
                  {child.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{child.name}</h3>
                  <p className="text-xs text-slate-500 font-medium">Room: {child.roomId || "Pre-School"}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-4 gap-2 mb-4">
                <button onClick={() => addEvent(child.id, 'meal', 'Ate all of lunch')} className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-50 hover:bg-orange-50 text-slate-600 hover:text-orange-600 border border-transparent hover:border-orange-100 transition-colors">
                  <Utensils className="w-5 h-5 mb-1" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Meal</span>
                </button>
                <div className="relative">
                  <button onClick={() => setNappyMenu(nappyMenu === child.id ? null : child.id)} className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-50 hover:bg-sky-50 text-slate-600 hover:text-sky-600 border border-transparent hover:border-sky-100 transition-colors w-full">
                    <Baby className="w-5 h-5 mb-1" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Nappy</span>
                  </button>
                  {nappyMenu === child.id && (
                    <div className="absolute top-full left-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-10 min-w-[120px]">
                      {['Wet', 'Soiled', 'Wet & Soiled', 'Dry check', 'Toileting attempt'].map(opt => (
                        <button key={opt} onClick={() => { addEvent(child.id, 'nappy', opt); setNappyMenu(null); }} className="block w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-sky-50 first:rounded-t-lg last:rounded-b-lg">
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <button onClick={() => addEvent(child.id, 'sleep', 'Slept for 1 hour')} className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-50 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 border border-transparent hover:border-indigo-100 transition-colors">
                  <Moon className="w-5 h-5 mb-1" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Sleep</span>
                </button>
                <button onClick={() => addEvent(child.id, 'sunscreen', 'Applied')} className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-50 hover:bg-amber-50 text-slate-600 hover:text-amber-600 border border-transparent hover:border-amber-100 transition-colors">
                  <Sun className="w-5 h-5 mb-1" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Sun</span>
                </button>
              </div>

              {/* Event Timeline for Child */}
              <div className="bg-slate-50 rounded-xl p-3 max-h-32 overflow-y-auto">
                <h4 className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Today's Log</h4>
                {getChildEvents(child.id).length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No care events recorded yet.</p>
                ) : (
                  <div className="space-y-2">
                    {getChildEvents(child.id).map(evt => (
                      <div key={evt.id} className="flex items-center gap-2 text-xs bg-white p-2 rounded border border-slate-100 shadow-sm">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span className="font-bold text-slate-700 w-12">{evt.time}</span>
                        <span className="font-semibold text-slate-600 capitalize w-16">{evt.type}</span>
                        <span className="text-slate-500 truncate">{evt.detail}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
