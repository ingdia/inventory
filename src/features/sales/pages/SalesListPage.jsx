import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign,
  Receipt,
  TrendingUp,
  Calendar,
  Download,
  Eye,
  Printer,
  ShoppingBag,
} from 'lucide-react';
import { useSalesList, useTodaySummary } from '../hooks/useSales.js';
import useSalesStore from '../store/salesStore.js';
import usePagination from '../../../shared/hooks/usePagination.js';
import useDebounce from '../../../shared/hooks/useDebounce.js';
import { formatCurrency } from '../../../shared/utils/formatCurrency.js';
import { formatDateTime } from '../../../shared/utils/formatDate.js';
import { exportSalesToCSV } from '../utils/sales.utils.js';
import SearchBar from '../../../shared/components/SearchBar.jsx';
import Button from '../../../shared/components/Button.jsx';
import Spinner from '../../../shared/components/Spinner.jsx';
import Pagination from '../../../shared/components/Pagination.jsx';
import PaymentMethodBadge from '../../../shared/components/PaymentMethodBadge.jsx';
import SaleStatusBadge from '../components/SaleStatusBadge.jsx';
import SaleDetailModal from '../components/SaleDetailModal.jsx';
import ReceiptModal from '../components/ReceiptModal.jsx';

function SummaryCard({ title, value, icon: Icon, loading, children }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          {loading ? (
            <div className="mt-2">
              <Spinner size="sm" />
            </div>
          ) : (
            <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
          )}
          {children}
        </div>
        <div className="rounded-lg bg-cyan-50 p-2.5 dark:bg-cyan-900/20">
          <Icon size={20} className="text-cyan-600 dark:text-cyan-400" />
        </div>
      </div>
    </div>
  );
}

function TableSkeleton() {
  return (
    <>
      {Array.from({ length: 8 }).map((_, i) => (
        <tr key={i} className="border-b border-gray-100 dark:border-gray-800">
          {Array.from({ length: 9 }).map((__, j) => (
            <td key={j} className="px-4 py-3">
              <div className="h-4 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

function getItemsSummary(items = []) {
  if (!items.length) return '—';
  return items
    .map((item) => {
      const name = item.medicineName || item.medicine?.name || 'Item';
      return `${name} x${item.quantity}`;
    })
    .join(', ');
}

const PAYMENT_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'cash', label: 'Cash' },
  { value: 'mobile_money', label: 'Mobile Money' },
  { value: 'insurance', label: 'Insurance' },
];

const STATUS_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'completed', label: 'Completed' },
  { value: 'refunded', label: 'Refunded' },
  { value: 'voided', label: 'Voided' },
];

const selectClassName =
  'rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/20';

export default function SalesListPage() {
  const [searchInput, setSearchInput] = useState('');
  const [selectedSaleId, setSelectedSaleId] = useState(null);
  const [receiptSale, setReceiptSale] = useState(null);

  const { filters, setFilter, resetFilters } = useSalesStore();
  const { page, limit, setPage, resetPage } = usePagination(1, 20);
  const debouncedSearch = useDebounce(searchInput, 300);

  const queryFilters = useMemo(
    () => ({
      ...filters,
      search: debouncedSearch,
      page,
      limit,
    }),
    [filters, debouncedSearch, page, limit]
  );

  const { data, isLoading } = useSalesList(queryFilters);
  const { data: summaryData, isLoading: summaryLoading } = useTodaySummary();

  const sales = Array.isArray(data?.data) ? data.data : data?.data?.sales ?? [];
  const pagination = data?.data?.pagination ?? data?.pagination ?? { total: 0, page: 1, limit: 20, totalPages: 1 };
  const summary = summaryData?.data ?? {};

  const hasActiveFilters = Boolean(
    searchInput ||
      filters.startDate ||
      filters.endDate ||
      filters.paymentMethod ||
      filters.status
  );

  useEffect(() => {
    resetPage();
  }, [debouncedSearch, filters.startDate, filters.endDate, filters.paymentMethod, filters.status, resetPage]);

  const handleResetFilters = () => {
    setSearchInput('');
    resetFilters();
    resetPage();
  };

  const handleExport = () => {
    exportSalesToCSV(sales);
  };

  return (
    <div className="min-h-full bg-white p-4 md:p-6 dark:bg-gray-900">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Sales History</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          View and manage completed transactions
        </p>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Today's Sales"
          value={formatCurrency(summary.totalRevenue)}
          icon={DollarSign}
          loading={summaryLoading}
        />
        <SummaryCard
          title="Transactions Today"
          value={summary.transactionCount ?? 0}
          icon={Receipt}
          loading={summaryLoading}
        />
        <SummaryCard
          title="Average Sale Value"
          value={formatCurrency(summary.averageSaleValue)}
          icon={TrendingUp}
          loading={summaryLoading}
        />
        <SummaryCard
          title="This Month"
          value="—"
          icon={Calendar}
          loading={false}
        >
          <Link
            to="/reports"
            className="mt-1 inline-block text-xs text-cyan-600 hover:underline dark:text-cyan-400"
          >
            (see reports)
          </Link>
        </SummaryCard>
      </div>

      <div className="mb-4 flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
          <SearchBar
            value={searchInput}
            onChange={(v) => setSearchInput(v)}
            placeholder="Search receipt or customer..."
            className="w-full sm:w-64"
          />
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => setFilter('startDate', e.target.value)}
            className={selectClassName}
            aria-label="Start date"
          />
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => setFilter('endDate', e.target.value)}
            className={selectClassName}
            aria-label="End date"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={filters.paymentMethod}
            onChange={(e) => setFilter('paymentMethod', e.target.value)}
            className={selectClassName}
            aria-label="Payment method filter"
          >
            {PAYMENT_OPTIONS.map((opt) => (
              <option key={opt.value || 'all'} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <select
            value={filters.status}
            onChange={(e) => setFilter('status', e.target.value)}
            className={selectClassName}
            aria-label="Status filter"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value || 'all'} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {hasActiveFilters && (
            <Button variant="ghost" onClick={handleResetFilters}>
              Reset Filters
            </Button>
          )}

          <Button variant="outline" onClick={handleExport} disabled={!sales.length}>
            <Download size={16} />
            Export CSV
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50">
                <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Receipt #</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Date</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Customer</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Cashier</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Items</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700 dark:text-gray-300">Total</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Payment</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Status</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700 dark:text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && <TableSkeleton />}

              {!isLoading && sales.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <ShoppingBag size={40} className="text-gray-300 dark:text-gray-600" />
                      <p className="text-base font-medium text-gray-600 dark:text-gray-400">No sales found</p>
                      {hasActiveFilters && (
                        <Button variant="outline" onClick={handleResetFilters}>
                          Reset filters
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              )}

              {!isLoading &&
                sales.map((sale) => (
                  <tr
                    key={sale._id}
                    className="border-b border-gray-100 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/40"
                  >
                    <td className="px-4 py-3 font-mono text-xs font-medium text-gray-900 dark:text-gray-100">
                      {sale.receiptNumber}
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                      {formatDateTime(sale.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-gray-900 dark:text-gray-100">
                      {sale.customer?.name || 'Walk-in'}
                    </td>
                    <td className="px-4 py-3 text-gray-900 dark:text-gray-100">
                      {sale.soldBy?.name || '—'}
                    </td>
                    <td className="max-w-[200px] truncate px-4 py-3 text-gray-600 dark:text-gray-400">
                      {getItemsSummary(sale.items)}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-cyan-600 dark:text-cyan-400">
                      {formatCurrency(sale.total)}
                    </td>
                    <td className="px-4 py-3">
                      <PaymentMethodBadge method={sale.paymentMethod} />
                    </td>
                    <td className="px-4 py-3">
                      <SaleStatusBadge status={sale.status} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => setSelectedSaleId(sale._id)}
                          className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-cyan-600 dark:hover:bg-gray-800 dark:hover:text-cyan-400"
                          aria-label="View sale details"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setReceiptSale(sale)}
                          className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-cyan-600 dark:hover:bg-gray-800 dark:hover:text-cyan-400"
                          aria-label="Print receipt"
                        >
                          <Printer size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {!isLoading && pagination.total > 0 && (
          <div className="border-t border-gray-200 px-4 py-4 dark:border-gray-700">
            <Pagination
              page={page}
              limit={limit}
              total={pagination.total}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>

      <SaleDetailModal
        isOpen={!!selectedSaleId}
        onClose={() => setSelectedSaleId(null)}
        saleId={selectedSaleId}
      />

      <ReceiptModal
        isOpen={!!receiptSale}
        onClose={() => setReceiptSale(null)}
        sale={receiptSale}
      />
    </div>
  );
}
