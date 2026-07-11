import React, { useState } from 'react';
import { Check, Loader2, Sparkles, Shield, Zap } from 'lucide-react';
import { DbUser } from '../services/types';
import toast from 'react-hot-toast';

interface SubscriptionPageProps {
  user?: DbUser | null;
}

export const SubscriptionPage: React.FC<SubscriptionPageProps> = ({ user }) => {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleSubscribe = async (plan: string) => {
    if (!user) {
      toast.error('You must be logged in to subscribe.');
      return;
    }
    setLoadingPlan(plan);
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan,
          userId: user.id,
          email: user.email,
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error: any) {
      console.error('Subscription error:', error);
      toast.error(error.message || 'Failed to start checkout. Please try again.');
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 w-full overflow-y-auto">
      <div className="max-w-6xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-extrabold text-slate-900 sm:text-5xl tracking-tight">
            Plans for Every Educator
          </h1>
          <p className="mt-4 text-xl text-slate-600">
            Unlock the full power of EarlyYearsOS. Choose the plan that fits your needs and start saving hours every week.
          </p>
        </div>

        <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0 xl:grid-cols-2">
          
          {/* Educator Plan */}
          <div className="border border-slate-200 rounded-3xl shadow-sm divide-y divide-slate-200 bg-white hover:shadow-lg transition-shadow duration-300">
            <div className="p-8">
              <div className="flex items-center">
                <Sparkles className="h-6 w-6 text-brand-teal" />
                <h2 className="ml-3 text-2xl font-bold text-slate-900">Individual Educator</h2>
              </div>
              <p className="mt-4 text-sm text-slate-500">Perfect for single educators managing their own classroom, portfolios, and programming.</p>
              <p className="mt-8">
                <span className="text-4xl font-extrabold text-slate-900">$29</span>
                <span className="text-base font-medium text-slate-500">/mo</span>
              </p>
              <button
                onClick={() => handleSubscribe('educator')}
                disabled={loadingPlan === 'educator' || user?.plan === 'educator'}
                className={`mt-8 block w-full py-3 px-6 border border-transparent rounded-xl text-center font-bold text-white transition-colors
                  ${user?.plan === 'educator' 
                    ? 'bg-slate-300 cursor-not-allowed' 
                    : 'bg-brand-teal hover:bg-teal-600 shadow-sm'} 
                `}
              >
                {loadingPlan === 'educator' ? <Loader2 className="w-5 h-5 mx-auto animate-spin" /> : user?.plan === 'educator' ? 'Current Plan' : 'Subscribe to Educator'}
              </button>
            </div>
            <div className="pt-6 pb-8 px-8">
              <h3 className="text-xs font-semibold text-slate-900 tracking-wide uppercase">What's included</h3>
              <ul className="mt-6 space-y-4">
                {[
                  'AI-assisted Observation Writer',
                  'Unlimited Learning Portfolios',
                  'Activity Planner access',
                  'Early Years Foundation mapping',
                  'Expert Assistant Chat',
                ].map((feature) => (
                  <li key={feature} className="flex space-x-3">
                    <Check className="flex-shrink-0 h-5 w-5 text-emerald-500" aria-hidden="true" />
                    <span className="text-sm text-slate-500">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Centre Plan */}
          <div className="border-2 border-brand-azure rounded-3xl shadow-md divide-y divide-slate-200 bg-white relative hover:shadow-xl transition-shadow duration-300">
            <div className="absolute top-0 inset-x-0 -translate-y-1/2 flex justify-center">
              <span className="bg-brand-azure text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wide">
                Most Popular
              </span>
            </div>
            <div className="p-8">
              <div className="flex items-center">
                <Shield className="h-6 w-6 text-brand-azure" />
                <h2 className="ml-3 text-2xl font-bold text-slate-900">Centre Management</h2>
              </div>
              <p className="mt-4 text-sm text-slate-500">A complete suite for directors operating entire childcare centres with multiple staff.</p>
              <p className="mt-8">
                <span className="text-4xl font-extrabold text-slate-900">$199</span>
                <span className="text-base font-medium text-slate-500">/mo</span>
              </p>
              <button
                onClick={() => handleSubscribe('centre')}
                disabled={loadingPlan === 'centre' || user?.plan === 'centre'}
                className={`mt-8 block w-full py-3 px-6 border border-transparent rounded-xl text-center font-bold text-white transition-colors
                  ${user?.plan === 'centre' 
                    ? 'bg-slate-300 cursor-not-allowed' 
                    : 'bg-brand-azure hover:bg-blue-600 shadow-sm'} 
                `}
              >
                {loadingPlan === 'centre' ? <Loader2 className="w-5 h-5 mx-auto animate-spin" /> : user?.plan === 'centre' ? 'Current Plan' : 'Subscribe to Centre'}
              </button>
            </div>
            <div className="pt-6 pb-8 px-8">
              <h3 className="text-xs font-semibold text-slate-900 tracking-wide uppercase">Everything in Educator, plus</h3>
              <ul className="mt-6 space-y-4">
                {[
                  'Compliance & QIP Management',
                  'Staff Rostering & Qualifications',
                  'Facility Management & Audits',
                  'Parent Portal & Billing',
                  'Priority Support',
                ].map((feature) => (
                  <li key={feature} className="flex space-x-3">
                    <Check className="flex-shrink-0 h-5 w-5 text-emerald-500" aria-hidden="true" />
                    <span className="text-sm text-slate-500">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
