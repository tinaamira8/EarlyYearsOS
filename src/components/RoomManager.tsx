import React, { useState, useEffect } from 'react';
import { db } from '../services/database';
import { DbUser, DbChild } from '../services/types';
import { GripVertical, LayoutGrid, Loader2, Search, Settings2, Sparkles, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import { analyzeRoomSetup } from '../services/geminiService';

interface RoomManagerProps {
  user?: DbUser | null;
}

const ROOMS = [
  { id: 'unassigned', name: 'Waitlist / Unassigned', color: 'slate' },
  { id: 'nursery', name: 'Nursery (0-2 Yrs)', color: 'rose' },
  { id: 'toddler', name: 'Toddlers (2-3 Yrs)', color: 'amber' },
  { id: 'preschool', name: 'Pre-School (3-5 Yrs)', color: 'emerald' },
];

export const RoomManager: React.FC<RoomManagerProps> = ({ user }) => {
  const [children, setChildren] = useState<DbChild[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [analysis, setAnalysis] = useState<{ trafficFlow?: string; supervision?: string; inclusion?: string } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (user?.centreId) {
      db.children.getChildren(user.centreId).then(list => {
        // Mock assigning some default rooms if empty
        const preparedList = list.map((c, i) => ({
          ...c,
          // 40% chance of being scattered if not explicitly set
          roomId: c.roomId || (i % 4 === 0 ? 'toddler' : i % 3 === 0 ? 'nursery' : i % 5 === 0 ? 'preschool' : 'unassigned')
        }));
        setChildren(preparedList);
      });
    }
  }, [user]);

  const moveChild = async (childId: string, newRoomId: string) => {
    const child = children.find(c => c.id === childId);
    if (!child) return;
    
    // Optimistic UI Update Muffled
    setChildren(children.map(c => c.id === childId ? { ...c, roomId: newRoomId } : c));
    toast.success(`Moved ${child.name} to ${ROOMS.find(r => r.id === newRoomId)?.name}`);
    
    // Note: Assuming a generic updateChild function exists, or we leave it as UI local for now
    if (db.children.updateChild) {
      await db.children.updateChild(childId, { roomId: newRoomId }).catch(console.error);
    }
  };

  const getChildrenInRoom = (roomId: string) => children.filter(c => c.roomId === roomId && c.name.toLowerCase().includes(searchQuery.toLowerCase()));

  // Setup drag and drop generic logic for UI only (Click to move logic added for simple UX)
  const [selectedChild, setSelectedChild] = useState<string | null>(null);

  const analyzeRooms = async () => {
    setIsAnalyzing(true);
    try {
      const summary = ROOMS.map(room => `${room.name}: ${getChildrenInRoom(room.id).length} children`);
      setAnalysis(await analyzeRoomSetup(summary, 'early learning centre room allocation'));
      toast.success('Room analysis generated. Validate against the physical environment.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'AI analysis failed.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRoomClick = (roomId: string) => {
    if (selectedChild) {
      moveChild(selectedChild, roomId);
      setSelectedChild(null);
    }
  };

  return (
    <div className="h-full w-full bg-slate-50 flex flex-col p-6 md:p-10 overflow-y-auto">
      <div className="max-w-7xl mx-auto w-full space-y-8">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-white p-6 rounded-[2rem] shadow-sm border border-slate-200">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-neutral-100 text-neutral-800 rounded-2xl flex items-center justify-center shadow-inner">
                <LayoutGrid className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Room Manager</h1>
                <p className="text-slate-500 font-medium mt-1">Organize children across physical rooms and track occupancy.</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center w-full md:w-auto relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input 
              type="text" 
              placeholder="Locate a child..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full md:w-72 pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-neutral-400 focus:ring-2 focus:ring-neutral-400/20 rounded-xl font-medium transition-all"
            />
          </div>
          <button disabled={isAnalyzing} onClick={() => void analyzeRooms()} className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50">{isAnalyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />} Analyze layout</button>
        </header>

        {analysis ? <div className="grid gap-3 rounded-2xl border border-violet-200 bg-violet-50 p-4 md:grid-cols-3">{Object.entries(analysis).map(([label, value]) => <div key={label} className="rounded-xl bg-white p-4"><strong className="capitalize text-violet-900">{label.replace(/([A-Z])/g, ' $1')}</strong><p className="mt-1 text-sm text-slate-600">{value}</p></div>)}</div> : null}

        {selectedChild && (
          <div className="bg-indigo-600 text-white rounded-xl p-4 shadow-lg flex items-center justify-between sticky top-4 z-50 animate-in fade-in slide-in-from-top-4">
            <div className="font-medium flex items-center gap-2">
              <Settings2 className="w-5 h-5 animate-spin-slow" />
              Moving <span className="font-bold">{children.find(c => c.id === selectedChild)?.name}</span>... Click on any room below to place them.
            </div>
            <button onClick={() => setSelectedChild(null)} className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-bold transition-colors">Cancel</button>
          </div>
        )}

        {/* Board Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {ROOMS.map(room => {
            const roomChildren = getChildrenInRoom(room.id);
            const isClickTarget = selectedChild !== null;
            
            return (
              <div 
                key={room.id}
                onClick={() => isClickTarget ? handleRoomClick(room.id) : undefined}
                className={`flex flex-col bg-slate-200/50 rounded-3xl p-4 border-2 transition-all ${isClickTarget ? 'border-dashed border-indigo-400 bg-indigo-50/50 cursor-pointer hover:bg-indigo-100 hover:border-indigo-600' : 'border-slate-200'}`}
              >
                <div className="flex items-center justify-between mb-4 px-2">
                  <h3 className="font-bold text-slate-800 text-lg">{room.name}</h3>
                  <div className="flex items-center gap-1.5 bg-white shadow-sm border border-slate-200 px-2 py-1 rounded-full text-xs font-bold text-slate-600">
                    <Users className="w-3 h-3" /> {roomChildren.length}
                  </div>
                </div>

                <div className="flex-1 space-y-3 min-h-[400px]">
                  {roomChildren.length === 0 ? (
                    <div className="h-full flex items-center justify-center border-2 border-dashed border-slate-300 rounded-2xl flex-col text-slate-400 gap-2 p-6 text-center">
                      <LayoutGrid className="w-8 h-8 opacity-20" />
                      <span className="text-sm font-medium">Room Empty</span>
                    </div>
                  ) : (
                    roomChildren.map(child => (
                      <div 
                        key={child.id}
                        onClick={(e) => {
                          if (!isClickTarget) {
                            e.stopPropagation();
                            setSelectedChild(child.id);
                          }
                        }}
                        className={`bg-white p-4 rounded-2xl shadow-sm border border-slate-200 transition-all flex items-center gap-3 ${selectedChild === child.id ? 'ring-4 ring-indigo-400 scale-105 z-10 relative' : isClickTarget ? 'opacity-50 grayscale' : 'hover:border-slate-400 cursor-grab hover:shadow-md'}`}
                      >
                        <GripVertical className="w-4 h-4 text-slate-300 cursor-grab active:cursor-grabbing shrink-0" />
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 shrink-0">
                          {child.name.charAt(0)}
                        </div>
                        <div className="truncate">
                          <p className="font-bold text-slate-800 truncate">{child.name}</p>
                          <p className="text-xs text-slate-500 font-medium truncate">ID: {child.id.substring(0,6)}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </div>
  );
};
