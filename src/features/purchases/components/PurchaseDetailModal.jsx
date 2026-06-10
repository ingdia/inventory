import { useState } from 'react';
import Modal from '../../../shared/components/Modal.jsx';
import Spinner from '../../../shared/components/Spinner.jsx';
import Button from '../../../shared/components/Button.jsx';
import ConfirmDialog from '../../../shared/components/ConfirmDialog.jsx';
import { formatCurrency } from '../../../shared/utils/formatCurrency.js';
import { formatDate } from '../../../shared/utils/formatDate.js';
import { usePurchaseDetail } from '../hooks/usePurchaseDetail.js';
import PurchaseStatusBadge from './PurchaseStatusBadge.jsx';

function getMedicineName(item) {
  return item.medicineName || item.medicine?.name || 'Unknown';
}

export default function PurchaseDetailModal({
  isOpen,
  onClose,
  purchaseId,
  onMarkReceived,
  onCancel,
  actionPending = false,
}) {
  const { purchase, isLoading } = usePurchaseDetail(purchaseId);
  const [confirmReceive, setConfirmReceive] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);

  if (!isOpen) return null;

  const isPending = purchase?.status === 'pending';
  const isReceived = purchase?.status === 'received';

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-2xl">
      {isLoading && (
        <div className="flex items-center justify-center py-16">
          <Spinner size="lg" />
        </div>
      )}

      {purchase && !isLoading && (
        <div className="p-6">
          <div className="mb-6 flex flex-wrap items-start justify-between gap-3 border-b border-gray-200 pb-4 dark:border-gray-700">
            <div>
              <p className="font-mono text-2xl font-bold text-gray-900 dark:text-gray-100">
                {purchase.invoiceNumber}
              </p>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {formatDate(purchase.purchaseDate)}
              </p>
            </div>
            <PurchaseStatusBadge status={purchase.status} />
          </div>

          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Supplier
              </p>
              <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-gray-100">
                {purchase.supplier?.name || '—'}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Invoice Number
              </p>
              <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-gray-100">
                {purchase.invoiceNumber}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Purchase Date
              </p>
              <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-gray-100">
                {formatDate(purchase.purchaseDate)}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Expected Delivery
              </p>
              <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-gray-100">
                {purchase.expectedDelivery ? formatDate(purchase.expectedDelivery) : '—'}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Recorded By
              </p>
              <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-gray-100">
                {purchase.recordedBy?.name || '—'}
              </p>
            </div>
            {isReceived && (
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Received By
                </p>
                <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {purchase.receivedBy?.name || '—'}
                  {purchase.receivedAt ? ` · ${formatDate(purchase.receivedAt)}` : ''}
                </p>
              </div>
            )}
          </div>

          <div className="mb-6 overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50">
                  <th className="px-4 py-2.5 text-left font-semibold text-gray-700 dark:text-gray-300">
                    Medicine
                  </th>
                  <th className="px-4 py-2.5 text-center font-semibold text-gray-700 dark:text-gray-300">
                    Ordered Qty
                  </th>
                  <th className="px-4 py-2.5 text-right font-semibold text-gray-700 dark:text-gray-300">
                    Unit Cost
                  </th>
                  <th className="px-4 py-2.5 text-right font-semibold text-gray-700 dark:text-gray-300">
                    Subtotal
                  </th>
                </tr>
              </thead>
              <tbody>
                {(purchase.items || []).map((item, index) => (
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
                      {formatCurrency(item.purchasePrice)}
                    </td>
                    <td className="px-4 py-2.5 text-right font-medium text-gray-900 dark:text-gray-100">
                      {formatCurrency(item.subtotal ?? item.quantity * item.purchasePrice)}
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
                    Total Amount
                  </td>
                  <td className="px-4 py-2.5 text-right font-bold text-cyan-600 dark:text-cyan-400">
                    {formatCurrency(purchase.totalAmount)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="flex flex-wrap justify-end gap-3">
            {isPending && (
              <>
                <Button
                  variant="outline"
                  onClick={() => setConfirmCancel(true)}
                  disabled={actionPending}
                  className="!border-red-300 !text-red-600 hover:!bg-red-50 dark:!border-red-800 dark:!text-red-400 dark:hover:!bg-red-900/20"
                >
                  Cancel Purchase
                </Button>
                <Button
                  onClick={() => setConfirmReceive(true)}
                  disabled={actionPending}
                >
                  Mark as Received
                </Button>
              </>
            )}
            <Button variant="ghost" onClick={onClose} disabled={actionPending}>
              Close
            </Button>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={confirmReceive}
        onClose={() => setConfirmReceive(false)}
        onConfirm={() => {
          setConfirmReceive(false);
          onMarkReceived();
        }}
        title="Mark as Received"
        message="Mark this purchase as received? This will update inventory."
        confirmLabel="Mark as Received"
        variant="primary"
        loading={actionPending}
      />

      <ConfirmDialog
        isOpen={confirmCancel}
        onClose={() => setConfirmCancel(false)}
        onConfirm={() => {
          setConfirmCancel(false);
          onCancel();
        }}
        title="Cancel Purchase"
        message="Are you sure you want to cancel this purchase?"
        confirmLabel="Cancel Purchase"
        variant="danger"
        loading={actionPending}
      />
    </Modal>
  );
}
