import React from 'react';
import { AppView } from '../services/types';
import { motion } from 'framer-motion';
import {
  Users, FileText, Shield, Activity,
  Heart, Star, BookOpen, AlertCircle, Sun, Sparkles
} from 'lucide-react';

interface DashboardProps {
  onNavigate: (view: AppView) => void;
  user?: { name?: string; role?: string } | null;
}

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
};

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate, user }) => {
  const firstName = user?.name?.split(' ')[0];
  const today = new Date().toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long' });
  const isEducator = user?.role === 'Educator';
  return (
    <div className="h-full w-full overflow-y-auto p-6 pt-16 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Welcome Hero */}
        <header className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 p-8 md:p-10 shadow-xl shadow-indigo-500/20">
          <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-16 right-24 w-48 h-48 rounded-full bg-fuchsia-400/20 blur-2xl pointer-events-none" />
          <div className="absolute top-6 right-8 hidden md:block">
            <Sun className="w-14 h-14 text-amber-300/80" />
          </div>
          <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight drop-shadow-sm">
                {getGreeting()}{firstName ? `, ${firstName}` : ''} 👋
              </h1>
              <p className="text-indigo-100 mt-2 text-sm md:text-base">{today} — {isEducator ? "here's your day at a glance." : "here's what's happening at your centre."}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => onNavigate(AppView.OBSERVATION)}
                className="px-4 py-2.5 bg-white/15 backdrop-blur text-white font-semibold rounded-xl border border-white/25 hover:bg-white/25 transition-colors flex items-center gap-2 text-sm"
              >
                <FileText className="w-4 h-4" />
                New Observation
              </button>
              <button
                onClick={() => onNavigate(AppView.ACTIVITY_PLANNER)}
                className="px-4 py-2.5 bg-white text-indigo-700 font-semibold rounded-xl shadow-lg shadow-indigo-900/20 hover:bg-indigo-50 transition-colors flex items-center gap-2 text-sm"
              >
                <Sparkles className="w-4 h-4" />
                Plan Activity
              </button>
            </div>
          </div>
        </header>

        {/* Top Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Children Present" value="42 / 45"
            icon={<Users className="w-5 h-5 text-white" />}
            trend="+2 since yesterday" trendUp={true}
            gradient="from-sky-400 to-blue-500" glow="shadow-blue-500/20" bar="bg-gradient-to-r from-sky-400 to-blue-500"
          />
          <StatCard
            title="Staff on Roster" value="8"
            icon={<Activity className="w-5 h-5 text-white" />}
            trend="All staff present" neutral={true}
            gradient="from-emerald-400 to-teal-500" glow="shadow-emerald-500/20" bar="bg-gradient-to-r from-emerald-400 to-teal-500"
          />
          <StatCard
            title="Pending Observations" value="12"
            icon={<FileText className="w-5 h-5 text-white" />}
            trend="Needs attention" trendUp={false}
            gradient="from-amber-400 to-orange-500" glow="shadow-amber-500/20" bar="bg-gradient-to-r from-amber-400 to-orange-500"
          />
          <StatCard
            title="Compliance Score" value="98%"
            icon={<Shield className="w-5 h-5 text-white" />}
            trend="Meeting NQS requirements" neutral={true}
            gradient="from-violet-400 to-purple-500" glow="shadow-violet-500/20" bar="bg-gradient-to-r from-violet-400 to-purple-500"
          />
        </div>

        {/* Quick Actions & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </span>
                  Your Quick Workflows
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <WorkflowCard
                  title="Daily Care & Routines"
                  desc="Log sleep, meals, and nappy changes."
                  icon={<Heart className="w-6 h-6 text-white" />}
                  gradient="from-rose-400 to-pink-500"
                  tint="hover:border-rose-200 hover:bg-rose-50/50"
                  onClick={() => onNavigate(AppView.DAILY_CARE)}
                />
                {isEducator ? (
                  <WorkflowCard
                    title="Write Observation"
                    desc="Document a child's learning moment."
                    icon={<FileText className="w-6 h-6 text-white" />}
                    gradient="from-amber-400 to-yellow-500"
                    tint="hover:border-amber-200 hover:bg-amber-50/50"
                    onClick={() => onNavigate(AppView.OBSERVATION)}
                  />
                ) : (
                  <WorkflowCard
                    title="QIP Goal Planner"
                    desc="AI-driven Quality Improvement Planning."
                    icon={<Star className="w-6 h-6 text-white" />}
                    gradient="from-amber-400 to-yellow-500"
                    tint="hover:border-amber-200 hover:bg-amber-50/50"
                    onClick={() => onNavigate(AppView.QIP_PLANNER)}
                  />
                )}
                <WorkflowCard
                  title="Curriculum Board"
                  desc="Review this week's educational program."
                  icon={<BookOpen className="w-6 h-6 text-white" />}
                  gradient="from-indigo-400 to-blue-500"
                  tint="hover:border-indigo-200 hover:bg-indigo-50/50"
                  onClick={() => onNavigate(AppView.CURRICULUM_BOARD)}
                />
                {isEducator ? (
                  <WorkflowCard
                    title="Learning Journal"
                    desc="View and add to children's digital journals."
                    icon={<Star className="w-6 h-6 text-white" />}
                    gradient="from-teal-400 to-emerald-500"
                    tint="hover:border-teal-200 hover:bg-teal-50/50"
                    onClick={() => onNavigate(AppView.DIGITAL_JOURNAL)}
                  />
                ) : (
                  <WorkflowCard
                    title="Expert Compliance Chat"
                    desc="Get NQS compliance answers instantly."
                    icon={<Shield className="w-6 h-6 text-white" />}
                    gradient="from-teal-400 to-emerald-500"
                    tint="hover:border-teal-200 hover:bg-teal-50/50"
                    onClick={() => onNavigate(AppView.ASSISTANT)}
                  />
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm p-6 flex flex-col">
            <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-rose-500 to-red-500 flex items-center justify-center">
                <AlertCircle className="w-4 h-4 text-white" />
              </span>
              Critical Alerts
            </h2>
             <div className="flex-1 space-y-4">
                <AlertItem
                  title="Asthma Action Plan Expiring"
                  desc="Leo M.'s plan expires in 5 days."
                  urgent={true}
                  onClick={() => onNavigate(AppView.MEDICAL_MANAGER)}
                />
                <AlertItem
                  title="Staff CPR Certificate"
                  desc="Sarah J. needs a renewal next month."
                  urgent={false}
                  onClick={() => onNavigate(AppView.STAFF_QUALIFICATIONS)}
                />
                <AlertItem
                  title="Draft Risk Assessment"
                  desc="Excursion to the park needs signoff."
                  urgent={false}
                  onClick={() => onNavigate(AppView.RISK_ASSESSMENT)}
                />
             </div>
             <button
               onClick={() => onNavigate(AppView.COMPLIANCE_ALERTS)}
               className="mt-6 w-full py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 rounded-xl transition-all shadow-sm"
             >
               View All Alerts
             </button>
          </div>
        </div>

      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, trend, trendUp, neutral = false, gradient, glow, bar }: any) => (
  <motion.div
    whileHover={{ y: -3 }}
    className={`relative bg-white p-6 rounded-3xl border border-slate-200/60 shadow-lg ${glow} flex flex-col justify-between overflow-hidden`}
  >
    <div className={`absolute top-0 inset-x-0 h-1 ${bar}`} />
    <div className="flex justify-between items-start mb-4">
      <div className={`p-2.5 bg-gradient-to-br ${gradient} rounded-2xl shadow-md`}>{icon}</div>
    </div>
    <div>
      <h3 className="text-slate-500 text-sm font-semibold">{title}</h3>
      <p className="text-3xl font-extrabold text-slate-900 mt-1 tracking-tight">{value}</p>
    </div>
    <div className="mt-4 pt-4 border-t border-slate-100">
      <span className={`text-xs font-bold ${neutral ? 'text-slate-500' : trendUp ? 'text-emerald-600' : 'text-amber-600'}`}>
        {trend}
      </span>
    </div>
  </motion.div>
);

const WorkflowCard = ({ title, desc, icon, onClick, gradient, tint }: any) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`group cursor-pointer p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:shadow-lg transition-all flex items-start gap-4 ${tint}`}
  >
    <div className={`p-3 bg-gradient-to-br ${gradient} rounded-2xl shadow-md group-hover:scale-110 group-hover:rotate-3 transition-transform`}>
      {icon}
    </div>
    <div>
      <h4 className="font-bold text-slate-800">{title}</h4>
      <p className="text-xs text-slate-500 mt-1 leading-snug">{desc}</p>
    </div>
  </motion.div>
);

const AlertItem = ({ title, desc, urgent, onClick }: any) => (
  <div
    onClick={onClick}
    className={`p-4 rounded-2xl border cursor-pointer hover:shadow-md transition-all flex gap-3 ${
      urgent ? 'bg-gradient-to-r from-red-50 to-rose-50 border-red-100 hover:border-red-200' : 'bg-gradient-to-r from-amber-50/50 to-orange-50/30 border-amber-100/60 hover:border-amber-200'
    }`}
  >
    <div className="mt-0.5">
      {urgent ? <AlertCircle className="w-5 h-5 text-red-500" /> : <Shield className="w-5 h-5 text-amber-500" />}
    </div>
    <div>
      <h4 className={`text-sm font-bold ${urgent ? 'text-red-900' : 'text-slate-800'}`}>{title}</h4>
      <p className={`text-xs mt-0.5 ${urgent ? 'text-red-700' : 'text-slate-500'}`}>{desc}</p>
    </div>
  </div>
);
