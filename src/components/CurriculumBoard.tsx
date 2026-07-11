import React, { useState } from 'react';
import { LayoutGrid, Plus, ArrowRight } from 'lucide-react';

const initialItems = {
  planning: [
    { id: 1, title: 'Colour and Light Science Unit', ageGroup: 'Pre-Kindy', outcome: 'Outcome 4', duration: '2 weeks' },
    { id: 2, title: 'Community Helpers Project', ageGroup: 'Toddlers', outcome: 'Outcome 2', duration: '1 week' },
    { id: 7, title: 'Under the Sea Exploration', ageGroup: 'Pre-Kindy', outcome: 'Outcome 4', duration: '2 weeks' },
    { id: 8, title: 'My Body, My Feelings', ageGroup: 'Toddlers', outcome: 'Outcome 3', duration: '1 week' },
    { id: 9, title: 'Aboriginal Dreamtime Stories', ageGroup: 'All rooms', outcome: 'Outcome 2', duration: '3 weeks' },
    { id: 10, title: 'Farm Animals & Their Sounds', ageGroup: 'Babies', outcome: 'Outcome 5', duration: '1 week' },
    { id: 11, title: 'Recycling & Caring for Earth', ageGroup: 'Pre-Kindy', outcome: 'Outcome 2', duration: '2 weeks' },
    { id: 12, title: 'Musical Instruments Discovery', ageGroup: 'Toddlers', outcome: 'Outcome 5', duration: '1 week' },
  ],
  inProgress: [
    { id: 3, title: 'Bugs and Mini-Beasts Inquiry', ageGroup: 'Pre-Kindy', outcome: 'Outcomes 1,4', duration: '3 weeks' },
    { id: 4, title: 'Emotions and Feelings Unit', ageGroup: 'All rooms', outcome: 'Outcome 3', duration: '2 weeks' },
    { id: 13, title: 'Water Play Science', ageGroup: 'Toddlers', outcome: 'Outcome 4', duration: '2 weeks' },
    { id: 14, title: 'Our Families & Cultures', ageGroup: 'All rooms', outcome: 'Outcome 1', duration: '3 weeks' },
    { id: 15, title: 'Dinosaur Discovery Project', ageGroup: 'Pre-Kindy', outcome: 'Outcome 4', duration: '2 weeks' },
    { id: 16, title: 'Sensory Garden Planting', ageGroup: 'All rooms', outcome: 'Outcome 2', duration: '4 weeks' },
    { id: 17, title: 'Letter of the Week', ageGroup: 'Pre-Kindy', outcome: 'Outcome 5', duration: 'Ongoing' },
    { id: 18, title: 'Cooking Together — Simple Recipes', ageGroup: 'Toddlers', outcome: 'Outcome 3', duration: '1 week' },
  ],
  completed: [
    { id: 5, title: 'Autumn Colours Art Project', ageGroup: 'All rooms', outcome: 'Outcome 5', duration: '1 week' },
    { id: 6, title: 'Family Trees Project', ageGroup: 'Pre-Kindy', outcome: 'Outcome 1', duration: '2 weeks' },
    { id: 19, title: 'Weather Watchers Journal', ageGroup: 'Pre-Kindy', outcome: 'Outcome 4', duration: '3 weeks' },
    { id: 20, title: 'Nursery Rhyme Weeks', ageGroup: 'Babies', outcome: 'Outcome 5', duration: '2 weeks' },
    { id: 21, title: 'Construction Zone — Building Big', ageGroup: 'Toddlers', outcome: 'Outcome 4', duration: '2 weeks' },
    { id: 22, title: 'Healthy Eating & Nutrition', ageGroup: 'All rooms', outcome: 'Outcome 3', duration: '1 week' },
    { id: 23, title: 'Kindness & Friendship Week', ageGroup: 'All rooms', outcome: 'Outcome 1', duration: '1 week' },
    { id: 24, title: 'Transport & Vehicles Project', ageGroup: 'Toddlers', outcome: 'Outcome 4', duration: '2 weeks' },
    { id: 25, title: 'NAIDOC Week Celebrations', ageGroup: 'All rooms', outcome: 'Outcome 2', duration: '1 week' },
    { id: 26, title: 'Space & Planets Inquiry', ageGroup: 'Pre-Kindy', outcome: 'Outcomes 4,5', duration: '3 weeks' },
  ],
};

type Col = 'planning' | 'inProgress' | 'completed';

const colConfig: Record<Col, { label: string; color: string }> = {
  planning: { label: 'Planning', color: 'bg-slate-100 text-slate-700' },
  inProgress: { label: 'In Progress', color: 'bg-blue-100 text-blue-700' },
  completed: { label: 'Completed', color: 'bg-emerald-100 text-emerald-700' },
};

export const CurriculumBoard: React.FC = () => {
  const [items, setItems] = useState(initialItems);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', ageGroup: 'Pre-Kindy', outcome: 'Outcome 4', duration: '1 week' });

  const add = () => {
    if (!form.title) return;
    setItems(i => ({ ...i, planning: [...i.planning, { ...form, id: Date.now() }] }));
    setForm({ title: '', ageGroup: 'Pre-Kindy', outcome: 'Outcome 4', duration: '1 week' });
    setShowForm(false);
  };

  const moveNext = (col: Col, id: number) => {
    const nextCol: Record<Col, Col | null> = { planning: 'inProgress', inProgress: 'completed', completed: null };
    const next = nextCol[col];
    if (!next) return;
    const item = items[col].find(i => i.id === id)!;
    setItems(prev => ({ ...prev, [col]: prev[col].filter(i => i.id !== id), [next]: [...prev[next], item] }));
  };

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
            <LayoutGrid className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1"><h1 className="text-2xl font-bold text-slate-800">Curriculum Board</h1>
            <p className="text-slate-500 text-sm">Kanban-style curriculum planning</p></div>
          <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-indigo-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-indigo-700">
            <Plus className="w-4 h-4" /> Add Activity
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2"><label className="text-xs text-slate-500 mb-1 block">Title</label>
                <input className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} /></div>
              <div><label className="text-xs text-slate-500 mb-1 block">Age Group</label>
                <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" value={form.ageGroup} onChange={e => setForm(f => ({ ...f, ageGroup: e.target.value }))}>
                  {['Babies', 'Toddlers', 'Pre-Kindy', 'All rooms'].map(a => <option key={a}>{a}</option>)}
                </select></div>
              <div><label className="text-xs text-slate-500 mb-1 block">EYLF Outcome</label>
                <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" value={form.outcome} onChange={e => setForm(f => ({ ...f, outcome: e.target.value }))}>
                  {['Outcome 1', 'Outcome 2', 'Outcome 3', 'Outcome 4', 'Outcome 5'].map(o => <option key={o}>{o}</option>)}
                </select></div>
            </div>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setShowForm(false)} className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg">Cancel</button>
              <button onClick={add} className="px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-lg">Add</button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-3 gap-4">
          {(Object.keys(colConfig) as Col[]).map(col => (
            <div key={col} className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${colConfig[col].color}`}>{colConfig[col].label}</span>
                <span className="text-xs text-slate-400">{items[col].length}</span>
              </div>
              <div className="space-y-2 min-h-16">
                {items[col].map(item => (
                  <div key={item.id} className="bg-white rounded-xl border border-slate-100 p-3 shadow-sm">
                    <p className="text-sm font-medium text-slate-800">{item.title}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-xs bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded">{item.ageGroup}</span>
                      <span className="text-xs bg-green-50 text-green-600 px-1.5 py-0.5 rounded">{item.outcome}</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{item.duration}</p>
                    {col !== 'completed' && (
                      <button onClick={() => moveNext(col, item.id)} className="mt-2 text-xs text-indigo-600 flex items-center gap-1 hover:underline">
                        Move <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
