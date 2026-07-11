import React, { useState } from 'react';
import { FileText, Loader2, Plus, Sparkles, Trash2, Download, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import { generateIncidentReport } from '../services/geminiService';
import { usePersistedState } from '../hooks/usePersistedState';
import { exportIncidentPDF } from '../services/exportEngine';

type Incident = {
  id: number; date: string; time: string; child: string; type: string;
  location: string; description: string; injuryDetails: string; bodyArea: string;
  firstAid: string; action: string; educatorOnDuty: string; witnesses: string;
  parentNotified: boolean; parentNotifiedTime: string; status: string;
};

const initialIncidents: Incident[] = [
  { id: 1, date: '2026-05-20', time: '10:30', child: 'Leo Martinez', type: 'Minor Injury', location: 'Outdoor play area', description: 'Fell on outdoor equipment, grazed knee', injuryDetails: 'Superficial graze on right knee, approx 2cm', bodyArea: 'Right knee', firstAid: 'Wound cleaned with saline, adhesive dressing applied, ice pack for 10 min', action: 'First aid applied, ice pack, parents notified', educatorOnDuty: 'Lisa Chen', witnesses: 'Emma Wilson (child), Sarah Johnson (educator)', parentNotified: true, parentNotifiedTime: '10:45', status: 'Closed' },
  { id: 2, date: '2026-05-22', time: '13:15', child: 'Emma Wilson', type: 'Illness', location: 'Possum Room', description: 'Child developed fever during the day (38.5°C)', injuryDetails: 'N/A', bodyArea: 'N/A', firstAid: 'Temperature monitored, cool cloth applied, child rested in quiet area', action: 'Parents called, child collected at 2pm', educatorOnDuty: 'Lisa Chen', witnesses: 'Sarah Johnson (Director)', parentNotified: true, parentNotifiedTime: '13:20', status: 'Closed' },
  { id: 3, date: '2026-05-23', time: '11:00', child: 'Noah Kim', type: 'Behavioural', location: 'Indoor play area', description: 'Biting incident with peer', injuryDetails: 'Bite mark on left forearm of affected child, no broken skin', bodyArea: 'Left forearm', firstAid: 'Cold compress applied to affected child', action: 'Both children comforted, parents of both notified, behaviour plan reviewed', educatorOnDuty: 'Lisa Chen', witnesses: 'Amy Davis (educator)', parentNotified: true, parentNotifiedTime: '11:15', status: 'Under Review' },
];

const types = ['Minor Injury', 'Serious Injury', 'Illness', 'Behavioural', 'Near Miss', 'Medication Error', 'Allergic Reaction', 'Other'];
const locations = ['Indoor play area', 'Outdoor play area', 'Bathroom', 'Kitchen/eating area', 'Sleep room', 'Foyer/entry', 'Excursion', 'Other'];
const bodyAreas = ['N/A', 'Head', 'Face', 'Left arm', 'Right arm', 'Left hand', 'Right hand', 'Torso', 'Left leg', 'Right leg', 'Left knee', 'Right knee', 'Left foot', 'Right foot', 'Back', 'Multiple areas'];

const emptyForm = (): Omit<Incident, 'id' | 'status'> => ({
  date: new Date().toISOString().split('T')[0], time: new Date().toTimeString().substring(0, 5),
  child: '', type: 'Minor Injury', location: 'Indoor play area',
  description: '', injuryDetails: '', bodyArea: 'N/A', firstAid: '',
  action: '', educatorOnDuty: '', witnesses: '',
  parentNotified: false, parentNotifiedTime: '',
});

export const IncidentReports: React.FC = () => {
  const [incidents, setIncidents] = usePersistedState('incident_reports', initialIncidents);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm());
  const [isGenerating, setIsGenerating] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const improveDraft = async () => {
    if (!form.description.trim()) return toast.error('Enter factual incident notes first.');
    setIsGenerating(true);
    try {
      const result = await generateIncidentReport({ date: form.date, type: form.type, description: form.description, actionTaken: form.action, parentNotified: form.parentNotified }) as { formalDescription?: string; regulatoryNotes?: string };
      setForm(current => ({ ...current, description: result.formalDescription || current.description, action: [current.action, result.regulatoryNotes].filter(Boolean).join('\n') }));
      toast.success('Draft improved. Verify every fact before submitting.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'AI generation failed.');
    } finally {
      setIsGenerating(false);
    }
  };

  const validate = (): string[] => {
    const errs: string[] = [];
    if (!form.child.trim()) errs.push('Child name is required');
    if (!form.date) errs.push('Date is required');
    if (!form.time) errs.push('Time of incident is required');
    if (!form.description.trim()) errs.push('Description is required');
    if (!form.educatorOnDuty.trim()) errs.push('Educator on duty is required');
    if (!form.action.trim()) errs.push('Action taken is required');
    if (form.type.includes('Injury') && !form.injuryDetails.trim()) errs.push('Injury details are required for injury reports');
    if (form.type.includes('Injury') && form.bodyArea === 'N/A') errs.push('Body area must be specified for injury reports');
    if (form.parentNotified && !form.parentNotifiedTime) errs.push('Parent notification time is required');
    return errs;
  };

  const submit = () => {
    const errs = validate();
    if (errs.length > 0) { setErrors(errs); return; }
    setErrors([]);
    setIncidents(i => [...i, { ...form, id: Date.now(), status: 'Open' }]);
    setForm(emptyForm());
    setShowForm(false);
    toast.success('Incident report submitted');
  };

  const inputCls = "w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300";
  const labelCls = "text-xs text-slate-500 mb-1 block";
  const reqCls = "text-red-400 ml-0.5";

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
            <FileText className="w-5 h-5 text-red-600" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-slate-800">Incident Reports</h1>
            <p className="text-slate-500 text-sm">Log and track incidents — Reg 176 compliant</p>
          </div>
          <button onClick={() => { setShowForm(!showForm); setErrors([]); }} className="flex items-center gap-2 bg-indigo-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
            <Plus className="w-4 h-4" /> New Report
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
            <h3 className="font-semibold text-slate-800">New Incident Report</h3>
            <p className="text-xs text-slate-400">Fields marked with <span className="text-red-400">*</span> are mandatory under Education and Care Services National Regulations.</p>

            {errors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex items-center gap-2 text-red-700 text-sm font-medium mb-1"><AlertTriangle className="w-4 h-4" /> Please fix the following:</div>
                <ul className="text-xs text-red-600 space-y-0.5 ml-6 list-disc">{errors.map((e, i) => <li key={i}>{e}</li>)}</ul>
              </div>
            )}

            <div className="grid grid-cols-3 gap-4">
              <div><label className={labelCls}>Date<span className={reqCls}>*</span></label>
                <input type="date" className={inputCls} value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} /></div>
              <div><label className={labelCls}>Time of incident<span className={reqCls}>*</span></label>
                <input type="time" className={inputCls} value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} /></div>
              <div><label className={labelCls}>Child name<span className={reqCls}>*</span></label>
                <input className={inputCls} value={form.child} onChange={e => setForm(f => ({ ...f, child: e.target.value }))} placeholder="Full name" /></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div><label className={labelCls}>Incident type<span className={reqCls}>*</span></label>
                <select className={inputCls} value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                  {types.map(t => <option key={t}>{t}</option>)}
                </select></div>
              <div><label className={labelCls}>Location<span className={reqCls}>*</span></label>
                <select className={inputCls} value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))}>
                  {locations.map(l => <option key={l}>{l}</option>)}
                </select></div>
            </div>

            <div><label className={labelCls}>Description of what happened<span className={reqCls}>*</span></label>
              <textarea className={inputCls} rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Factual account of the incident..." /></div>

            <div className="grid grid-cols-2 gap-4">
              <div><label className={labelCls}>Injury details {form.type.includes('Injury') && <span className={reqCls}>*</span>}</label>
                <textarea className={inputCls} rows={2} value={form.injuryDetails} onChange={e => setForm(f => ({ ...f, injuryDetails: e.target.value }))} placeholder="Type, size, severity of injury" /></div>
              <div><label className={labelCls}>Body area affected {form.type.includes('Injury') && <span className={reqCls}>*</span>}</label>
                <select className={inputCls} value={form.bodyArea} onChange={e => setForm(f => ({ ...f, bodyArea: e.target.value }))}>
                  {bodyAreas.map(b => <option key={b}>{b}</option>)}
                </select></div>
            </div>

            <div><label className={labelCls}>First aid administered</label>
              <textarea className={inputCls} rows={2} value={form.firstAid} onChange={e => setForm(f => ({ ...f, firstAid: e.target.value }))} placeholder="Describe first aid treatment..." /></div>

            <div><label className={labelCls}>Action taken / follow-up<span className={reqCls}>*</span></label>
              <textarea className={inputCls} rows={2} value={form.action} onChange={e => setForm(f => ({ ...f, action: e.target.value }))} placeholder="Actions taken and planned follow-up..." /></div>

            <div className="grid grid-cols-2 gap-4">
              <div><label className={labelCls}>Educator on duty<span className={reqCls}>*</span></label>
                <input className={inputCls} value={form.educatorOnDuty} onChange={e => setForm(f => ({ ...f, educatorOnDuty: e.target.value }))} placeholder="Name of supervising educator" /></div>
              <div><label className={labelCls}>Witnesses</label>
                <input className={inputCls} value={form.witnesses} onChange={e => setForm(f => ({ ...f, witnesses: e.target.value }))} placeholder="Names and roles" /></div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <input type="checkbox" id="pn" checked={form.parentNotified} onChange={e => setForm(f => ({ ...f, parentNotified: e.target.checked }))} />
                <label htmlFor="pn" className="text-sm text-slate-700">Parent/Guardian notified</label>
              </div>
              {form.parentNotified && (
                <div className="flex items-center gap-2">
                  <label className="text-xs text-slate-500">Time notified<span className={reqCls}>*</span></label>
                  <input type="time" className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm w-28" value={form.parentNotifiedTime} onChange={e => setForm(f => ({ ...f, parentNotifiedTime: e.target.value }))} />
                </div>
              )}
            </div>

            <div className="flex gap-2 justify-end">
              <button onClick={() => { setShowForm(false); setErrors([]); }} className="px-4 py-2 text-sm border border-slate-200 rounded-lg">Cancel</button>
              <button disabled={isGenerating} onClick={() => void improveDraft()} className="flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm text-white disabled:opacity-50">
                {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />} Improve wording
              </button>
              <button onClick={submit} className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Submit Report</button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {incidents.map(inc => (
            <div key={inc.id} className="bg-white rounded-xl border border-slate-100 p-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-800">{inc.child}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">{inc.type}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${inc.status === 'Closed' ? 'bg-emerald-100 text-emerald-700' : inc.status === 'Under Review' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>{inc.status}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{inc.date} at {inc.time} · {inc.location} · Educator: {inc.educatorOnDuty}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => exportIncidentPDF(inc)} title="Export PDF"><Download className="w-4 h-4 text-slate-300 hover:text-indigo-500" /></button>
                  <button onClick={() => setIncidents(i => i.filter(x => x.id !== inc.id))}><Trash2 className="w-4 h-4 text-slate-300 hover:text-red-500" /></button>
                </div>
              </div>
              <p className="text-sm text-slate-700 mt-2">{inc.description}</p>
              {inc.injuryDetails && inc.injuryDetails !== 'N/A' && <p className="text-xs text-slate-500 mt-1"><span className="font-medium">Injury:</span> {inc.injuryDetails} ({inc.bodyArea})</p>}
              {inc.firstAid && <p className="text-xs text-slate-500 mt-1"><span className="font-medium">First aid:</span> {inc.firstAid}</p>}
              <p className="text-xs text-slate-500 mt-1"><span className="font-medium">Action:</span> {inc.action}</p>
              {inc.witnesses && <p className="text-xs text-slate-500 mt-1"><span className="font-medium">Witnesses:</span> {inc.witnesses}</p>}
              <p className="text-xs mt-1"><span className={inc.parentNotified ? 'text-emerald-600' : 'text-red-600'}>{inc.parentNotified ? `✓ Parent notified at ${inc.parentNotifiedTime}` : '✗ Parent not yet notified'}</span></p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
