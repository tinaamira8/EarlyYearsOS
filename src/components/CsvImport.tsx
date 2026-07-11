import React, { useRef, useState } from 'react';
import { Upload, FileSpreadsheet, CheckCircle2, AlertTriangle, X } from 'lucide-react';
import Papa from 'papaparse';
import toast from 'react-hot-toast';

interface CsvImportProps {
  onImport: (data: Record<string, string>[], headers: string[]) => void;
  expectedColumns?: string[];
  label?: string;
  maxRows?: number;
}

export const CsvImport: React.FC<CsvImportProps> = ({ onImport, expectedColumns, label = 'Import CSV', maxRows = 500 }) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<{ headers: string[]; rows: Record<string, string>[]; fileName: string } | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    if (!file.name.endsWith('.csv')) { toast.error('Please upload a CSV file'); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error('File too large (max 5MB)'); return; }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const headers = results.meta.fields || [];
        const rows = (results.data as Record<string, string>[]).slice(0, maxRows);
        const errs: string[] = [];

        if (rows.length === 0) errs.push('No data rows found');
        if (expectedColumns) {
          const missing = expectedColumns.filter(c => !headers.some(h => h.toLowerCase().trim() === c.toLowerCase()));
          if (missing.length) errs.push(`Missing columns: ${missing.join(', ')}`);
        }
        if (results.errors.length > 0) {
          errs.push(...results.errors.slice(0, 3).map(e => `Row ${e.row}: ${e.message}`));
        }

        setErrors(errs);
        setPreview({ headers, rows, fileName: file.name });
      },
      error: () => toast.error('Failed to parse CSV'),
    });
  };

  const confirmImport = () => {
    if (!preview || errors.length > 0) return;
    onImport(preview.rows, preview.headers);
    toast.success(`${preview.rows.length} rows imported`);
    setPreview(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <div className="space-y-3">
      <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={e => handleFile(e.target.files?.[0])} />

      {!preview ? (
        <button onClick={() => fileRef.current?.click()} className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-slate-300 rounded-xl text-slate-600 hover:border-indigo-400 hover:text-indigo-600 transition-colors font-medium text-sm">
          <Upload className="w-4 h-4" /> {label}
        </button>
      ) : (
        <div className="border border-slate-200 rounded-xl bg-white overflow-hidden">
          <div className="flex items-center justify-between p-3 bg-slate-50 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-indigo-600" />
              <span className="text-sm font-semibold text-slate-700">{preview.fileName}</span>
              <span className="text-xs text-slate-400">{preview.rows.length} rows · {preview.headers.length} columns</span>
            </div>
            <button onClick={() => { setPreview(null); setErrors([]); }} className="text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>
          </div>

          {errors.length > 0 && (
            <div className="p-3 bg-amber-50 border-b border-amber-100">
              {errors.map((e, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-amber-700">
                  <AlertTriangle className="w-3 h-3 flex-shrink-0" /> {e}
                </div>
              ))}
            </div>
          )}

          <div className="overflow-x-auto max-h-48">
            <table className="w-full text-xs">
              <thead className="bg-slate-50">
                <tr>{preview.headers.map(h => <th key={h} className="px-3 py-2 text-left font-semibold text-slate-600 whitespace-nowrap">{h}</th>)}</tr>
              </thead>
              <tbody>
                {preview.rows.slice(0, 5).map((row, i) => (
                  <tr key={i} className="border-t border-slate-100">
                    {preview.headers.map(h => <td key={h} className="px-3 py-1.5 text-slate-600 whitespace-nowrap max-w-[200px] truncate">{row[h]}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
            {preview.rows.length > 5 && <p className="text-xs text-slate-400 p-2 text-center">+ {preview.rows.length - 5} more rows</p>}
          </div>

          <div className="flex justify-end gap-2 p-3 border-t border-slate-200">
            <button onClick={() => { setPreview(null); setErrors([]); }} className="px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50 rounded-lg font-medium">Cancel</button>
            <button onClick={confirmImport} disabled={errors.length > 0} className="flex items-center gap-1 px-4 py-1.5 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed">
              <CheckCircle2 className="w-3 h-3" /> Import {preview.rows.length} rows
            </button>
          </div>
        </div>
      )}

      {expectedColumns && !preview && (
        <p className="text-[10px] text-slate-400">Expected columns: {expectedColumns.join(', ')}</p>
      )}
    </div>
  );
};
