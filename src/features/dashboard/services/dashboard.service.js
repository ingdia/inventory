import api from '../../../shared/services/api';

const q = (params) => ({ params });

export const dashboardService = {
  getMetrics:        (p) => api.get('/dashboard/metrics', q(p)),
  getRevenueChart:   (p) => api.get('/dashboard/revenue-chart', q(p)),
  getTopMedicines:   (p) => api.get('/dashboard/top-medicines', q(p)),
  getSalesByPayment: (p) => api.get('/dashboard/sales-by-payment', q(p)),
  getProfitSummary:  (p) => api.get('/dashboard/profit-summary', q(p)),
  getRecentSales:    ()  => api.get('/dashboard/recent-sales'),
  getLowStock:       ()  => api.get('/dashboard/low-stock'),
  getExpiring:       ()  => api.get('/dashboard/expiring'),
};
