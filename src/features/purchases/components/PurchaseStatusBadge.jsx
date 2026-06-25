const STATUS_STYLES = {
  pending:
    'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  received:
    'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

export default function PurchaseStatusBadge({ status = 'pending' }) {
  const normalized = String(status || 'pending').toLowerCase();
  const styleClass =
    STATUS_STYLES[normalized] ||
    'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400';
  const label = normalized.charAt(0).toUpperCase() + normalized.slice(1);

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${styleClass}`}
    >
      {label}
    </span>
  );
}
