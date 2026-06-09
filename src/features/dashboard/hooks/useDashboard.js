import { useEffect } from 'react';
import useDashboardStore from '../store/dashboardStore';

export default function useDashboard() {
  const fetchDashboardData = useDashboardStore((s) => s.fetchDashboardData);
  const startDate = useDashboardStore((s) => s.dateRange.startDate);
  const endDate = useDashboardStore((s) => s.dateRange.endDate);
  const period = useDashboardStore((s) => s.period);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [startDate, endDate, period]);

  return useDashboardStore();
}
