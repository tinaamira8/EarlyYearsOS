import React, { useState } from 'react';
import { Map, Plus, Maximize2 } from 'lucide-react';

const rooms = [
  { id: 1, label: 'Babies Room', x: 5, y: 5, w: 30, h: 25, color: 'bg-pink-100 border-pink-300', capacity: 10, enrolled: 8 },
  { id: 2, label: 'Toddlers Room', x: 37, y: 5, w: 30, h: 25, color: 'bg-blue-100 border-blue-300', capacity: 15, enrolled: 12 },
  { id: 3, label: 'Pre-Kindy Room', x: 5, y: 33, w: 62, h: 28, color: 'bg-green-100 border-green-300', capacity: 25, enrolled: 22 },
  { id: 4, label: 'Office', x: 69, y: 5, w: 25, h: 12, color: 'bg-slate-100 border-slate-300', capacity: null, enrolled: null },
  { id: 5, label: 'Staff Room', x: 69, y: 19, w: 25, h: 12, color: 'bg-amber-100 border-amber-300', capacity: null, enrolled: null },
  { id: 6, label: 'Kitchen', x: 69, y: 33, w: 25, h: 14, color: 'bg-orange-100 border-orange-300', capacity: null, enrolled: null },
  { id: 7, label: 'Bathrooms', x: 69, y: 49, w: 25, h: 12, color: 'bg-cyan-100 border-cyan-300', capacity: null, enrolled: null },
  { id: 8, label: 'Outdoor Play Area', x: 5, y: 63, w: 89, h: 30, color: 'bg-emerald-100 border-emerald-300', capacity: null, enrolled: null },
];

export const FloorPlan: React.FC = () => {
  const [selected, setSelected] = useState<number | null>(null);
  const sel = rooms.find(r => r.id === selected);

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
            <Map className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Centre Floor Plan</h1>
            <p className="text-slate-500 text-sm">Interactive room layout and occupancy</p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex-1 bg-white rounded-2xl border border-slate-200 p-4 overflow-hidden">
            <div className="relative w-full" style={{ paddingBottom: '65%' }}>
              <div className="absolute inset-0 bg-slate-50 rounded-xl border-2 border-slate-200">
                {rooms.map(room => (
                  <button
                    key={room.id}
                    onClick={() => setSelected(selected === room.id ? null : room.id)}
                    className={`absolute border-2 rounded-lg flex flex-col items-center justify-center text-center transition-all ${room.color} ${selected === room.id ? 'ring-2 ring-indigo-400 ring-offset-1 shadow-md' : 'hover:opacity-90'}`}
                    style={{ left: `${room.x}%`, top: `${room.y}%`, width: `${room.w}%`, height: `${room.h}%` }}
                  >
                    <span className="text-xs font-semibold text-slate-700 leading-tight px-1">{room.label}</span>
                    {room.capacity && <span className="text-[10px] text-slate-500 mt-0.5">{room.enrolled}/{room.capacity}</span>}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="w-56 space-y-3">
            {sel ? (
              <div className="bg-white rounded-xl border border-slate-100 p-4">
                <h3 className="font-semibold text-slate-800 mb-2">{sel.label}</h3>
                {sel.capacity ? (
                  <>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between"><span className="text-slate-500">Capacity</span><span className="font-medium">{sel.capacity}</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">Enrolled</span><span className="font-medium text-indigo-600">{sel.enrolled}</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">Occupancy</span><span className="font-medium">{Math.round((sel.enrolled! / sel.capacity) * 100)}%</span></div>
                    </div>
                    <div className="bg-slate-100 rounded-full h-2 mt-3">
                      <div className="bg-indigo-400 h-2 rounded-full" style={{ width: `${(sel.enrolled! / sel.capacity) * 100}%` }} />
                    </div>
                  </>
                ) : <p className="text-sm text-slate-500">Support space — no enrolment data.</p>}
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-slate-100 p-4">
                <p className="text-xs text-slate-400 text-center">Click a room to see details</p>
              </div>
            )}
            <div className="bg-white rounded-xl border border-slate-100 p-4 space-y-2">
              <h4 className="text-xs font-semibold text-slate-600">Room Legend</h4>
              {[
                { label: 'Babies Room', color: 'bg-pink-200' },
                { label: 'Toddlers Room', color: 'bg-blue-200' },
                { label: 'Pre-Kindy Room', color: 'bg-green-200' },
                { label: 'Outdoor Area', color: 'bg-emerald-200' },
                { label: 'Support Spaces', color: 'bg-slate-200' },
              ].map(l => (
                <div key={l.label} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded ${l.color}`} />
                  <span className="text-xs text-slate-600">{l.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
