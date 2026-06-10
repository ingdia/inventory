import { useState } from 'react';
import { Printer } from 'lucide-react';
import Modal from '../../../shared/components/Modal.jsx';
import Spinner from '../../../shared/components/Spinner.jsx';
import Button from '../../../shared/components/Button.jsx';
import PaymentMethodBadge from '../../../shared/components/PaymentMethodBadge.jsx';
import { formatCurrency } from '../../../shared/utils/formatCurrency.js';
import { formatDateTime } from '../../../shared/utils/formatDate.js';
import { useSaleDetail } from '../hooks/useSaleDetail.js';
import SaleStatusBadge from './SaleStatusBadge.jsx';
import ReceiptModal from './ReceiptModal.jsx';

function getMedicineName(item) {
  return item.medicineName || item.medicine?.name || 'Unknown';
}

export default function SaleDetailModal({ isOpen, onClose, saleId }) {
  const { sale, isLoading, isError, refetch } = useSaleDetail(saleId);
  const [receiptOpen, setReceiptOpen] = useState(false);

  if (!isOpen) return null;

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} className="max-w-2xl">
        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <Spinner size="lg" />
          </div>
        )}

        {isError && !isLoading && (
          <div className="flex flex-col items-center gap-4 px-6 py-12 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">Failed to load sale details</p>
            <Button variant="outline" onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        )}

        {sale && !isLoading && (
          <div className="p-6">
            <div className="mb-6 flex flex-wrap items-start justify-between gap-3 border-b border-gray-200 pb-4 dark:border-gray-700">
              <div>
                <p className="font-mono text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {sale.receiptNumber}
                </p>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {formatDateTime(sale.createdAt)}
                </p>
              </div>
              <SaleStatusBadge status={sale.status} />
            </div>

            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Cashier
                </p>
                <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {sale.soldBy?.name || '—'}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Customer
                </p>
                <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {sale.customer?.name || 'Walk-in'}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Payment Method
                </p>
                <div className="mt-1">
                  {sale.paymentMethod ? (
                    <PaymentMethodBadge method={sale.paymentMethod} />
                  ) : (
                    <span className="text-sm text-gray-900 dark:text-gray-100">—</span>
                  )}
                </div>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Total
                </p>
                <p className="mt-1 text-xl font-bold text-cyan-600 dark:text-cyan-400">
                  {formatCurrency(sale.total)}
                </p>
              </div>
            </div>

            <div className="mb-6 overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50">
                    <th className="px-4 py-2.5 text-left font-semibold text-gray-700 dark:text-gray-300">
                      Medicine Name
                    </th>
                    <th className="px-4 py-2.5 text-center font-semibold text-gray-700 dark:text-gray-300">
                      Qty
                    </th>
                    <th className="px-4 py-2.5 text-right font-semibold text-gray-700 dark:text-gray-300">
                      Unit Price
                    </th>
                    <th className="px-4 py-2.5 text-right font-semibold text-gray-700 dark:text-gray-300">
                      Subtotal
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {(sale.items || []).map((item, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-100 last:border-0 dark:border-gray-800"
                    >
                      <td className="px-4 py-2.5 text-gray-900 dark:text-gray-100">
                        {getMedicineName(item)}
                      </td>
                      <td className="px-4 py-2.5 text-center text-gray-700 dark:text-gray-300">
                        {item.quantity}
                      </td>
                      <td className="px-4 py-2.5 text-right text-gray-700 dark:text-gray-300">
                        {formatCurrency(item.unitPrice)}
                      </td>
                      <td className="px-4 py-2.5 text-right font-medium text-gray-900 dark:text-gray-100">
                        {formatCurrency(item.subtotal ?? item.quantity * item.unitPrice)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-50 dark:bg-gray-800/50">
                    <td
                      colSpan={3}
                      className="px-4 py-2.5 text-right font-semibold text-gray-700 dark:text-gray-300"
                    >
                      Total
                    </td>
                    <td className="px-4 py-2.5 text-right font-bold text-cyan-600 dark:text-cyan-400">
                      {formatCurrency(sale.total)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="mb-6 space-y-2 rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                <span className="text-gray-900 dark:text-gray-100">{formatCurrency(sale.subtotal)}</span>
              </div>
              {Number(sale.discount) > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Discount</span>
                  <span className="text-gray-900 dark:text-gray-100">
                    -{formatCurrency(sale.discount)}
                  </span>
                </div>
              )}
              <div className="flex justify-between border-t border-gray-200 pt-2 text-base font-bold dark:border-gray-700">
                <span className="text-gray-900 dark:text-gray-100">Grand Total</span>
                <span className="text-cyan-600 dark:text-cyan-400">{formatCurrency(sale.total)}</span>
              </div>
            </div>

            <div className="flex flex-wrap justify-end gap-3">
              <Button variant="ghost" onClick={onClose}>
                Close
              </Button>
              <Button onClick={() => setReceiptOpen(true)}>
                <Printer size={16} />
                Print Receipt
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <ReceiptModal
        isOpen={receiptOpen}
        onClose={() => setReceiptOpen(false)}
        sale={sale}
      />
    </>
  );
}
