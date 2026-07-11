import React, { useEffect, useState } from 'react';
import { DbUser } from '../services/types';
import { 
  Siren, CheckCircle, Clock, Loader2, Map, Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';
import { evaluateEmergencyDrill } from '../services/geminiService';

interface EmergencyHubProps {
  user?: DbUser | null;
}

export const EmergencyHub: React.FC<EmergencyHubProps> = ({ user }) => {
  const [drillActive, setDrillActive] = useState(false);
  const [timer, setTimer] = useState(0);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [accountedRooms, setAccountedRooms] = useState<string[]>(['Toddler Room']);
  const [lastDrillSeconds, setLastDrillSeconds] = useState<number | null>(null);
  const [evaluation, setEvaluation] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);

  useEffect(() => () => {
    if (intervalId) clearInterval(intervalId);
  }, [intervalId]);

  const toggleRoom = (room: string) => {
    setAccountedRooms(current => current.includes(room) ? current.filter(item => item !== room) : [...current, room]);
  };

  const toggleDrill = () => {
    if (drillActive) {
      if (intervalId) clearInterval(intervalId);
      setIntervalId(null);
      setDrillActive(false);
      toast.success(`Evacuation drill completed in ${formatTime(timer)}`);
      setLastDrillSeconds(timer);
      setTimer(0);
    } else {
      setDrillActive(true);
      const id = setInterval(() => {
        setTimer(p => p + 1);
      }, 1000);
      setIntervalId(id);
      toast.error("Evacuation Drill Started - Commence Roll Call");
    }
  };

  const evaluateLastDrill = async () => {
    if (lastDrillSeconds === null) return;
    setIsEvaluating(true);
    try {
      setEvaluation(await evaluateEmergencyDrill('evacuation', formatTime(lastDrillSeconds), `${accountedRooms.length} of 3 rooms marked accounted for.`));
      toast.success('Drill evaluation drafted for supervisor review.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'AI evaluation failed.');
    } finally {
      setIsEvaluating(false);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-full w-full bg-slate-50 flex flex-col p-6 md:p-10 overflow-y-auto">
      <div className="max-w-5xl mx-auto w-full space-y-8">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden relative">
          
          {/* Pulsing overlay if active */}
          {drillActive && (
             <div className="absolute inset-0 bg-rose-500/10 animate-pulse pointer-events-none"></div>
          )}

          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${drillActive ? 'bg-rose-600 text-white' : 'bg-rose-50 text-rose-600'}`}>
                <Siren className={`w-8 h-8 ${drillActive ? 'animate-pulse' : ''}`} />
              </div>
              <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Emergency Hub</h1>
                <p className="text-slate-500 font-medium mt-1">Evacuation drills, lockdown procedures, and roll call.</p>
              </div>
            </div>
          </div>
          
          <div className="relative z-10 w-full md:w-auto">
            <button 
               onClick={toggleDrill}
               className={`w-full md:w-auto px-8 py-4 text-lg font-black rounded-xl transition-all shadow-lg ${drillActive ? 'bg-rose-600 text-white hover:bg-rose-700 shadow-rose-600/30' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
            >
              {drillActive ? `STOP DRILL (${formatTime(timer)})` : 'START EVACUATION DRILL'}
            </button>
          </div>
        </header>

        {/* Drill Tools */}
        {drillActive && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4">
             <div className="bg-white border-2 border-rose-200 shadow-xl shadow-rose-500/10 rounded-3xl p-6">
                <div className="flex items-center gap-2 text-rose-600 mb-4">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                  </span>
                  <h3 className="font-bold text-lg">Active Roll Call</h3>
                </div>
                <div className="flex flex-col gap-3">
                   {['Nursery Room', 'Toddler Room', 'Pre-School'].map(room => {
                     const accounted = accountedRooms.includes(room);
                     return (
                       <button type="button" key={room} aria-pressed={accounted} onClick={() => toggleRoom(room)} className={`${accounted ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 hover:bg-slate-200 text-slate-800'} p-4 rounded-xl font-bold flex justify-between items-center transition-colors`}>
                         {room} <CheckCircle className={`w-5 h-5 ${accounted ? 'text-emerald-600' : 'text-slate-400'}`} />
                       </button>
                     );
                   })}
                </div>
             </div>

             <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden flex items-center justify-center min-h-[250px]">
                <Map className="absolute inset-0 w-full h-full opacity-10 text-slate-500 stroke-1" />
                <div className="relative text-center z-10">
                   <p className="text-rose-400 font-bold uppercase tracking-widest text-xs mb-2">Protocol</p>
                   <p className="text-2xl font-black mb-4">Proceed to Assembly Point A</p>
                   <p className="text-slate-400 text-sm">Grab iPad and Emergency Go-Bag near front exit.</p>
                </div>
             </div>
          </div>
        )}

        {/* History Log */}
        {!drillActive && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
             <div className="mb-6 flex items-center justify-between gap-3"><h3 className="font-bold text-slate-900 text-lg flex items-center gap-2"><Clock className="w-5 h-5 text-slate-400" /> Recent Drills</h3>{lastDrillSeconds !== null ? <button disabled={isEvaluating} onClick={() => void evaluateLastDrill()} className="flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm text-white disabled:opacity-50">{isEvaluating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />} Evaluate last drill</button> : null}</div>
             {evaluation ? <div className="mb-4 whitespace-pre-wrap rounded-xl border border-violet-200 bg-violet-50 p-4 text-sm text-slate-700">{evaluation}</div> : null}
             <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                   <div>
                     <p className="font-bold text-slate-800">Lockdown Drill</p>
                     <p className="text-sm font-medium text-slate-500">Nov 14, 2025 • 03:45 Duration</p>
                   </div>
                   <span className="bg-emerald-100 text-emerald-700 px-3 py-1 text-xs font-bold rounded-lg truncate">100% Accounted</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                   <div>
                     <p className="font-bold text-slate-800">Evacuation Drill</p>
                     <p className="text-sm font-medium text-slate-500">Sep 02, 2025 • 04:12 Duration</p>
                   </div>
                   <span className="bg-emerald-100 text-emerald-700 px-3 py-1 text-xs font-bold rounded-lg truncate">100% Accounted</span>
                </div>
             </div>
          </div>
        )}

      </div>
    </div>
  );
};
