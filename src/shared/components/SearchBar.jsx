import { Search, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function SearchBar({ value, onChange, placeholder = 'Search...', debounce = 400 }) {
  const [local, setLocal] = useState(value || '');

  useEffect(() => {
    const t = setTimeout(() => onChange(local), debounce);
    return () => clearTimeout(t);
  }, [local]);

  useEffect(() => { setLocal(value || ''); }, [value]);

  return (
    <div className="relative flex-1 min-w-0">
      <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
      <input
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-slate-700 bg-slate-800/60 pl-9 pr-8 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
      />
      {local && (
        <button onClick={() => { setLocal(''); onChange(''); }} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
          <X size={14} />
        </button>
      )}
    </div>
  );
}
