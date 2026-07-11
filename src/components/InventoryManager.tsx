import React, { useState } from 'react';
import { Package, AlertTriangle, Plus } from 'lucide-react';
import { usePersistedState } from '../hooks/usePersistedState';

const initialItems = [
  { id: 1, name: 'Nappies (size 4)', category: 'Care', stock: 45, min: 30, unit: 'pcs' },
  { id: 2, name: 'Nappies (size 5)', category: 'Care', stock: 12, min: 30, unit: 'pcs' },
  { id: 3, name: 'Baby Wipes', category: 'Care', stock: 8, min: 10, unit: 'packs' },
  { id: 4, name: 'Sunscreen SPF50+', category: 'Health', stock: 3, min: 5, unit: 'bottles' },
  { id: 5, name: 'Hand Sanitiser', category: 'Hygiene', stock: 6, min: 4, unit: 'bottles' },
  { id: 6, name: 'Gloves (disposable)', category: 'Hygiene', stock: 120, min: 50, unit: 'pcs' },
  { id: 7, name: 'A4 Paper', category: 'Craft', stock: 5, min: 10, unit: 'reams' },
  { id: 8, name: 'Paint (acrylic)', category: 'Craft', stock: 2, min: 6, unit: 'sets' },
  { id: 9, name: 'Dishwashing Liquid', category: 'Cleaning', stock: 3, min: 2, unit: 'bottles' },
  { id: 10, name: 'Surface Spray', category: 'Cleaning', stock: 1, min: 3, unit: 'bottles' },
];

export const InventoryManager: React.FC = () => {
  const [items, setItems] = usePersistedState('inventory_items', initialItems);
  const [editing, setEditing] = useState<number | null>(null);
  const [editVal, setEditVal] = useState(0);
  const [filter, setFilter] = useState('All');
  const [showAddItem, setShowAddItem] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', category: 'Care', stock: 0, min: 0, unit: 'pcs' });
  const categories = ['All', ...Array.from(new Set(items.map(i => i.category)))];

  const filtered = filter === 'All' ? items : items.filter(i => i.category === filter);
  const lowStock = items.filter(i => i.stock < i.min).length;

  const saveEdit = (id: number) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, stock: editVal } : i));
    setEditing(null);
  };

  const addItem = (event: React.FormEvent) => {
    event.preventDefault();
    setItems(current => [...current, { ...newItem, id: Date.now() }]);
    setNewItem({ name: '', category: 'Care', stock: 0, min: 0, unit: 'pcs' });
    setShowAddItem(false);
    setFilter('All');
  };

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
            <Package className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="flex-1"><h1 className="text-2xl font-bold text-slate-800">Inventory Manager</h1>
            <p className="text-slate-500 text-sm">Track supplies and stock levels</p></div>
          <button type="button" onClick={() => setShowAddItem(true)} className="flex items-center gap-2 bg-indigo-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-indigo-700">
            <Plus className="w-4 h-4" /> Add Item
          </button>
        </div>

        {lowStock > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />
            <p className="text-sm text-amber-700">{lowStock} item{lowStock > 1 ? 's' : ''} below minimum stock level — reorder required.</p>
          </div>
        )}

        <div className="flex gap-2 flex-wrap">
          {categories.map(c => (
            <button key={c} onClick={() => setFilter(c)} className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-colors ${filter === c ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}>{c}</button>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs text-slate-500 uppercase">
              <tr>
                <th className="text-left px-4 py-3">Item</th>
                <th className="text-left px-4 py-3">Category</th>
                <th className="text-center px-4 py-3">Stock</th>
                <th className="text-center px-4 py-3">Min.</th>
                <th className="text-center px-4 py-3">Status</th>
                <th className="text-left px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(item => {
                const low = item.stock < item.min;
                return (
                  <tr key={item.id} className={`hover:bg-slate-50 ${low ? 'bg-red-50' : ''}`}>
                    <td className="px-4 py-3 font-medium text-slate-800">{item.name}</td>
                    <td className="px-4 py-3 text-slate-500">{item.category}</td>
                    <td className="px-4 py-3 text-center">
                      {editing === item.id ? (
                        <div className="flex items-center justify-center gap-1">
                          <input type="number" className="w-16 border border-slate-200 rounded px-2 py-0.5 text-sm text-center" value={editVal} onChange={e => setEditVal(+e.target.value)} />
                          <button onClick={() => saveEdit(item.id)} className="text-xs text-emerald-600 font-medium">✓</button>
                        </div>
                      ) : (
                        <span className={`font-semibold ${low ? 'text-red-600' : 'text-slate-800'}`}>{item.stock} {item.unit}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center text-slate-500">{item.min} {item.unit}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${low ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>{low ? 'Reorder' : 'OK'}</span>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => { setEditing(item.id); setEditVal(item.stock); }} className="text-xs text-indigo-600 hover:underline">Update Stock</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      {showAddItem ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/50 p-4" role="dialog" aria-modal="true" aria-labelledby="add-item-title">
          <form onSubmit={addItem} className="w-full max-w-md space-y-4 rounded-2xl bg-white p-6 shadow-2xl">
            <h2 id="add-item-title" className="text-xl font-bold text-slate-900">Add inventory item</h2>
            <input aria-label="Item name" required value={newItem.name} onChange={event => setNewItem(item => ({ ...item, name: event.target.value }))} placeholder="Item name" className="w-full rounded-lg border border-slate-200 px-3 py-2" />
            <div className="grid grid-cols-2 gap-3">
              <input aria-label="Category" required value={newItem.category} onChange={event => setNewItem(item => ({ ...item, category: event.target.value }))} placeholder="Category" className="rounded-lg border border-slate-200 px-3 py-2" />
              <input aria-label="Unit" required value={newItem.unit} onChange={event => setNewItem(item => ({ ...item, unit: event.target.value }))} placeholder="Unit" className="rounded-lg border border-slate-200 px-3 py-2" />
              <input aria-label="Current stock" type="number" min="0" required value={newItem.stock} onChange={event => setNewItem(item => ({ ...item, stock: Number(event.target.value) }))} className="rounded-lg border border-slate-200 px-3 py-2" />
              <input aria-label="Minimum stock" type="number" min="0" required value={newItem.min} onChange={event => setNewItem(item => ({ ...item, min: Number(event.target.value) }))} className="rounded-lg border border-slate-200 px-3 py-2" />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="flex-1 rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white">Add item</button>
              <button type="button" onClick={() => setShowAddItem(false)} className="rounded-lg border border-slate-200 px-4 py-2 text-slate-600">Cancel</button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
};
