// src/features/sales/utils/receipt.utils.js
import { formatCurrency } from '../../../shared/utils/formatCurrency.js';
import { formatDateTime } from '../../../shared/utils/formatDate.js';

export function formatReceiptData(apiSale) {
  const items = (apiSale.items || []).map((item) => ({
    name: item.medicineName || item.medicine?.name || 'Unknown',
    quantity: item.quantity,
    unitPrice: formatCurrency(item.unitPrice),
    subtotal: formatCurrency(item.subtotal ?? item.quantity * item.unitPrice),
  }));

  return {
    receiptNumber: apiSale.receiptNumber,
    date: formatDateTime(apiSale.createdAt),
    cashier: apiSale.soldBy?.name || '',
    customer: apiSale.customer?.name || 'Walk-in',
    items,
    subtotal: formatCurrency(apiSale.subtotal),
    discountAmount: formatCurrency(apiSale.discount ?? 0),
    total: formatCurrency(apiSale.total),
    paymentMethod: apiSale.paymentMethod,
    notes: apiSale.notes || '',
  };
}
