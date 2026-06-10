// src/shared/utils/formatDate.js

// ── Internal helpers ───────────────────────────────────────────────
function toDate(value) {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  day:   '2-digit',
  month: 'short',
  year:  'numeric',
});

const dateTimeFormatter = new Intl.DateTimeFormat('en-GB', {
  day:    '2-digit',
  month:  'short',
  year:   'numeric',
  hour:   '2-digit',
  minute: '2-digit',
  hour12: false,
});

// ── Formatting functions ───────────────────────────────────────────

// "12 Jun 2025"
export function formatDate(date) {
  const parsed = toDate(date);
  if (!parsed) return '';
  return dateFormatter.format(parsed);
}

// "12 Jun 2025, 14:30"
export function formatDateTime(date) {
  const parsed = toDate(date);
  if (!parsed) return '';
  return dateTimeFormatter.format(parsed);
}

// "2025-06-12"  — for date input value prop
export function formatDateForInput(date) {
  const parsed = toDate(date);
  if (!parsed) return '';
  const year  = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, '0');
  const day   = String(parsed.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// ── Expiry utilities (used by Esther's medicines module) ───────────

// Returns true if the date is in the past
export const isExpired = (date) => {
  const parsed = toDate(date);
  return parsed ? parsed < new Date() : false;
};

// Returns true if the date is within `days` days from now but not yet expired
export const isExpiringSoon = (date, days = 30) => {
  const parsed = toDate(date);
  if (!parsed) return false;
  const now       = new Date();
  const threshold = new Date();
  threshold.setDate(threshold.getDate() + days);
  return parsed > now && parsed <= threshold;
};