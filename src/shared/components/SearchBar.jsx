import { Search, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function SearchBar({
  value,
  onChange,
  placeholder = 'Search...',
  className = '',
  debounce = 300,
}) {
  const [local, setLocal] = useState(value || '');

  // Sync local state when parent resets value externally
  useEffect(() => { setLocal(value || ''); }, [value]);

  // Debounce the onChange call
  useEffect(() => {
    const t = setTimeout(() => onChange(local), debounce);
    return () => clearTimeout(t);
  }, [local]);

  return (
    <div className={`relative ${className}`}>
      <Search
        size={15}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
      />
      <input
        type="search"
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-8 text-sm
          text-gray-900 outline-none transition-all placeholder:text-gray-400
          focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20
          dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100
          dark:placeholder:text-gray-500 dark:focus:border-cyan-400
          dark:focus:ring-cyan-400/20"
      />
      {local && (
        <button
          type="button"
          onClick={() => { setLocal(''); onChange(''); }}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
          aria-label="Clear search"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}