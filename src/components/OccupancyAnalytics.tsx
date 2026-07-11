import React, { useState } from 'react';
import { BarChart, TrendingUp, Users, CalendarDays, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { DbUser } from '../services/types';

interface OccupancyAnalyticsProps { user?: DbUser | null; }
type Period = 'current' | 'next';

const periods = {
  current: { label: 'This Month', occupancy: '89.2%', waitlist: '42', vacancies: '12', revenue: '$42.8k', capacity: 89, bars: [40, 70, 95, 80, 60] },
  next: { label: 'Next Month', occupancy: '93.4%', waitlist: '37', vacancies: '7', revenue: '$46.1k', capacity: 93, bars: [62, 78, 92, 88, 74] },
};

export const OccupancyAnalytics: React.FC<OccupancyAnalyticsProps> = ({ user }) => {
  const [period, setPeriod] = useState<Period>('current');
  const data = periods[period];

  return (
    <div className="flex h-full w-full flex-col overflow-y-auto bg-slate-50 p-4 md:p-10">
      <div className="mx-auto w-full max-w-6xl space-y-8">
        <header className="flex flex-col items-start justify-between gap-6 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:flex-row md:items-end">
          <div className="flex items-center gap-3"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600"><BarChart className="h-6 w-6" /></div><div><h1 className="text-3xl font-black tracking-tight text-slate-900">Occupancy Analytics</h1><p className="mt-1 font-medium text-slate-500">{user?.centreName || 'Your centre'} capacity and business outlook.</p></div></div>
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2" aria-label="Occupancy period">
            {(Object.keys(periods) as Period[]).map(key => <button type="button" key={key} onClick={() => setPeriod(key)} className={`rounded-lg px-4 py-2 text-sm font-bold ${period === key ? 'border border-slate-200 bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>{periods[key].label}</button>)}
          </div>
        </header>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Metric icon={<BarChart className="h-6 w-6 text-indigo-600" />} label="Average Occupancy" value={data.occupancy} trend="2.4%" positive />
          <Metric icon={<Users className="h-6 w-6 text-rose-600" />} label="Total Waitlisted" value={data.waitlist} trend="5 spots" positive />
          <Metric icon={<CalendarDays className="h-6 w-6 text-amber-600" />} label="Upcoming Vacancies" value={data.vacancies} trend="1.1%" />
          <div className="rounded-3xl bg-gradient-to-br from-indigo-900 to-violet-900 p-6 text-white shadow-xl"><div className="mb-4 w-max rounded-xl bg-white/10 p-3"><TrendingUp className="h-6 w-6 text-indigo-200" /></div><p className="text-xs font-bold uppercase tracking-wider text-indigo-200">Projected Revenue</p><h2 className="text-4xl font-black tracking-tight">{data.revenue}</h2><p className="mt-2 text-xs text-indigo-300">Based on current bookings</p></div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="flex min-h-[300px] flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"><h3 className="mb-6 text-lg font-bold text-slate-900">Occupancy by weekday · {data.label}</h3><div className="flex flex-1 items-end gap-4">{data.bars.map((height, index) => <div key={`${period}-${index}`} className="group relative flex h-full max-h-48 flex-1 items-end overflow-hidden rounded-t-xl bg-slate-100"><div style={{ height: `${height}%` }} className="w-full rounded-t-xl bg-indigo-500 transition-all group-hover:bg-indigo-600" /><span className="absolute inset-x-0 bottom-2 text-center text-xs font-bold text-white">{height}%</span></div>)}</div><div className="mt-4 flex justify-between text-xs font-bold text-slate-400"><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span></div></div>
          <div className="flex flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm"><div className="flex h-48 w-48 items-center justify-center rounded-full border-8 border-slate-100 border-r-indigo-500 border-t-indigo-500 shadow-inner"><div><span className="text-4xl font-black text-slate-900">{data.capacity}%</span><span className="mt-1 block text-xs font-bold uppercase tracking-widest text-slate-400">Total Capacity</span></div></div><p className="mt-5 text-sm text-slate-500">Updated for {data.label.toLowerCase()}</p></div>
        </div>
      </div>
    </div>
  );
};

const Metric = ({ icon, label, value, trend, positive = false }: { icon: React.ReactNode; label: string; value: string; trend: string; positive?: boolean }) => (
  <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><div className="mb-4 flex items-start justify-between"><div className="rounded-xl bg-slate-50 p-3">{icon}</div><span className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-bold ${positive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>{positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}{trend}</span></div><p className="text-xs font-bold uppercase tracking-wider text-slate-500">{label}</p><h2 className="text-4xl font-black text-slate-900">{value}</h2></div>
);
