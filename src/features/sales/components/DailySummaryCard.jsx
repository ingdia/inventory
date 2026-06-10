// src/features/sales/components/DailySummaryCard.jsx
import Spinner from '../../../shared/components/Spinner.jsx';

export default function DailySummaryCard({ title, value, icon: Icon, isLoading }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          {isLoading ? (
            <div className="mt-2">
              <Spinner size="sm" />
            </div>
          ) : (
            <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
          )}
        </div>
        {Icon && (
          <div className="rounded-lg bg-cyan-50 p-2.5 dark:bg-cyan-900/20">
            <Icon size={20} className="text-cyan-600 dark:text-cyan-400" />
          </div>
        )}
      </div>
    </div>
  );
}
