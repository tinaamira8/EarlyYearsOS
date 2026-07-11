import React, { useState } from 'react';
import { Settings, Bell, Moon, Sun, Lock, User, Download, Database, Upload } from 'lucide-react';
import { CsvImport } from './CsvImport';

export const UserSettings: React.FC = () => {
  const [profile, setProfile] = useState({ name: 'Amy Davis', email: 'amy.davis@sunshine-elc.com', role: 'Director', centre: 'Sunshine Early Learning Centre', phone: '0412 345 678' });
  const [notifications, setNotifications] = useState({ complianceAlerts: true, parentMessages: true, staffUpdates: true, dailyDigest: false, newsletter: true });
  const [darkMode, setDarkMode] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwords, setPasswords] = useState({ next: '', confirm: '' });
  const [passwordUpdated, setPasswordUpdated] = useState(false);

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };
  const updatePassword = (event: React.FormEvent) => {
    event.preventDefault();
    if (passwords.next.length < 8 || passwords.next !== passwords.confirm) return;
    setPasswordUpdated(true);
    setPasswords({ next: '', confirm: '' });
    setShowPasswordForm(false);
  };

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-200 rounded-xl flex items-center justify-center">
            <Settings className="w-5 h-5 text-slate-600" />
          </div>
          <div><h1 className="text-2xl font-bold text-slate-800">User Settings</h1>
            <p className="text-slate-500 text-sm">Manage your profile and preferences</p></div>
        </div>

        {/* Profile */}
        <div className="bg-white rounded-xl border border-slate-100 p-5 space-y-4">
          <h3 className="font-semibold text-slate-800 flex items-center gap-2"><User className="w-4 h-4 text-slate-400" /> Personal Information</h3>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 text-xl font-bold">{profile.name[0]}</div>
            <div>
              <p className="font-semibold text-slate-800">{profile.name}</p>
              <p className="text-sm text-slate-500">{profile.role} · {profile.centre}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { key: 'name', label: 'Full Name' },
              { key: 'email', label: 'Email Address' },
              { key: 'phone', label: 'Phone' },
              { key: 'role', label: 'Role' },
            ].map(f => (
              <div key={f.key}>
                <label className="text-xs text-slate-500 mb-1 block">{f.label}</label>
                <input className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" value={profile[f.key as keyof typeof profile]} onChange={e => setProfile(p => ({ ...p, [f.key]: e.target.value }))} />
              </div>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-xl border border-slate-100 p-5 space-y-3">
          <h3 className="font-semibold text-slate-800 flex items-center gap-2"><Bell className="w-4 h-4 text-slate-400" /> Notification Preferences</h3>
          {Object.entries(notifications).map(([key, val]) => (
            <div key={key} className="flex items-center justify-between py-1">
              <span className="text-sm text-slate-700">{key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}</span>
              <button onClick={() => setNotifications(n => ({ ...n, [key]: !val }))} className={`w-11 h-6 rounded-full transition-colors ${val ? 'bg-indigo-600' : 'bg-slate-200'} relative`}>
                <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${val ? 'left-5' : 'left-0.5'}`} />
              </button>
            </div>
          ))}
        </div>

        {/* Display */}
        <div className="bg-white rounded-xl border border-slate-100 p-5">
          <h3 className="font-semibold text-slate-800 flex items-center gap-2 mb-4">{darkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />} Display</h3>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-700">Dark Mode</span>
            <button onClick={() => setDarkMode(d => !d)} className={`w-11 h-6 rounded-full transition-colors ${darkMode ? 'bg-indigo-600' : 'bg-slate-200'} relative`}>
              <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${darkMode ? 'left-5' : 'left-0.5'}`} />
            </button>
          </div>
        </div>

        {/* Security */}
        <div className="bg-white rounded-xl border border-slate-100 p-5">
          <h3 className="font-semibold text-slate-800 flex items-center gap-2 mb-4"><Lock className="w-4 h-4 text-slate-400" /> Security</h3>
          {showPasswordForm ? (
            <form onSubmit={updatePassword} className="space-y-3">
              <input aria-label="New password" type="password" minLength={8} required value={passwords.next} onChange={event => setPasswords(current => ({ ...current, next: event.target.value }))} placeholder="New password (8+ characters)" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
              <input aria-label="Confirm password" type="password" minLength={8} required value={passwords.confirm} onChange={event => setPasswords(current => ({ ...current, confirm: event.target.value }))} placeholder="Confirm password" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
              {passwords.confirm && passwords.next !== passwords.confirm ? <p className="text-xs text-rose-600">Passwords do not match.</p> : null}
              <div className="flex gap-2">
                <button type="submit" disabled={passwords.next.length < 8 || passwords.next !== passwords.confirm} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">Update password</button>
                <button type="button" onClick={() => setShowPasswordForm(false)} className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600">Cancel</button>
              </div>
            </form>
          ) : (
            <button type="button" onClick={() => { setShowPasswordForm(true); setPasswordUpdated(false); }} className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">Change Password →</button>
          )}
          {passwordUpdated ? <p role="status" className="mt-2 text-xs font-medium text-emerald-600">Password updated for this local session.</p> : null}
        </div>

        {/* CSV Import */}
        <div className="bg-white rounded-xl border border-slate-100 p-5">
          <h3 className="font-semibold text-slate-800 flex items-center gap-2 mb-3"><Upload className="w-4 h-4 text-slate-400" /> Bulk Import</h3>
          <p className="text-xs text-slate-500 mb-3">Import children, staff, or families from a CSV file. Download the template first, fill it in, then upload.</p>
          <div className="space-y-3">
            <div>
              <p className="text-xs font-semibold text-slate-600 mb-1">Import Children</p>
              <CsvImport
                label="Upload Children CSV"
                expectedColumns={['name', 'birthday', 'room', 'medical_condition', 'allergies']}
                onImport={(rows) => {
                  const existing = JSON.parse(localStorage.getItem('eyos_imported_children') || '[]');
                  const mapped = rows.map((r, i) => ({
                    id: `imp-child-${Date.now()}-${i}`,
                    name: r.name,
                    birthday: r.birthday,
                    roomId: r.room,
                    medicalCondition: r.medical_condition,
                    allergies: r.allergies ? r.allergies.split(';').map((a: string) => a.trim()) : [],
                  }));
                  localStorage.setItem('eyos_imported_children', JSON.stringify([...existing, ...mapped]));
                }}
              />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-600 mb-1">Import Staff</p>
              <CsvImport
                label="Upload Staff CSV"
                expectedColumns={['name', 'role', 'email']}
                onImport={(rows) => {
                  const existing = JSON.parse(localStorage.getItem('eyos_imported_staff') || '[]');
                  const mapped = rows.map((r, i) => ({
                    id: `imp-staff-${Date.now()}-${i}`,
                    name: r.name,
                    role: r.role,
                    email: r.email,
                    wwcc: r.wwcc || '',
                    firstAid: r.first_aid || '',
                    cpr: r.cpr || '',
                  }));
                  localStorage.setItem('eyos_imported_staff', JSON.stringify([...existing, ...mapped]));
                }}
              />
            </div>
          </div>
        </div>

        {/* Data Backup */}
        <div className="bg-white rounded-xl border border-slate-100 p-5">
          <h3 className="font-semibold text-slate-800 flex items-center gap-2 mb-3"><Database className="w-4 h-4 text-slate-400" /> Data Management</h3>
          <p className="text-xs text-slate-500 mb-3">Export all centre data for backup or regulatory audit purposes.</p>
          <div className="flex gap-2">
            <button
              onClick={() => {
                const allData: Record<string, unknown> = {};
                for (let i = 0; i < localStorage.length; i++) {
                  const key = localStorage.key(i);
                  if (key?.startsWith('eyos_')) {
                    try { allData[key] = JSON.parse(localStorage.getItem(key) || ''); } catch { allData[key] = localStorage.getItem(key); }
                  }
                }
                const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `earlyyearsos-backup-${new Date().toISOString().split('T')[0]}.json`;
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="flex items-center gap-2 text-sm bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            >
              <Download className="w-4 h-4" /> Export All Data (JSON)
            </button>
            <button
              onClick={() => {
                if (confirm('This will remove all saved data and reset to defaults. Are you sure?')) {
                  const keysToRemove: string[] = [];
                  for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    if (key?.startsWith('eyos_')) keysToRemove.push(key);
                  }
                  keysToRemove.forEach(k => localStorage.removeItem(k));
                  window.location.reload();
                }
              }}
              className="text-sm border border-red-200 text-red-600 px-4 py-2 rounded-lg hover:bg-red-50"
            >
              Reset All Data
            </button>
          </div>
        </div>

        <div className="flex justify-end">
          <button onClick={save} className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${saved ? 'bg-emerald-600 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}>
            {saved ? '✓ Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};
