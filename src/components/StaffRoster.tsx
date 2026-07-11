import React, { useState, useEffect } from 'react';
import { db } from '../services/database';
import { DbUser, DbStaff, DbChild } from '../services/types';
import {
  Users, Calendar, Clock, Contact, MoreVertical,
  MapPin, CheckCircle, AlertTriangle, Loader2, Sparkles,
  Plus, X, Trash2, Edit2, ChevronLeft, ChevronRight,
  LogIn, LogOut, Coffee, Home, Delete, KeyRound
} from 'lucide-react';
import toast from 'react-hot-toast';
import { generateRosterInsights } from '../services/geminiService';

interface StaffRosterProps {
  user?: DbUser | null;
}

interface StaffMember {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  qualifications: string;
  pin: string;
}

interface Shift {
  id: string;
  staffId: string;
  date: string;
  start: string;
  end: string;
  room: string;
  breakStart?: string;
  breakEnd?: string;
  notes?: string;
}

type ClockEvent = 'arrive' | 'break_start' | 'break_end' | 'go_home';

interface TimeClockEntry {
  staffId: string;
  event: ClockEvent;
  time: string;
}

interface StaffStatus {
  staffId: string;
  state: 'off' | 'working' | 'on_break' | 'gone_home';
  arrived?: string;
  breakStart?: string;
  breakEnd?: string;
  departed?: string;
}

interface SignInRecord {
  staffId: string;
  signIn: string | null;
  signOut: string | null;
}

const ROOMS = ['Nursery', 'Toddler Room', 'Pre-Kindy', 'Kindy', 'Float', 'Kitchen', 'Office'];
const SHIFT_PRESETS = [
  { label: 'Early', start: '06:30', end: '14:30' },
  { label: 'Mid', start: '08:00', end: '16:00' },
  { label: 'Late', start: '09:30', end: '17:30' },
  { label: 'Close', start: '10:30', end: '18:30' },
];
const ROLES = ['Director', 'Lead Educator', 'Educator', 'Assistant Educator', 'Trainee', 'Cook', 'Admin'];

const demoStaff: StaffMember[] = [
  { id: 's1', name: 'Amy Davis', role: 'Director', email: 'director@sunshine-elc.com', phone: '0412 345 678', qualifications: 'Bachelor of ECE, First Aid', pin: '1001' },
  { id: 's2', name: 'Sarah Johnson', role: 'Lead Educator', email: 'sarah@sunshine-elc.com', phone: '0423 456 789', qualifications: 'Diploma of ECE, First Aid, WWCC', pin: '1002' },
  { id: 's3', name: 'Mark Chen', role: 'Educator', email: 'mark@sunshine-elc.com', phone: '0434 567 890', qualifications: 'Cert III ECE, First Aid, WWCC', pin: '1003' },
  { id: 's4', name: 'Lisa Nguyen', role: 'Educator', email: 'lisa@sunshine-elc.com', phone: '0445 678 901', qualifications: 'Diploma of ECE, First Aid', pin: '1004' },
  { id: 's5', name: 'James Wilson', role: 'Assistant Educator', email: 'james@sunshine-elc.com', phone: '0456 789 012', qualifications: 'Cert III ECE (in progress), WWCC', pin: '1005' },
  { id: 's6', name: 'Priya Patel', role: 'Educator', email: 'priya@sunshine-elc.com', phone: '0467 890 123', qualifications: 'Bachelor of ECE, First Aid, WWCC', pin: '1006' },
  { id: 's7', name: 'Emma Brown', role: 'Cook', email: 'emma@sunshine-elc.com', phone: '0478 901 234', qualifications: 'Food Safety Certificate', pin: '1007' },
  { id: 's8', name: 'Tom Harris', role: 'Trainee', email: 'tom@sunshine-elc.com', phone: '0489 012 345', qualifications: 'Cert III ECE (in progress)', pin: '1008' },
];

const CLOCK_EVENTS: { event: ClockEvent; label: string; icon: React.ReactNode; color: string; bg: string; border: string }[] = [
  { event: 'arrive', label: 'Arrive', icon: <LogIn className="w-4 h-4" />, color: 'text-emerald-700', bg: 'bg-emerald-50 hover:bg-emerald-100', border: 'border-emerald-200' },
  { event: 'break_start', label: 'Start Break', icon: <Coffee className="w-4 h-4" />, color: 'text-amber-700', bg: 'bg-amber-50 hover:bg-amber-100', border: 'border-amber-200' },
  { event: 'break_end', label: 'End Break', icon: <LogIn className="w-4 h-4" />, color: 'text-blue-700', bg: 'bg-blue-50 hover:bg-blue-100', border: 'border-blue-200' },
  { event: 'go_home', label: 'Go Home', icon: <Home className="w-4 h-4" />, color: 'text-rose-700', bg: 'bg-rose-50 hover:bg-rose-100', border: 'border-rose-200' },
];

const STATE_LABELS: Record<StaffStatus['state'], { label: string; color: string; dot: string }> = {
  off: { label: 'Not arrived', color: 'text-slate-400', dot: 'bg-slate-300' },
  working: { label: 'Working', color: 'text-emerald-600', dot: 'bg-emerald-500' },
  on_break: { label: 'On break', color: 'text-amber-600', dot: 'bg-amber-500' },
  gone_home: { label: 'Gone home', color: 'text-slate-500', dot: 'bg-slate-400' },
};

const getWeekDates = (baseDate: Date): string[] => {
  const monday = new Date(baseDate);
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(d.getDate() + i);
    return d.toISOString().split('T')[0];
  });
};

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr + 'T00:00:00');
  return { day: d.toLocaleDateString('en-AU', { weekday: 'short' }), date: d.getDate() };
};

const today = new Date().toISOString().split('T')[0];

const buildDemoShifts = (staff: StaffMember[], dates: string[]): Shift[] => {
  const shifts: Shift[] = [];
  staff.forEach((s, si) => {
    dates.forEach((date, di) => {
      if (di >= 5 && si > 3) return;
      if (di === 6 && si > 1) return;
      const preset = SHIFT_PRESETS[si % SHIFT_PRESETS.length];
      shifts.push({
        id: `shift-${s.id}-${date}`,
        staffId: s.id,
        date,
        start: preset.start,
        end: preset.end,
        room: ROOMS[si % 5],
      });
    });
  });
  return shifts;
};

export const StaffRoster: React.FC<StaffRosterProps> = ({ user }) => {
  const [dbStaff, setDbStaff] = useState<DbStaff[]>([]);
  const [children, setChildren] = useState<DbChild[]>([]);
  const [activeView, setActiveView] = useState<'daily' | 'weekly'>('daily');
  const [published, setPublished] = useState(false);
  const [insights, setInsights] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const [staff, setStaff] = useState<StaffMember[]>(demoStaff);
  const [weekBase, setWeekBase] = useState(new Date());
  const weekDates = getWeekDates(weekBase);
  const [selectedDate, setSelectedDate] = useState(today);
  const [shifts, setShifts] = useState<Shift[]>(() => buildDemoShifts(demoStaff, getWeekDates(new Date())));

  const [signIns, setSignIns] = useState<SignInRecord[]>([
    { staffId: 's1', signIn: '06:28', signOut: null },
    { staffId: 's2', signIn: '07:55', signOut: null },
    { staffId: 's3', signIn: '09:27', signOut: null },
  ]);

  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [pinSuccess, setPinSuccess] = useState('');
  const [clockLog, setClockLog] = useState<TimeClockEntry[]>([
    { staffId: 's1', event: 'arrive', time: '06:28' },
    { staffId: 's2', event: 'arrive', time: '07:55' },
    { staffId: 's2', event: 'break_start', time: '12:00' },
    { staffId: 's2', event: 'break_end', time: '12:30' },
    { staffId: 's3', event: 'arrive', time: '09:27' },
  ]);

  const getStaffStatus = (staffId: string): StaffStatus => {
    const events = clockLog.filter(e => e.staffId === staffId);
    if (!events.length) return { staffId, state: 'off' };
    const last = events[events.length - 1];
    const arrived = events.find(e => e.event === 'arrive')?.time;
    const breakStart = events.find(e => e.event === 'break_start')?.time;
    const breakEnd = events.find(e => e.event === 'break_end')?.time;
    const departed = events.find(e => e.event === 'go_home')?.time;
    let state: StaffStatus['state'] = 'off';
    if (last.event === 'arrive' || last.event === 'break_end') state = 'working';
    else if (last.event === 'break_start') state = 'on_break';
    else if (last.event === 'go_home') state = 'gone_home';
    return { staffId, state, arrived, breakStart, breakEnd, departed };
  };

  const getAvailableActions = (status: StaffStatus): ClockEvent[] => {
    switch (status.state) {
      case 'off': return ['arrive'];
      case 'working': return ['break_start', 'go_home'];
      case 'on_break': return ['break_end'];
      case 'gone_home': return [];
    }
  };

  const handlePinDigit = (digit: string) => {
    setPinError('');
    setPinSuccess('');
    if (pinInput.length < 4) setPinInput(prev => prev + digit);
  };

  const handlePinClear = () => { setPinInput(''); setPinError(''); setPinSuccess(''); };
  const handlePinBackspace = () => { setPinInput(prev => prev.slice(0, -1)); setPinError(''); };

  const handleClockAction = (event: ClockEvent) => {
    if (pinInput.length !== 4) { setPinError('Enter your 4-digit PIN first.'); return; }
    const member = staff.find(s => s.pin === pinInput);
    if (!member) { setPinError('Invalid PIN. Please try again.'); setPinInput(''); return; }
    const status = getStaffStatus(member.id);
    const available = getAvailableActions(status);
    if (!available.includes(event)) {
      const eventLabel = CLOCK_EVENTS.find(e => e.event === event)?.label || event;
      setPinError(`${member.name} cannot "${eventLabel}" right now (currently: ${STATE_LABELS[status.state].label}).`);
      setPinInput('');
      return;
    }
    const time = nowTime();
    setClockLog(prev => [...prev, { staffId: member.id, event, time }]);
    if (event === 'arrive') {
      setSignIns(prev => {
        const existing = prev.find(r => r.staffId === member.id);
        if (existing) return prev.map(r => r.staffId === member.id ? { ...r, signIn: time, signOut: null } : r);
        return [...prev, { staffId: member.id, signIn: time, signOut: null }];
      });
    } else if (event === 'go_home') {
      setSignIns(prev => prev.map(r => r.staffId === member.id ? { ...r, signOut: time } : r));
    }
    const eventLabel = CLOCK_EVENTS.find(e => e.event === event)?.label || event;
    setPinSuccess(`${member.name} — ${eventLabel} at ${time}`);
    setPinInput('');
    toast.success(`${member.name}: ${eventLabel} recorded at ${time}`);
    setTimeout(() => setPinSuccess(''), 4000);
  };

  const workingCount = staff.filter(s => getStaffStatus(s.id).state === 'working').length;
  const onBreakCount = staff.filter(s => getStaffStatus(s.id).state === 'on_break').length;

  const [showAddStaff, setShowAddStaff] = useState(false);
  const [showAddShift, setShowAddShift] = useState(false);
  const [editingShift, setEditingShift] = useState<Shift | null>(null);
  const [newStaff, setNewStaff] = useState<Omit<StaffMember, 'id'>>({ name: '', role: 'Educator', email: '', phone: '', qualifications: '', pin: '' });
  const [newShift, setNewShift] = useState<Omit<Shift, 'id'>>({ staffId: '', date: selectedDate, start: '08:00', end: '16:00', room: ROOMS[0] });

  useEffect(() => {
    if (user?.centreId) {
      db.staff.getStaff(user.centreId).then(setDbStaff).catch(console.error);
      db.children.getChildren(user.centreId).then(setChildren).catch(console.error);
    }
  }, [user]);

  const childCount = children.length || 3;
  const staffRatioRequirement = Math.ceil(childCount / 4);
  const todayShifts = shifts.filter(s => s.date === selectedDate);
  const rosteredStaffToday = new Set(todayShifts.map(s => s.staffId)).size;

  const addStaff = () => {
    if (!newStaff.name.trim()) return toast.error('Enter a staff name.');
    const pin = newStaff.pin || String(1000 + staff.length + 1);
    if (pin.length !== 4 || !/^\d{4}$/.test(pin)) return toast.error('PIN must be exactly 4 digits.');
    if (staff.some(s => s.pin === pin)) return toast.error('This PIN is already in use.');
    const member: StaffMember = { ...newStaff, pin, id: `s${Date.now()}` };
    setStaff(prev => [...prev, member]);
    setNewStaff({ name: '', role: 'Educator', email: '', phone: '', qualifications: '', pin: '' });
    setShowAddStaff(false);
    toast.success(`${member.name} added to staff list.`);
  };

  const removeStaff = (id: string) => {
    const member = staff.find(s => s.id === id);
    setStaff(prev => prev.filter(s => s.id !== id));
    setShifts(prev => prev.filter(s => s.staffId !== id));
    toast.success(`${member?.name || 'Staff'} removed.`);
  };

  const addShift = () => {
    if (!newShift.staffId) return toast.error('Select a staff member.');
    const existing = shifts.find(s => s.staffId === newShift.staffId && s.date === newShift.date);
    if (existing) return toast.error('This staff member already has a shift on this date.');
    const shift: Shift = { ...newShift, id: `shift-${Date.now()}` };
    setShifts(prev => [...prev, shift]);
    setShowAddShift(false);
    setNewShift({ staffId: '', date: selectedDate, start: '08:00', end: '16:00', room: ROOMS[0] });
    toast.success('Shift added.');
  };

  const updateShift = () => {
    if (!editingShift) return;
    setShifts(prev => prev.map(s => s.id === editingShift.id ? editingShift : s));
    setEditingShift(null);
    toast.success('Shift updated.');
  };

  const removeShift = (id: string) => {
    setShifts(prev => prev.filter(s => s.id !== id));
    toast.success('Shift removed.');
  };

  const applyPreset = (preset: typeof SHIFT_PRESETS[0]) => {
    if (editingShift) {
      setEditingShift({ ...editingShift, start: preset.start, end: preset.end });
    } else {
      setNewShift(prev => ({ ...prev, start: preset.start, end: preset.end }));
    }
  };

  const copyPreviousWeek = () => {
    const prevWeekBase = new Date(weekBase);
    prevWeekBase.setDate(prevWeekBase.getDate() - 7);
    const prevDates = getWeekDates(prevWeekBase);
    const prevShifts = shifts.filter(s => prevDates.includes(s.date));
    if (!prevShifts.length) return toast.error('No shifts found in previous week to copy.');
    const newShifts = prevShifts.map(s => {
      const dayIndex = prevDates.indexOf(s.date);
      return { ...s, id: `shift-${Date.now()}-${Math.random()}`, date: weekDates[dayIndex] };
    }).filter(s => !shifts.find(ex => ex.staffId === s.staffId && ex.date === s.date));
    setShifts(prev => [...prev, ...newShifts]);
    toast.success(`${newShifts.length} shifts copied from previous week.`);
  };

  const analyzeRoster = async () => {
    setIsGenerating(true);
    try {
      const rosterData = todayShifts.map(s => {
        const member = staff.find(m => m.id === s.staffId);
        return { name: member?.name, role: member?.role, shift: { start: s.start, end: s.end, room: s.room } };
      });
      const rooms = [...new Set(todayShifts.map(s => s.room))];
      setInsights(await generateRosterInsights(rosterData, rooms, [{ count: childCount }]));
      toast.success('Roster insights generated.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'AI analysis failed.');
    } finally {
      setIsGenerating(false);
    }
  };

  const nowTime = () => new Date().toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit', hour12: false });

  const signInStaff = (staffId: string) => {
    const time = nowTime();
    setSignIns(prev => {
      const existing = prev.find(r => r.staffId === staffId);
      if (existing) return prev.map(r => r.staffId === staffId ? { ...r, signIn: time, signOut: null } : r);
      return [...prev, { staffId, signIn: time, signOut: null }];
    });
    toast.success(`${getStaffName(staffId)} signed in at ${time}.`);
  };

  const signOutStaff = (staffId: string) => {
    const time = nowTime();
    setSignIns(prev => prev.map(r => r.staffId === staffId ? { ...r, signOut: time } : r));
    toast.success(`${getStaffName(staffId)} signed out at ${time}.`);
  };

  const signedInCount = signIns.filter(r => r.signIn && !r.signOut).length;

  const prevWeek = () => { const d = new Date(weekBase); d.setDate(d.getDate() - 7); setWeekBase(d); };
  const nextWeek = () => { const d = new Date(weekBase); d.setDate(d.getDate() + 7); setWeekBase(d); };

  const getStaffName = (id: string) => staff.find(s => s.id === id)?.name || 'Unknown';

  return (
    <div className="h-full w-full bg-slate-50 flex flex-col p-4 md:p-8 overflow-y-auto">
      <div className="max-w-7xl mx-auto w-full space-y-6">

        {/* Header */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
              <Contact className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900">Staff Roster</h1>
              <p className="text-slate-500 text-sm">Manage educator scheduling and ensure compliance ratios.</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button disabled={isGenerating} onClick={() => void analyzeRoster()} className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50 hover:bg-violet-700 transition-colors">
              {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />} Analyze
            </button>
            <div className="bg-slate-100 p-1 rounded-lg flex">
              <button onClick={() => setActiveView('daily')} className={`px-3 py-1.5 text-sm font-bold rounded-md transition-colors ${activeView === 'daily' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>Daily</button>
              <button onClick={() => setActiveView('weekly')} className={`px-3 py-1.5 text-sm font-bold rounded-md transition-colors ${activeView === 'weekly' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>Weekly</button>
            </div>
            <button onClick={() => { setPublished(true); toast.success('Roster published and staff notified.'); }} className="px-4 py-2 bg-purple-600 text-white text-sm font-semibold rounded-xl hover:bg-purple-700 transition-colors">
              {published ? '✓ Published' : 'Publish Roster'}
            </button>
          </div>
        </header>

        {/* AI Insights */}
        {insights.length > 0 && (
          <div className="grid gap-3 rounded-2xl border border-violet-200 bg-violet-50 p-4 md:grid-cols-3">
            {insights.map((insight, i) => <div key={i} className="rounded-xl bg-white p-4 text-sm text-slate-700">{insight}</div>)}
          </div>
        )}

        {/* Ratio Status */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Centre Ratio Status</h3>
            <p className="text-sm text-slate-500 mt-1">Based on {childCount} children, you need at least {staffRatioRequirement} educators on the floor.</p>
          </div>
          <div className="flex gap-5 items-center">
            <div className="text-center">
              <p className="text-2xl font-black text-slate-900">{childCount}</p>
              <p className="text-xs text-slate-500 font-bold uppercase">Children</p>
            </div>
            <div className="w-px h-10 bg-slate-200" />
            <div className="text-center">
              <p className="text-2xl font-black text-purple-600">{rosteredStaffToday}</p>
              <p className="text-xs text-purple-600 font-bold uppercase">Staff Rostered</p>
            </div>
            <div className="w-px h-10 bg-slate-200" />
            {rosteredStaffToday >= staffRatioRequirement ? (
              <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-2 rounded-xl">
                <CheckCircle className="w-4 h-4" /> <span className="font-bold text-sm">Ratio Met</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 px-3 py-2 rounded-xl">
                <AlertTriangle className="w-4 h-4" /> <span className="font-bold text-sm">Ratio Warning</span>
              </div>
            )}
          </div>
        </div>

        {/* Staff List */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 flex items-center gap-2"><Users className="w-4 h-4 text-purple-500" /> Staff Members ({staff.length})</h3>
            <button onClick={() => setShowAddStaff(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 text-white text-xs font-semibold rounded-lg hover:bg-purple-700 transition-colors">
              <Plus className="w-3.5 h-3.5" /> Add Staff
            </button>
          </div>
          <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
            {staff.map(s => (
              <div key={s.id} className="px-5 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center font-bold text-sm">{s.name.charAt(0)}</div>
                  <div>
                    <h4 className="font-semibold text-slate-900 text-sm">{s.name}</h4>
                    <p className="text-xs text-slate-500">{s.role} · {s.qualifications}</p>
                  </div>
                </div>
                <button onClick={() => removeStaff(s.id)} className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
        </div>

        {/* PIN Time Clock */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-purple-500" /> Staff PIN Time Clock
            </h3>
            <div className="flex gap-2">
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">{workingCount} working</span>
              {onBreakCount > 0 && <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg">{onBreakCount} on break</span>}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
            {/* PIN Pad */}
            <div className="p-6 flex flex-col items-center">
              <p className="text-xs text-slate-500 font-medium mb-3">Enter your 4-digit staff PIN</p>

              {/* PIN Display */}
              <div className="flex gap-3 mb-4">
                {[0, 1, 2, 3].map(i => (
                  <div key={i} className={`w-12 h-14 rounded-xl border-2 flex items-center justify-center text-2xl font-black transition-colors ${pinInput[i] ? 'border-purple-400 bg-purple-50 text-purple-700' : 'border-slate-200 bg-slate-50 text-slate-300'}`}>
                    {pinInput[i] ? '•' : '—'}
                  </div>
                ))}
              </div>

              {/* Error / Success Messages */}
              {pinError && <div className="mb-3 px-4 py-2 bg-red-50 border border-red-200 rounded-xl text-xs font-semibold text-red-600 text-center max-w-[280px]">{pinError}</div>}
              {pinSuccess && <div className="mb-3 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-700 text-center max-w-[280px]">{pinSuccess}</div>}

              {/* Number Pad */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                {['1','2','3','4','5','6','7','8','9'].map(d => (
                  <button key={d} onClick={() => handlePinDigit(d)} className="w-16 h-12 bg-slate-100 hover:bg-slate-200 rounded-xl text-lg font-bold text-slate-800 transition-colors active:bg-purple-100">
                    {d}
                  </button>
                ))}
                <button onClick={handlePinClear} className="w-16 h-12 bg-slate-100 hover:bg-red-100 rounded-xl text-xs font-bold text-slate-500 transition-colors">Clear</button>
                <button onClick={() => handlePinDigit('0')} className="w-16 h-12 bg-slate-100 hover:bg-slate-200 rounded-xl text-lg font-bold text-slate-800 transition-colors active:bg-purple-100">0</button>
                <button onClick={handlePinBackspace} className="w-16 h-12 bg-slate-100 hover:bg-amber-100 rounded-xl flex items-center justify-center text-slate-500 transition-colors"><Delete className="w-5 h-5" /></button>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 w-full max-w-[280px]">
                {CLOCK_EVENTS.map(ce => (
                  <button
                    key={ce.event}
                    onClick={() => handleClockAction(ce.event)}
                    className={`flex items-center justify-center gap-2 px-3 py-3 rounded-xl border text-sm font-bold transition-colors ${ce.color} ${ce.bg} ${ce.border}`}
                  >
                    {ce.icon} {ce.label}
                  </button>
                ))}
              </div>

              <p className="mt-4 text-[10px] text-slate-400 text-center">Demo PINs: Amy 1001 · Sarah 1002 · Mark 1003 · Lisa 1004<br/>James 1005 · Priya 1006 · Emma 1007 · Tom 1008</p>
            </div>

            {/* Staff Status Board */}
            <div className="p-4">
              <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3 px-1">Today's Status</h4>
              <div className="space-y-1.5 max-h-[420px] overflow-y-auto">
                {staff.map(member => {
                  const status = getStaffStatus(member.id);
                  const stateInfo = STATE_LABELS[status.state];
                  return (
                    <div key={member.id} className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${stateInfo.dot}`} />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-800 truncate">{member.name}</p>
                          <p className={`text-[11px] font-medium ${stateInfo.color}`}>{stateInfo.label}</p>
                        </div>
                      </div>
                      <div className="text-right text-[11px] text-slate-500 shrink-0 ml-2">
                        {status.arrived && <div><span className="font-semibold text-slate-600">In</span> {status.arrived}</div>}
                        {status.breakStart && <div><span className="font-semibold text-amber-600">Brk</span> {status.breakStart}{status.breakEnd ? `–${status.breakEnd}` : '...'}</div>}
                        {status.departed && <div><span className="font-semibold text-slate-600">Out</span> {status.departed}</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Add Staff Modal */}
        {showAddStaff && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm" onClick={() => setShowAddStaff(false)}>
            <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900">Add Staff Member</h3>
                <button onClick={() => setShowAddStaff(false)} className="p-1 text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-slate-600 mb-1 block">Full Name *</label>
                  <input className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none" value={newStaff.name} onChange={e => setNewStaff(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Sarah Johnson" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-slate-600 mb-1 block">Role *</label>
                    <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none" value={newStaff.role} onChange={e => setNewStaff(p => ({ ...p, role: e.target.value }))}>
                      {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-600 mb-1 block">Phone</label>
                    <input className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none" value={newStaff.phone} onChange={e => setNewStaff(p => ({ ...p, phone: e.target.value }))} placeholder="0412 345 678" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600 mb-1 block">Email</label>
                  <input className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none" value={newStaff.email} onChange={e => setNewStaff(p => ({ ...p, email: e.target.value }))} placeholder="staff@centre.com" />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600 mb-1 block">Qualifications</label>
                  <input className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none" value={newStaff.qualifications} onChange={e => setNewStaff(p => ({ ...p, qualifications: e.target.value }))} placeholder="e.g. Diploma of ECE, First Aid, WWCC" />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600 mb-1 block">4-Digit PIN *</label>
                  <input className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none font-mono tracking-widest" value={newStaff.pin} onChange={e => setNewStaff(p => ({ ...p, pin: e.target.value.replace(/\D/g, '').slice(0, 4) }))} placeholder="e.g. 1009" maxLength={4} inputMode="numeric" />
                </div>
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <button onClick={() => setShowAddStaff(false)} className="px-4 py-2 text-sm border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50">Cancel</button>
                <button onClick={addStaff} className="px-4 py-2 text-sm bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700">Add Staff</button>
              </div>
            </div>
          </div>
        )}

        {/* Shifts Section */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          {/* Date Navigation */}
          <div className="px-5 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            {activeView === 'daily' ? (
              <>
                <div className="flex items-center gap-2">
                  <button onClick={() => { const d = new Date(selectedDate); d.setDate(d.getDate() - 1); setSelectedDate(d.toISOString().split('T')[0]); }} className="p-1 hover:bg-slate-200 rounded-lg transition-colors"><ChevronLeft className="w-4 h-4" /></button>
                  <h3 className="font-bold text-slate-800">{new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</h3>
                  <button onClick={() => { const d = new Date(selectedDate); d.setDate(d.getDate() + 1); setSelectedDate(d.toISOString().split('T')[0]); }} className="p-1 hover:bg-slate-200 rounded-lg transition-colors"><ChevronRight className="w-4 h-4" /></button>
                </div>
                <button onClick={() => { setNewShift(prev => ({ ...prev, date: selectedDate })); setShowAddShift(true); }} className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 text-white text-xs font-semibold rounded-lg hover:bg-purple-700">
                  <Plus className="w-3.5 h-3.5" /> Add Shift
                </button>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <button onClick={prevWeek} className="p-1 hover:bg-slate-200 rounded-lg transition-colors"><ChevronLeft className="w-4 h-4" /></button>
                  <h3 className="font-bold text-slate-800">
                    {new Date(weekDates[0] + 'T00:00:00').toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })} – {new Date(weekDates[6] + 'T00:00:00').toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </h3>
                  <button onClick={nextWeek} className="p-1 hover:bg-slate-200 rounded-lg transition-colors"><ChevronRight className="w-4 h-4" /></button>
                </div>
                <div className="flex gap-2">
                  <button onClick={copyPreviousWeek} className="px-3 py-1.5 text-xs font-semibold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-100">Copy Previous Week</button>
                  <button onClick={() => { setNewShift(prev => ({ ...prev, date: weekDates[0] })); setShowAddShift(true); }} className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 text-white text-xs font-semibold rounded-lg hover:bg-purple-700">
                    <Plus className="w-3.5 h-3.5" /> Add Shift
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Daily View */}
          {activeView === 'daily' && (
            <div className="divide-y divide-slate-100">
              {todayShifts.length === 0 ? (
                <div className="p-12 text-center">
                  <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500 font-medium">No shifts scheduled for this day.</p>
                  <button onClick={() => { setNewShift(prev => ({ ...prev, date: selectedDate })); setShowAddShift(true); }} className="mt-3 text-sm text-purple-600 font-semibold hover:underline">+ Add a shift</button>
                </div>
              ) : (
                todayShifts.map(shift => {
                  const member = staff.find(s => s.id === shift.staffId);
                  return (
                    <div key={shift.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                          {member?.name.charAt(0) || '?'}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-semibold text-slate-900 text-sm truncate">{member?.name || 'Unknown'}</h4>
                          <p className="text-xs text-slate-500">{member?.role}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="bg-slate-100 px-3 py-1.5 rounded-lg flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-sm font-bold text-slate-700">{shift.start} – {shift.end}</span>
                        </div>
                        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-600">
                          <MapPin className="w-3 h-3" /> {shift.room}
                        </div>
                        <button onClick={() => setEditingShift(shift)} className="p-1.5 text-slate-400 hover:text-purple-600 transition-colors"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => removeShift(shift.id)} className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* Weekly View */}
          {activeView === 'weekly' && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="px-4 py-3 text-left font-bold text-slate-600 text-xs uppercase w-40 sticky left-0 bg-slate-50 z-10">Staff</th>
                    {weekDates.map(date => {
                      const { day, date: d } = formatDate(date);
                      const isToday = date === today;
                      return (
                        <th key={date} className={`px-2 py-3 text-center min-w-[110px] ${isToday ? 'bg-purple-50' : ''}`}>
                          <span className="text-xs text-slate-500 font-medium">{day}</span>
                          <span className={`block text-sm font-bold ${isToday ? 'text-purple-600' : 'text-slate-800'}`}>{d}</span>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {staff.map(member => (
                    <tr key={member.id} className="hover:bg-slate-50/50">
                      <td className="px-4 py-3 sticky left-0 bg-white z-10">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center font-bold text-xs">{member.name.charAt(0)}</div>
                          <div>
                            <p className="font-semibold text-slate-800 text-xs">{member.name}</p>
                            <p className="text-[10px] text-slate-400">{member.role}</p>
                          </div>
                        </div>
                      </td>
                      {weekDates.map(date => {
                        const shift = shifts.find(s => s.staffId === member.id && s.date === date);
                        const isToday = date === today;
                        return (
                          <td key={date} className={`px-1 py-2 text-center ${isToday ? 'bg-purple-50/50' : ''}`}>
                            {shift ? (
                              <button onClick={() => setEditingShift(shift)} className="w-full px-2 py-1.5 bg-purple-100 text-purple-800 rounded-lg text-xs font-semibold hover:bg-purple-200 transition-colors">
                                <div>{shift.start}–{shift.end}</div>
                                <div className="text-[10px] text-purple-600 font-medium truncate">{shift.room}</div>
                              </button>
                            ) : (
                              <button onClick={() => { setNewShift({ staffId: member.id, date, start: '08:00', end: '16:00', room: ROOMS[0] }); setShowAddShift(true); }} className="w-full py-3 text-slate-300 hover:text-purple-400 hover:bg-purple-50 rounded-lg transition-colors">
                                <Plus className="w-4 h-4 mx-auto" />
                              </button>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Add Shift Modal */}
        {showAddShift && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm" onClick={() => setShowAddShift(false)}>
            <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900">Add Shift</h3>
                <button onClick={() => setShowAddShift(false)} className="p-1 text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-slate-600 mb-1 block">Staff Member *</label>
                  <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none" value={newShift.staffId} onChange={e => setNewShift(p => ({ ...p, staffId: e.target.value }))}>
                    <option value="">Select staff...</option>
                    {staff.map(s => <option key={s.id} value={s.id}>{s.name} ({s.role})</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600 mb-1 block">Date</label>
                  <input type="date" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none" value={newShift.date} onChange={e => setNewShift(p => ({ ...p, date: e.target.value }))} />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600 mb-2 block">Shift Preset</label>
                  <div className="flex gap-2">
                    {SHIFT_PRESETS.map(p => (
                      <button key={p.label} onClick={() => applyPreset(p)} className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${newShift.start === p.start && newShift.end === p.end ? 'bg-purple-600 text-white border-purple-600' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                        {p.label}<br /><span className="text-[10px] font-normal">{p.start}–{p.end}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-slate-600 mb-1 block">Start Time</label>
                    <input type="time" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none" value={newShift.start} onChange={e => setNewShift(p => ({ ...p, start: e.target.value }))} />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-600 mb-1 block">End Time</label>
                    <input type="time" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none" value={newShift.end} onChange={e => setNewShift(p => ({ ...p, end: e.target.value }))} />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600 mb-1 block">Room Assignment</label>
                  <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none" value={newShift.room} onChange={e => setNewShift(p => ({ ...p, room: e.target.value }))}>
                    {ROOMS.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <button onClick={() => setShowAddShift(false)} className="px-4 py-2 text-sm border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50">Cancel</button>
                <button onClick={addShift} className="px-4 py-2 text-sm bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700">Add Shift</button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Shift Modal */}
        {editingShift && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm" onClick={() => setEditingShift(null)}>
            <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900">Edit Shift — {getStaffName(editingShift.staffId)}</h3>
                <button onClick={() => setEditingShift(null)} className="p-1 text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-slate-600 mb-1 block">Date</label>
                  <input type="date" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none" value={editingShift.date} onChange={e => setEditingShift({ ...editingShift, date: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600 mb-2 block">Shift Preset</label>
                  <div className="flex gap-2">
                    {SHIFT_PRESETS.map(p => (
                      <button key={p.label} onClick={() => applyPreset(p)} className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${editingShift.start === p.start && editingShift.end === p.end ? 'bg-purple-600 text-white border-purple-600' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                        {p.label}<br /><span className="text-[10px] font-normal">{p.start}–{p.end}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-slate-600 mb-1 block">Start Time</label>
                    <input type="time" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none" value={editingShift.start} onChange={e => setEditingShift({ ...editingShift, start: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-600 mb-1 block">End Time</label>
                    <input type="time" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none" value={editingShift.end} onChange={e => setEditingShift({ ...editingShift, end: e.target.value })} />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600 mb-1 block">Room Assignment</label>
                  <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none" value={editingShift.room} onChange={e => setEditingShift({ ...editingShift, room: e.target.value })}>
                    {ROOMS.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600 mb-1 block">Notes</label>
                  <input className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none" value={editingShift.notes || ''} onChange={e => setEditingShift({ ...editingShift, notes: e.target.value })} placeholder="e.g. covering for Lisa" />
                </div>
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <button onClick={() => { removeShift(editingShift.id); setEditingShift(null); }} className="px-4 py-2 text-sm border border-red-200 text-red-600 rounded-lg hover:bg-red-50 mr-auto">Delete Shift</button>
                <button onClick={() => setEditingShift(null)} className="px-4 py-2 text-sm border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50">Cancel</button>
                <button onClick={updateShift} className="px-4 py-2 text-sm bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700">Save Changes</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
