import React, { useState } from 'react';
import { Clock, Plus, Trash2 } from 'lucide-react';
import { usePersistedState } from '../hooks/usePersistedState';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const rooms = ['Babies (0-2)', 'Toddlers (2-3)', 'Pre-Kindy (3-5)'];
const defaultActivities: Record<string, Record<string, string>> = {
  '7:00': { 'Babies (0-2)': 'Arrival & Free Play', 'Toddlers (2-3)': 'Arrival & Exploration', 'Pre-Kindy (3-5)': 'Arrival & Choice Play' },
  '8:00': { 'Babies (0-2)': 'Bottle / Breakfast', 'Toddlers (2-3)': 'Breakfast', 'Pre-Kindy (3-5)': 'Breakfast' },
  '9:00': { 'Babies (0-2)': 'Sensory Play', 'Toddlers (2-3)': 'Group Time / Songs', 'Pre-Kindy (3-5)': 'Morning Meeting & Learning' },
  '10:00': { 'Babies (0-2)': 'Morning Sleep', 'Toddlers (2-3)': 'Outdoor Play', 'Pre-Kindy (3-5)': 'Outdoor Learning' },
  '11:30': { 'Babies (0-2)': 'Bottle / Lunch', 'Toddlers (2-3)': 'Lunch', 'Pre-Kindy (3-5)': 'Lunch' },
  '12:00': { 'Babies (0-2)': 'Sleep', 'Toddlers (2-3)': 'Rest Time', 'Pre-Kindy (3-5)': 'Quiet Reading / Rest' },
  '14:00': { 'Babies (0-2)': 'Wake & Play', 'Toddlers (2-3)': 'Afternoon Snack', 'Pre-Kindy (3-5)': 'Afternoon Snack' },
  '15:00': { 'Babies (0-2)': 'Tummy Time / Story', 'Toddlers (2-3)': 'Creative Arts', 'Pre-Kindy (3-5)': 'Project Work' },
  '16:00': { 'Babies (0-2)': 'Free Play & Departures', 'Toddlers (2-3)': 'Outdoor Play & Departures', 'Pre-Kindy (3-5)': 'Free Choice & Departures' },
};

export const RoutineManager: React.FC = () => {
  const [selectedRoom, setSelectedRoom] = useState(rooms[1]);
  const [editing, setEditing] = useState<{ time: string; value: string } | null>(null);
  const [activities, setActivities] = usePersistedState('routine_activities', defaultActivities);

  const save = () => {
    if (!editing) return;
    setActivities(a => ({ ...a, [editing.time]: { ...a[editing.time], [selectedRoom]: editing.value } }));
    setEditing(null);
  };

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center">
            <Clock className="w-5 h-5 text-teal-600" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-slate-800">Routine Manager</h1>
            <p className="text-slate-500 text-sm">Daily schedule and routines by room</p>
          </div>
        </div>

        <div className="flex gap-2">
          {rooms.map(r => (
            <button key={r} onClick={() => setSelectedRoom(r)} className={`px-4 py-2 text-sm rounded-lg font-medium transition-colors ${selectedRoom === r ? 'bg-teal-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>{r}</button>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
          <div className="bg-teal-600 text-white px-4 py-3">
            <h3 className="font-semibold">{selectedRoom} — Daily Routine</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {Object.entries(activities).map(([time, roomActivities]) => (
              <div key={time} className="flex items-center px-4 py-3 hover:bg-slate-50 group">
                <div className="w-16 flex-shrink-0 text-sm font-mono font-semibold text-slate-500">{time}</div>
                <div className="flex-1">
                  {editing?.time === time ? (
                    <div className="flex gap-2">
                      <input className="flex-1 border border-slate-200 rounded px-2 py-1 text-sm" value={editing.value} onChange={e => setEditing({ time, value: e.target.value })} autoFocus onKeyDown={e => e.key === 'Enter' && save()} />
                      <button onClick={save} className="px-2 py-1 text-xs bg-teal-600 text-white rounded">Save</button>
                      <button onClick={() => setEditing(null)} className="px-2 py-1 text-xs border border-slate-200 rounded">Cancel</button>
                    </div>
                  ) : (
                    <span className="text-sm text-slate-700">{roomActivities[selectedRoom] || '-'}</span>
                  )}
                </div>
                <button onClick={() => setEditing({ time, value: roomActivities[selectedRoom] || '' })} className="opacity-0 group-hover:opacity-100 text-xs text-indigo-600 ml-2 transition-opacity">Edit</button>
              </div>
            ))}
          </div>
        </div>
        <p className="text-xs text-slate-400 text-center">Click "Edit" on any row to customise the routine. Changes apply to this session.</p>
      </div>
    </div>
  );
};
