// src/features/sales/utils/sales.utils.js
import { formatDateTime } from '../../../shared/utils/formatDate.js';

function escapeCSV(value) {
  const str = String(value ?? '');
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function downloadCSV(filename, content) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function buildSalePayload(
  cartItems,
  discount,
  discountType,
  paymentMethod,
  customerName,
  notes,
  subtotal,
  total
) {
  return {
    items: cartItems.map((item) => ({
      medicine: item.medicineId,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
    })),
    discount:
      discountType === 'percent' ? (subtotal * discount) / 100 : discount,
    paymentMethod,
    customer: { name: customerName },
    notes,
  };
}

export function exportSalesToCSV(sales) {
  const headers = [
    'Receipt No',
    'Date',
    'Customer',
    'Cashier',
    'Items',
    'Total',
    'Payment Method',
    'Status',
  ];

  const rows = sales.map((sale) => {
    const itemsSummary = (sale.items || [])
      .map((item) => {
        const name = item.medicineName || item.medicine?.name || 'Item';
        return `${name} x${item.quantity}`;
      })
      .join('; ');

    return [
      sale.receiptNumber,
      formatDateTime(sale.createdAt),
      sale.customer?.name || 'Walk-in',
      sale.soldBy?.name || '',
      itemsSummary,
      sale.total,
      sale.paymentMethod,
      sale.status || 'completed',
    ]
      .map(escapeCSV)
      .join(',');
  });

  const csv = [headers.join(','), ...rows].join('\n');
  downloadCSV('sales-export.csv', csv);
}
