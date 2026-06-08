import { isExpired, isExpiringSoon } from '../../../shared/utils/formatDate';

export function getStockStatus(item) {
  const med = item.medicine;
  if (isExpired(med?.expiryDate)) return 'expired';
  if (item.quantity === 0) return 'out_of_stock';
  if (item.quantity <= (med?.reorderLevel ?? 10)) return 'low_stock';
  return 'in_stock';
}

export const stockBadgeVariant = {
  in_stock: 'success',
  low_stock: 'warning',
  out_of_stock: 'danger',
  expired: 'danger',
};

export const stockStatusLabel = {
  in_stock: 'In Stock',
  low_stock: 'Low Stock',
  out_of_stock: 'Out of Stock',
  expired: 'Expired',
};
