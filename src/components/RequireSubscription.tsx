import React from 'react';
import { Lock, Sparkles } from 'lucide-react';
import { DbUser } from '../services/types';

interface RequireSubscriptionProps {
  user: DbUser | null;
  onUpgrade: () => void;
  title: string;
  description: string;
  children: React.ReactNode;
}

export const RequireSubscription: React.FC<RequireSubscriptionProps> = ({
  user,
  onUpgrade,
  title,
  description,
  children
}) => {
  // All sections are accessible - no subscription gating
  return <>{children}</>;

  // Otherwise, render a beautiful locked state paywall
  return (
    <div className="h-full w-full bg-slate-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative background blurs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-brand-teal rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-brand-azure rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-64 h-64 bg-brand-berry rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-md w-full bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-200 p-8 text-center mt-10">
        <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner ring-1 ring-slate-900/5">
          <Lock className="w-8 h-8" />
        </div>
        
        <h2 className="text-2xl font-bold text-slate-900 mb-3">{title}</h2>
        <p className="text-slate-600 mb-8 leading-relaxed">
          {description}
          <br /><br />
          This is a premium feature. Upgrade your plan to instantly unlock this and many other advanced AI capabilities.
        </p>
        
        <button
          onClick={onUpgrade}
          className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
        >
          <Sparkles className="w-5 h-5 text-yellow-400" />
          <span>View Upgrade Options</span>
        </button>
      </div>
    </div>
  );
};
