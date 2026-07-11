import React, { useState } from 'react';
import { DbUser } from '../services/types';
import { 
  Leaf, Droplets, Zap, Recycle, Sprout, ArrowRight, CheckCircle2
} from 'lucide-react';
import toast from 'react-hot-toast';

interface GreenAuditProps {
  user?: DbUser | null;
}

export const GreenAudit: React.FC<GreenAuditProps> = ({ user }) => {
  const [activeMetric, setActiveMetric] = useState('water');

  const metrics = [
    { id: 'water', icon: Droplets, title: 'Water', color: 'text-sky-500', bg: 'bg-sky-50', score: 85, trend: '+5%' },
    { id: 'energy', icon: Zap, title: 'Energy', color: 'text-amber-500', bg: 'bg-amber-50', score: 92, trend: '+12%' },
    { id: 'waste', icon: Recycle, title: 'Waste', color: 'text-violet-500', bg: 'bg-violet-50', score: 64, trend: '-2%' },
    { id: 'nature', icon: Sprout, title: 'Biodiversity', color: 'text-emerald-500', bg: 'bg-emerald-50', score: 78, trend: '+8%' },
  ];

  return (
    <div className="h-full w-full bg-slate-50 flex flex-col p-6 md:p-10 overflow-y-auto">
      <div className="max-w-6xl mx-auto w-full space-y-8">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-white p-6 rounded-[2rem] shadow-sm border border-slate-200">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                <Leaf className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Green Audit</h1>
                <p className="text-slate-500 font-medium mt-1">Sustainability tracking for NQS QA3 compliance.</p>
              </div>
            </div>
          </div>
          
          <button type="button" onClick={() => window.print()} className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-lg flex items-center gap-2">
            Generate Report <ArrowRight className="w-4 h-4" />
          </button>
        </header>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
           {metrics.map(metric => {
              const Icon = metric.icon;
              return (
                 <button 
                    key={metric.id}
                    onClick={() => setActiveMetric(metric.id)}
                    className={`text-left p-6 rounded-3xl border transition-all ${activeMetric === metric.id ? 'bg-white border-emerald-400 shadow-lg shadow-emerald-500/10 scale-105 z-10' : 'bg-slate-50 border-slate-200 hover:border-slate-300'}`}
                 >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${metric.bg} ${metric.color}`}>
                       <Icon className="w-5 h-5" />
                    </div>
                    <p className="font-bold text-slate-500 uppercase tracking-wider text-xs mb-1">{metric.title}</p>
                    <div className="flex items-end gap-2">
                       <h2 className="text-3xl font-black text-slate-900">{metric.score}%</h2>
                    </div>
                 </button>
              )
           })}
        </div>

        {/* Detailed Audit View */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
           <div className="flex justify-between items-start mb-8">
              <div>
                 <h2 className="text-2xl font-black text-slate-900 capitalize">{activeMetric} Conservation Audit</h2>
                 <p className="text-slate-500 font-medium mt-1">Checklist and action items for current quarter.</p>
              </div>
           </div>

           <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-start gap-4">
                 <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                 <div>
                    <h3 className="font-bold text-slate-900 text-lg">Child-led practices integrated</h3>
                    <p className="text-slate-600 text-sm mt-1">Children actively empty remnant water loops into the garden pots instead of the sink.</p>
                 </div>
              </div>
              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-start gap-4">
                 <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                 <div>
                    <h3 className="font-bold text-slate-900 text-lg">Push-button taps installed</h3>
                    <p className="text-slate-600 text-sm mt-1">All children's sinks have timed push-button taps preventing water waste.</p>
                 </div>
              </div>
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-4 group hover:bg-white transition-colors cursor-pointer" onClick={() => toast.success("Marked as resolved!")}>
                 <div className="w-6 h-6 rounded-full border-2 border-slate-300 group-hover:border-emerald-400 shrink-0 mt-0.5 transition-colors"></div>
                 <div>
                    <h3 className="font-bold text-slate-700 text-lg group-hover:text-slate-900 transition-colors">Fix leaky outdoor tap</h3>
                    <p className="text-slate-500 text-sm mt-1">The tap near the sandpit is dripping. Needs plumber.</p>
                 </div>
              </div>
           </div>
        </div>

        {/* Impact Visual */}
        <div className="bg-emerald-900 rounded-3xl p-8 shadow-xl text-white overflow-hidden relative">
           <div className="relative z-10 md:w-2/3">
              <h2 className="text-2xl font-black mb-2">Our Environmental Impact</h2>
              <p className="text-emerald-100/80 font-medium leading-relaxed mb-6">Through our collective green audit efforts this year, we have reduced our carbon footprint significantly and taught the next generation vital sustainability habits.</p>
              
              <div className="flex gap-8">
                 <div>
                    <p className="text-emerald-300 text-xs font-bold uppercase tracking-widest mb-1">Water Saved</p>
                    <p className="text-3xl font-black">12k Litres</p>
                 </div>
                 <div>
                    <p className="text-emerald-300 text-xs font-bold uppercase tracking-widest mb-1">Waste Redirected</p>
                    <p className="text-3xl font-black">400kg</p>
                 </div>
              </div>
           </div>
           
           <Leaf className="absolute -right-10 -bottom-10 w-64 h-64 text-emerald-800 opacity-50 rotate-12" />
        </div>

      </div>
    </div>
  );
};
