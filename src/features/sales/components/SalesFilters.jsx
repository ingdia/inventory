// src/features/sales/components/SalesFilters.jsx

const inputClass =
  'rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/20';

const PAYMENT_OPTIONS = [
  { value: '', label: 'All Payments' },
  { value: 'cash', label: 'Cash' },
  { value: 'mobile_money', label: 'Mobile Money' },
  { value: 'insurance', label: 'Insurance' },
];

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'completed', label: 'Completed' },
  { value: 'refunded', label: 'Refunded' },
  { value: 'voided', label: 'Voided' },
];

export default function SalesFilters({ filters, onFilterChange, onReset }) {
  const hasActive = Boolean(
    filters.search ||
      filters.startDate ||
      filters.endDate ||
      filters.paymentMethod ||
      filters.status
  );

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
      <input
        type="text"
        value={filters.search}
        onChange={(e) => onFilterChange('search', e.target.value)}
        placeholder="Search receipt or customer..."
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
      <select
        value={filters.paymentMethod}
        onChange={(e) => onFilterChange('paymentMethod', e.target.value)}
        className={inputClass}
        aria-label="Payment method"
      >
        {PAYMENT_OPTIONS.map((o) => (
          <option key={o.value || 'all-pm'} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
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
