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
        sales:      reportsService.getSalesReport,
        inventory:  reportsService.getInventoryReport,
        profitLoss: reportsService.getProfitLoss,
        purchases:  reportsService.getPurchasesReport,
      };
      const keyMap = { sales: 'salesReport', inventory: 'inventoryReport', profitLoss: 'profitLoss', purchases: 'purchasesReport' };
      const { data: res } = await serviceMap[type](params);
      // sales & purchases: res.data = { sales/purchases: [], pagination: {} }
      // inventory & profitLoss: res.data = []
      let list = [];
      let pagination = null;
      if (Array.isArray(res.data)) {
        list = res.data;
      } else if (res.data?.sales) {
        list = res.data.sales;
        pagination = res.data.pagination;
      } else if (res.data?.purchases) {
        list = res.data.purchases;
        pagination = res.data.pagination;
      }
      set({ [keyMap[type]]: { data: list, summary: res.summary || null, pagination } });
    } catch (e) {
      console.error('[reportsStore]', type, e);
    } finally {
      set({ loading: false });
    }
  },
}));

export default useReportsStore;
