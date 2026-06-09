import { create } from 'zustand';
import { reportsService } from '../services/reports.service';

const useReportsStore = create((set) => ({
  salesReport:     { data: [], summary: null, pagination: null },
  inventoryReport: { data: [], summary: null },
  profitLoss:      { data: [], summary: null },
  purchasesReport: { data: [], summary: null, pagination: null },
  loading: false,
  filters: {},

  setFilters: (filters) => set({ filters }),

  fetchReport: async (type, params) => {
    set({ loading: true });
    try {
      const serviceMap = {
        sales:     reportsService.getSalesReport,
        inventory: reportsService.getInventoryReport,
        profitLoss:reportsService.getProfitLoss,
        purchases: reportsService.getPurchasesReport,
      };
      const { data } = await serviceMap[type](params);
      const keyMap = { sales: 'salesReport', inventory: 'inventoryReport', profitLoss: 'profitLoss', purchases: 'purchasesReport' };
      set({ [keyMap[type]]: { data: data.data, summary: data.summary, pagination: data.data?.pagination } });
    } catch {
      // silent
    } finally {
      set({ loading: false });
    }
  },
}));

export default useReportsStore;
