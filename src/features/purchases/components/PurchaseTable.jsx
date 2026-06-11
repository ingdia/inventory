// src/features/purchases/components/PurchaseTable.jsx
import { CheckCircle, Eye, XCircle } from 'lucide-react';
import { formatCurrency } from '../../../shared/utils/formatCurrency.js';
import { formatDate } from '../../../shared/utils/formatDate.js';
import PurchaseStatusBadge from './PurchaseStatusBadge.jsx';

function TableSkeleton() {
  return (
    <>
      {Array.from({ length: 8 }).map((_, i) => (
        <tr key={i} className="border-b border-gray-100 dark:border-gray-800">
          {Array.from({ length: 8 }).map((__, j) => (
            <td key={j} className="px-4 py-3">
              <div className="h-4 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

function getItemsSummary(items = []) {
  if (!items.length) return '—';
  return items
    .map((item) => `${item.medicineName || item.medicine?.name || 'Item'} x${item.quantity}`)
    .join(', ');
}

export default function PurchaseTable({ purchases, isLoading, onView, onReceive, onCancel }) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50">
              {['PO Number', 'Date', 'Supplier', 'Items', 'Total', 'Status', 'Recorded By', 'Actions'].map(
                (col) => (
                  <th
                    key={col}
                    className={`px-4 py-3 font-semibold text-gray-700 dark:text-gray-300 ${col === 'Total' || col === 'Actions' ? 'text-right' : 'text-left'}`}
                  >
                    {col}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {isLoading && <TableSkeleton />}

            {!isLoading && (!purchases || purchases.length === 0) && (
              <tr>
                <td colSpan={8} className="px-4 py-16 text-center text-gray-500 dark:text-gray-400">
                  No purchases found
                </td>
              </tr>
            )}

            {!isLoading &&
              purchases?.map((purchase) => {
                const isPending = purchase.status === 'pending';
                return (
                  <tr
                    key={purchase._id}
                    className="border-b border-gray-100 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/40"
                  >
                    <td className="px-4 py-3 font-mono text-xs font-medium text-gray-900 dark:text-gray-100">
                      {purchase.invoiceNumber}
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                      {formatDate(purchase.purchaseDate)}
                    </td>
                    <td className="px-4 py-3 text-gray-900 dark:text-gray-100">
                      {purchase.supplier?.name || '—'}
                    </td>
                    <td className="max-w-[180px] truncate px-4 py-3 text-gray-600 dark:text-gray-400">
                      {getItemsSummary(purchase.items)}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-cyan-600 dark:text-cyan-400">
                      {formatCurrency(purchase.totalAmount)}
                    </td>
                    <td className="px-4 py-3">
                      <PurchaseStatusBadge status={purchase.status} />
                    </td>
                    <td className="px-4 py-3 text-gray-900 dark:text-gray-100">
                      {purchase.recordedBy?.name || '—'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => onView(purchase._id)}
                          className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-cyan-600 dark:hover:bg-gray-800 dark:hover:text-cyan-400"
                          aria-label="View details"
                        >
                          <Eye size={16} />
                        </button>
                        {isPending && (
                          <>
                            <button
                              type="button"
                              onClick={() => onReceive(purchase._id)}
                              className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-green-600 dark:hover:bg-gray-800 dark:hover:text-green-400"
                              aria-label="Mark as received"
                            >
                              <CheckCircle size={16} />
                            </button>
                            <button
                              type="button"
                              onClick={() => onCancel(purchase._id)}
                              className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-red-600 dark:hover:bg-gray-800 dark:hover:text-red-400"
                              aria-label="Cancel purchase"
                            >
                              <XCircle size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
