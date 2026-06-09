import { useRef, useState, useEffect } from 'react';
import useReports from './hooks/useReports';
import ReportFilters from './components/ReportFilters';
import SalesReportTable from './components/SalesReportTable';
import ReportExportBar from './components/ReportExportBar';
import { formatCurrency } from '../../shared/utils/formatters';

const SummaryCard = ({ label, value }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
    <p className="text-xs text-slate-400 mb-1">{label}</p>
    <p className="text-lg font-extrabold text-slate-800">{value}</p>
  </div>
);

export default function SalesReportPage() {
  const printRef = useRef();
  const { salesReport, loading, fetch } = useReports('sales');
  const [filters, setFilters] = useState({ startDate: '', endDate: '', paymentMethod: '', soldBy: '' });

  useEffect(() => { fetch(filters); }, []);

  const { data: sales = [], summary } = salesReport;

  const csvHeaders = ['Receipt No', 'Date', 'Customer', 'Items', 'Subtotal', 'Discount', 'Total', 'Payment', 'Cashier'];
  const csvRows = sales.map((s) => [
    s.receiptNo || '', s.createdAt?.slice(0, 10) || '', s.customerName || 'Walk-in',
    s.items?.length ?? 0, s.subtotal ?? s.totalAmount, s.discount ?? 0, s.totalAmount,
    s.paymentMethod, s.soldBy ? `${s.soldBy.firstName} ${s.soldBy.lastName}` : '',
  ]);

  return (
    <div className="p-6 space-y-5 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-slate-800">Sales Report</h1>
          <p className="text-xs text-slate-400">Detailed sales transactions</p>
        </div>
        <ReportExportBar printRef={printRef} title="Sales-Report" csvHeaders={csvHeaders} csvRows={csvRows} />
      </div>

      <ReportFilters
        filters={filters}
        onChange={setFilters}
        onApply={() => fetch(filters)}
        extras={[
          { name: 'paymentMethod', options: [{ value: '', label: 'All Payments' }, { value: 'cash', label: 'Cash' }, { value: 'mobile_money', label: 'Mobile Money' }, { value: 'insurance', label: 'Insurance' }] },
        ]}
      />

      {summary && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <SummaryCard label="Total Sales"    value={summary.totalSales?.toLocaleString()} />
          <SummaryCard label="Total Revenue"  value={formatCurrency(summary.totalRevenue)} />
          <SummaryCard label="Total Discount" value={formatCurrency(summary.totalDiscount)} />
          <SummaryCard label="Net Revenue"    value={formatCurrency(summary.netRevenue)} />
        </div>
      )}

      <div ref={printRef} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <SalesReportTable data={sales} loading={loading} />
      </div>
    </div>
  );
}
