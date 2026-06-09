import { useNavigate } from 'react-router-dom';
import {
  DollarSign, TrendingUp, ShoppingCart, Calendar,
  Package, AlertTriangle, Clock, BarChart2,
} from 'lucide-react';
import useDashboard from './hooks/useDashboard';
import MetricCard from './components/MetricCard';
import RevenueChart from './components/RevenueChart';
import TopMedicinesChart from './components/TopMedicinesChart';
import SalesByPaymentChart from './components/SalesByPaymentChart';
import ProfitSummaryCard from './components/ProfitSummaryCard';
import RecentSalesWidget from './components/RecentSalesWidget';
import LowStockWidget from './components/LowStockWidget';
import ExpiryWidget from './components/ExpiryWidget';
import DateRangeSelector from './components/DateRangeSelector';

export default function DashboardPage() {
  const navigate = useNavigate();
  const {
    metrics, revenueChart, topMedicines, salesByPayment,
    profitSummary, recentSales, lowStockItems, expiringItems,
    dateRange, period, loading, setDateRange, setPeriod,
  } = useDashboard();

  const m = metrics || {};
  const l = loading;

  const cards = [
    { icon: DollarSign,    label: 'Total Revenue',        value: m.totalRevenue,        trend: m.trends?.revenueTrend,      color: 'cyan',   isCurrency: true },
    { icon: TrendingUp,    label: "Today's Revenue",      value: m.todayRevenue,         trend: undefined,                   color: 'green',  isCurrency: true },
    { icon: ShoppingCart,  label: 'Total Transactions',   value: m.totalTransactions,    trend: m.trends?.transactionsTrend, color: 'blue'   },
    { icon: Calendar,      label: "Today's Transactions", value: m.todayTransactions,    trend: undefined,                   color: 'purple' },
    { icon: BarChart2,     label: 'Total Profit',         value: m.totalProfit,          trend: undefined,                   color: 'cyan',   isCurrency: true },
    { icon: Package,       label: 'Total Medicines',      value: m.totalMedicines,       trend: undefined,                   color: 'green' },
    {
      icon: AlertTriangle, label: 'Low Stock Items',      value: m.lowStockCount,        trend: undefined, color: 'amber',
      onClick: () => navigate('/inventory'),
    },
    {
      icon: Clock,         label: 'Expiring Soon',        value: m.expiringCount,        trend: undefined, color: 'red',
      onClick: () => navigate('/inventory'),
    },
  ];

  return (
    <div className="p-6 space-y-6 min-h-screen">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-800">Dashboard</h1>
          <p className="text-xs text-slate-400 mt-0.5">Live business overview</p>
        </div>
        <DateRangeSelector
          startDate={dateRange.startDate}
          endDate={dateRange.endDate}
          onChange={setDateRange}
          showPeriod
          period={period}
          onPeriodChange={setPeriod}
        />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-3">
        {cards.map((c, i) => (
          <div key={i} className="xl:col-span-1 sm:col-span-1 col-span-1">
            <MetricCard {...c} loading={l.metrics} />
          </div>
        ))}
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RevenueChart data={revenueChart} loading={l.revenueChart} />
        <TopMedicinesChart data={topMedicines} loading={l.topMedicines} />
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SalesByPaymentChart data={salesByPayment} loading={l.salesByPayment} />
        <ProfitSummaryCard data={profitSummary} loading={l.profitSummary} />
      </div>

      {/* Widgets row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <RecentSalesWidget data={recentSales} loading={l.recentSales} />
        <LowStockWidget data={lowStockItems} loading={l.lowStock} />
        <ExpiryWidget data={expiringItems} loading={l.expiring} />
      </div>
    </div>
  );
}
