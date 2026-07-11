import React, { useState } from 'react';
import { BookOpen, CheckCircle, AlertTriangle } from 'lucide-react';

const modules = ['Child Protection', 'First Aid', 'CPR', 'Anaphylaxis Management', 'Asthma Management', 'Food Safety', 'Emergency Evacuation', 'Work Health & Safety'];
const staff = ['Sarah Johnson', 'Mark Chen', 'Amy Davis', 'James Park', 'Jessica Turner'];

const generateMatrix = () => {
  return staff.map(name => ({
    name,
    completions: modules.map((_, i) => {
      if (Math.random() > 0.3) {
        const d = new Date();
        d.setMonth(d.getMonth() - Math.floor(Math.random() * 18));
        return d.toISOString().split('T')[0];
      }
      return null;
    }),
  }));
};

const matrix = generateMatrix();

export const RequiredTraining: React.FC = () => {
  const today = new Date();
  const isOverdue = (date: string | null) => !date;

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Required Training</h1>
            <p className="text-slate-500 text-sm">Mandatory training compliance matrix</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-100 overflow-x-auto">
          <table className="text-xs min-w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left px-4 py-3 text-slate-600 font-semibold min-w-[140px]">Staff Member</th>
                {modules.map(m => (
                  <th key={m} className="px-2 py-3 text-slate-500 font-medium text-center" style={{ minWidth: '90px' }}>
                    <div className="writing-mode-vertical" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', height: '80px', display: 'flex', alignItems: 'center' }}>{m}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {matrix.map((row, ri) => (
                <tr key={ri} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-800">{row.name}</td>
                  {row.completions.map((date, ci) => (
                    <td key={ci} className="px-2 py-3 text-center">
                      {date ? (
                        <div className="flex flex-col items-center">
                          <CheckCircle className="w-4 h-4 text-emerald-500" />
                          <span className="text-slate-400 text-[10px] mt-0.5">{date.substring(2)}</span>
                        </div>
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-red-400 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Completed (date shown)</div>
          <div className="flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5 text-red-400" /> Not completed / Overdue</div>
        </div>
      </div>
    </div>
  );
};
