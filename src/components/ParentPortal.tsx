import React, { useState, useEffect } from 'react';
import { db } from '../services/database';
import { DbUser, DbChild, DbInvoice } from '../services/types';
import { User, Bell, FileText, UploadCloud, Calendar, DollarSign, Activity } from 'lucide-react';

interface ParentPortalProps {
  user?: DbUser | null;
}

export const ParentPortal: React.FC<ParentPortalProps> = ({ user }) => {
  const [children, setChildren] = useState<DbChild[]>([]);
  const [activeTab, setActiveTab] = useState<'feed' | 'billing' | 'attendance'>('feed');

  useEffect(() => {
    if (user?.id) {
      db.children.getParentChildren(user.id).then(setChildren).catch(console.error);
    }
  }, [user]);

  return (
    <div className="h-full w-full bg-slate-100 flex flex-col md:flex-row">
      {/* Sidebar navigation */}
      <div className="w-full md:w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 overflow-y-auto">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-900">Parent Portal</h2>
          <p className="text-sm text-slate-500 mt-1">Welcome back, {user?.name || "Parent"}</p>
        </div>
        <div className="p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('feed')}
            className={`w-full text-left px-4 py-2.5 rounded-lg flex items-center gap-3 font-medium transition-colors ${activeTab === 'feed' ? 'bg-brand-azure text-white shadow-sm shadow-blue-500/20' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <Activity className="w-5 h-5" /> Activity Feed
          </button>
          <button 
            onClick={() => setActiveTab('attendance')}
            className={`w-full text-left px-4 py-2.5 rounded-lg flex items-center gap-3 font-medium transition-colors ${activeTab === 'attendance' ? 'bg-brand-azure text-white shadow-sm shadow-blue-500/20' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <Calendar className="w-5 h-5" /> Attendance
          </button>
          <button 
            onClick={() => setActiveTab('billing')}
            className={`w-full text-left px-4 py-2.5 rounded-lg flex items-center gap-3 font-medium transition-colors ${activeTab === 'billing' ? 'bg-brand-azure text-white shadow-sm shadow-blue-500/20' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <DollarSign className="w-5 h-5" /> Billing & Invoices
          </button>
        </div>

        <div className="mt-auto p-4 border-t border-slate-200">
          <h3 className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-3">Your Children</h3>
          {children.length === 0 ? (
            <p className="text-sm text-slate-500">No children linked to this account.</p>
          ) : (
            <div className="space-y-2">
              {children.map(child => (
                <div key={child.id} className="flex items-center gap-3 p-2 rounded border border-slate-100 bg-slate-50">
                  <div className="w-8 h-8 rounded-full bg-brand-teal/20 flex items-center justify-center text-brand-teal font-bold">
                    {child.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{child.name}</p>
                    <p className="text-xs text-slate-500">{child.birthday ? `Born: ${new Date(child.birthday).toLocaleDateString()}` : 'Age unknown'}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-6 md:p-10">
        
        {activeTab === 'feed' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold text-slate-900 mb-6">Daily Activity Feed</h1>
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-start gap-4 pb-6 border-b border-slate-100">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-brand-azure shrink-0">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="font-bold text-slate-900">New Observation: Block Towers</h3>
                    <span className="text-xs text-slate-400">2 hours ago</span>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed mb-3">
                    Oliver showed fantastic spatial awareness today while building the tall tower in the blue room. He demonstrated resilience when the blocks tumbled down...
                  </p>
                  <div className="h-48 w-full bg-slate-200 rounded-xl relative overflow-hidden group cursor-pointer border border-slate-100">
                    <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors" />
                    <img src="https://images.unsplash.com/photo-1596464718049-74d440db0365?q=80&w=800&auto=format&fit=crop" alt="Blocks" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4 pt-6">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-rose-500 shrink-0">
                  <Activity className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="font-bold text-slate-900">Meal Update: Lunch</h3>
                    <span className="text-xs text-slate-400">4 hours ago</span>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Oliver ate all of his pasta bake and had a serving of fresh fruit.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'billing' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold text-slate-900 mb-6">Billing & Invoices</h1>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">Current Balance</p>
                  <p className="text-3xl font-bold text-slate-900 mt-1">$0.00</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500">
                  <DollarSign className="w-6 h-6" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">Next Payment</p>
                  <p className="text-xl font-bold text-slate-900 mt-1">Auto-deduct on 14th</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
                <h3 className="font-semibold text-slate-800">Recent Invoices</h3>
              </div>
              <div className="divide-y divide-slate-100">
                <div className="p-4 px-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div>
                    <h4 className="font-medium text-slate-900">INV-2026-04</h4>
                    <p className="text-xs text-slate-500">01 Apr 2026 - Childcare Fees</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full uppercase">Paid</span>
                    <p className="font-bold text-slate-900">$450.00</p>
                  </div>
                </div>
                <div className="p-4 px-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div>
                    <h4 className="font-medium text-slate-900">INV-2026-03</h4>
                    <p className="text-xs text-slate-500">01 Mar 2026 - Childcare Fees</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full uppercase">Paid</span>
                    <p className="font-bold text-slate-900">$450.00</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'attendance' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold text-slate-900 mb-6">Attendance Record</h1>
            <div className="bg-white p-12 rounded-2xl border border-slate-200 shadow-sm text-center">
              <Calendar className="w-12 h-12 mx-auto text-slate-300 mb-4" />
              <h3 className="text-lg font-semibold text-slate-700">Attendance Calendar</h3>
              <p className="text-slate-500 text-sm mt-2">Oliver has attended 100% of his scheduled days this month.</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
