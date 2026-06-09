import { useRef, useState, useEffect } from 'react';
import useReports from './hooks/useReports';
import ReportFilters from './components/ReportFilters';
import InventoryReportTable from './components/InventoryReportTable';
import ReportExportBar from './components/ReportExportBar';
import { formatCurrency } from '../../shared/utils/formatters';

const SummaryCard = ({ label, value, accent }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
    <p className="text-xs text-slate-400 mb-1">{label}</p>
    <p className={`text-lg font-extrabold ${accent ? 'text-cyan-600' : 'text-slate-800'}`}>{value}</p>
  </div>
);

export default function InventoryReportPage() {
  const printRef = useRef();
  const { inventoryReport, loading, fetch } = useReports('inventory');
  const [filters, setFilters] = useState({ category: '', status: '' });

  useEffect(() => { fetch(filters); }, []);

  const { data: items = [], summary } = inventoryReport;

  const csvHeaders = ['Medicine', 'Category', 'Qty', 'Unit', 'Reorder Level', 'Stock Value', 'Status', 'Expiry Date'];
  const csvRows = items.map((i) => [
    i.medicine, i.category || '', i.quantity, i.unit,
    i.reorderLevel, i.stockValue, i.status, i.expiryDate?.slice(0, 10) || '',
  ]);

  return (
    <div className="p-6 space-y-5 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-slate-800">Inventory Report</h1>
          <p className="text-xs text-slate-400">Current stock snapshot</p>
        </div>
        <ReportExportBar printRef={printRef} title="Inventory-Report" csvHeaders={csvHeaders} csvRows={csvRows} />
      </div>

      <ReportFilters
        filters={filters}
        onChange={setFilters}
        onApply={() => fetch(filters)}
        extras={[
          { name: 'status', options: [{ value: '', label: 'All Status' }, { value: 'in_stock', label: 'In Stock' }, { value: 'low_stock', label: 'Low Stock' }, { value: 'out_of_stock', label: 'Out of Stock' }, { value: 'expired', label: 'Expired' }] },
          { name: 'category', type: 'text', placeholder: 'Filter by category...' },
        ]}
      />

      {summary && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <SummaryCard label="Total Stock Value" value={formatCurrency(summary.totalStockValue)} accent />
          <SummaryCard label="Total Items"       value={summary.totalItems?.toLocaleString()} />
          <SummaryCard label="Low Stock"         value={summary.lowStockCount} />
          <SummaryCard label="Expired"           value={summary.expiredCount} />
        </div>
      )}

      <div ref={printRef} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <InventoryReportTable data={items} loading={loading} />
      </div>
    </div>
  );
}
