import React, { useState, useEffect } from 'react';
import { db } from '../services/database';
import { DbChild, DbObservation, DbUser } from '../services/types';
import { FileText, Sparkles, User, Calendar, Loader2, Save, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import { generateLearningStory } from '../services/geminiService';
import { ImageUpload } from './ImageUpload';

interface ObservationWriterProps {
  user?: DbUser | null;
}

const demoChildren: DbChild[] = [
  { id: 'demo-1', centreId: 'mock_centre_1', name: 'Oliver B.', medicalCondition: 'Anaphylaxis', severity: 'High', allergies: ['Peanuts'], medication: 'EpiPen', actionPlanDate: '2024-02-15', immunizationExpiry: '2024-04-15' },
  { id: 'demo-2', centreId: 'mock_centre_1', name: 'Mia T.', medicalCondition: 'Asthma', severity: 'Medium', allergies: ['Dust'], medication: 'Ventolin', actionPlanDate: '2024-03-10', immunizationExpiry: '2024-03-25' },
  { id: 'demo-3', centreId: 'mock_centre_1', name: 'Leo S.', immunizationExpiry: '2024-05-20' }
];

export const ObservationWriter: React.FC<ObservationWriterProps> = ({ user }) => {
  const [children, setChildren] = useState<DbChild[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [title, setTitle] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDraft, setGeneratedDraft] = useState('');
  const [saving, setSaving] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);
  const [pastObservations, setPastObservations] = useState<DbObservation[]>([]);
  const visibleChildren = children.length > 0 ? children : demoChildren;

  useEffect(() => {
    if (user?.centreId) {
      db.children.getChildren(user.centreId).then(setChildren).catch(console.error);
      loadObservations();
    }
  }, [user]);

  const loadObservations = async () => {
    if (user?.centreId) {
      const obs = await db.documents.getObservations(user.centreId);
      setPastObservations(obs);
    }
  };

  const handleMagicDraft = async () => {
    if (!notes.trim()) return toast.error("Please add some notes first.");
    if (!selectedChildId) return toast.error("Please select a child.");
    
    const selectedChild = visibleChildren.find(c => c.id === selectedChildId);
    if (!selectedChild) return toast.error('No child selected.');
    setIsGenerating(true);
    try {
      const result = await generateLearningStory('the child', selectedChild.birthday ? 'age available to educator' : 'not provided', title || 'educator observation', notes);
      setGeneratedDraft(`${result.title}\n\n${result.story}\n\nAnalysis\n${result.analysis}\n\nSuggested next steps\n${result.followUp}`);
      toast.success("AI Draft generated!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'AI generation failed.');
    } finally {
      setIsGenerating(false);
    }
  };

  const saveObservation = async () => {
    if (!user || (!notes && !generatedDraft)) {
      return toast.error("Cannot save empty observation.");
    }
    const selectedChild = visibleChildren.find(c => c.id === selectedChildId);
    if (!selectedChild) return toast.error("No child selected.");

    setSaving(true);
    try {
      await db.documents.saveObservation({
        centreId: user.centreId,
        childId: selectedChild.id,
        childName: selectedChild.name,
        title: title || `Observation: ${selectedChild.name}`,
        data: { content: generatedDraft || notes },
        educatorId: user.id,
        educatorName: user.name,
        date: new Date().toISOString().split('T')[0],
        status: 'published'
      });
      toast.success("Observation saved!");
      setNotes('');
      setGeneratedDraft('');
      setTitle('');
      setSelectedChildId('');
      loadObservations();
    } catch (e: any) {
      toast.error("Failed to save: " + e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="h-full w-full bg-slate-50 flex flex-col md:flex-row overflow-hidden">
      
      {/* Sidebar: Past Observations */}
      <div className="w-full md:w-80 bg-white border-r border-slate-200 flex flex-col h-full overflow-hidden shrink-0">
        <div className="p-4 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <FileText className="w-5 h-5 text-brand-azure" />
            Recent Observations
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {pastObservations.length === 0 ? (
            <p className="text-sm text-slate-500 italic">No recent observations.</p>
          ) : (
            pastObservations.slice(0, 10).map(obs => (
              <div key={obs.id} className="p-3 bg-slate-50 border border-slate-200 rounded-lg hover:border-brand-azure cursor-pointer transition-colors">
                <p className="font-semibold text-slate-800 text-sm">{obs.title}</p>
                <div className="flex justify-between mt-2 text-xs text-slate-500">
                  <span className="flex items-center gap-1"><User className="w-3 h-3" /> {obs.childName}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {obs.date}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Editor Content */}
      <div className="flex-1 overflow-y-auto p-6 lg:p-10">
        <div className="max-w-3xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">Observation Writer</h1>
            <p className="text-slate-600 mt-2">Write raw notes and let AI structure them into professional, EYLF-aligned documentation.</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 space-y-6">
              
              {/* Target & Title */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Focus Child</label>
                  <select 
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-brand-azure focus:ring-1 focus:ring-brand-azure"
                    value={selectedChildId} 
                    onChange={e => setSelectedChildId(e.target.value)}
                  >
                    <option value="">Select a child...</option>
                    {visibleChildren.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Title</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Exploring Water Density"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-brand-azure focus:ring-1 focus:ring-brand-azure"
                  />
                </div>
              </div>

              {/* Raw Notes Entry */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Raw Notes / Jottings</label>
                <textarea 
                  className="w-full h-32 p-3 rounded-xl border border-slate-300 focus:border-brand-azure focus:ring-1 focus:ring-brand-azure resize-none"
                  placeholder="Jot down quick observations here... e.g. Oliver stacked 5 blocks and laughed when they fell. He tried again with a wider base."
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                />
              </div>

              {/* Photo Upload */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Photos</label>
                <ImageUpload images={photos} onChange={setPhotos} maxImages={6} bucket="observations" />
              </div>

              {/* Toolbar */}
              <div className="flex justify-end pt-2 border-t border-slate-100">
                <button 
                  onClick={handleMagicDraft}
                  disabled={isGenerating || !notes}
                  className="px-5 py-2.5 bg-gradient-to-r from-brand-azure to-brand-teal text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                  {isGenerating ? "Analyzing & Mapping EYLF..." : "Enhance with AI Magic"}
                </button>
              </div>

              {/* Generated Result */}
              {generatedDraft && (
                <div className="mt-8 pt-6 border-t border-slate-200">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Refined Professional Draft</label>
                  <textarea 
                    className="w-full h-48 p-4 rounded-xl border border-slate-300 bg-emerald-50/50 focus:border-brand-teal focus:ring-1 focus:ring-brand-teal resize-none font-medium text-slate-800"
                    value={generatedDraft}
                    onChange={e => setGeneratedDraft(e.target.value)}
                  />
                  
                  <div className="flex justify-end gap-3 mt-4">
                    <button 
                      onClick={() => setGeneratedDraft('')}
                      className="px-4 py-2 border border-slate-300 text-slate-600 rounded-lg hover:bg-slate-50 font-medium"
                    >
                      Discard
                    </button>
                    <button 
                      onClick={saveObservation}
                      disabled={saving}
                      className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 shadow-sm font-medium flex items-center gap-2"
                    >
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      Publish Observation
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
