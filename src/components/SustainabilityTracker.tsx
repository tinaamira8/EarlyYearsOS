import React, { useState } from 'react';
import { Leaf } from 'lucide-react';

const goals = [
  { id: 1, category: 'Waste Reduction', goal: 'Reduce landfill waste by 30%', progress: 65, unit: '%', current: '22% reduction so far', initiatives: ['Composting program', 'Recycling stations in all rooms', 'Reusable containers for food storage'] },
  { id: 2, category: 'Energy Saving', goal: 'Reduce energy use by 20% vs 2024', progress: 40, unit: '%', current: '8% reduction so far', initiatives: ['LED lighting throughout', 'Timer switches on heaters', 'Solar panels (pending approval)'] },
  { id: 3, category: 'Water Conservation', goal: 'Reduce water use by 15%', progress: 80, unit: '%', current: '12% reduction so far', initiatives: ['Water-saving taps installed', 'Rainwater tank for outdoor watering', 'Water audit completed'] },
  { id: 4, category: 'Recycling', goal: '90% of recyclables diverted from landfill', progress: 78, unit: '%', current: '78% achieved', initiatives: ['Paper, cardboard, plastic streams', 'Staff training on recycling', 'E-waste collection point'] },
];

const log = [
  { date: '2026-05-15', initiative: 'Native garden planted by children and families', category: 'Biodiversity' },
  { date: '2026-05-01', initiative: 'Introduced worm farm — processing food scraps', category: 'Waste' },
  { date: '2026-04-22', initiative: 'Earth Day — centre-wide clean up walk', category: 'Community' },
  { date: '2026-04-01', initiative: 'Switched to eco-friendly cleaning products', category: 'Chemicals' },
];

export const SustainabilityTracker: React.FC = () => {
  const [tab, setTab] = useState<'goals' | 'log'>('goals');

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
            <Leaf className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="flex-1"><h1 className="text-2xl font-bold text-slate-800">Sustainability Tracker</h1>
            <p className="text-slate-500 text-sm">Green practices and environmental goals</p></div>
        </div>

        <div className="flex gap-2">
          <button onClick={() => setTab('goals')} className={`px-4 py-2 text-sm rounded-lg font-medium ${tab === 'goals' ? 'bg-emerald-600 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}>Goals & Progress</button>
          <button onClick={() => setTab('log')} className={`px-4 py-2 text-sm rounded-lg font-medium ${tab === 'log' ? 'bg-emerald-600 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}>Initiative Log</button>
        </div>

        {tab === 'goals' && (
          <div className="space-y-4">
            {goals.map(g => (
              <div key={g.id} className="bg-white rounded-xl border border-slate-100 p-5">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="text-xs font-semibold text-emerald-600 uppercase">{g.category}</span>
                    <h3 className="font-semibold text-slate-800 mt-0.5">{g.goal}</h3>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-emerald-600">{g.progress}%</div>
                    <div className="text-xs text-slate-400">toward goal</div>
                  </div>
                </div>
                <div className="bg-slate-100 rounded-full h-2.5 mb-3">
                  <div className={`h-2.5 rounded-full ${g.progress >= 75 ? 'bg-emerald-500' : g.progress >= 50 ? 'bg-amber-400' : 'bg-blue-400'}`} style={{ width: `${g.progress}%` }} />
                </div>
                <p className="text-xs text-slate-500 mb-2">{g.current}</p>
                <ul className="space-y-1">
                  {g.initiatives.map((init, i) => <li key={i} className="text-xs text-slate-600 flex items-center gap-2"><span className="text-emerald-400">✓</span>{init}</li>)}
                </ul>
              </div>
            ))}
          </div>
        )}

        {tab === 'log' && (
          <div className="space-y-3">
            {log.map((l, i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-100 p-4 flex items-start gap-4">
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Leaf className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-800">{l.initiative}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-slate-400">{l.date}</span>
                    <span className="text-xs bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded">{l.category}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
