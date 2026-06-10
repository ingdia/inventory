import { useEffect, useRef } from 'react';
import { useShallow } from 'zustand/react/shallow';
import useDashboardStore from '../store/dashboardStore';

export default function useDashboard() {
  const startDate = useDashboardStore((s) => s.dateRange.startDate);
  const endDate   = useDashboardStore((s) => s.dateRange.endDate);
  const period    = useDashboardStore((s) => s.period);
  const fetch     = useDashboardStore((s) => s.fetchDashboardData);

  const fetchRef = useRef(fetch);
  fetchRef.current = fetch;

  useEffect(() => {
    fetchRef.current();
    const interval = setInterval(() => fetchRef.current(), 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [startDate, endDate, period]);

  return useDashboardStore(
    useShallow((s) => ({
      metrics:        s.metrics,
      revenueChart:   s.revenueChart,
      topMedicines:   s.topMedicines,
      salesByPayment: s.salesByPayment,
      profitSummary:  s.profitSummary,
      recentSales:    s.recentSales,
      lowStockItems:  s.lowStockItems,
      expiringItems:  s.expiringItems,
      dateRange:      s.dateRange,
      period:         s.period,
      loading:        s.loading,
      setDateRange:   s.setDateRange,
      setPeriod:      s.setPeriod,
    }))
  );
}
