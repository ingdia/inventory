// src/features/purchases/components/PurchaseFilters.jsx
import SupplierSelect from './SupplierSelect.jsx';

const inputClass =
  'rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/20';

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'received', label: 'Received' },
  { value: 'cancelled', label: 'Cancelled' },
];

export default function PurchaseFilters({ filters, onFilterChange, onReset }) {
  const hasActive = Boolean(
    filters.search ||
      filters.startDate ||
      filters.endDate ||
      filters.supplier ||
      filters.status
  );

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
      <input
        type="text"
        value={filters.search}
        onChange={(e) => onFilterChange('search', e.target.value)}
        placeholder="Search invoice number..."
        className={`${inputClass} w-full sm:w-56`}
      />
      <input
        type="date"
        value={filters.startDate}
        onChange={(e) => onFilterChange('startDate', e.target.value)}
        className={inputClass}
        aria-label="Start date"
      />
      <input
        type="date"
        value={filters.endDate}
        onChange={(e) => onFilterChange('endDate', e.target.value)}
        className={inputClass}
        aria-label="End date"
      />
      <SupplierSelect
        value={filters.supplier}
        onChange={(val) => onFilterChange('supplier', val)}
        includeAllOption
        className="w-full sm:w-44"
      />
      <select
        value={filters.status}
        onChange={(e) => onFilterChange('status', e.target.value)}
        className={inputClass}
        aria-label="Status"
      >
        {STATUS_OPTIONS.map((o) => (
          <option key={o.value || 'all-st'} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {hasActive && (
        <button
          type="button"
          onClick={onReset}
          className="rounded-lg px-3 py-2 text-sm font-semibold text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
        >
          Reset
        </button>
      )}
    </div>
  );
}
