// src/features/sales/components/POSCart.jsx
import { useState } from 'react';
import {
  AlertTriangle,
  Minus,
  Plus,
  ShoppingCart,
  Trash2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import useCartStore, { useCartTotals } from '../store/cartStore.js';
import { useCreateSale } from '../hooks/useSales.js';
import { buildSalePayload } from '../utils/sales.utils.js';
import { formatCurrency } from '../../../shared/utils/formatCurrency.js';
import Button from '../../../shared/components/Button.jsx';
import Spinner from '../../../shared/components/Spinner.jsx';
import Badge from '../../../shared/components/Badge.jsx';

const PAYMENT_METHODS = [
  { value: 'cash', label: 'Cash' },
  { value: 'mobile_money', label: 'Mobile Money' },
  { value: 'insurance', label: 'Insurance' },
];

export default function POSCart({ onSaleComplete }) {
  const items = useCartStore((s) => s.items);
  const discount = useCartStore((s) => s.discount);
  const discountType = useCartStore((s) => s.discountType);
  const paymentMethod = useCartStore((s) => s.paymentMethod);
  const customerName = useCartStore((s) => s.customerName);
  const notes = useCartStore((s) => s.notes);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQty = useCartStore((s) => s.updateQty);
  const clearCart = useCartStore((s) => s.clearCart);
  const setDiscount = useCartStore((s) => s.setDiscount);
  const setPaymentMethod = useCartStore((s) => s.setPaymentMethod);
  const setCustomerName = useCartStore((s) => s.setCustomerName);
  const setNotes = useCartStore((s) => s.setNotes);

  const { subtotal, discountAmount, total } = useCartTotals();
  const createSale = useCreateSale();

  const [confirmClear, setConfirmClear] = useState(false);
  const [amountReceived, setAmountReceived] = useState('');
  const [inlineError, setInlineError] = useState('');

  const amountReceivedNum = Number(amountReceived) || 0;
  const change = amountReceivedNum - total;
  const isCash = paymentMethod === 'cash';
  const canComplete =
    items.length > 0 && (!isCash || amountReceivedNum >= total);

  const handleCompleteSale = () => {
    setInlineError('');
    const payload = buildSalePayload(
      items,
      discount,
      discountType,
      paymentMethod,
      customerName,
      notes,
      subtotal,
      total
    );

    createSale.mutate(payload, {
      onSuccess: (response) => {
        const sale = response?.data ?? response;
        toast.success('Sale completed successfully!');
        onSaleComplete({
          ...sale,
          amountReceived: isCash ? amountReceivedNum : undefined,
          change: isCash ? change : undefined,
        });
        clearCart();
        setAmountReceived('');
        setConfirmClear(false);
      },
      onError: (error) => {
        const message = error.response?.data?.message || '';
        if (message.toLowerCase().includes('stock')) {
          setInlineError(message);
        }
      },
    });
  };

  const handleClearCart = () => {
    clearCart();
    setAmountReceived('');
    setConfirmClear(false);
    setInlineError('');
  };

  return (
    <div className="flex h-full flex-col bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Cart</h2>
          <Badge variant="info">{items.length}</Badge>
        </div>
        {items.length > 0 && !confirmClear && (
          <button
            type="button"
            onClick={() => setConfirmClear(true)}
            className="text-sm font-semibold text-red-500 transition-colors hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
          >
            Clear Cart
          </button>
        )}
        {confirmClear && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">Clear all items?</span>
            <button
              type="button"
              onClick={handleClearCart}
              className="rounded-lg bg-red-500 px-2.5 py-1 text-xs font-bold text-white hover:bg-red-600"
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() => setConfirmClear(false)}
              className="rounded-lg border border-gray-200 px-2.5 py-1 text-xs font-semibold text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              No
            </button>
          </div>
        )}
      </div>

      {/* Items list */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        {items.length === 0 ? (
          <div className="flex h-full min-h-[160px] flex-col items-center justify-center text-gray-400 dark:text-gray-500">
            <ShoppingCart size={40} className="mb-2 opacity-40" />
            <p className="font-medium">Cart is empty</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {items.map((item) => (
              <li
                key={item.medicineId}
                className="rounded-xl border border-gray-100 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <p className="truncate font-medium text-gray-900 dark:text-white">
                        {item.name}
                      </p>
                      {item.requiresPrescription && (
                        <span title="Prescription required" className="shrink-0">
                          <AlertTriangle
                            size={14}
                            className="text-amber-500 dark:text-amber-400"
                          />
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formatCurrency(item.unitPrice)} each
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.medicineId)}
                    className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                    aria-label="Remove item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => updateQty(item.medicineId, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="flex h-7 w-7 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center font-semibold text-gray-900 dark:text-white">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQty(item.medicineId, item.quantity + 1)}
                      disabled={item.quantity >= item.stock}
                      className="flex h-7 w-7 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {formatCurrency(item.unitPrice * item.quantity)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Bottom sections */}
      <div className="border-t border-gray-200 dark:border-gray-700">
        {/* Discount */}
        <div className="px-4 py-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Discount
          </p>
          <div className="mb-2 flex gap-1">
            {['amount', 'percent'].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setDiscount(discount, type)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                  discountType === type
                    ? 'bg-cyan-500 text-white dark:bg-cyan-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                {type === 'amount' ? 'Amount' : '%'}
              </button>
            ))}
          </div>
          <input
            type="number"
            min="0"
            value={discount || ''}
            onChange={(e) => setDiscount(Number(e.target.value) || 0, discountType)}
            placeholder={discountType === 'percent' ? 'Discount %' : 'Discount amount'}
            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-cyan-400"
          />
          {discount > 0 && (
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Discount: -{formatCurrency(discountAmount)}
            </p>
          )}
        </div>

        {/* Customer & notes */}
        <div className="space-y-2 border-t border-gray-100 px-4 py-3 dark:border-gray-800">
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Customer name (optional)"
            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-cyan-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
          />
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Notes (optional)"
            rows={2}
            className="w-full resize-none rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-cyan-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
          />
        </div>

        {/* Payment method */}
        <div className="border-t border-gray-100 px-4 py-3 dark:border-gray-800">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Payment Method
          </p>
          <div className="flex gap-1">
            {PAYMENT_METHODS.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => setPaymentMethod(value)}
                className={`flex-1 rounded-lg px-2 py-2 text-xs font-semibold transition-colors ${
                  paymentMethod === value
                    ? 'bg-cyan-500 text-white dark:bg-cyan-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {isCash && (
            <div className="mt-3 space-y-1">
              <input
                type="number"
                min="0"
                value={amountReceived}
                onChange={(e) => setAmountReceived(e.target.value)}
                placeholder="Amount received"
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-cyan-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              />
              <p
                className={`text-sm font-medium ${
                  change < 0
                    ? 'text-red-500 dark:text-red-400'
                    : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                Change: {formatCurrency(change)}
              </p>
            </div>
          )}
        </div>

        {/* Totals & action */}
        <div className="sticky bottom-0 border-t border-gray-200 bg-white px-4 py-4 dark:border-gray-700 dark:bg-gray-900">
          <div className="mb-3 space-y-1 text-sm">
            <div className="flex justify-between text-gray-600 dark:text-gray-400">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Discount</span>
                <span className="text-red-500 dark:text-red-400">
                  -{formatCurrency(discountAmount)}
                </span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold text-cyan-600 dark:text-cyan-400">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>

          {inlineError && (
            <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
              {inlineError}
            </div>
          )}

          <Button
            onClick={handleCompleteSale}
            disabled={!canComplete || createSale.isPending}
            className="w-full py-3.5 text-base"
          >
            {createSale.isPending ? (
              <span className="flex items-center gap-2">
                <Spinner size="sm" className="border-white/30 border-t-white" />
                Processing...
              </span>
            ) : (
              'COMPLETE SALE'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
