import React, { useState } from 'react';
import { Bot, Loader2, Send } from 'lucide-react';
import { chatWithExpert } from '../services/geminiService';

const suggestions = ['Tell me about NQS ratings', 'What is the EYLF?', 'What are staff ratios?', 'WWCC requirements', 'Anaphylaxis management', 'How to write a QIP'];

type Msg = { from: 'user' | 'bot'; text: string };

export const ExpertChat: React.FC = () => {
  const [messages, setMessages] = useState<Msg[]>([
    { from: 'bot', text: 'Hi! I\'m your Early Childhood Education expert assistant. Ask me about NQS, EYLF, regulations, or best practices. What would you like to know?' }
  ]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);

  const send = async (text: string = input) => {
    if (!text.trim() || isSending) return;
    const userMsg: Msg = { from: 'user', text };
    const history = [...messages, userMsg];
    setMessages(history);
    setInput('');
    setIsSending(true);
    try {
      const response = await chatWithExpert(text, messages);
      setMessages(current => [...current, { from: 'bot', text: response.text }]);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'AI is unavailable right now.';
      setMessages(current => [...current, { from: 'bot', text: `Unable to answer: ${message}` }]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-50">
      <div className="bg-white border-b border-slate-100 px-6 py-4 flex items-center gap-3">
        <div className="w-9 h-9 bg-indigo-100 rounded-xl flex items-center justify-center">
          <Bot className="w-5 h-5 text-indigo-600" />
        </div>
        <div>
          <h1 className="font-semibold text-slate-800">Expert Chat Assistant</h1>
          <p className="text-xs text-slate-500">Ask about regulations, EYLF, NQS, best practices</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'} gap-3`}>
            {msg.from === 'bot' && <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0"><Bot className="w-4 h-4 text-indigo-600" /></div>}
            <div className={`max-w-md rounded-2xl px-4 py-3 ${msg.from === 'user' ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-slate-800'}`}>
              <p className="text-sm leading-relaxed">{msg.text}</p>
            </div>
          </div>
        ))}
        {isSending ? <div className="flex items-center gap-2 text-sm text-slate-500"><Loader2 className="h-4 w-4 animate-spin" /> Checking the current guidance…</div> : null}
      </div>

      <div className="p-4 border-t border-slate-100 bg-white space-y-3">
        <div className="flex flex-wrap gap-2">
          {suggestions.map(s => (
            <button key={s} onClick={() => send(s)} className="text-xs border border-slate-200 text-slate-600 px-3 py-1.5 rounded-full hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-600 transition-colors">{s}</button>
          ))}
        </div>
        <div className="flex gap-3">
          <input disabled={isSending} className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-100" placeholder="Ask a question..." value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && void send()} />
          <button aria-label="Send question" disabled={isSending || !input.trim()} onClick={() => void send()} className="bg-indigo-600 text-white px-4 py-2.5 rounded-xl hover:bg-indigo-700 disabled:opacity-50"><Send className="w-4 h-4" /></button>
        </div>
        <p className="text-[11px] text-slate-400">AI guidance must be reviewed against current ACECQA and state requirements before use.</p>
      </div>
    </div>
  );
};
