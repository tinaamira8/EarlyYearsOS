import React, { useState } from 'react';
import { Building2, Users, MapPin, Phone, CheckCircle, ChevronRight, ChevronLeft } from 'lucide-react';

type CentreDetails = {
  name: string; address: string; phone: string; email: string;
  approvalNumber: string; maxCapacity: string;
  rooms: { name: string; ageGroup: string; capacity: string }[];
  operatingHours: { open: string; close: string };
  directorName: string;
};

interface CentreOnboardingProps {
  user: { name: string; email: string };
  onComplete: (details: CentreDetails) => void;
}

const AGE_GROUPS = ['Babies (0-2)', 'Toddlers (2-3)', 'Pre-Kindy (3-4)', 'Kindy (4-5)', 'Mixed Age'];

export const CentreOnboarding: React.FC<CentreOnboardingProps> = ({ user, onComplete }) => {
  const [step, setStep] = useState(0);
  const [details, setDetails] = useState<CentreDetails>({
    name: '', address: '', phone: '', email: user.email,
    approvalNumber: '', maxCapacity: '60',
    rooms: [{ name: 'Room 1', ageGroup: 'Babies (0-2)', capacity: '8' }],
    operatingHours: { open: '07:00', close: '18:00' },
    directorName: user.name,
  });

  const addRoom = () => setDetails(d => ({ ...d, rooms: [...d.rooms, { name: `Room ${d.rooms.length + 1}`, ageGroup: 'Toddlers (2-3)', capacity: '12' }] }));
  const removeRoom = (i: number) => setDetails(d => ({ ...d, rooms: d.rooms.filter((_, idx) => idx !== i) }));
  const updateRoom = (i: number, field: string, value: string) => setDetails(d => ({ ...d, rooms: d.rooms.map((r, idx) => idx === i ? { ...r, [field]: value } : r) }));

  const steps = [
    { title: 'Centre Details', icon: Building2 },
    { title: 'Rooms & Capacity', icon: Users },
    { title: 'Operating Hours', icon: MapPin },
    { title: 'Review & Finish', icon: CheckCircle },
  ];

  const canProceed = () => {
    if (step === 0) return details.name && details.address && details.phone;
    if (step === 1) return details.rooms.length > 0 && details.rooms.every(r => r.name && r.capacity);
    return true;
  };

  const inputCls = "w-full bg-white/10 border border-white/20 text-white placeholder-indigo-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400";
  const labelCls = "text-sm text-indigo-200 mb-1.5 block";

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/20">
            <span className="text-3xl">🌟</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Set Up Your Centre</h1>
          <p className="text-indigo-300 mt-1">Welcome, {user.name}! Let's get started.</p>
        </div>

        <div className="flex justify-center gap-2 mb-6">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${i < step ? 'bg-emerald-500 text-white' : i === step ? 'bg-indigo-500 text-white' : 'bg-white/10 text-indigo-300'}`}>
                {i < step ? <CheckCircle className="w-4 h-4" /> : i + 1}
              </div>
              {i < steps.length - 1 && <div className={`w-8 h-0.5 ${i < step ? 'bg-emerald-500' : 'bg-white/10'}`} />}
            </div>
          ))}
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-8 shadow-2xl">
          <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            {React.createElement(steps[step].icon, { className: 'w-5 h-5' })} {steps[step].title}
          </h2>

          {step === 0 && (
            <div className="space-y-4">
              <div><label className={labelCls}>Centre name *</label><input value={details.name} onChange={e => setDetails(d => ({ ...d, name: e.target.value }))} className={inputCls} placeholder="Sunshine Early Learning Centre" /></div>
              <div><label className={labelCls}>Address *</label><input value={details.address} onChange={e => setDetails(d => ({ ...d, address: e.target.value }))} className={inputCls} placeholder="123 Learning Lane, Melbourne VIC 3000" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className={labelCls}>Phone *</label><input value={details.phone} onChange={e => setDetails(d => ({ ...d, phone: e.target.value }))} className={inputCls} placeholder="03 9123 4567" /></div>
                <div><label className={labelCls}>Email</label><input value={details.email} onChange={e => setDetails(d => ({ ...d, email: e.target.value }))} className={inputCls} /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className={labelCls}>Approval number</label><input value={details.approvalNumber} onChange={e => setDetails(d => ({ ...d, approvalNumber: e.target.value }))} className={inputCls} placeholder="SE-00001234" /></div>
                <div><label className={labelCls}>Director name</label><input value={details.directorName} onChange={e => setDetails(d => ({ ...d, directorName: e.target.value }))} className={inputCls} /></div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <label className={labelCls}>Max centre capacity</label>
                <input value={details.maxCapacity} onChange={e => setDetails(d => ({ ...d, maxCapacity: e.target.value }))} className="w-20 bg-white/10 border border-white/20 text-white rounded-lg px-3 py-2 text-sm text-center focus:outline-none focus:ring-2 focus:ring-indigo-400" type="number" />
              </div>
              {details.rooms.map((room, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-white text-sm font-medium">Room {i + 1}</span>
                    {details.rooms.length > 1 && <button onClick={() => removeRoom(i)} className="text-xs text-red-400 hover:text-red-300">Remove</button>}
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div><label className={labelCls}>Name</label><input value={room.name} onChange={e => updateRoom(i, 'name', e.target.value)} className={inputCls} /></div>
                    <div>
                      <label className={labelCls}>Age group</label>
                      <select value={room.ageGroup} onChange={e => updateRoom(i, 'ageGroup', e.target.value)} className={inputCls}>
                        {AGE_GROUPS.map(ag => <option key={ag} value={ag} className="bg-slate-800">{ag}</option>)}
                      </select>
                    </div>
                    <div><label className={labelCls}>Capacity</label><input type="number" value={room.capacity} onChange={e => updateRoom(i, 'capacity', e.target.value)} className={inputCls} /></div>
                  </div>
                </div>
              ))}
              <button onClick={addRoom} className="w-full border border-dashed border-white/20 rounded-xl py-3 text-indigo-300 text-sm hover:bg-white/5 transition-colors">+ Add Room</button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className={labelCls}>Opening time</label><input type="time" value={details.operatingHours.open} onChange={e => setDetails(d => ({ ...d, operatingHours: { ...d.operatingHours, open: e.target.value } }))} className={inputCls} /></div>
                <div><label className={labelCls}>Closing time</label><input type="time" value={details.operatingHours.close} onChange={e => setDetails(d => ({ ...d, operatingHours: { ...d.operatingHours, close: e.target.value } }))} className={inputCls} /></div>
              </div>
              <div className="bg-indigo-500/10 border border-indigo-400/20 rounded-xl p-4 text-sm text-indigo-200">
                <p className="font-medium text-white mb-1">What happens next?</p>
                <ul className="space-y-1 text-xs">
                  <li>• Your centre profile will be created</li>
                  <li>• You can invite educators from the Staff section</li>
                  <li>• Add children and families in the Enrolment Manager</li>
                  <li>• All data is stored securely on Australian servers</li>
                </ul>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-indigo-300">Centre</span><span className="text-white font-medium">{details.name}</span></div>
                <div className="flex justify-between"><span className="text-indigo-300">Address</span><span className="text-white font-medium">{details.address}</span></div>
                <div className="flex justify-between"><span className="text-indigo-300">Phone</span><span className="text-white font-medium">{details.phone}</span></div>
                <div className="flex justify-between"><span className="text-indigo-300">Director</span><span className="text-white font-medium">{details.directorName}</span></div>
                <div className="flex justify-between"><span className="text-indigo-300">Rooms</span><span className="text-white font-medium">{details.rooms.length} ({details.rooms.map(r => r.name).join(', ')})</span></div>
                <div className="flex justify-between"><span className="text-indigo-300">Capacity</span><span className="text-white font-medium">{details.maxCapacity} places</span></div>
                <div className="flex justify-between"><span className="text-indigo-300">Hours</span><span className="text-white font-medium">{details.operatingHours.open} – {details.operatingHours.close}</span></div>
              </div>
            </div>
          )}

          <div className="flex justify-between mt-8">
            {step > 0 ? (
              <button onClick={() => setStep(s => s - 1)} className="flex items-center gap-1 text-indigo-300 hover:text-white text-sm"><ChevronLeft className="w-4 h-4" /> Back</button>
            ) : <div />}
            {step < 3 ? (
              <button onClick={() => setStep(s => s + 1)} disabled={!canProceed()} className="flex items-center gap-1 bg-indigo-500 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-600 disabled:opacity-40 transition-colors">
                Next <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button onClick={() => onComplete(details)} className="flex items-center gap-1 bg-emerald-500 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-emerald-600 transition-colors">
                <CheckCircle className="w-4 h-4" /> Launch Centre
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
