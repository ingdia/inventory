export const formatDate = (date) => {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

export const isExpired = (date) => date && new Date(date) < new Date();

export const isExpiringSoon = (date, days = 30) => {
  if (!date) return false;
  const expiry = new Date(date);
  const threshold = new Date();
  threshold.setDate(threshold.getDate() + days);
  return expiry > new Date() && expiry <= threshold;
};
