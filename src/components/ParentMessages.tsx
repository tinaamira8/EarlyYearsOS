import React, { useState } from 'react';
import { MessageSquare, Send } from 'lucide-react';
import { usePersistedState } from '../hooks/usePersistedState';

const conversations = [
  { id: 1, family: 'Martinez Family', child: 'Leo', lastMsg: 'Thank you for the update about Leo!', time: '10:32 AM', unread: 0, messages: [
    { from: 'parent', text: 'Hi, just checking how Leo went today?', time: '9:15 AM' },
    { from: 'centre', text: 'Leo had a wonderful day! He really enjoyed the sensory play activity and ate all his lunch 😊', time: '10:30 AM' },
    { from: 'parent', text: 'Thank you for the update about Leo!', time: '10:32 AM' },
  ]},
  { id: 2, family: 'Wilson Family', child: 'Emma', lastMsg: 'Emma won\'t be in tomorrow.', time: 'Yesterday', unread: 1, messages: [
    { from: 'parent', text: 'Emma won\'t be in tomorrow. She has a doctor\'s appointment.', time: 'Yesterday 4:45 PM' },
  ]},
  { id: 3, family: 'Kim Family', child: 'Noah', lastMsg: 'Can we book a parent meeting?', time: 'Mon', unread: 2, messages: [
    { from: 'parent', text: 'Hi, can we book a parent meeting to discuss Noah\'s development goals?', time: 'Mon 2:30 PM' },
    { from: 'parent', text: 'Any time this week works for us.', time: 'Mon 2:31 PM' },
  ]},
];

export const ParentMessages: React.FC = () => {
  const [selected, setSelected] = useState(conversations[0]);
  const [reply, setReply] = useState('');
  const [msgs, setMsgs] = usePersistedState('parent_messages', conversations);

  const send = () => {
    if (!reply.trim()) return;
    const updated = msgs.map(c => c.id === selected.id
      ? { ...c, messages: [...c.messages, { from: 'centre', text: reply, time: 'Now' }], lastMsg: reply }
      : c
    );
    setMsgs(updated);
    setSelected(updated.find(c => c.id === selected.id)!);
    setReply('');
  };

  return (
    <div className="h-full flex overflow-hidden bg-slate-50">
      {/* Conversation list */}
      <div className="w-64 bg-white border-r border-slate-100 flex flex-col">
        <div className="p-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-800 flex items-center gap-2"><MessageSquare className="w-4 h-4" /> Messages</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {msgs.map(c => (
            <button key={c.id} onClick={() => setSelected(c)} className={`w-full text-left px-4 py-3 border-b border-slate-50 hover:bg-slate-50 transition-colors ${selected.id === c.id ? 'bg-indigo-50' : ''}`}>
              <div className="flex justify-between items-start">
                <div className="font-medium text-slate-800 text-sm">{c.family}</div>
                <div className="flex items-center gap-1">
                  {c.unread > 0 && <span className="w-4 h-4 bg-indigo-600 text-white text-[10px] rounded-full flex items-center justify-center">{c.unread}</span>}
                  <span className="text-xs text-slate-400">{c.time}</span>
                </div>
              </div>
              <p className="text-xs text-slate-500 truncate">{c.child} · {c.lastMsg}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Message thread */}
      <div className="flex-1 flex flex-col">
        <div className="bg-white border-b border-slate-100 px-6 py-4">
          <h3 className="font-semibold text-slate-800">{selected.family}</h3>
          <p className="text-xs text-slate-500">Re: {selected.child}</p>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {selected.messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.from === 'centre' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs rounded-2xl px-4 py-2.5 ${msg.from === 'centre' ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-slate-800'}`}>
                <p className="text-sm">{msg.text}</p>
                <p className={`text-xs mt-1 ${msg.from === 'centre' ? 'text-indigo-200' : 'text-slate-400'}`}>{msg.time}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-white border-t border-slate-100 p-4 flex gap-3">
          <input className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Type a message..." value={reply} onChange={e => setReply(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} />
          <button onClick={send} className="bg-indigo-600 text-white px-4 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors">
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
