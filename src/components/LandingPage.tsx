import React from 'react';
import { motion } from 'framer-motion';
import {
  Eye, ShieldCheck, Users, MessageSquare, CalendarCheck, Sparkles,
  ArrowRight, CheckCircle2, Star, Heart,
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted?: () => void;
  onLogin?: () => void;
}

const features = [
  {
    icon: <Eye className="w-5 h-5" />,
    title: 'Observations & Documentation',
    desc: 'Turn quick jottings into professional, EYLF-aligned observations with AI assistance — in seconds, not evenings.',
  },
  {
    icon: <ShieldCheck className="w-5 h-5" />,
    title: 'NQS Compliance, Always On',
    desc: 'Live self-assessment across all 7 quality areas, QIP goal planning, and alerts before anything expires.',
  },
  {
    icon: <Heart className="w-5 h-5" />,
    title: 'Daily Care & Health',
    desc: 'Meals, sleep, sunscreen, nappy changes, medication logs and medical action plans — logged in two taps.',
  },
  {
    icon: <Users className="w-5 h-5" />,
    title: 'Staff & Rostering',
    desc: 'Rosters, qualifications, required training and professional development portfolios in one place.',
  },
  {
    icon: <MessageSquare className="w-5 h-5" />,
    title: 'Family Communication',
    desc: 'A parent portal, secure messaging and beautiful newsletters that keep families connected and informed.',
  },
  {
    icon: <CalendarCheck className="w-5 h-5" />,
    title: 'Operations & Finance',
    desc: 'Enrolments, waitlists, occupancy analytics, invoicing and CCS estimates — the whole centre, one dashboard.',
  },
];

const highlights = [
  'Built around the EYLF & National Quality Standard',
  'AI writing help for observations, reflections & QIPs',
  'Works on desktop, tablet and phone',
];

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onLogin }) => {
  const start = onGetStarted || onLogin;
  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Nav */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-sm">
              <span className="text-white text-sm font-extrabold">EY</span>
            </div>
            <span className="font-extrabold text-lg tracking-tight">EarlyYearsOS</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onLogin}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
            >
              Sign in
            </button>
            <button
              onClick={start}
              className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm shadow-indigo-600/25 transition-colors"
            >
              Get started
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/80 via-white to-white" aria-hidden="true" />
        <div className="relative max-w-6xl mx-auto px-5 pt-20 pb-16 text-center">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wide">
              <Sparkles className="w-3.5 h-3.5" />
              Professional Educator Suite
            </span>
            <h1 className="mt-6 text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.05]">
              Run your early learning centre
              <span className="block bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                with calm and confidence.
              </span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-lg text-slate-600 leading-relaxed">
              EarlyYearsOS brings observations, compliance, daily care, rosters, invoicing and
              family communication into one beautiful platform — so educators spend less time on
              paperwork and more time with children.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={start}
                className="w-full sm:w-auto px-7 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-600/25 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                Try the live demo
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={onLogin}
                className="w-full sm:w-auto px-7 py-3.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-bold rounded-2xl shadow-sm transition-colors"
              >
                Sign in to your centre
              </button>
            </div>
            <ul className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-x-6 gap-y-2 text-sm text-slate-500">
              {highlights.map(h => (
                <li key={h} className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  {h}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-5 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold tracking-tight">Everything your centre needs</h2>
          <p className="mt-3 text-slate-600 max-w-xl mx-auto">
            One login for educators, directors, chefs and families — with more than 60 purpose-built
            tools for Australian early childhood services.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
              className="p-6 rounded-2xl border border-slate-200 bg-white hover:shadow-lg hover:shadow-slate-200/60 hover:-translate-y-0.5 transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                {f.icon}
              </div>
              <h3 className="font-bold text-slate-900">{f.title}</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Social proof / stats */}
      <section className="bg-slate-50 border-y border-slate-100">
        <div className="max-w-6xl mx-auto px-5 py-14 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            ['60+', 'Suite tools included'],
            ['7', 'NQS quality areas covered'],
            ['5 min', 'To write an observation'],
            ['24/7', 'Compliance monitoring'],
          ].map(([num, label]) => (
            <div key={label}>
              <p className="text-3xl font-extrabold text-indigo-600">{num}</p>
              <p className="mt-1 text-sm text-slate-500 font-medium">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-5 py-20">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 to-violet-600 px-6 py-14 text-center shadow-xl shadow-indigo-600/20">
          <Star className="absolute -top-6 -left-6 w-32 h-32 text-white/10 rotate-12" aria-hidden="true" />
          <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Ready to give educators their evenings back?
          </h2>
          <p className="mt-4 text-indigo-100 max-w-xl mx-auto">
            Explore the full platform right now with the interactive demo — no sign-up required.
          </p>
          <button
            onClick={start}
            className="mt-8 px-8 py-3.5 bg-white text-indigo-700 font-bold rounded-2xl shadow-lg hover:bg-indigo-50 transition-colors inline-flex items-center gap-2"
          >
            Open the demo
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-5 py-8 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center">
              <span className="text-white text-[9px] font-extrabold">EY</span>
            </div>
            <span className="font-semibold text-slate-700">EarlyYearsOS</span>
          </div>
          <p>© {new Date().getFullYear()} EarlyYearsOS · Professional Educator Suite</p>
        </div>
      </footer>
    </div>
  );
};
