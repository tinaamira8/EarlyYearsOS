import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { AppView } from '../types';

const navItems = [
  { label: 'Dashboard', view: 'DASHBOARD', group: 'Home' },
  { label: 'Reception Kiosk', view: 'RECEPTION', group: 'Home' },
  { label: 'Daily Care', view: 'DAILY_CARE', group: 'Children' },
  { label: 'Child Portfolio', view: 'CHILD_PORTFOLIO', group: 'Children' },
  { label: 'Medical Manager', view: 'MEDICAL_MANAGER', group: 'Children' },
  { label: 'Observations', view: 'OBSERVATION', group: 'Curriculum' },
  { label: 'Activity Planner', view: 'ACTIVITY_PLANNER', group: 'Curriculum' },
  { label: 'Routine Manager', view: 'ROUTINE_MANAGER', group: 'Curriculum' },
  { label: 'NQS Overview', view: 'NQS_OVERVIEW', group: 'Compliance' },
  { label: 'Risk Assessment', view: 'RISK_ASSESSMENT', group: 'Compliance' },
  { label: 'Incident Reports', view: 'INCIDENT_REPORTS', group: 'Compliance' },
  { label: 'Policy Portal', view: 'POLICY_PORTAL', group: 'Compliance' },
  { label: 'Staff Roster', view: 'STAFF_ROSTER', group: 'Staff' },
  { label: 'Staff Qualifications', view: 'STAFF_QUALIFICATIONS', group: 'Staff' },
  { label: 'PD Portfolio', view: 'PD_PORTFOLIO', group: 'Staff' },
  { label: 'Expense Tracker', view: 'EXPENSE_TRACKER', group: 'Finance' },
  { label: 'Invoicing System', view: 'INVOICING_SYSTEM', group: 'Finance' },
  { label: 'Maintenance Log', view: 'MAINTENANCE_LOG', group: 'Operations' },
  { label: 'Inventory Manager', view: 'INVENTORY', group: 'Operations' },
  { label: 'Newsletter Generator', view: 'NEWSLETTER', group: 'Community' },
  { label: 'User Settings', view: 'USER_SETTINGS', group: 'Admin' },
];

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: AppView) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, onNavigate }) => {
  const [query, setQuery] = useState('');
  if (!isOpen) return null;

  const filtered = query ? navItems.filter(i => i.label.toLowerCase().includes(query.toLowerCase()) || i.group.toLowerCase().includes(query.toLowerCase())) : navItems.slice(0, 8);

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center pt-24 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100">
          <Search className="w-5 h-5 text-slate-400 flex-shrink-0" />
          <input autoFocus className="flex-1 text-slate-800 placeholder-slate-400 text-sm outline-none" placeholder="Search sections..." value={query} onChange={e => setQuery(e.target.value)} />
          <button onClick={onClose}><X className="w-4 h-4 text-slate-400 hover:text-slate-600" /></button>
        </div>
        <div className="max-h-80 overflow-y-auto p-2">
          {filtered.length === 0 && <p className="text-sm text-slate-400 text-center py-6">No results for "{query}"</p>}
          {filtered.map(item => (
            <button key={item.view} onClick={() => { onNavigate(item.view as AppView); onClose(); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-indigo-50 text-left transition-colors">
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-800">{item.label}</p>
                <p className="text-xs text-slate-400">{item.group}</p>
              </div>
              <span className="text-xs text-slate-300">↵</span>
            </button>
          ))}
        </div>
        <div className="px-4 py-2 border-t border-slate-100 flex gap-3 text-xs text-slate-400">
          <span>↵ Navigate</span><span>Esc Close</span>
        </div>
      </div>
    </div>
  );
};
