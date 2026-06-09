import api from '../../../shared/services/api';

export const reportsService = {
  getSalesReport:     (params) => api.get('/reports/sales', { params }),
  getInventoryReport: (params) => api.get('/reports/inventory', { params }),
  getProfitLoss:      (params) => api.get('/reports/profit-loss', { params }),
  getPurchasesReport: (params) => api.get('/reports/purchases', { params }),
};
