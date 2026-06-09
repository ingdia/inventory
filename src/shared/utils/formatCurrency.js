// src/shared/utils/formatCurrency.js
const formatter = new Intl.NumberFormat('rw-RW', {
  style: 'currency',
  currency: 'RWF',
  maximumFractionDigits: 0,
});

export function formatCurrency(amount) {
  if (amount == null || Number.isNaN(Number(amount))) {
    return 'RWF 0';
  }

  return formatter.format(amount);
}
