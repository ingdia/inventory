// src/features/sales/components/SalesTable.jsx
import { Eye, Printer } from 'lucide-react';
import { formatCurrency } from '../../../shared/utils/formatCurrency.js';
import { formatDateTime } from '../../../shared/utils/formatDate.js';
import PaymentMethodBadge from '../../../shared/components/PaymentMethodBadge.jsx';
import SaleStatusBadge from './SaleStatusBadge.jsx';

function TableSkeleton() {
  return (
    <>
      {Array.from({ length: 8 }).map((_, i) => (
        <tr key={i} className="border-b border-gray-100 dark:border-gray-800">
          {Array.from({ length: 9 }).map((__, j) => (
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

export default function SalesTable({ sales, isLoading, onViewDetail, onPrintReceipt }) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50">
              {['Receipt #', 'Date', 'Customer', 'Cashier', 'Items', 'Total', 'Payment', 'Status', 'Actions'].map(
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

            {!isLoading && (!sales || sales.length === 0) && (
              <tr>
                <td colSpan={9} className="px-4 py-16 text-center text-gray-500 dark:text-gray-400">
                  No sales found
                </td>
              </tr>
            )}

            {!isLoading &&
              sales?.map((sale) => (
                <tr
                  key={sale._id}
                  className="border-b border-gray-100 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/40"
                >
                  <td className="px-4 py-3 font-mono text-xs font-medium text-gray-900 dark:text-gray-100">
                    {sale.receiptNumber}
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                    {formatDateTime(sale.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-gray-900 dark:text-gray-100">
                    {sale.customer?.name || 'Walk-in'}
                  </td>
                  <td className="px-4 py-3 text-gray-900 dark:text-gray-100">
                    {sale.soldBy?.name || '—'}
                  </td>
                  <td className="max-w-[180px] truncate px-4 py-3 text-gray-600 dark:text-gray-400">
                    {getItemsSummary(sale.items)}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-cyan-600 dark:text-cyan-400">
                    {formatCurrency(sale.total)}
                  </td>
                  <td className="px-4 py-3">
                    <PaymentMethodBadge method={sale.paymentMethod} />
                  </td>
                  <td className="px-4 py-3">
                    <SaleStatusBadge status={sale.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => onViewDetail(sale._id)}
                        className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-cyan-600 dark:hover:bg-gray-800 dark:hover:text-cyan-400"
                        aria-label="View details"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => onPrintReceipt(sale)}
                        className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-cyan-600 dark:hover:bg-gray-800 dark:hover:text-cyan-400"
                        aria-label="Print receipt"
                      >
                        <Printer size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
