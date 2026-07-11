import React, { useState } from 'react';
import { DbUser } from '../services/types';
import { 
  BookOpen, CheckCircle, FileSignature, AlertCircle, 
  Users, Key
} from 'lucide-react';
import toast from 'react-hot-toast';

interface CodeOfConductProps {
  user?: DbUser | null;
}

export const CodeOfConduct: React.FC<CodeOfConductProps> = ({ user }) => {
  const [signature, setSignature] = useState('');
  const [signed, setSigned] = useState(false);

  const handleSign = () => {
    if (!signature.trim()) {
      toast.error('Please type your name to sign.');
      return;
    }
    setSigned(true);
    toast.success('Code of Conduct signed successfully.');
  };

  const staffCompletion = [
    { name: 'Sarah Jenkins', role: 'Lead Educator', completed: true, date: 'Oct 10, 2025' },
    { name: 'Michael Oak', role: 'Educator', completed: true, date: 'Oct 11, 2025' },
    { name: 'Emma Rose', role: 'Trainee', completed: false, date: '-' },
    { name: 'Liam Hughes', role: 'Chef', completed: true, date: 'Oct 12, 2025' },
  ];

  return (
    <div className="h-full w-full bg-slate-50 flex flex-col p-6 md:p-10 overflow-y-auto">
      <div className="max-w-6xl mx-auto w-full space-y-8">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-white p-6 rounded-[2rem] shadow-sm border border-slate-200">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-violet-50 text-violet-700 rounded-2xl flex items-center justify-center">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Code of Conduct</h1>
                <p className="text-slate-500 font-medium mt-1">Professional standards, ethics, and digital sign-offs.</p>
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Document Content */}
          <div className="lg:col-span-2 space-y-6">
             <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-1.5 bg-violet-500"></div>
                <h2 className="text-2xl font-black text-slate-900 mb-6">Staff Code of Conduct & Ethics</h2>
                
                <div className="space-y-6 text-slate-700 font-medium leading-relaxed">
                   <section>
                      <h3 className="text-lg font-bold text-violet-900 mb-2 flex items-center gap-2"><Key className="w-5 h-5"/> Core Values</h3>
                      <p>As educators, we hold a unique position of trust. Our primary responsibility is the safety, welfare, and wellbeing of the children in our care. We must act with integrity, respect, and professionalism at all times.</p>
                   </section>
                   <section>
                      <h3 className="text-lg font-bold text-violet-900 mb-2 flex items-center gap-2"><Users className="w-5 h-5"/> Interactions with Children</h3>
                      <p>All interactions must be respectful, positive, and affirming. Physical contact must always be appropriate and purely for the child's care, comfort, or safety. Shouting, belittling, or punitive discipline is strictly prohibited.</p>
                   </section>
                   <section>
                      <h3 className="text-lg font-bold text-violet-900 mb-2 flex items-center gap-2"><AlertCircle className="w-5 h-5"/> Conflict of Interest</h3>
                      <p>Staff must declare any conflict of interest, including secondary employment, babysitting arrangements with enrolled families, or accepting gifts beyond nominal value.</p>
                   </section>
                </div>

                <div className="mt-8 pt-8 border-t border-slate-100 bg-slate-50 p-6 rounded-2xl">
                   {signed ? (
                      <div className="flex items-center gap-4 text-emerald-700">
                         <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                            <CheckCircle className="w-6 h-6" />
                         </div>
                         <div>
                            <p className="font-bold text-lg">You have signed the Code of Conduct</p>
                            <p className="text-sm">Signed as <span className="font-bold underline">{signature}</span> on {new Date().toLocaleDateString()}</p>
                         </div>
                      </div>
                   ) : (
                      <>
                         <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2"><FileSignature className="w-5 h-5 text-violet-600"/> Digital Sign-off</h3>
                         <p className="text-sm text-slate-500 mb-4">By typing your name below, you acknowledge that you have read, understood, and will abide by the Code of Conduct.</p>
                         <div className="flex flex-col sm:flex-row gap-3">
                            <input 
                               type="text" 
                               value={signature}
                               onChange={(e) => setSignature(e.target.value)}
                               placeholder="Type your full name..."
                               className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all font-medium"
                            />
                            <button 
                               onClick={handleSign}
                               className="px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl transition-colors shrink-0"
                            >
                               I Agree
                            </button>
                         </div>
                      </>
                   )}
                </div>
             </div>
          </div>

          {/* Tracker Dashboard */}
          <div className="lg:col-span-1">
             <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm sticky top-6">
                <h3 className="font-bold text-slate-900 text-lg mb-6">Staff Completion</h3>
                
                <div className="mb-6">
                   <div className="flex justify-between text-sm font-bold mb-2">
                      <span className="text-slate-500">Compliance Rate</span>
                      <span className="text-violet-700">75%</span>
                   </div>
                   <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-violet-500 rounded-full" style={{ width: '75%' }}></div>
                   </div>
                </div>

                <div className="space-y-3">
                   {staffCompletion.map((staff, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50">
                         <div>
                            <p className="font-bold text-slate-800 text-sm">{staff.name}</p>
                            <p className="text-xs text-slate-500">{staff.role}</p>
                         </div>
                         {staff.completed ? (
                            <div className="text-right">
                               <CheckCircle className="w-5 h-5 text-emerald-500 ml-auto mb-0.5" />
                               <span className="text-[10px] uppercase font-bold text-slate-400">{staff.date}</span>
                            </div>
                         ) : (
                            <button type="button" onClick={() => toast.success(`Reminder queued for ${staff.name}`)} className="px-3 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 text-xs font-bold rounded-lg transition-colors border border-rose-100">
                               Remind
                            </button>
                         )}
                      </div>
                   ))}
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};
