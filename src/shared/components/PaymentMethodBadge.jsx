const METHOD_STYLES = {
  cash: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:ring-emerald-800',
  mobile_money:
    'bg-violet-50 text-violet-700 ring-1 ring-violet-200 dark:bg-violet-900/20 dark:text-violet-400 dark:ring-violet-800',
  insurance:
    'bg-sky-50 text-sky-700 ring-1 ring-sky-200 dark:bg-sky-900/20 dark:text-sky-400 dark:ring-sky-800',
};

const METHOD_LABELS = {
  cash: 'Cash',
  mobile_money: 'Mobile Money',
  insurance: 'Insurance',
};

export default function PaymentMethodBadge({ method }) {
  if (!method) return null;

  const normalized = String(method).toLowerCase();
  const styleClass =
    METHOD_STYLES[normalized] ||
    'bg-gray-100 text-gray-600 ring-1 ring-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700';
  const label = METHOD_LABELS[normalized] || method;

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${styleClass}`}>
      {label}
    </span>
  );
}
