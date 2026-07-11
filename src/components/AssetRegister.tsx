import React, { useState } from 'react';
import { Package, Plus, AlertTriangle } from 'lucide-react';
import { usePersistedState } from '../hooks/usePersistedState';

const initialAssets = [
  { id: 1, name: 'Commercial Dishwasher', category: 'Kitchen Equipment', serial: 'DW-2019-4421', location: 'Kitchen', purchased: '2019-03-15', value: 3200, condition: 'Good', nextService: '2026-09-01' },
  { id: 2, name: 'Air Conditioner (Babies Room)', category: 'HVAC', serial: 'AC-HR-8832', location: 'Babies Room', purchased: '2021-11-20', value: 2400, condition: 'Good', nextService: '2026-11-01' },
  { id: 3, name: 'Outdoor Shade Sail (East)', category: 'Outdoor', serial: 'N/A', location: 'Outdoor', purchased: '2020-08-10', value: 850, condition: 'Fair', nextService: '2026-06-01' },
  { id: 4, name: 'iPad (x3 set)', category: 'Technology', serial: 'APP-2023-SET', location: 'Pre-Kindy Room', purchased: '2023-02-01', value: 2100, condition: 'Good', nextService: 'N/A' },
  { id: 5, name: 'Water Play Table', category: 'Furniture', serial: 'N/A', location: 'Toddlers Room', purchased: '2022-05-15', value: 450, condition: 'Poor', nextService: 'N/A' },
  { id: 6, name: 'Emergency Generator', category: 'Safety', serial: 'GEN-2020-113', location: 'Utility Room', purchased: '2020-01-10', value: 5800, condition: 'Good', nextService: '2026-07-01' },
];

const conditionColors: Record<string, string> = { Good: 'bg-emerald-100 text-emerald-700', Fair: 'bg-amber-100 text-amber-700', Poor: 'bg-red-100 text-red-700' };

export const AssetRegister: React.FC = () => {
  const [assets, setAssets] = usePersistedState('asset_register', initialAssets);
  const [filter, setFilter] = useState('All');
  const [showAddAsset, setShowAddAsset] = useState(false);
  const [newAsset, setNewAsset] = useState({ name: '', category: 'Equipment', serial: '', location: '', value: 0 });
  const categories = ['All', ...Array.from(new Set(assets.map(a => a.category)))];
  const filtered = filter === 'All' ? assets : assets.filter(a => a.category === filter);
  const totalValue = assets.reduce((s, a) => s + a.value, 0);
  const poorCondition = assets.filter(a => a.condition === 'Poor').length;

  const addAsset = (event: React.FormEvent) => {
    event.preventDefault();
    setAssets(current => [...current, {
      ...newAsset,
      id: Date.now(),
      purchased: new Date().toISOString().slice(0, 10),
      condition: 'Good',
      nextService: 'N/A',
    }]);
    setNewAsset({ name: '', category: 'Equipment', serial: '', location: '', value: 0 });
    setShowAddAsset(false);
    setFilter('All');
  };

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-200 rounded-xl flex items-center justify-center">
            <Package className="w-5 h-5 text-slate-600" />
          </div>
          <div className="flex-1"><h1 className="text-2xl font-bold text-slate-800">Asset Register</h1>
            <p className="text-slate-500 text-sm">Track centre assets, condition, and service schedules</p></div>
          <button type="button" onClick={() => setShowAddAsset(true)} className="flex items-center gap-2 bg-indigo-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-indigo-700">
            <Plus className="w-4 h-4" /> Add Asset
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-slate-100 p-4 text-center">
            <div className="text-2xl font-bold text-slate-800">{assets.length}</div>
            <div className="text-xs text-slate-500">Total Assets Registered</div>
          </div>
          <div className="bg-white rounded-xl border border-slate-100 p-4 text-center">
            <div className="text-2xl font-bold text-indigo-600">${totalValue.toLocaleString()}</div>
            <div className="text-xs text-slate-500">Total Estimated Value</div>
          </div>
          <div className={`rounded-xl border p-4 text-center ${poorCondition > 0 ? 'bg-red-50 border-red-100' : 'bg-emerald-50 border-emerald-100'}`}>
            <div className={`text-2xl font-bold ${poorCondition > 0 ? 'text-red-600' : 'text-emerald-600'}`}>{poorCondition}</div>
            <div className="text-xs text-slate-500">Assets in Poor Condition</div>
          </div>
        </div>

        {poorCondition > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />
            <p className="text-sm text-amber-700">{poorCondition} asset(s) in poor condition require attention or replacement.</p>
          </div>
        )}

        <div className="flex gap-2 flex-wrap">
          {categories.map(c => <button key={c} onClick={() => setFilter(c)} className={`px-3 py-1.5 text-xs rounded-lg font-medium ${filter === c ? 'bg-slate-700 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}>{c}</button>)}
        </div>

        <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs text-slate-500 uppercase">
              <tr>
                <th className="text-left px-4 py-3">Asset</th>
                <th className="text-left px-4 py-3">Category</th>
                <th className="text-left px-4 py-3">Location</th>
                <th className="text-left px-4 py-3">Purchased</th>
                <th className="text-right px-4 py-3">Value</th>
                <th className="text-left px-4 py-3">Condition</th>
                <th className="text-left px-4 py-3">Next Service</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(a => (
                <tr key={a.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3"><div className="font-medium text-slate-800">{a.name}</div><div className="text-xs text-slate-400 font-mono">{a.serial}</div></td>
                  <td className="px-4 py-3 text-slate-600">{a.category}</td>
                  <td className="px-4 py-3 text-slate-600">{a.location}</td>
                  <td className="px-4 py-3 text-slate-600">{a.purchased}</td>
                  <td className="px-4 py-3 text-right font-semibold text-slate-800">${a.value.toLocaleString()}</td>
                  <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${conditionColors[a.condition]}`}>{a.condition}</span></td>
                  <td className="px-4 py-3 text-slate-500 text-xs">{a.nextService}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {showAddAsset ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/50 p-4" role="dialog" aria-modal="true" aria-labelledby="add-asset-title">
          <form onSubmit={addAsset} className="w-full max-w-md space-y-4 rounded-2xl bg-white p-6 shadow-2xl">
            <h2 id="add-asset-title" className="text-xl font-bold text-slate-900">Add asset</h2>
            <input aria-label="Asset name" required value={newAsset.name} onChange={event => setNewAsset(asset => ({ ...asset, name: event.target.value }))} placeholder="Asset name" className="w-full rounded-lg border border-slate-200 px-3 py-2" />
            <div className="grid grid-cols-2 gap-3">
              <input aria-label="Asset category" required value={newAsset.category} onChange={event => setNewAsset(asset => ({ ...asset, category: event.target.value }))} placeholder="Category" className="rounded-lg border border-slate-200 px-3 py-2" />
              <input aria-label="Asset serial" value={newAsset.serial} onChange={event => setNewAsset(asset => ({ ...asset, serial: event.target.value }))} placeholder="Serial number" className="rounded-lg border border-slate-200 px-3 py-2" />
              <input aria-label="Asset location" required value={newAsset.location} onChange={event => setNewAsset(asset => ({ ...asset, location: event.target.value }))} placeholder="Location" className="rounded-lg border border-slate-200 px-3 py-2" />
              <input aria-label="Asset value" type="number" min="0" required value={newAsset.value} onChange={event => setNewAsset(asset => ({ ...asset, value: Number(event.target.value) }))} className="rounded-lg border border-slate-200 px-3 py-2" />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="flex-1 rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white">Add asset</button>
              <button type="button" onClick={() => setShowAddAsset(false)} className="rounded-lg border border-slate-200 px-4 py-2 text-slate-600">Cancel</button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
};
