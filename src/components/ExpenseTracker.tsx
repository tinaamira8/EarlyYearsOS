import React, { useState } from 'react';
import { DollarSign, Plus, TrendingUp } from 'lucide-react';
import { usePersistedState } from '../hooks/usePersistedState';

type Month = { name: string; budget: number; actual: number };
const months: Month[] = [
  { name: 'Jan', budget: 42000, actual: 39800 },
  { name: 'Feb', budget: 42000, actual: 41200 },
  { name: 'Mar', budget: 42000, actual: 43100 },
  { name: 'Apr', budget: 42000, actual: 40500 },
  { name: 'May', budget: 42000, actual: 38900 },
];

const categories = ['Staff', 'Food & Catering', 'Supplies & Materials', 'Maintenance', 'Marketing', 'Admin & IT', 'Insurance', 'Utilities'];

const initialExpenses = [
  { id: 1, date: '2026-05-20', category: 'Food & Catering', description: 'Weekly catering order', amount: 680, supplier: 'Fresh Eats Co.' },
  { id: 2, date: '2026-05-19', category: 'Supplies & Materials', description: 'Art supplies restock', amount: 245, supplier: 'Officeworks' },
  { id: 3, date: '2026-05-15', category: 'Maintenance', description: 'Garden fence repair', amount: 450, supplier: 'Fencing Pro' },
  { id: 4, date: '2026-05-10', category: 'Marketing', description: 'Facebook ad campaign', amount: 150, supplier: 'Meta' },
];

export const ExpenseTracker: React.FC = () => {
  const [expenses, setExpenses] = usePersistedState('expenses', initialExpenses);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ date: new Date().toISOString().split('T')[0], category: 'Supplies & Materials', description: '', amount: '', supplier: '' });
  const total = expenses.reduce((s, e) => s + e.amount, 0);
  const max = Math.max(...months.map(m => Math.max(m.budget, m.actual)));

  const add = () => {
    if (!form.description || !form.amount) return;
    setExpenses(e => [...e, { ...form, id: Date.now(), amount: +form.amount }]);
    setForm({ date: new Date().toISOString().split('T')[0], category: 'Supplies & Materials', description: '', amount: '', supplier: '' });
    setShowForm(false);
  };

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-green-600" />
          </div>
          <div className="flex-1"><h1 className="text-2xl font-bold text-slate-800">Expense Tracker</h1>
            <p className="text-slate-500 text-sm">Monthly centre expenses vs budget</p></div>
          <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-indigo-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-indigo-700">
            <Plus className="w-4 h-4" /> Add Expense
          </button>
        </div>

        <div className="bg-white rounded-xl border border-slate-100 p-5">
          <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-slate-400" /> Budget vs Actual (2026)</h3>
          <div className="space-y-3">
            {months.map(m => (
              <div key={m.name}>
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                  <span className="font-medium">{m.name}</span>
                  <span>${m.actual.toLocaleString()} / ${m.budget.toLocaleString()}</span>
                </div>
                <div className="space-y-1">
                  <div className="bg-slate-100 rounded-full h-2"><div className="bg-slate-300 h-2 rounded-full" style={{ width: `${(m.budget / max) * 100}%` }} /></div>
                  <div className="bg-slate-100 rounded-full h-2"><div className={`h-2 rounded-full ${m.actual > m.budget ? 'bg-red-400' : 'bg-emerald-400'}`} style={{ width: `${(m.actual / max) * 100}%` }} /></div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-4 mt-3 text-xs"><div className="flex items-center gap-1"><span className="w-3 h-1.5 bg-slate-300 rounded inline-block" /> Budget</div><div className="flex items-center gap-1"><span className="w-3 h-1.5 bg-emerald-400 rounded inline-block" /> Actual</div></div>
        </div>

        {showForm && (
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-xs text-slate-500 mb-1 block">Date</label>
                <input type="date" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} /></div>
              <div><label className="text-xs text-slate-500 mb-1 block">Category</label>
                <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                  {categories.map(c => <option key={c}>{c}</option>)}
                </select></div>
              <div><label className="text-xs text-slate-500 mb-1 block">Description</label>
                <input className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></div>
              <div><label className="text-xs text-slate-500 mb-1 block">Amount ($)</label>
                <input type="number" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} /></div>
            </div>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm border border-slate-200 rounded-lg">Cancel</button>
              <button onClick={add} className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg">Add</button>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-semibold text-slate-800">Recent Expenses</h3>
            <span className="text-sm font-bold text-slate-700">Total: ${total.toLocaleString()}</span>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs text-slate-500 uppercase">
              <tr>
                <th className="text-left px-4 py-3">Date</th>
                <th className="text-left px-4 py-3">Category</th>
                <th className="text-left px-4 py-3">Description</th>
                <th className="text-left px-4 py-3">Supplier</th>
                <th className="text-right px-4 py-3">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {expenses.map(e => (
                <tr key={e.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-slate-600">{e.date}</td>
                  <td className="px-4 py-3"><span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">{e.category}</span></td>
                  <td className="px-4 py-3 text-slate-700">{e.description}</td>
                  <td className="px-4 py-3 text-slate-500">{e.supplier}</td>
                  <td className="px-4 py-3 text-right font-semibold text-slate-800">${e.amount.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
