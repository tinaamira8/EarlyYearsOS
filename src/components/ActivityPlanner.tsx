import React, { useState } from 'react';
import { DbUser } from '../services/types';
import {
  Calendar, GripHorizontal, Loader2, Plus, Search, Sparkles,
  Map, Lightbulb, Music, Palette, BookOpen, Activity
} from 'lucide-react';
import toast from 'react-hot-toast';
import { generateActivityPlan } from '../services/geminiService';
import { usePersistedState } from '../hooks/usePersistedState';

interface ActivityPlannerProps {
  user?: DbUser | null;
}

const CATEGORIES = [
  { id: 'cognitive', name: 'Cognitive & STEM', icon: <Lightbulb className="w-4 h-4 text-amber-500" /> },
  { id: 'physical', name: 'Physical Motor', icon: <Activity className="w-4 h-4 text-emerald-500" /> },
  { id: 'creative', name: 'Creative Arts', icon: <Palette className="w-4 h-4 text-fuchsia-500" /> },
  { id: 'language', name: 'Language & Literacy', icon: <BookOpen className="w-4 h-4 text-blue-500" /> },
  { id: 'music', name: 'Music & Movement', icon: <Music className="w-4 h-4 text-rose-500" /> },
  { id: 'outdoors', name: 'Nature & Outdoors', icon: <Map className="w-4 h-4 text-green-600" /> },
];

const mockActivities = [
  { id: 1, title: 'Baking Soda Volcanoes', category: 'cognitive', desc: 'Introduction to basic chemical reactions.', time: 'Morning' },
  { id: 2, title: 'Obstacle Course', category: 'physical', desc: 'Gross motor skill development on the playground.', time: 'Afternoon' },
  { id: 3, title: 'Finger Painting', category: 'creative', desc: 'Exploring primary color mixing.', time: 'Morning' },
  { id: 4, title: 'Storytime: The Gruffalo', category: 'language', desc: 'Group reading with puppetry.', time: 'Late Morning' },
  { id: 5, title: 'Rhythm Sticks', category: 'music', desc: 'Following beats and learning rests.', time: 'Afternoon' },
];

export const ActivityPlanner: React.FC<ActivityPlannerProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'this-week' | 'next-week' | 'library'>('this-week');
  const [searchQuery, setSearchQuery] = useState('');
  const [activities, setActivities] = usePersistedState('activity_planner_activities', mockActivities);
  const [showNewActivity, setShowNewActivity] = useState(false);
  const [draftActivity, setDraftActivity] = useState({ title: '', category: 'cognitive', desc: '', time: 'Morning' });
  const [scheduled, setScheduled] = usePersistedState<Record<string, number[]>>('activity_planner_schedule', { Monday: [3], Wednesday: [5, 4] });
  const [isGenerating, setIsGenerating] = useState(false);
  const filteredActivities = activities.filter(activity => activity.title.toLowerCase().includes(searchQuery.toLowerCase()));

  const createActivity = (event: React.FormEvent) => {
    event.preventDefault();
    setActivities(current => [...current, { ...draftActivity, id: Date.now() }]);
    setDraftActivity({ title: '', category: 'cognitive', desc: '', time: 'Morning' });
    setShowNewActivity(false);
  };

  const addActivityToDay = (day: string) => {
    const existing = scheduled[day] || [];
    const next = filteredActivities.find(activity => !existing.includes(activity.id));
    if (!next) return;
    setScheduled(current => ({ ...current, [day]: [...existing, next.id] }));
  };

  const generateActivities = async () => {
    if (!searchQuery.trim()) return toast.error('Enter a child interest in the search box first.');
    setIsGenerating(true);
    try {
      const result = await generateActivityPlan(searchQuery, 'mixed early childhood age group') as Array<{ title: string; description: string }>;
      const generated = result.map((item, index) => ({ id: Date.now() + index, title: item.title, category: 'cognitive', desc: item.description, time: 'Morning' }));
      if (!generated.length) throw new Error('The AI did not return any activities.');
      setActivities(current => [...generated, ...current]);
      setSearchQuery('');
      toast.success('AI activities added to the library for educator review.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'AI generation failed.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="h-full w-full bg-slate-50 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row justify-between items-center shrink-0 z-10 shadow-sm relative">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="p-2 bg-indigo-50 rounded-xl">
            <Calendar className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Curriculum Planner</h1>
            <p className="text-xs text-slate-500">Plan educational experiences aligned with EYLF</p>
          </div>
        </div>
        <div className="flex items-center gap-3 mt-4 sm:mt-0 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input 
              type="text" 
              placeholder="Search activities..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-100 border-transparent focus:bg-white focus:border-brand-azure focus:ring-2 focus:ring-brand-azure/20 rounded-xl text-sm transition-all"
            />
          </div>
          <button type="button" onClick={() => setShowNewActivity(true)} className="px-4 py-2 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-slate-800 transition-colors flex items-center gap-2 shadow-md shrink-0">
            <Plus className="w-4 h-4" /> New Activity
          </button>
          <button type="button" disabled={isGenerating} onClick={() => void generateActivities()} className="px-4 py-2 bg-violet-600 text-white text-sm font-semibold rounded-xl hover:bg-violet-700 transition-colors flex items-center gap-2 shadow-md shrink-0 disabled:opacity-50">
            {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />} Generate
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-slate-50 border-r border-slate-200 p-4 flex flex-col shrink-0 hidden md:flex">
          <div className="space-y-1 mb-8">
            <button 
              onClick={() => setActiveTab('this-week')}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'this-week' ? 'bg-indigo-100 text-indigo-900' : 'text-slate-600 hover:bg-slate-200/50'}`}
            >
              This Week's Plan
            </button>
            <button 
              onClick={() => setActiveTab('next-week')}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'next-week' ? 'bg-indigo-100 text-indigo-900' : 'text-slate-600 hover:bg-slate-200/50'}`}
            >
              Next Week's Plan
            </button>
            <button 
              onClick={() => setActiveTab('library')}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'library' ? 'bg-indigo-100 text-indigo-900' : 'text-slate-600 hover:bg-slate-200/50'}`}
            >
              Activity Library
            </button>
          </div>
          
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-3">Available Experiences</h3>
            <div className="space-y-2">
              {filteredActivities.map(activity => (
                <div key={activity.id} className="p-3 bg-white border border-slate-200 rounded-xl shadow-sm cursor-grab hover:border-brand-azure hover:shadow-md transition-all group flex gap-3">
                  <div className="mt-0.5 opacity-40 group-hover:opacity-100">
                    <GripHorizontal className="w-4 h-4 text-slate-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 leading-snug">{activity.title}</h4>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-1">{activity.desc}</p>
                    <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-slate-100 text-slate-600">
                      {CATEGORIES.find(c => c.id === activity.category)?.icon}
                      {CATEGORIES.find(c => c.id === activity.category)?.name}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Board */}
        <div className="flex-1 bg-slate-100 p-6 overflow-x-auto">
          <div className="min-w-[800px] h-full flex flex-col">
            <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              {activeTab === 'this-week' ? "Current Week Planner" : activeTab === 'next-week' ? "Next Week Planner" : "Master Library"}
            </h2>

            {/* Kanban / Calendar Hybrid View */}
            <div className="flex-1 grid grid-cols-5 gap-4">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => (
                <div key={day} className="flex flex-col h-full">
                  <div className="bg-white px-4 py-3 border border-slate-200 rounded-t-xl shadow-sm z-10 flex justify-between items-center font-bold text-slate-700">
                    {day}
                    <button type="button" aria-label={`Add activity to ${day}`} onClick={() => addActivityToDay(day)} className="text-slate-400 hover:text-brand-azure transition-colors"><Plus className="w-4 h-4" /></button>
                  </div>
                  <div className="flex-1 bg-slate-200/50 border-x border-b border-slate-200 rounded-b-xl p-3 flex flex-col gap-3 min-h-[400px]">
                    {(scheduled[day] || []).map(activityId => {
                      const activity = activities.find(item => item.id === activityId);
                      if (!activity) return null;
                      return (
                        <div key={activity.id} className="p-3 bg-white border border-slate-200 rounded-xl shadow-sm cursor-pointer hover:border-brand-azure transition-all">
                          <h4 className="text-sm font-bold text-slate-800 leading-snug">{activity.title}</h4>
                          <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-indigo-50 text-indigo-700">
                            {CATEGORIES.find(category => category.id === activity.category)?.icon}
                            {CATEGORIES.find(category => category.id === activity.category)?.name}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {showNewActivity ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/50 p-4" role="dialog" aria-modal="true" aria-labelledby="new-activity-title">
          <form onSubmit={createActivity} className="w-full max-w-md space-y-4 rounded-2xl bg-white p-6 shadow-2xl">
            <h2 id="new-activity-title" className="text-xl font-bold text-slate-900">New activity</h2>
            <input aria-label="Activity title" required value={draftActivity.title} onChange={event => setDraftActivity(activity => ({ ...activity, title: event.target.value }))} placeholder="Activity title" className="w-full rounded-lg border border-slate-200 px-3 py-2" />
            <textarea aria-label="Activity description" required value={draftActivity.desc} onChange={event => setDraftActivity(activity => ({ ...activity, desc: event.target.value }))} placeholder="Description" rows={3} className="w-full rounded-lg border border-slate-200 px-3 py-2" />
            <select aria-label="Activity category" value={draftActivity.category} onChange={event => setDraftActivity(activity => ({ ...activity, category: event.target.value }))} className="w-full rounded-lg border border-slate-200 px-3 py-2">
              {CATEGORIES.map(category => <option key={category.id} value={category.id}>{category.name}</option>)}
            </select>
            <div className="flex gap-2">
              <button type="submit" className="flex-1 rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white">Create activity</button>
              <button type="button" onClick={() => setShowNewActivity(false)} className="rounded-lg border border-slate-200 px-4 py-2 text-slate-600">Cancel</button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
};
