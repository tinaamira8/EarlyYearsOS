import React, { useState } from 'react';
import { BarChart2, TrendingUp, AlertTriangle, CheckCircle, Users, UserPlus, UserMinus } from 'lucide-react';
import { usePersistedState } from '../hooks/usePersistedState';

type Room = {
  name: string; ageGroup: string; capacity: number; enrolled: number;
  regulatoryRatio: number; currentStaff: number;
};

const NQF_RATIOS: Record<string, number> = {
  'Babies (0-2)': 4,
  'Toddlers (2-3)': 5,
  'Pre-Kindy (3-5)': 11,
  'Kindy (4-5)': 11,
  'School Age (5+)': 15,
};

const initialRooms: Room[] = [
  { name: 'Babies Room', ageGroup: 'Babies (0-2)', capacity: 10, enrolled: 8, regulatoryRatio: 4, currentStaff: 2 },
  { name: 'Toddlers Room', ageGroup: 'Toddlers (2-3)', capacity: 15, enrolled: 12, regulatoryRatio: 5, currentStaff: 3 },
  { name: 'Pre-Kindy Room', ageGroup: 'Pre-Kindy (3-5)', capacity: 25, enrolled: 22, regulatoryRatio: 11, currentStaff: 2 },
];

const weeklyData = [
  { week: 'W1 May', babies: 8, toddlers: 11, prekindy: 20 },
  { week: 'W2 May', babies: 8, toddlers: 12, prekindy: 21 },
  { week: 'W3 May', babies: 7, toddlers: 12, prekindy: 22 },
  { week: 'W4 May', babies: 8, toddlers: 12, prekindy: 22 },
];

export const OccupancyDashboard: React.FC = () => {
  const [rooms, setRooms] = usePersistedState<Room[]>('occupancy_rooms', initialRooms);
  const [editingStaff, setEditingStaff] = useState<string | null>(null);

  const total = rooms.reduce((s, r) => s + r.enrolled, 0);
  const cap = rooms.reduce((s, r) => s + r.capacity, 0);
  const pct = Math.round((total / cap) * 100);

  const requiredStaff = (r: Room) => Math.ceil(r.enrolled / r.regulatoryRatio);
  const isCompliant = (r: Room) => r.currentStaff >= requiredStaff(r);
  const allCompliant = rooms.every(isCompliant);

  const updateStaff = (name: string, delta: number) => {
    setRooms(rs => rs.map(r => r.name === name ? { ...r, currentStaff: Math.max(0, r.currentStaff + delta) } : r));
  };

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
            <BarChart2 className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-slate-800">Occupancy & Ratio Dashboard</h1>
            <p className="text-slate-500 text-sm">Real-time enrolment, capacity, and NQF ratio compliance</p>
          </div>
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium ${allCompliant ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
            {allCompliant ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
            {allCompliant ? 'All ratios compliant' : 'Ratio alert'}
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-blue-200 text-sm">Overall Occupancy</p>
              <p className="text-5xl font-bold mt-1">{pct}%</p>
              <p className="text-blue-200 text-sm mt-1">{total} of {cap} places filled</p>
            </div>
            <div className="text-right space-y-1">
              <div className="text-blue-200 text-xs">Total staff on floor</div>
              <div className="text-3xl font-bold">{rooms.reduce((s, r) => s + r.currentStaff, 0)}</div>
              <div className="text-blue-200 text-xs">Required: {rooms.reduce((s, r) => s + requiredStaff(r), 0)}</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-100 p-5">
          <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2"><Users className="w-4 h-4" /> NQF Ratio Calculator</h3>
          <div className="space-y-3">
            {rooms.map(r => {
              const req = requiredStaff(r);
              const compliant = isCompliant(r);
              const actualRatio = r.currentStaff > 0 ? `1:${Math.round(r.enrolled / r.currentStaff)}` : 'N/A';
              const regulatoryLabel = `1:${r.regulatoryRatio}`;

              return (
                <div key={r.name} className={`rounded-xl border p-4 ${compliant ? 'border-slate-100' : 'border-red-200 bg-red-50/50'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-slate-800">{r.name}</h4>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">{r.ageGroup}</span>
                        {!compliant && <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-medium flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Under-staffed</span>}
                      </div>
                      <div className="grid grid-cols-4 gap-4 mt-2 text-xs">
                        <div><span className="text-slate-400">Children</span><div className="font-semibold text-slate-800 text-sm">{r.enrolled}</div></div>
                        <div><span className="text-slate-400">NQF Ratio</span><div className="font-semibold text-slate-800 text-sm">{regulatoryLabel}</div></div>
                        <div><span className="text-slate-400">Actual Ratio</span><div className={`font-semibold text-sm ${compliant ? 'text-emerald-600' : 'text-red-600'}`}>{actualRatio}</div></div>
                        <div><span className="text-slate-400">Required Staff</span><div className="font-semibold text-slate-800 text-sm">{req}</div></div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <button onClick={() => updateStaff(r.name, -1)} className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center"><UserMinus className="w-3.5 h-3.5 text-slate-600" /></button>
                      <div className="text-center w-12">
                        <div className={`text-2xl font-bold ${compliant ? 'text-emerald-600' : 'text-red-600'}`}>{r.currentStaff}</div>
                        <div className="text-[10px] text-slate-400">staff</div>
                      </div>
                      <button onClick={() => updateStaff(r.name, 1)} className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center"><UserPlus className="w-3.5 h-3.5 text-slate-600" /></button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-slate-400 mt-3">Ratios based on Education and Care Services National Regulations (Reg 123–124)</p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {rooms.map(r => {
            const occupancy = Math.round((r.enrolled / r.capacity) * 100);
            return (
              <div key={r.name} className="bg-white rounded-xl border border-slate-100 p-4">
                <h3 className="font-semibold text-slate-800 text-sm">{r.name}</h3>
                <div className="text-3xl font-bold text-slate-800 mt-2">{occupancy}%</div>
                <div className="bg-slate-100 rounded-full h-2 mt-2 mb-3">
                  <div className={`h-2 rounded-full ${occupancy >= 90 ? 'bg-emerald-400' : occupancy >= 70 ? 'bg-blue-400' : 'bg-amber-400'}`} style={{ width: `${occupancy}%` }} />
                </div>
                <div className="text-xs text-slate-500 space-y-1">
                  <div className="flex justify-between"><span>Enrolled</span><span className="font-medium text-slate-700">{r.enrolled}/{r.capacity}</span></div>
                  <div className="flex justify-between"><span>Available</span><span className="font-medium text-slate-700">{r.capacity - r.enrolled} places</span></div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-xl border border-slate-100 p-5">
          <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2"><TrendingUp className="w-4 h-4" /> Weekly Attendance Trend (May 2026)</h3>
          <div className="space-y-3">
            {rooms.map(r => (
              <div key={r.name}>
                <div className="flex justify-between text-xs text-slate-500 mb-1"><span>{r.name}</span></div>
                <div className="flex items-end gap-2 h-10">
                  {weeklyData.map((w, i) => {
                    const val = r.name === 'Babies Room' ? w.babies : r.name === 'Toddlers Room' ? w.toddlers : w.prekindy;
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <div className="w-full bg-blue-400/80 rounded-sm" style={{ height: `${(val / r.capacity) * 100}%` }} />
                        <span className="text-[10px] text-slate-400">{w.week.split(' ')[0]}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
