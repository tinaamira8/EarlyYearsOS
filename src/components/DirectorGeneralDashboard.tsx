import React, { useState } from 'react';
import { BarChart3 } from 'lucide-react';

const centres = [
  { id: 1, name: 'Sunshine Early Learning Centre', location: 'Brisbane QLD', occupancy: 94, capacity: 45, enrolled: 42, compliance: 98, staff: 8, revenue: 68400 },
  { id: 2, name: 'Rainbow Kids Centre', location: 'Gold Coast QLD', occupancy: 87, capacity: 60, enrolled: 52, compliance: 91, staff: 11, revenue: 84200 },
  { id: 3, name: 'Little Stars Childcare', location: 'Ipswich QLD', occupancy: 78, capacity: 40, enrolled: 31, compliance: 88, staff: 7, revenue: 49600 },
];

export const DirectorGeneralDashboard: React.FC = () => {
  const [selected, setSelected] = useState<number | null>(null);
  const totals = {
    enrolled: centres.reduce((s, c) => s + c.enrolled, 0),
    capacity: centres.reduce((s, c) => s + c.capacity, 0),
    staff: centres.reduce((s, c) => s + c.staff, 0),
    revenue: centres.reduce((s, c) => s + c.revenue, 0),
  };

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-violet-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Director General Dashboard</h1>
            <p className="text-slate-500 text-sm">Multi-centre overview and performance metrics</p>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-slate-100 p-4 text-center">
            <div className="text-2xl font-bold text-indigo-600">{totals.enrolled}/{totals.capacity}</div>
            <div className="text-xs text-slate-500">Total Enrolled</div>
          </div>
          <div className="bg-white rounded-xl border border-slate-100 p-4 text-center">
            <div className="text-2xl font-bold text-emerald-600">{totals.staff}</div>
            <div className="text-xs text-slate-500">Total Staff</div>
          </div>
          <div className="bg-white rounded-xl border border-slate-100 p-4 text-center">
            <div className="text-2xl font-bold text-amber-600">{Math.round(centres.reduce((s,c)=>s+c.compliance,0)/centres.length)}%</div>
            <div className="text-xs text-slate-500">Avg Compliance</div>
          </div>
          <div className="bg-white rounded-xl border border-slate-100 p-4 text-center">
            <div className="text-2xl font-bold text-violet-600">${(totals.revenue/1000).toFixed(0)}k</div>
            <div className="text-xs text-slate-500">Monthly Revenue</div>
          </div>
        </div>

        <div className="space-y-4">
          {centres.map(c => (
            <div key={c.id} className={`bg-white rounded-xl border transition-all cursor-pointer overflow-hidden ${selected === c.id ? 'border-indigo-300 ring-2 ring-indigo-100' : 'border-slate-100 hover:border-slate-200'}`} onClick={() => setSelected(selected === c.id ? null : c.id)}>
              <div className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-800">{c.name}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{c.location}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${c.occupancy >= 90 ? 'bg-emerald-100 text-emerald-700' : c.occupancy >= 75 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>{c.occupancy}% full</span>
                </div>
                <div className="grid grid-cols-4 gap-4 mt-4">
                  <div><div className="text-lg font-bold text-slate-800">{c.enrolled}/{c.capacity}</div><div className="text-xs text-slate-500">Enrolled</div></div>
                  <div><div className="text-lg font-bold text-slate-800">{c.staff}</div><div className="text-xs text-slate-500">Staff</div></div>
                  <div><div className="text-lg font-bold text-slate-800">{c.compliance}%</div><div className="text-xs text-slate-500">Compliance</div></div>
                  <div><div className="text-lg font-bold text-slate-800">${(c.revenue/1000).toFixed(1)}k</div><div className="text-xs text-slate-500">Revenue/mo</div></div>
                </div>
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-slate-400 mb-1"><span>Occupancy</span><span>{c.occupancy}%</span></div>
                  <div className="bg-slate-100 rounded-full h-2">
                    <div className={`h-2 rounded-full ${c.occupancy >= 90 ? 'bg-emerald-400' : c.occupancy >= 75 ? 'bg-amber-400' : 'bg-red-400'}`} style={{ width: `${c.occupancy}%` }} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
