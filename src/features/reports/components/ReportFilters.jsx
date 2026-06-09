import { Search } from 'lucide-react';
import DateRangeSelector from '../../dashboard/components/DateRangeSelector';
import Button from '../../../shared/components/Button';

export default function ReportFilters({ filters, onChange, onApply, extras = [] }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-wrap items-end gap-3">
      <DateRangeSelector
        startDate={filters.startDate}
        endDate={filters.endDate}
        onChange={(range) => onChange({ ...filters, ...range })}
      />
      {extras.map(({ name, placeholder, options, type = 'select' }) =>
        type === 'text' ? (
          <div key={name} className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={placeholder}
              value={filters[name] || ''}
              onChange={(e) => onChange({ ...filters, [name]: e.target.value })}
              className="pl-8 pr-3 py-2 text-xs border border-gray-200 rounded-xl outline-none focus:border-cyan-400 bg-white text-slate-700"
            />
          </div>
        ) : (
          <select
            key={name}
            value={filters[name] || ''}
            onChange={(e) => onChange({ ...filters, [name]: e.target.value })}
            className="px-3 py-2 text-xs border border-gray-200 rounded-xl outline-none focus:border-cyan-400 bg-white text-slate-700"
          >
            {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        )
      )}
      <Button onClick={onApply} className="py-2 px-4 text-xs">Apply</Button>
    </div>
  );
}
