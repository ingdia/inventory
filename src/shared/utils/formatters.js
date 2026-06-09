import { format, parseISO } from 'date-fns';

export const formatCurrency = (value = 0) =>
  new Intl.NumberFormat('en-RW', { style: 'currency', currency: 'RWF', maximumFractionDigits: 0 }).format(value);

export const formatDate = (date, pattern = 'MMM dd, yyyy') => {
  if (!date) return '—';
  try {
    return format(typeof date === 'string' ? parseISO(date) : date, pattern);
  } catch {
    return '—';
  }
};

export const formatPercent = (value = 0) => `${Number(value).toFixed(1)}%`;
