import React, { useState } from 'react';
import { FileText, Plus, X } from 'lucide-react';

type InvoiceStatus = 'Paid' | 'Pending' | 'Overdue';

interface Invoice {
  id: string;
  family: string;
  amount: number;
  issued: string;
  due: string;
  status: InvoiceStatus;
}

const families = [
  { id: 1, name: 'Martinez Family', child: 'Leo Martinez', balance: 0, lastPayment: '2026-05-01', plan: 'Weekly' },
  { id: 2, name: 'Wilson Family', child: 'Emma Wilson', balance: 320, lastPayment: '2026-04-15', plan: 'Fortnightly' },
  { id: 3, name: 'Kim Family', child: 'Noah Kim', balance: 0, lastPayment: '2026-05-20', plan: 'Weekly' },
  { id: 4, name: 'Chen Family', child: 'Ava Chen', balance: 840, lastPayment: '2026-03-30', plan: 'Monthly' },
  { id: 5, name: 'Johnson Family', child: 'Mia Johnson', balance: 150, lastPayment: '2026-05-10', plan: 'Weekly' },
];

const initialInvoices: Invoice[] = [
  { id: 'INV-2026-045', family: 'Wilson Family', amount: 640, issued: '2026-05-01', due: '2026-05-15', status: 'Overdue' },
  { id: 'INV-2026-044', family: 'Chen Family', amount: 960, issued: '2026-04-01', due: '2026-04-30', status: 'Overdue' },
  { id: 'INV-2026-043', family: 'Johnson Family', amount: 320, issued: '2026-05-15', due: '2026-05-29', status: 'Pending' },
  { id: 'INV-2026-042', family: 'Martinez Family', amount: 640, issued: '2026-05-01', due: '2026-05-15', status: 'Paid' },
  { id: 'INV-2026-041', family: 'Kim Family', amount: 960, issued: '2026-05-01', due: '2026-05-15', status: 'Paid' },
];

const statusColors: Record<InvoiceStatus, string> = {
  Paid: 'bg-emerald-100 text-emerald-700',
  Pending: 'bg-amber-100 text-amber-700',
  Overdue: 'bg-red-100 text-red-700',
};

export const InvoicingSystem: React.FC = () => {
  const [tab, setTab] = useState<'invoices' | 'families'>('invoices');
  const [invoiceRows, setInvoiceRows] = useState<Invoice[]>(initialInvoices);
  const [showCreateInvoice, setShowCreateInvoice] = useState(false);
  const [family, setFamily] = useState(families[0].name);
  const [amount, setAmount] = useState('');
  const [due, setDue] = useState('');
  const outstanding = invoiceRows
    .filter(invoice => invoice.status !== 'Paid')
    .reduce((sum, invoice) => sum + invoice.amount, 0);

  const createInvoice = (event: React.FormEvent) => {
    event.preventDefault();
    const parsedAmount = Number(amount);
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0 || !due) return;

    setInvoiceRows(current => [{
      id: `INV-${new Date().getFullYear()}-${String(Date.now()).slice(-5)}`,
      family,
      amount: parsedAmount,
      issued: new Date().toISOString().slice(0, 10),
      due,
      status: 'Pending',
    }, ...current]);
    setAmount('');
    setDue('');
    setTab('invoices');
    setShowCreateInvoice(false);
  };

  return (
    <div className="h-full overflow-y-auto p-4 sm:p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100">
            <FileText className="h-5 w-5 text-emerald-600" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-slate-800">Invoicing System</h1>
            <p className="text-sm text-slate-500">Billing and payment management</p>
          </div>
          <button
            type="button"
            onClick={() => setShowCreateInvoice(true)}
            className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4" /> New Invoice
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Metric value={`$${outstanding.toLocaleString()}`} label="Outstanding Balance" tone="text-red-600" />
          <Metric value={String(invoiceRows.filter(invoice => invoice.status === 'Pending').length)} label="Pending Invoices" tone="text-amber-600" />
          <Metric value={String(invoiceRows.filter(invoice => invoice.status === 'Paid').length)} label="Paid This Month" tone="text-emerald-600" />
        </div>

        <div className="flex gap-2">
          <button type="button" onClick={() => setTab('invoices')} className={`rounded-lg px-4 py-2 text-sm font-medium ${tab === 'invoices' ? 'bg-indigo-600 text-white' : 'border border-slate-200 bg-white text-slate-600'}`}>Invoices</button>
          <button type="button" onClick={() => setTab('families')} className={`rounded-lg px-4 py-2 text-sm font-medium ${tab === 'families' ? 'bg-indigo-600 text-white' : 'border border-slate-200 bg-white text-slate-600'}`}>Family Accounts</button>
        </div>

        {tab === 'invoices' ? (
          <div className="overflow-x-auto rounded-xl border border-slate-100 bg-white">
            <table className="min-w-[720px] w-full text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr><th className="px-4 py-3 text-left">Invoice #</th><th className="px-4 py-3 text-left">Family</th><th className="px-4 py-3 text-right">Amount</th><th className="px-4 py-3 text-left">Issued</th><th className="px-4 py-3 text-left">Due</th><th className="px-4 py-3 text-left">Status</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoiceRows.map(invoice => (
                  <tr key={invoice.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-mono text-slate-700">{invoice.id}</td><td className="px-4 py-3 font-medium text-slate-800">{invoice.family}</td><td className="px-4 py-3 text-right font-semibold text-slate-800">${invoice.amount.toLocaleString()}</td><td className="px-4 py-3 text-slate-600">{invoice.issued}</td><td className="px-4 py-3 text-slate-600">{invoice.due}</td><td className="px-4 py-3"><span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[invoice.status]}`}>{invoice.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="space-y-3">
            {families.map(item => (
              <div key={item.id} className="flex flex-col gap-2 rounded-xl border border-slate-100 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
                <div><p className="font-semibold text-slate-800">{item.name}</p><p className="text-xs text-slate-500">{item.child} · {item.plan} billing · Last payment: {item.lastPayment}</p></div>
                <p className={`text-lg font-bold ${item.balance > 0 ? 'text-red-600' : 'text-emerald-600'}`}>{item.balance > 0 ? `$${item.balance} owing` : 'Paid'}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {showCreateInvoice ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/50 p-4" role="dialog" aria-modal="true" aria-labelledby="create-invoice-title">
          <form onSubmit={createInvoice} className="w-full max-w-md space-y-5 rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between"><h2 id="create-invoice-title" className="text-xl font-bold text-slate-900">Create invoice</h2><button type="button" aria-label="Close invoice form" onClick={() => setShowCreateInvoice(false)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"><X className="h-5 w-5" /></button></div>
            <label className="block text-sm font-medium text-slate-700">Family<select aria-label="Family" value={family} onChange={event => setFamily(event.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2">{families.map(item => <option key={item.id}>{item.name}</option>)}</select></label>
            <label className="block text-sm font-medium text-slate-700">Amount<input aria-label="Amount" type="number" min="0.01" step="0.01" required value={amount} onChange={event => setAmount(event.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2" /></label>
            <label className="block text-sm font-medium text-slate-700">Due date<input aria-label="Due date" type="date" required value={due} onChange={event => setDue(event.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2" /></label>
            <button type="submit" className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 font-semibold text-white hover:bg-indigo-700">Create invoice</button>
          </form>
        </div>
      ) : null}
    </div>
  );
};

const Metric = ({ value, label, tone }: { value: string; label: string; tone: string }) => (
  <div className="rounded-xl border border-slate-100 bg-white p-4 text-center"><div className={`text-2xl font-bold ${tone}`}>{value}</div><div className="mt-1 text-xs text-slate-500">{label}</div></div>
);
