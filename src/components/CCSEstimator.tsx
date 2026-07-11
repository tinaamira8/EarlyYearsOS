import React, { useState } from 'react';
import { Calculator } from 'lucide-react';

export const CCSEstimator: React.FC = () => {
  const [income, setIncome] = useState(80000);
  const [activity, setActivity] = useState(75);
  const [hours, setHours] = useState(30);
  const [age, setAge] = useState('3-4 years');

  const hourlyRates: Record<string, number> = { 'Under 2 years': 14.29, '2 years': 12.68, '3-4 years': 11.05, '5+ years': 11.05 };

  // CCS calculation (simplified estimate, not official)
  let ccsRate = 0;
  if (income <= 80000) ccsRate = 90;
  else if (income <= 100000) ccsRate = 85;
  else if (income <= 130000) ccsRate = 80;
  else if (income <= 160000) ccsRate = 72;
  else if (income <= 190000) ccsRate = 60;
  else if (income <= 230000) ccsRate = 48;
  else if (income <= 280000) ccsRate = 36;
  else if (income <= 340000) ccsRate = 24;
  else ccsRate = 0;

  const activityCap = Math.ceil(activity / 5) * 5;
  let hoursCapped = Math.min(hours, activityCap === 0 ? 24 : activityCap === 5 ? 24 : activityCap === 10 ? 36 : activityCap === 15 ? 48 : 100);
  const rate = hourlyRates[age];
  const subsidy = (ccsRate / 100) * Math.min(rate, rate) * hoursCapped;

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-cyan-100 rounded-xl flex items-center justify-center">
            <Calculator className="w-5 h-5 text-cyan-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">CCS Estimator</h1>
            <p className="text-slate-500 text-sm">Estimate Childcare Subsidy entitlement (educational tool only)</p>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-700">
          ⚠️ This is an estimation tool for educational purposes only. For accurate CCS calculations, families should use the official Services Australia CCS estimator or contact Centrelink.
        </div>

        <div className="bg-white rounded-xl border border-slate-100 p-6 space-y-5">
          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">Combined Family Income: <strong className="text-indigo-600">${income.toLocaleString()}</strong></label>
            <input type="range" min={0} max={500000} step={5000} className="w-full accent-indigo-600" value={income} onChange={e => setIncome(+e.target.value)} />
            <div className="flex justify-between text-xs text-slate-400 mt-1"><span>$0</span><span>$500,000</span></div>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">Activity Level (hours/fortnight per parent): <strong className="text-indigo-600">{activity}h</strong></label>
            <input type="range" min={0} max={100} step={5} className="w-full accent-indigo-600" value={activity} onChange={e => setActivity(+e.target.value)} />
            <div className="flex justify-between text-xs text-slate-400 mt-1"><span>0h (No subsidy)</span><span>100h+</span></div>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">Child's Age Group</label>
            <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" value={age} onChange={e => setAge(e.target.value)}>
              {Object.keys(hourlyRates).map(a => <option key={a}>{a}</option>)}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">Hours per week in care: <strong className="text-indigo-600">{hours}h</strong></label>
            <input type="range" min={0} max={60} step={1} className="w-full accent-indigo-600" value={hours} onChange={e => setHours(+e.target.value)} />
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-2xl p-6 space-y-4">
          <h3 className="font-semibold text-lg">Estimated Entitlement</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/20 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold">{ccsRate}%</div>
              <div className="text-indigo-200 text-sm mt-1">CCS Rate</div>
            </div>
            <div className="bg-white/20 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold">${subsidy.toFixed(0)}</div>
              <div className="text-indigo-200 text-sm mt-1">Subsidy / week</div>
            </div>
          </div>
          <p className="text-indigo-200 text-xs">Based on the hourly rate cap of ${rate}/hr for {age} children.</p>
        </div>
      </div>
    </div>
  );
};
