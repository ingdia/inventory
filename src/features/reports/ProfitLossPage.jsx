import { useRef, useState, useEffect } from 'react';
import useReports from './hooks/useReports';
import ReportFilters from './components/ReportFilters';
import ProfitLossTable from './components/ProfitLossTable';
import ReportExportBar from './components/ReportExportBar';
import { formatCurrency, formatPercent } from '../../shared/utils/formatters';

const SummaryCard = ({ label, value, accent }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
    <p className="text-xs text-slate-400 mb-1">{label}</p>
    <p className={`text-lg font-extrabold ${accent ? 'text-cyan-600' : 'text-slate-800'}`}>{value}</p>
  </div>
);

export default function ProfitLossPage() {
  const printRef = useRef();
  const { profitLoss, loading, fetch } = useReports('profitLoss');
  const [filters, setFilters] = useState({ startDate: '', endDate: '', groupBy: 'month' });

  useEffect(() => { fetch(filters); }, []);

  const { data: rows = [], summary } = profitLoss;

  const csvHeaders = ['Period', 'Revenue', 'COGS', 'Gross Profit', 'Margin %'];
  const csvRows = rows.map((r) => [r.period, r.revenue, r.cogs, r.grossProfit, r.margin]);

  return (
    <div className="p-6 space-y-5 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-slate-800">Profit & Loss</h1>
          <p className="text-xs text-slate-400">Revenue vs cost breakdown</p>
        </div>
        <ReportExportBar printRef={printRef} title="Profit-Loss-Report" csvHeaders={csvHeaders} csvRows={csvRows} />
      </div>

      <ReportFilters
        filters={filters}
        onChange={setFilters}
        onApply={() => fetch(filters)}
        extras={[
          { name: 'groupBy', options: [{ value: 'month', label: 'By Month' }, { value: 'day', label: 'By Day' }] },
        ]}
      />

      {summary && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <SummaryCard label="Total Revenue"  value={formatCurrency(summary.totalRevenue)} />
          <SummaryCard label="Total COGS"     value={formatCurrency(summary.totalCOGS)} />
          <SummaryCard label="Gross Profit"   value={formatCurrency(summary.grossProfit)} accent />
          <SummaryCard label="Gross Margin"   value={formatPercent(summary.grossMargin)} accent />
        </div>
      )}

      <div ref={printRef} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 overflow-hidden">
        <ProfitLossTable data={rows} loading={loading} />
      </div>
    </div>
  );
}
