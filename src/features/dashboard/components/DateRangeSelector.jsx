import { Calendar } from 'lucide-react';

export default function DateRangeSelector({ startDate, endDate, onChange, showPeriod, period, onPeriodChange }) {
  const periods = [
    { label: '7D', value: '7d' },
    { label: '30D', value: '30d' },
    { label: '3M', value: '3m' },
    { label: '1Y', value: '1y' },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2">
      {showPeriod && (
        <div className="flex rounded-xl border border-gray-200 overflow-hidden bg-white">
          {periods.map((p) => (
            <button
              key={p.value}
              onClick={() => onPeriodChange?.(p.value)}
              className={`px-3 py-1.5 text-xs font-semibold transition-all ${
                period === p.value ? 'bg-cyan-500 text-white' : 'text-slate-500 hover:bg-gray-50'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      )}
      <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-1.5">
        <Calendar size={14} className="text-cyan-500" />
        <input
          type="date"
          value={startDate || ''}
          onChange={(e) => onChange?.({ startDate: e.target.value, endDate })}
          className="text-xs text-slate-600 outline-none bg-transparent"
        />
        <span className="text-slate-300 text-xs">→</span>
        <input
          type="date"
          value={endDate || ''}
          onChange={(e) => onChange?.({ startDate, endDate: e.target.value })}
          className="text-xs text-slate-600 outline-none bg-transparent"
        />
      </div>
    </div>
  );
}
