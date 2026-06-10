import { create } from 'zustand';
import { inventoryService } from '../services/inventory.service';
import { medicinesService } from '../../medicines/services/medicines.service';
import toast from 'react-hot-toast';

const useInventoryStore = create((set, get) => ({
  inventory: [],
  lowStockItems: [],
  expiringItems: [],
  stockMovements: [],
  summary: null,
  loading: false,
  transactionPagination: { page: 1, totalPages: 1, total: 0 },
  inventoryPagination: { page: 1, totalPages: 1, total: 0 },

  fetchInventory: async (params = {}) => {
    set({ loading: true });
    try {
      const { data } = await inventoryService.getAll({ limit: 10, ...params });
      set({
        inventory: data.data.inventory,
        inventoryPagination: { page: data.data.page, totalPages: data.data.totalPages, total: data.data.total },
        loading: false,
      });
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to fetch inventory';
      toast.error(msg);
      set({ loading: false });
    }
  },

  fetchAlerts: async () => {
    try {
      const [lowRes, expiringRes] = await Promise.all([
        medicinesService.getLowStock(),
        medicinesService.getExpiring(),
      ]);
      set({
        lowStockItems: lowRes.data.data || [],
        expiringItems: expiringRes.data.data || [],
      });
    } catch {
      // silent — alerts are non-critical
    }
  },

  fetchSummary: async () => {
    try {
      const { data } = await inventoryService.getSummary();
      set({ summary: data.data });
    } catch {
      toast.error('Failed to fetch summary');
    }
  },

  fetchTransactions: async (params = {}) => {
    set({ loading: true });
    try {
      const { data } = await inventoryService.getTransactions({ limit: 10, ...params });
      set({
        stockMovements: data.data.transactions,
        transactionPagination: { page: data.data.page, totalPages: data.data.totalPages, total: data.data.total },
        loading: false,
      });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch transactions');
      set({ loading: false });
    }
  },

  recordStockMovement: async (payload) => {
    const { data } = await inventoryService.recordMovement(payload);
    toast.success('Stock movement recorded');
    get().fetchInventory();
    get().fetchSummary();
    return data.data;
  },
}));

export default useInventoryStore;
