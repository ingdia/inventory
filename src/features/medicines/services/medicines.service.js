import api from '../../../shared/services/api';
import { API_ROUTES } from '../../../shared/constants/api.constants';
import axiosInstance from '@/shared/services/axiosInstance';

export const medicinesService = {
  getAll: (params) => api.get(API_ROUTES.MEDICINES, { params }),
  getOne: (id) => api.get(`${API_ROUTES.MEDICINES}/${id}`),
  create: (data) => api.post(API_ROUTES.MEDICINES, data),
  update: (id, data) => api.put(`${API_ROUTES.MEDICINES}/${id}`, data),
  remove: (id) => api.delete(`${API_ROUTES.MEDICINES}/${id}`),
  getLowStock: () => api.get(`${API_ROUTES.MEDICINES}/low-stock`),
  getExpiring: () => api.get(`${API_ROUTES.MEDICINES}/expiring`),
  getExpired: () => api.get(`${API_ROUTES.MEDICINES}/expired`),
  getCategories: () => api.get(API_ROUTES.CATEGORIES),
  getSuppliers: () => api.get(API_ROUTES.SUPPLIERS),
};

export const getMedicines = (params) => axiosInstance.get('/medicines', { params });
export const createMedicine = (data) => axiosInstance.post('/medicines', data);
export const updateMedicine = (id, data) => axiosInstance.put(`/medicines/${id}`, data);
export const deleteMedicine = (id) => axiosInstance.delete(`/medicines/${id}`);
