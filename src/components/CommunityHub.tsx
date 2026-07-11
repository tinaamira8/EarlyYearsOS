import React, { useState } from 'react';
import { Users, Calendar, MessageSquare, Bell } from 'lucide-react';

const initialEvents = [
  { id: 1, title: 'Parent Information Night', date: '2026-06-02', time: '6:30 PM', type: 'Event', rsvps: 12, capacity: 30 },
  { id: 2, title: 'Community Playgroup', date: '2026-05-29', time: '9:30 AM', type: 'Playgroup', rsvps: 8, capacity: 15 },
  { id: 3, title: 'Father\'s Day Breakfast', date: '2026-09-04', time: '8:00 AM', type: 'Event', rsvps: 0, capacity: 40 },
  { id: 4, title: 'Kindergarten Transition Session', date: '2026-08-15', time: '10:00 AM', type: 'Transition', rsvps: 6, capacity: 10 },
];

const initialNotices = [
  { id: 1, title: 'Flu season reminder', date: '2026-05-20', audience: 'All Families', preview: 'As we enter flu season, please keep children home if they show symptoms...' },
  { id: 2, title: 'New parking arrangements', date: '2026-05-15', audience: 'All Families', preview: 'From 1 June, parking on Oak Street will be 2-minute drop-off only...' },
  { id: 3, title: 'Bee allergy alert — Toddlers Room', date: '2026-05-10', audience: 'Toddlers Families', preview: 'We have a new child with a bee allergy. Please read the attached care plan...' },
];

export const CommunityHub: React.FC = () => {
  const [tab, setTab] = useState<'events' | 'notices'>('events');
  const [events, setEvents] = useState(initialEvents);
  const [notices, setNotices] = useState(initialNotices);
  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState('');
  const [managing, setManaging] = useState<number | null>(null);
  const [expandedNotice, setExpandedNotice] = useState<number | null>(null);

  const createEntry = (event: React.FormEvent) => {
    event.preventDefault();
    if (tab === 'events') {
      setEvents(current => [...current, { id: Date.now(), title: title.trim(), date: new Date().toISOString().slice(0, 10), time: '9:00 AM', type: 'Event', rsvps: 0, capacity: 30 }]);
    } else {
      setNotices(current => [...current, { id: Date.now(), title: title.trim(), date: new Date().toISOString().slice(0, 10), audience: 'All Families', preview: 'New community notice.' }]);
    }
    setTitle('');
    setShowCreate(false);
  };

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center">
            <Users className="w-5 h-5 text-violet-600" />
          </div>
          <div className="flex-1"><h1 className="text-2xl font-bold text-slate-800">Community Hub</h1>
            <p className="text-slate-500 text-sm">Family events, notices and community connections</p></div>
          <button type="button" onClick={() => setShowCreate(true)} className="flex items-center gap-2 bg-violet-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-violet-700">+ New</button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-slate-100 p-4 text-center">
            <div className="text-2xl font-bold text-violet-600">{events.length}</div>
            <div className="text-xs text-slate-500">Upcoming Events</div>
          </div>
          <div className="bg-white rounded-xl border border-slate-100 p-4 text-center">
            <div className="text-2xl font-bold text-indigo-600">{events.reduce((s, e) => s + e.rsvps, 0)}</div>
            <div className="text-xs text-slate-500">Total RSVPs</div>
          </div>
          <div className="bg-white rounded-xl border border-slate-100 p-4 text-center">
            <div className="text-2xl font-bold text-emerald-600">{notices.length}</div>
            <div className="text-xs text-slate-500">Active Notices</div>
          </div>
        </div>

        <div className="flex gap-2">
          <button onClick={() => setTab('events')} className={`px-4 py-2 text-sm rounded-lg font-medium flex items-center gap-2 ${tab === 'events' ? 'bg-violet-600 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}><Calendar className="w-4 h-4" /> Events</button>
          <button onClick={() => setTab('notices')} className={`px-4 py-2 text-sm rounded-lg font-medium flex items-center gap-2 ${tab === 'notices' ? 'bg-violet-600 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}><Bell className="w-4 h-4" /> Notices</button>
        </div>

        {tab === 'events' && (
          <div className="space-y-3">
            {events.map(ev => (
              <div key={ev.id} className="bg-white rounded-xl border border-slate-100 p-5 flex items-center gap-5">
                <div className="bg-violet-100 rounded-xl p-3 text-center flex-shrink-0 w-16">
                  <div className="text-lg font-bold text-violet-700">{ev.date.split('-')[2]}</div>
                  <div className="text-xs text-violet-500">{new Date(ev.date).toLocaleDateString('en', { month: 'short' })}</div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-slate-800">{ev.title}</h3>
                    <span className="text-xs bg-violet-50 text-violet-600 px-2 py-0.5 rounded-full">{ev.type}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{ev.time} · {ev.rsvps} RSVPs of {ev.capacity} capacity</p>
                  <div className="bg-slate-100 rounded-full h-1.5 mt-2 w-48">
                    <div className="bg-violet-400 h-1.5 rounded-full" style={{ width: `${(ev.rsvps / ev.capacity) * 100}%` }} />
                  </div>
                </div>
                <div className="text-right">
                  <button type="button" onClick={() => setManaging(managing === ev.id ? null : ev.id)} className="text-xs text-violet-600 border border-violet-200 px-3 py-1.5 rounded-lg hover:bg-violet-50">Manage</button>
                  {managing === ev.id ? (
                    <button type="button" onClick={() => setEvents(current => current.map(item => item.id === ev.id ? { ...item, rsvps: Math.min(item.capacity, item.rsvps + 1) } : item))} className="mt-2 block text-xs font-medium text-emerald-600">+ Add RSVP</button>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'notices' && (
          <div className="space-y-3">
            {notices.map(n => (
              <div key={n.id} className="bg-white rounded-xl border border-slate-100 p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-slate-800">{n.title}</h3>
                  <div className="flex items-center gap-2 text-right">
                    <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full">{n.audience}</span>
                    <span className="text-xs text-slate-400">{n.date}</span>
                  </div>
                </div>
                <p className="text-sm text-slate-600">{n.preview}</p>
                {expandedNotice === n.id ? <p className="mt-2 rounded-lg bg-slate-50 p-3 text-sm text-slate-600">Please contact the centre office if you need clarification or support related to this notice.</p> : null}
                <button type="button" onClick={() => setExpandedNotice(expandedNotice === n.id ? null : n.id)} className="text-xs text-indigo-600 mt-2 hover:underline">{expandedNotice === n.id ? 'Show less' : 'Read more →'}</button>
              </div>
            ))}
          </div>
        )}
        {showCreate ? (
          <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/50 p-4" role="dialog" aria-modal="true" aria-labelledby="community-create-title">
            <form onSubmit={createEntry} className="w-full max-w-md space-y-4 rounded-2xl bg-white p-6 shadow-2xl">
              <h2 id="community-create-title" className="text-xl font-bold text-slate-900">New {tab === 'events' ? 'event' : 'notice'}</h2>
              <input aria-label="Title" required value={title} onChange={event => setTitle(event.target.value)} placeholder="Title" className="w-full rounded-lg border border-slate-200 px-3 py-2" />
              <div className="flex gap-2">
                <button type="submit" className="flex-1 rounded-lg bg-violet-600 px-4 py-2 font-medium text-white">Create</button>
                <button type="button" onClick={() => setShowCreate(false)} className="rounded-lg border border-slate-200 px-4 py-2 text-slate-600">Cancel</button>
              </div>
            </form>
          </div>
        ) : null}
      </div>
    </div>
  );
};
