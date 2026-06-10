// src/features/purchases/utils/purchases.utils.js
import { formatDate } from '../../../shared/utils/formatDate.js';

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

export function buildPurchasePayload(formData, items) {
  return {
    invoiceNumber: formData.invoiceNumber,
    supplier: formData.supplier,
    purchaseDate: formData.purchaseDate,
    expectedDelivery: formData.expectedDelivery || undefined,
    notes: formData.notes || undefined,
    items: items.map((item) => ({
      medicine: item.medicineId || item.medicine,
      quantity: Number(item.quantity),
      purchasePrice: Number(item.purchasePrice),
    })),
  };
}

export function exportPurchasesToCSV(purchases) {
  const headers = [
    'PO Number',
    'Date',
    'Supplier',
    'Items',
    'Total',
    'Status',
    'Recorded By',
  ];

  const rows = purchases.map((purchase) => {
    const itemsSummary = (purchase.items || [])
      .map((item) => {
        const name = item.medicineName || item.medicine?.name || 'Item';
        return `${name} x${item.quantity}`;
      })
      .join('; ');

    return [
      purchase.invoiceNumber,
      formatDate(purchase.purchaseDate),
      purchase.supplier?.name || '',
      itemsSummary,
      purchase.totalAmount,
      purchase.status,
      purchase.recordedBy?.name || '',
    ]
      .map(escapeCSV)
      .join(',');
  });

  const csv = [headers.join(','), ...rows].join('\n');
  downloadCSV('purchases-export.csv', csv);
}
