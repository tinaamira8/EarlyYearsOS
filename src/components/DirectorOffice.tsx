import React, { useState } from 'react';
import { Briefcase, CheckCircle, AlertTriangle, Calendar } from 'lucide-react';

const tasks = [
  { id: 1, title: 'Review Mark Chen WWCC renewal', priority: 'High', due: '2026-06-20', status: 'Pending' },
  { id: 2, title: 'Approve June staff roster', priority: 'High', due: '2026-05-30', status: 'Pending' },
  { id: 3, title: 'Update anaphylaxis plan for Leo', priority: 'High', due: '2026-05-28', status: 'In Progress' },
  { id: 4, title: 'Parent meeting with Kim family', priority: 'Medium', due: '2026-06-02', status: 'Pending' },
  { id: 5, title: 'Policy review — Social Media policy', priority: 'Medium', due: '2026-06-01', status: 'Pending' },
  { id: 6, title: 'Submit quarterly report to DET', priority: 'Low', due: '2026-06-30', status: 'Not Started' },
];

const events = [
  { date: 'Today', event: 'Staff meeting @ 3:30pm' },
  { date: 'Tomorrow', event: 'Fire drill 10:00am' },
  { date: '28 May', event: 'Mia Johnson 3-month review' },
  { date: '2 June', event: 'Parent information night' },
];

interface DirectorOfficeProps { user?: any; }

export const DirectorOffice: React.FC<DirectorOfficeProps> = ({ user }) => {
  const [taskList, setTaskList] = useState(tasks);
  const pending = taskList.filter(t => t.status === 'Pending' || t.status === 'In Progress').length;

  const complete = (id: number) => setTaskList(t => t.map(task => task.id === id ? { ...task, status: 'Completed' } : task));

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Director's Office</h1>
            <p className="text-slate-500 text-sm">Your hub for tasks, approvals, and priorities</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-slate-100 p-4 text-center">
            <div className="text-2xl font-bold text-amber-600">{pending}</div>
            <div className="text-xs text-slate-500">Pending Tasks</div>
          </div>
          <div className="bg-white rounded-xl border border-slate-100 p-4 text-center">
            <div className="text-2xl font-bold text-red-600">2</div>
            <div className="text-xs text-slate-500">Compliance Alerts</div>
          </div>
          <div className="bg-white rounded-xl border border-slate-100 p-4 text-center">
            <div className="text-2xl font-bold text-indigo-600">3</div>
            <div className="text-xs text-slate-500">Unread Messages</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 bg-white rounded-xl border border-slate-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-semibold text-slate-800">Action Items</h3>
              <span className="text-xs text-slate-400">{taskList.filter(t => t.status === 'Completed').length} of {taskList.length} done</span>
            </div>
            <div className="divide-y divide-slate-100">
              {taskList.map(t => (
                <div key={t.id} className={`flex items-center gap-3 px-5 py-3 ${t.status === 'Completed' ? 'opacity-50' : ''}`}>
                  <button onClick={() => complete(t.id)} className="flex-shrink-0">
                    <CheckCircle className={`w-5 h-5 ${t.status === 'Completed' ? 'text-emerald-500' : 'text-slate-200 hover:text-emerald-400'}`} />
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${t.status === 'Completed' ? 'line-through text-slate-400' : 'text-slate-800'}`}>{t.title}</p>
                    <p className="text-xs text-slate-400">Due: {t.due}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${t.priority === 'High' ? 'bg-red-100 text-red-700' : t.priority === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>{t.priority}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-slate-100 p-4">
              <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2"><Calendar className="w-4 h-4 text-slate-400" /> Upcoming</h3>
              <div className="space-y-2">
                {events.map((e, i) => (
                  <div key={i} className="flex gap-3">
                    <span className="text-xs font-medium text-indigo-600 w-16 flex-shrink-0">{e.date}</span>
                    <span className="text-xs text-slate-600">{e.event}</span>
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
