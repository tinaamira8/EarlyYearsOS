import { useState } from 'react';
import { CheckCircle2, FileCheck2, Scale, ShieldAlert } from 'lucide-react';

const obligations = [
  { id: 'privacy', title: 'Privacy and records', owner: 'Approved provider', cadence: 'Annual review' },
  { id: 'employment', title: 'Employment and workplace', owner: 'Centre director', cadence: 'Quarterly review' },
  { id: 'safety', title: 'Child safety obligations', owner: 'Nominated supervisor', cadence: 'Monthly review' },
  { id: 'governance', title: 'Governance and notifications', owner: 'Approved provider', cadence: 'Quarterly review' },
] as const;

export const LegalCompliance = () => {
  const [reviewed, setReviewed] = useState<string[]>([]);
  const [completed, setCompleted] = useState(false);

  const toggleReviewed = (id: string) => {
    setReviewed(current => current.includes(id) ? current.filter(item => item !== id) : [...current, id]);
    setCompleted(false);
  };

  const allReviewed = reviewed.length === obligations.length;

  return (
    <div className="min-h-full bg-slate-50 p-4 sm:p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="flex flex-col gap-4 rounded-2xl bg-slate-900 p-6 text-white sm:flex-row sm:items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
            <Scale className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Legal Compliance</h1>
            <p className="mt-1 text-sm text-slate-300">Track internal reviews, ownership, and evidence in one register.</p>
          </div>
          <div className="rounded-xl bg-amber-400/10 px-4 py-3 text-xs text-amber-100">
            Operational checklist only — not legal advice.
          </div>
        </header>

        <section aria-labelledby="legal-register-title" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 id="legal-register-title" className="font-bold text-slate-900">Compliance register</h2>
              <p className="text-sm text-slate-500">Confirm each area has been reviewed against your current jurisdiction and service circumstances.</p>
            </div>
            <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">{reviewed.length}/{obligations.length} reviewed</span>
          </div>

          <div className="divide-y divide-slate-100">
            {obligations.map(item => {
              const isReviewed = reviewed.includes(item.id);
              return (
                <label key={item.id} className="flex cursor-pointer items-start gap-3 py-4">
                  <input
                    type="checkbox"
                    checked={isReviewed}
                    onChange={() => toggleReviewed(item.id)}
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-indigo-600"
                  />
                  <span className="flex-1">
                    <span className="block font-semibold text-slate-800">{item.title}</span>
                    <span className="mt-1 block text-xs text-slate-500">Owner: {item.owner} · {item.cadence}</span>
                  </span>
                  {isReviewed ? <CheckCircle2 className="h-5 w-5 text-emerald-500" aria-label="Reviewed" /> : <FileCheck2 className="h-5 w-5 text-slate-300" aria-label="Awaiting review" />}
                </label>
              );
            })}
          </div>

          <button
            type="button"
            disabled={!allReviewed}
            onClick={() => setCompleted(true)}
            className="mt-4 w-full rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
          >
            Mark review complete
          </button>
          {completed ? (
            <p role="status" className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-emerald-50 p-3 text-sm font-medium text-emerald-700">
              <CheckCircle2 className="h-4 w-4" /> Review recorded for this session.
            </p>
          ) : null}
        </section>

        <aside className="flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <ShieldAlert className="mt-0.5 h-5 w-5 flex-shrink-0" />
          <p>Before relying on this register, confirm obligations with the relevant regulator or qualified adviser and attach the supporting evidence in your service records.</p>
        </aside>
      </div>
    </div>
  );
};
