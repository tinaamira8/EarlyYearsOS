import React, { useState } from 'react';
import { TrendingUp, BarChart3 } from 'lucide-react';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];
const rooms = ['Babies', 'Toddlers', 'Pre-Kindy'];

const data: Record<string, number[]> = {
  Babies: [8, 8, 9, 9, 8],
  Toddlers: [12, 12, 13, 11, 12],
  'Pre-Kindy': [18, 20, 19, 22, 22],
};

const capacity: Record<string, number> = { Babies: 10, Toddlers: 15, 'Pre-Kindy': 25 };
const totalCapacity = Object.values(capacity).reduce((a, b) => a + b, 0);

const insights = [
  { icon: '📈', text: 'Pre-Kindy occupancy trending upward — now at 88%, up from 72% in Jan.' },
  { icon: '⚠️', text: 'Babies room below 80% occupancy. Consider targeted marketing for infant enrolments.' },
  { icon: '🎯', text: 'Overall occupancy 85% — above industry average of 80%.' },
];

export const RevenueForecasting: React.FC = () => {
  const [selectedRoom, setSelectedRoom] = useState('All');
  const weeklyRates: Record<string, number> = { Babies: 540, Toddlers: 480, 'Pre-Kindy': 420 };

  const latestOccupancy = rooms.map(r => data[r][data[r].length - 1]);
  const totalEnrolled = latestOccupancy.reduce((a, b) => a + b, 0);
  const weeklyRevenue = rooms.reduce((sum, r, i) => sum + latestOccupancy[i] * weeklyRates[r], 0);
  const monthlyRevenue = weeklyRevenue * 4.33;

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Revenue Forecasting</h1>
            <p className="text-slate-500 text-sm">Enrolment trends and revenue projections</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-slate-100 p-4 text-center">
            <div className="text-2xl font-bold text-indigo-600">{totalEnrolled}/{totalCapacity}</div>
            <div className="text-xs text-slate-500">Current Enrolments</div>
            <div className="text-xs text-indigo-400 mt-1">{Math.round((totalEnrolled/totalCapacity)*100)}% occupancy</div>
          </div>
          <div className="bg-white rounded-xl border border-slate-100 p-4 text-center">
            <div className="text-2xl font-bold text-emerald-600">${weeklyRevenue.toLocaleString()}</div>
            <div className="text-xs text-slate-500">Weekly Revenue</div>
          </div>
          <div className="bg-white rounded-xl border border-slate-100 p-4 text-center">
            <div className="text-2xl font-bold text-green-600">${Math.round(monthlyRevenue).toLocaleString()}</div>
            <div className="text-xs text-slate-500">Monthly Revenue (est.)</div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-100 p-5">
          <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2"><BarChart3 className="w-4 h-4 text-slate-400" /> Enrolment Trend by Room (2026)</h3>
          <div className="space-y-6">
            {rooms.map(room => (
              <div key={room}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-slate-700">{room}</span>
                  <span className="text-slate-500">{data[room][data[room].length - 1]}/{capacity[room]} enrolled</span>
                </div>
                <div className="flex items-end gap-1 h-16">
                  {data[room].map((val, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
                      <div className="w-full bg-indigo-400 rounded-t" style={{ height: `${(val / capacity[room]) * 100}%`, minHeight: '4px' }} />
                      <span className="text-[10px] text-slate-400">{months[i]}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold text-slate-800">Key Insights</h3>
          {insights.map((ins, i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-100 p-4 flex items-start gap-3">
              <span className="text-xl">{ins.icon}</span>
              <p className="text-sm text-slate-700">{ins.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
