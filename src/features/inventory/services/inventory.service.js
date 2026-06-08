import api from '../../../shared/services/api';
import { API_ROUTES } from '../../../shared/constants/api.constants';

export const inventoryService = {
  getAll: (params) => api.get(API_ROUTES.INVENTORY, { params }),
  getByMedicine: (medicineId) => api.get(`${API_ROUTES.INVENTORY}/${medicineId}`),
  getSummary: () => api.get(API_ROUTES.INVENTORY_SUMMARY),
  recordMovement: (data) => api.post(API_ROUTES.STOCK_MOVEMENT, data),
  getTransactions: (params) => api.get(API_ROUTES.TRANSACTIONS, { params }),
  getTransactionsByMedicine: (medicineId, params) => api.get(`${API_ROUTES.TRANSACTIONS}/${medicineId}`, { params }),
};
