// src/features/sales/components/ReceiptModal.jsx
import { useRef } from 'react';
import { Printer, X } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import { formatReceiptData } from '../utils/receipt.utils.js';
import { formatCurrency } from '../../../shared/utils/formatCurrency.js';
import Modal from '../../../shared/components/Modal.jsx';

function ReceiptContent({ sale }) {
  const receipt = formatReceiptData(sale);
  const isCash = sale.paymentMethod === 'cash';

  const paymentLabels = {
    cash: 'Cash',
    mobile_money: 'Mobile Money',
    insurance: 'Insurance',
  };

  return (
    <div className="receipt-print mx-auto w-full max-w-[80mm] p-6 font-mono text-sm text-gray-900 dark:text-gray-100">
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .print\\:hidden { display: none !important; }
          .receipt-print {
            width: 80mm;
            max-width: 80mm;
            margin: 0 auto;
            padding: 4mm;
            font-size: 11px;
            color: #000 !important;
            background: #fff !important;
          }
          body * { visibility: hidden; }
          .receipt-print, .receipt-print * { visibility: visible; }
          .receipt-print { position: absolute; left: 0; top: 0; }
        }
      `}</style>

      <div className="text-center">
        <h2 className="text-lg font-bold">PharmaCare Pharmacy</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400">Kigali, Rwanda</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">+250 788 000 000</p>
      </div>

      <hr className="my-3 border-gray-300 dark:border-gray-600" />

      <div className="space-y-0.5 text-xs">
        <p><span className="font-semibold">Receipt #:</span> {receipt.receiptNumber}</p>
        <p><span className="font-semibold">Date:</span> {receipt.date}</p>
        <p><span className="font-semibold">Cashier:</span> {receipt.cashier}</p>
        <p><span className="font-semibold">Customer:</span> {receipt.customer}</p>
      </div>

      <hr className="my-3 border-gray-300 dark:border-gray-600" />

      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-gray-300 dark:border-gray-600">
            <th className="pb-1 text-left font-semibold">Item</th>
            <th className="pb-1 text-center font-semibold">Qty</th>
            <th className="pb-1 text-right font-semibold">Unit</th>
            <th className="pb-1 text-right font-semibold">Total</th>
          </tr>
        </thead>
        <tbody>
          {receipt.items.map((item, i) => (
            <tr key={i} className="border-b border-gray-100 dark:border-gray-700">
              <td className="py-1 pr-1">{item.name}</td>
              <td className="py-1 text-center">{item.quantity}</td>
              <td className="py-1 text-right">{item.unitPrice}</td>
              <td className="py-1 text-right">{item.subtotal}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <hr className="my-3 border-gray-300 dark:border-gray-600" />

      <div className="space-y-0.5 text-xs">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{receipt.subtotal}</span>
        </div>
        {Number(sale.discount) > 0 && (
          <div className="flex justify-between">
            <span>Discount</span>
            <span>-{receipt.discountAmount}</span>
          </div>
        )}
        <div className="flex justify-between text-base font-bold">
          <span>TOTAL</span>
          <span>{receipt.total}</span>
        </div>
        <div className="flex justify-between">
          <span>Payment Method</span>
          <span>{paymentLabels[sale.paymentMethod] || sale.paymentMethod}</span>
        </div>
        {isCash && sale.amountReceived != null && (
          <div className="flex justify-between">
            <span>Amount Paid</span>
            <span>{formatCurrency(sale.amountReceived)}</span>
          </div>
        )}
        {isCash && sale.change != null && (
          <div className="flex justify-between">
            <span>Change</span>
            <span>{formatCurrency(sale.change)}</span>
          </div>
        )}
      </div>

      <hr className="my-3 border-gray-300 dark:border-gray-600" />

      <div className="text-center text-xs text-gray-500 dark:text-gray-400">
        <p className="font-medium">Thank you for your purchase!</p>
        <p>Please keep this receipt for your records.</p>
      </div>
    </div>
  );
}

export default function ReceiptModal({ isOpen, onClose, sale }) {
  const receiptRef = useRef(null);

  const handlePrint = useReactToPrint({
    contentRef: receiptRef,
    documentTitle: sale?.receiptNumber ? `Receipt-${sale.receiptNumber}` : 'Receipt',
  });

  if (!sale) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} showClose={false} className="max-w-md">
      <div className="no-print print:hidden flex items-center justify-end gap-2 border-b border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-900">
        <button
          type="button"
          onClick={handlePrint}
          className="no-print flex items-center gap-1.5 rounded-lg bg-cyan-500 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-cyan-600 dark:bg-cyan-600 dark:hover:bg-cyan-500"
        >
          <Printer size={16} />
          Print
        </button>
        <button
          type="button"
          onClick={onClose}
          className="no-print rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-200"
          aria-label="Close"
        >
          <X size={18} />
        </button>
      </div>

      <div ref={receiptRef}>
        <ReceiptContent sale={sale} />
      </div>
    </Modal>
  );
}
