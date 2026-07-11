import React, { useRef, useState } from 'react';
import { Camera, Grid, List, Loader2, Sparkles, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import { editDocumentationPhoto } from '../services/geminiService';

type MediaItem = { id: number; type: string; child: string; room: string; date: string; caption: string; color: string; source?: string };

const mockMedia: MediaItem[] = [
  { id: 1, type: 'photo', child: 'Leo Martinez', room: 'Toddlers', date: '2026-05-23', caption: 'Sensory water play exploration', color: 'bg-blue-100' },
  { id: 2, type: 'photo', child: 'Emma Wilson', room: 'Pre-Kindy', date: '2026-05-23', caption: 'Nature collage creation', color: 'bg-green-100' },
  { id: 3, type: 'photo', child: 'Group', room: 'Pre-Kindy', date: '2026-05-22', caption: 'Morning group meeting', color: 'bg-amber-100' },
  { id: 4, type: 'photo', child: 'Noah Kim', room: 'Toddlers', date: '2026-05-22', caption: 'First steps with confidence', color: 'bg-pink-100' },
  { id: 5, type: 'video', child: 'Ava Chen', room: 'Pre-Kindy', date: '2026-05-21', caption: 'Story telling session', color: 'bg-purple-100' },
  { id: 6, type: 'photo', child: 'Group', room: 'Babies', date: '2026-05-21', caption: 'Tummy time & play', color: 'bg-rose-100' },
  { id: 7, type: 'photo', child: 'Mia Johnson', room: 'Babies', date: '2026-05-20', caption: 'Reaching and grasping objects', color: 'bg-sky-100' },
  { id: 8, type: 'photo', child: 'Group', room: 'Pre-Kindy', date: '2026-05-20', caption: 'Collaborative block building', color: 'bg-orange-100' },
];

const rooms = ['All', 'Babies', 'Toddlers', 'Pre-Kindy'];

export const MediaStudio: React.FC = () => {
  const [filter, setFilter] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [media, setMedia] = useState(mockMedia);
  const [selectedImageId, setSelectedImageId] = useState<number | null>(null);
  const [editPrompt, setEditPrompt] = useState('Improve lighting and clarity while keeping the documentation photo natural.');
  const [isEditing, setIsEditing] = useState(false);
  const uploadRef = useRef<HTMLInputElement>(null);
  const filtered = filter === 'All' ? media : media.filter(m => m.room === filter);

  const addMedia = async (files: FileList | null) => {
    if (!files?.length) return;
    const added = await Promise.all(Array.from(files).map(async (file, index): Promise<MediaItem> => ({
      id: Date.now() + index,
      type: file.type.startsWith('video/') ? 'video' : 'photo',
      child: 'Unassigned',
      room: 'Pre-Kindy',
      date: new Date().toISOString().slice(0, 10),
      caption: file.name,
      color: 'bg-indigo-100',
      source: file.type.startsWith('image/') ? await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
      }) : undefined,
    })));
    setMedia(current => [...added, ...current]);
  };

  const editSelectedImage = async () => {
    const selected = media.find(item => item.id === selectedImageId);
    if (!selected?.source) return toast.error('Upload and select an image before using AI editing.');
    if (!editPrompt.trim()) return toast.error('Describe the edit you want.');
    setIsEditing(true);
    try {
      const source = await editDocumentationPhoto(selected.source, editPrompt);
      setMedia(current => current.map(item => item.id === selected.id ? { ...item, source } : item));
      toast.success('AI edit applied. Review the image before using it in documentation.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'AI image editing failed.');
    } finally {
      setIsEditing(false);
    }
  };

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center">
            <Camera className="w-5 h-5 text-rose-600" />
          </div>
          <div className="flex-1"><h1 className="text-2xl font-bold text-slate-800">Media Studio</h1>
            <p className="text-slate-500 text-sm">Photos and videos from the centre</p></div>
          <input ref={uploadRef} type="file" accept="image/png,image/jpeg,image/webp,video/*" multiple className="hidden" onChange={event => void addMedia(event.target.files)} />
          <button type="button" onClick={() => uploadRef.current?.click()} className="flex items-center gap-2 bg-indigo-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-indigo-700">
            <Upload className="w-4 h-4" /> Upload Media
          </button>
        </div>

        {selectedImageId !== null ? (
          <div className="flex flex-col gap-3 rounded-xl border border-violet-200 bg-violet-50 p-4 sm:flex-row sm:items-end">
            <label className="flex-1 text-xs font-semibold text-violet-900">AI photo edit instructions
              <input value={editPrompt} onChange={event => setEditPrompt(event.target.value)} className="mt-1 w-full rounded-lg border border-violet-200 bg-white px-3 py-2 text-sm font-normal text-slate-800" />
            </label>
            <button disabled={isEditing} onClick={() => void editSelectedImage()} className="flex items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">
              {isEditing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />} Apply AI edit
            </button>
          </div>
        ) : null}

        <div className="bg-white rounded-xl border border-slate-100 p-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Camera className="w-4 h-4" />
            <span><strong className="text-slate-800">{media.filter(m=>m.type==='photo').length}</strong> photos · <strong className="text-slate-800">{media.filter(m=>m.type==='video').length}</strong> videos · <strong className="text-slate-800">48MB</strong> used of 10GB</span>
          </div>
          <div className="flex gap-1">
            <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-indigo-100 text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}><Grid className="w-4 h-4" /></button>
            <button onClick={() => setViewMode('list')} className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-indigo-100 text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}><List className="w-4 h-4" /></button>
          </div>
        </div>

        <div className="flex gap-2">
          {rooms.map(r => <button key={r} onClick={() => setFilter(r)} className={`px-3 py-1.5 text-xs rounded-lg font-medium ${filter === r ? 'bg-rose-600 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}>{r}</button>)}
        </div>

        {viewMode === 'grid' ? (
          <div className="grid grid-cols-4 gap-3">
            {filtered.map(m => (
              <div key={m.id} className="rounded-xl overflow-hidden border border-slate-100 hover:shadow-md transition-shadow cursor-pointer">
                <div className={`relative h-28 ${m.color} flex items-center justify-center`}>
                  {m.source ? <img src={m.source} alt={m.caption} className="h-full w-full object-cover" /> : m.type === 'video' ? <div className="w-10 h-10 bg-white/70 rounded-full flex items-center justify-center"><span className="text-slate-600 text-lg">▶</span></div> : <Camera className="w-8 h-8 text-white/60" />}
                  {m.source ? <button onClick={() => setSelectedImageId(m.id)} className="absolute bottom-2 right-2 rounded-md bg-white/90 px-2 py-1 text-[10px] font-semibold text-violet-700 shadow"><Sparkles className="mr-1 inline h-3 w-3" />AI edit</button> : null}
                </div>
                <div className="p-2">
                  <p className="text-xs font-medium text-slate-700 truncate">{m.caption}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{m.child} · {m.date}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-xs text-slate-500 uppercase"><tr><th className="text-left px-4 py-3">Preview</th><th className="text-left px-4 py-3">Caption</th><th className="text-left px-4 py-3">Child</th><th className="text-left px-4 py-3">Room</th><th className="text-left px-4 py-3">Date</th><th className="text-left px-4 py-3">Type</th></tr></thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(m => (
                  <tr key={m.id} className="hover:bg-slate-50">
                    <td className="px-4 py-2"><div className={`w-10 h-10 rounded-lg ${m.color} flex items-center justify-center`}><Camera className="w-4 h-4 text-white/60" /></div></td>
                    <td className="px-4 py-2 font-medium text-slate-800">{m.caption}</td>
                    <td className="px-4 py-2 text-slate-600">{m.child}</td>
                    <td className="px-4 py-2 text-slate-600">{m.room}</td>
                    <td className="px-4 py-2 text-slate-500">{m.date}</td>
                    <td className="px-4 py-2"><span className={`text-xs px-2 py-0.5 rounded-full ${m.type === 'video' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>{m.type}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
