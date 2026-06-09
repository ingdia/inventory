import { useEffect } from 'react';
import useDashboardStore from '../store/dashboardStore';

export default function useDashboard() {
  const { fetchDashboardData, dateRange, period } = useDashboardStore();

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [dateRange, period]);

  return useDashboardStore();
}
