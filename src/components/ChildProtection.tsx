import React, { useState } from 'react';
import { DbUser } from '../services/types';
import { Shield, Eye, Lock, FileText, ExternalLink, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

interface ChildProtectionProps {
  user?: DbUser | null;
}

export const ChildProtection: React.FC<ChildProtectionProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'guidelines' | 'secure_notes'>('guidelines');

  return (
    <div className="h-full w-full bg-slate-50 flex flex-col p-6 md:p-10 overflow-y-auto">
      <div className="max-w-5xl mx-auto w-full space-y-8">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-white p-6 rounded-[2rem] shadow-sm border border-slate-200">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-700 rounded-2xl flex items-center justify-center">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Child Protection</h1>
                <p className="text-slate-500 font-medium mt-1">Mandatory reporting workflows and safeguarding guidelines.</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center bg-slate-100 p-1.5 rounded-xl border border-slate-200">
             <button 
               onClick={() => setActiveTab('guidelines')}
               className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'guidelines' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
             >
               Safeguarding Guide
             </button>
             <button 
               onClick={() => setActiveTab('secure_notes')}
               className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'secure_notes' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
             >
               <Lock className="w-4 h-4"/> Secure Notes
             </button>
          </div>
        </header>

        {activeTab === 'guidelines' ? (
           <div className="space-y-6">
              
              {/* Emergency Alert */}
              <div className="bg-rose-50 border-2 border-rose-200 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row gap-6 items-center">
                 <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-8 h-8 text-rose-600" />
                 </div>
                 <div>
                    <h3 className="text-rose-900 font-black text-xl mb-1">Immediate Danger?</h3>
                    <p className="text-rose-700 font-medium text-sm max-w-2xl">If you believe a child is in immediate danger of significant harm or a life-threatening situation exists, contact emergency services (000) immediately before proceeding with internal reports.</p>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {/* Mandatory Reporting Steps */}
                 <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                       <Eye className="w-6 h-6 text-indigo-600" />
                       <h2 className="text-xl font-bold text-slate-800">Mandatory Reporting Steps</h2>
                    </div>
                    <ul className="space-y-6 relative before:absolute before:inset-y-2 before:left-[11px] before:w-0.5 before:bg-indigo-100">
                       <li className="relative pl-8">
                          <span className="absolute left-0 top-1 w-6 h-6 rounded-full bg-indigo-100 border-2 border-white flex items-center justify-center text-[10px] font-black text-indigo-700">1</span>
                          <h4 className="font-bold text-slate-900">Observe & Document</h4>
                          <p className="text-sm text-slate-500 mt-1">Factually record what you saw, heard, and observed without leading questions.</p>
                       </li>
                       <li className="relative pl-8">
                          <span className="absolute left-0 top-1 w-6 h-6 rounded-full bg-indigo-100 border-2 border-white flex items-center justify-center text-[10px] font-black text-indigo-700">2</span>
                          <h4 className="font-bold text-slate-900">Consult Nominated Supervisor</h4>
                          <p className="text-sm text-slate-500 mt-1">Discuss concerns with your director to review the child's history and center policies.</p>
                       </li>
                       <li className="relative pl-8">
                          <span className="absolute left-0 top-1 w-6 h-6 rounded-full bg-indigo-100 border-2 border-white flex items-center justify-center text-[10px] font-black text-indigo-700">3</span>
                          <h4 className="font-bold text-slate-900">Use Decision Tree (MRG)</h4>
                          <p className="text-sm text-slate-500 mt-1">Run details through the Mandatory Reporter Guide to determine if it meets the Risk of Significant Harm threshold.</p>
                       </li>
                       <li className="relative pl-8">
                          <span className="absolute left-0 top-1 w-6 h-6 rounded-full bg-indigo-100 border-2 border-white flex items-center justify-center text-[10px] font-black text-indigo-700">4</span>
                          <h4 className="font-bold text-slate-900">Report / Monitor</h4>
                          <p className="text-sm text-slate-500 mt-1">Lodge with Child Protection Helpline if ROSH is met, otherwise monitor and refer to family support.</p>
                       </li>
                    </ul>
                 </div>

                 {/* Key Resources */}
                 <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                       <FileText className="w-6 h-6 text-indigo-600" />
                       <h2 className="text-xl font-bold text-slate-800">Support & Resources</h2>
                    </div>

                    <div className="grid gap-4 flex-1">
                       <a href="#" className="flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200 group">
                          <div>
                             <h4 className="font-bold text-slate-800 group-hover:text-indigo-700 transition-colors">ChildStory Reporter</h4>
                             <p className="text-xs text-slate-500">Access the Mandatory Reporter Guide</p>
                          </div>
                          <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
                       </a>
                       <a href="#" className="flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200 group">
                          <div>
                             <h4 className="font-bold text-slate-800 group-hover:text-indigo-700 transition-colors">eSafety Commissioner</h4>
                             <p className="text-xs text-slate-500">Report serious cyberbullying & abuse</p>
                          </div>
                          <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
                       </a>
                       <a href="#" className="flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200 group">
                          <div>
                             <h4 className="font-bold text-slate-800 group-hover:text-indigo-700 transition-colors">ACECQA Child Safe Standards</h4>
                             <p className="text-xs text-slate-500">National principles alignment document</p>
                          </div>
                          <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
                       </a>
                    </div>
                 </div>
              </div>
           </div>
        ) : (
           <div className="bg-white border border-slate-200 rounded-3xl p-12 shadow-sm text-center flex flex-col items-center max-w-2xl mx-auto mt-10">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                 <Lock className="w-10 h-10 text-slate-300" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-3">Secure Encrypted Vault</h2>
              <p className="text-slate-500 font-medium text-sm mb-8 max-w-md">Child protection notes are highly sensitive. This vault requires re-authentication and is heavily encrypted. Access is strictly audited.</p>
              
              <button 
                 onClick={() => toast.error("Hardware key required to unlock vault in demo mode.")}
                 className="px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-lg"
              >
                 Unlock Vault
              </button>
           </div>
        )}

      </div>
    </div>
  );
};
