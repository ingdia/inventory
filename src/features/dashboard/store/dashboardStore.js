import { create } from 'zustand';
import { dashboardService } from '../services/dashboard.service';
import toast from 'react-hot-toast';

const useDashboardStore = create((set, get) => ({
  metrics: null,
  revenueChart: [],
  topMedicines: [],
  salesByPayment: [],
  profitSummary: null,
  recentSales: [],
  lowStockItems: [],
  expiringItems: [],
  dateRange: { startDate: null, endDate: null },
  period: '30d',
  loading: {
    metrics: false, revenueChart: false, topMedicines: false,
    salesByPayment: false, profitSummary: false, recentSales: false,
    lowStock: false, expiring: false,
  },

  setDateRange: (dateRange) => set({ dateRange }),
  setPeriod: (period) => set({ period }),

  setLoading: (key, val) =>
    set((s) => {
      if (s.loading[key] === val) return s;
      return { loading: { ...s.loading, [key]: val } };
    }),

  fetchDashboardData: async () => {
    const { dateRange, period, setLoading } = get();
    const calls = [
      { key: 'metrics',       fn: () => dashboardService.getMetrics(dateRange),        setter: (d) => set({ metrics: d }) },
      { key: 'revenueChart',  fn: () => dashboardService.getRevenueChart({ period }),  setter: (d) => set({ revenueChart: d }) },
      { key: 'topMedicines',  fn: () => dashboardService.getTopMedicines(dateRange),   setter: (d) => set({ topMedicines: d }) },
      { key: 'salesByPayment',fn: () => dashboardService.getSalesByPayment(dateRange), setter: (d) => set({ salesByPayment: d }) },
      { key: 'profitSummary', fn: () => dashboardService.getProfitSummary(dateRange),  setter: (d) => set({ profitSummary: d }) },
      { key: 'recentSales',   fn: () => dashboardService.getRecentSales(),             setter: (d) => set({ recentSales: d }) },
      { key: 'lowStock',      fn: () => dashboardService.getLowStock(),                setter: (d) => set({ lowStockItems: d }) },
      { key: 'expiring',      fn: () => dashboardService.getExpiring(),                setter: (d) => set({ expiringItems: d }) },
    ];

    calls.forEach(({ key }) => setLoading(key, true));

    await Promise.allSettled(
      calls.map(async ({ key, fn, setter }) => {
        try {
          const { data } = await fn();
          setter(data.data);
        } catch (e) {
          console.error('[dashboard]', key, e?.response?.data || e.message);
        } finally {
          setLoading(key, false);
        }
      })
    );
  },
}));

export default useDashboardStore;
