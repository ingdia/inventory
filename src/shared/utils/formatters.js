export { formatCurrency, formatCurrencyOrDash } from './formatCurrency';
export { formatDate, formatDateTime, formatDateForInput, isExpired, isExpiringSoon } from './formatDate';

export function formatPercent(value, decimals = 1) {
  if (value == null || isNaN(Number(value))) return '0%';
  return `${Number(value).toFixed(decimals)}%`;
}
