import { useRef, useState, useEffect } from 'react';
import useReports from './hooks/useReports';
import ReportFilters from './components/ReportFilters';
import PurchasesReportTable from './components/PurchasesReportTable';
import ReportExportBar from './components/ReportExportBar';
import { formatCurrency } from '../../shared/utils/formatters';

const SummaryCard = ({ label, value }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
    <p className="text-xs text-slate-400 mb-1">{label}</p>
    <p className="text-lg font-extrabold text-slate-800">{value}</p>
  </div>
);

export default function PurchasesReportPage() {
  const printRef = useRef();
  const { purchasesReport, loading, fetch } = useReports('purchases');
  const [filters, setFilters] = useState({ startDate: '', endDate: '', supplier: '', status: '' });

  useEffect(() => { fetch(filters); }, []);

  const { data: rows = [], summary } = purchasesReport;

  const csvHeaders = ['Invoice No', 'Date', 'Supplier', 'Items', 'Total Amount', 'Status', 'Recorded By'];
  const csvRows = rows.map((p) => [
    p.invoiceNo || '', p.purchaseDate?.slice(0, 10) || '', p.supplier?.name || '',
    p.items?.length ?? 0, p.totalAmount, p.status,
    p.recordedBy ? `${p.recordedBy.firstName} ${p.recordedBy.lastName}` : '',
  ]);

  return (
    <div className="p-6 space-y-5 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-slate-800">Purchases Report</h1>
          <p className="text-xs text-slate-400">Purchase orders and supplier payments</p>
        </div>
        <ReportExportBar printRef={printRef} title="Purchases-Report" csvHeaders={csvHeaders} csvRows={csvRows} />
      </div>

      <ReportFilters
        filters={filters}
        onChange={setFilters}
        onApply={() => fetch(filters)}
        extras={[
          { name: 'status', options: [{ value: '', label: 'All Status' }, { value: 'pending', label: 'Pending' }, { value: 'received', label: 'Received' }, { value: 'cancelled', label: 'Cancelled' }] },
          { name: 'supplier', type: 'text', placeholder: 'Filter by supplier...' },
        ]}
      />

      {summary && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <SummaryCard label="Total Purchases"   value={summary.totalPurchases?.toLocaleString()} />
          <SummaryCard label="Total Amount Spent" value={formatCurrency(summary.totalAmount)} />
          <SummaryCard label="Pending Orders"    value={summary.pendingCount} />
          <SummaryCard label="Received Orders"   value={summary.receivedCount} />
        </div>
      )}

      <div ref={printRef} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <PurchasesReportTable data={rows} loading={loading} />
      </div>
    </div>
  );
}
