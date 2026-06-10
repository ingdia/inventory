import { isExpired } from '../../../shared/utils/formatDate';

export function getStockStatus(medicine, quantity) {
  if (isExpired(medicine?.expiryDate)) return 'expired';
  if (quantity === 0) return 'out_of_stock';
  if (quantity <= (medicine?.reorderLevel ?? 10)) return 'low_stock';
  return 'in_stock';
}

export function stockStatusBadgeVariant(status) {
  return { in_stock: 'success', low_stock: 'warning', out_of_stock: 'danger', expired: 'danger' }[status] || 'default';
}

export function stockStatusLabel(status) {
  return { in_stock: 'In Stock', low_stock: 'Low Stock', out_of_stock: 'Out of Stock', expired: 'Expired' }[status] || status;
}

export function exportMedicinesToCSV(medicines) {
  const headers = ['Name', 'Generic Name', 'Category', 'Supplier', 'Unit', 'Purchase Price', 'Selling Price', 'Reorder Level', 'Expiry Date', 'Status'];
  const rows = medicines.map((m) => [
    m.name, m.genericName || '', m.category?.name || '', m.supplier?.name || '',
    m.unit, m.purchasePrice, m.sellingPrice, m.reorderLevel, m.expiryDate?.split('T')[0] || '', m.status,
  ]);
  const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'medicines.csv'; a.click();
  URL.revokeObjectURL(url);
}
