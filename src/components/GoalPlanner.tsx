import React, { useState } from 'react';
import { DbUser, NQSArea } from '../services/types';
import {
  Target, Sparkles, Plus, Search,
  BarChart, ArrowRight, CheckCircle2, CircleDashed, Download
} from 'lucide-react';
import toast from 'react-hot-toast';
import { generateGoalTimeline } from '../services/geminiService';
import { usePersistedState } from '../hooks/usePersistedState';
import { exportTableToPDF } from '../services/exportEngine';

interface GoalPlannerProps {
  user?: DbUser | null;
  initialArea?: NQSArea;
}

type QipGoal = {
  id: string;
  nqsArea: string;
  title: string;
  progress: 'Not Started' | 'In Progress' | 'Achieved';
  aiGenerated: boolean;
};

const NQS_AREAS = [
  'QA1: Educational Program and Practice',
  'QA2: Children’s Health and Safety',
  'QA3: Physical Environment',
  'QA4: Staffing Arrangements',
  'QA5: Relationships with Children',
  'QA6: Collaborative Partnerships',
  'QA7: Governance and Leadership'
];

export const GoalPlanner: React.FC<GoalPlannerProps> = ({ user, initialArea }) => {
  const [goals, setGoals] = usePersistedState<QipGoal[]>(‘qip_goals’, [
    { id: ‘1’, nqsArea: ‘QA1: Educational Program and Practice’, title: ‘Implement bi-weekly critical reflection sessions for all lead educators.’, progress: ‘In Progress’, aiGenerated: false },
    { id: ‘2’, nqsArea: ‘QA2: Children’s Health and Safety’, title: ‘Conduct comprehensive sun-safety audit of all outdoor spaces.’, progress: ‘Not Started’, aiGenerated: false },
    { id: ‘3’, nqsArea: ‘QA6: Collaborative Partnerships’, title: ‘Establish a new parent advisory committee for monthly feedback.’, progress: ‘Achieved’, aiGenerated: true },
  ]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedArea, setSelectedArea] = useState<string>(
    initialArea ? `QA${initialArea.split('_')[1]}: ` + initialArea : NQS_AREAS[0]
  );
  const [newProblem, setNewProblem] = useState('');

  const generateAIGoal = async () => {
    if (!newProblem) return toast.error("Describe the current gap or problem first.");
    setIsGenerating(true);
    try {
      const result = await generateGoalTimeline(newProblem, selectedArea);
      const generatedGoal: QipGoal = {
        id: crypto.randomUUID(),
        nqsArea: selectedArea,
        title: result.smartGoal,
        progress: 'Not Started',
        aiGenerated: true
      };
      setGoals(current => [...current, generatedGoal]);
      setNewProblem('');
      toast.success("AI successfully drafted a new QIP Goal!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'AI generation failed.');
    } finally {
      setIsGenerating(false);
    }
  };

  const updateProgress = (id: string, progress: QipGoal['progress']) => {
    setGoals(goals.map(g => g.id === id ? { ...g, progress } : g));
  };

  const calculateProgress = () => {
    const achieved = goals.filter(g => g.progress === 'Achieved').length;
    return goals.length > 0 ? Math.round((achieved / goals.length) * 100) : 0;
  };

  return (
    <div className="h-full w-full bg-slate-50 flex flex-col md:flex-row overflow-hidden">
      
      {/* Sidebar: AI Assistant */}
      <div className="w-full md:w-96 bg-white border-r border-slate-200 flex flex-col h-full overflow-hidden shrink-0 shadow-sm z-10">
        <div className="p-6 border-b border-indigo-100 bg-indigo-50/50">
          <h2 className="text-xl font-bold text-indigo-900 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-indigo-600" />
            AI Goal Generator
          </h2>
          <p className="text-sm text-indigo-700/80 mt-2">Describe an area of improvement, and let AI draft a SMART goal for your QIP.</p>
        </div>
        <div className="p-6 space-y-6 flex-1 overflow-y-auto">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Target NQS Area</label>
            <select 
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            >
              {NQS_AREAS.map(area => <option key={area} value={area}>{area}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Identified Gap / Problem</label>
            <textarea 
              value={newProblem}
              onChange={(e) => setNewProblem(e.target.value)}
              placeholder="e.g., We struggle to get parents to read the weekly newsletters, resulting in poor communication."
              className="w-full h-32 p-3 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none"
            />
          </div>
          <button 
            onClick={() => void generateAIGoal()}
            disabled={isGenerating || !newProblem}
            className="w-full px-5 py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/40 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isGenerating ? "Drafting Goal..." : "Generate SMART Goal"}
          </button>
        </div>
      </div>

      {/* Main Board */}
      <div className="flex-1 overflow-y-auto p-6 lg:p-10 bg-slate-100">
        <div className="max-w-5xl mx-auto space-y-8">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200">
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                <Target className="w-8 h-8 text-rose-500" /> Quality Improvement Plan
              </h1>
              <p className="text-slate-500 mt-2 text-lg">Track and implement continuous improvements across your service.</p>
              <button
                onClick={() => {
                  const columns = ['NQS Area', 'Goal', 'Status'];
                  const data = goals.map(g => [g.nqsArea, g.title, g.progress]);
                  exportTableToPDF('Quality Improvement Plan', columns, data, `QIP_Export_${new Date().toISOString().split('T')[0]}`);
                  toast.success('QIP exported as PDF');
                }}
                className="mt-3 flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
              >
                <Download className="w-4 h-4" /> Export QIP as PDF
              </button>
            </div>
            
            <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="w-16 h-16 rounded-full border-4 border-emerald-500 flex items-center justify-center text-emerald-600 font-black text-xl bg-white shadow-inner">
                {calculateProgress()}%
              </div>
              <div>
                <p className="font-bold text-slate-900 text-lg">Overall Progress</p>
                <p className="text-sm text-slate-500 font-medium">Towards exceeding NQS</p>
              </div>
            </div>
          </div>

          {/* Kanban Board */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Not Started */}
            <div className="bg-slate-200/50 rounded-3xl p-5 border border-slate-200">
              <div className="flex items-center gap-2 mb-4 px-2">
                <CircleDashed className="w-5 h-5 text-slate-500" />
                <h3 className="font-bold text-slate-800 text-lg">Not Started</h3>
                <span className="ml-auto bg-slate-300 text-slate-700 text-xs font-bold px-2 py-1 rounded-full">{goals.filter(g => g.progress === 'Not Started').length}</span>
              </div>
              <div className="space-y-4">
                {goals.filter(g => g.progress === 'Not Started').map(goal => (
                  <div key={goal.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-300 transition-colors cursor-pointer group">
                    <div className="text-xs font-black text-indigo-600 mb-2">{goal.nqsArea.split(':')[0]}</div>
                    <p className="font-semibold text-slate-800 text-sm leading-snug">{goal.title}</p>
                    <div className="mt-4 flex justify-end">
                      <button onClick={() => updateProgress(goal.id, 'In Progress')} className="text-xs font-bold text-slate-500 hover:text-indigo-600 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        Start <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* In Progress */}
            <div className="bg-indigo-50/50 rounded-3xl p-5 border border-indigo-100">
              <div className="flex items-center gap-2 mb-4 px-2">
                <BarChart className="w-5 h-5 text-indigo-500" />
                <h3 className="font-bold text-indigo-900 text-lg">In Progress</h3>
                <span className="ml-auto bg-indigo-200 text-indigo-800 text-xs font-bold px-2 py-1 rounded-full">{goals.filter(g => g.progress === 'In Progress').length}</span>
              </div>
              <div className="space-y-4">
                {goals.filter(g => g.progress === 'In Progress').map(goal => (
                  <div key={goal.id} className="bg-white p-5 rounded-2xl border border-indigo-200 shadow-sm shadow-indigo-100 cursor-pointer group">
                    <div className="text-xs font-black text-indigo-600 mb-2">{goal.nqsArea.split(':')[0]}</div>
                    <p className="font-semibold text-slate-800 text-sm leading-snug">{goal.title}</p>
                    <div className="mt-4 flex justify-end">
                      <button onClick={() => updateProgress(goal.id, 'Achieved')} className="text-xs font-bold text-indigo-600 hover:text-emerald-600 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        Mark Achieved <CheckCircle2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Achieved */}
            <div className="bg-emerald-50/50 rounded-3xl p-5 border border-emerald-100">
              <div className="flex items-center gap-2 mb-4 px-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <h3 className="font-bold text-emerald-900 text-lg">Achieved</h3>
                <span className="ml-auto bg-emerald-200 text-emerald-800 text-xs font-bold px-2 py-1 rounded-full">{goals.filter(g => g.progress === 'Achieved').length}</span>
              </div>
              <div className="space-y-4">
                {goals.filter(g => g.progress === 'Achieved').map(goal => (
                  <div key={goal.id} className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-sm shadow-emerald-100 opacity-75">
                    <div className="text-xs font-black text-emerald-600 mb-2">{goal.nqsArea.split(':')[0]}</div>
                    <p className="font-medium text-slate-600 text-sm line-through">{goal.title}</p>
                    {goal.aiGenerated && (
                      <div className="mt-3 inline-flex items-center gap-1 text-[10px] uppercase font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                        <Sparkles className="w-3 h-3" /> AI Assisted
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
