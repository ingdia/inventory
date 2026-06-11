import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Download,
  Eye,
  CheckCircle,
  XCircle,
  Plus,
  Package,
  Clock,
  DollarSign,
  ShoppingCart,
} from 'lucide-react';
import {
  usePurchasesList,
  useReceivePurchase,
  useCancelPurchase,
} from '../hooks/usePurchases.js';
import usePurchasesStore from '../store/purchasesStore.js';
import usePagination from '../../../shared/hooks/usePagination.js';
import useDebounce from '../../../shared/hooks/useDebounce.js';
import { formatCurrency } from '../../../shared/utils/formatCurrency.js';
import { formatDate } from '../../../shared/utils/formatDate.js';
import { exportPurchasesToCSV } from '../utils/purchases.utils.js';
import SearchBar from '../../../shared/components/SearchBar.jsx';
import Button from '../../../shared/components/Button.jsx';
import Spinner from '../../../shared/components/Spinner.jsx';
import Pagination from '../../../shared/components/Pagination.jsx';
import ConfirmDialog from '../../../shared/components/ConfirmDialog.jsx';
import SupplierSelect from '../components/SupplierSelect.jsx';
import PurchaseStatusBadge from '../components/PurchaseStatusBadge.jsx';
import PurchaseDetailModal from '../components/PurchaseDetailModal.jsx';

function SummaryCard({ title, value, icon: Icon, loading }) {
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
          {Array.from({ length: 8 }).map((__, j) => (
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

function getMonthRange() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return {
    startDate: start.toISOString().slice(0, 10),
    endDate: end.toISOString().slice(0, 10),
  };
}

const STATUS_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'received', label: 'Received' },
  { value: 'cancelled', label: 'Cancelled' },
];

const selectClassName =
  'rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/20';

export default function PurchasesListPage() {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState('');
  const [selectedPurchaseId, setSelectedPurchaseId] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);

  const { filters, setFilter, resetFilters } = usePurchasesStore();
  const { page, limit, setPage, resetPage } = usePagination(1, 20);
  const debouncedSearch = useDebounce(searchInput, 300);

  const monthRange = useMemo(() => getMonthRange(), []);

  const queryFilters = useMemo(
    () => ({
      ...filters,
      search: debouncedSearch,
      page,
      limit,
    }),
    [filters, debouncedSearch, page, limit]
  );

  const monthFilters = useMemo(
    () => ({
      startDate: monthRange.startDate,
      endDate: monthRange.endDate,
      limit: 500,
      page: 1,
    }),
    [monthRange]
  );

  const { data, isLoading } = usePurchasesList(queryFilters);
  const { data: monthData, isLoading: monthLoading } = usePurchasesList(monthFilters);

  const receiveMutation = useReceivePurchase();
  const cancelMutation = useCancelPurchase();

  const purchases = Array.isArray(data?.data) ? data.data : data?.data?.purchases ?? [];
  const pagination = data?.pagination ?? { total: 0, page: 1, limit: 20, totalPages: 1 };
  const monthPurchases = monthData?.data ?? [];

  const monthTotal = monthPurchases.reduce((sum, p) => sum + (p.totalAmount || 0), 0);
  const pendingCount = monthPurchases.filter((p) => p.status === 'pending').length;

  const hasActiveFilters = Boolean(
    searchInput ||
      filters.startDate ||
      filters.endDate ||
      filters.supplier ||
      filters.status
  );

  useEffect(() => {
    resetPage();
  }, [debouncedSearch, filters.startDate, filters.endDate, filters.supplier, filters.status, resetPage]);

  const handleResetFilters = () => {
    setSearchInput('');
    resetFilters();
    resetPage();
  };

  const handleReceive = (purchaseId) => {
    receiveMutation.mutate(purchaseId, {
      onSuccess: () => {
        setConfirmAction(null);
        setSelectedPurchaseId(null);
      },
    });
  };

  const handleCancel = (purchaseId) => {
    cancelMutation.mutate(purchaseId, {
      onSuccess: () => {
        setConfirmAction(null);
        setSelectedPurchaseId(null);
      },
    });
  };

  return (
    <div className="min-h-full bg-white p-4 md:p-6 dark:bg-gray-900">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Purchases</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage supplier orders and stock intake
          </p>
        </div>
        <Button onClick={() => navigate('/purchases/new')}>
          <Plus size={16} />
          Record Purchase
        </Button>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SummaryCard
          title="Total Purchases This Month"
          value={formatCurrency(monthTotal)}
          icon={Package}
          loading={monthLoading}
        />
        <SummaryCard
          title="Pending Orders"
          value={pendingCount}
          icon={Clock}
          loading={monthLoading}
        />
        <SummaryCard
          title="Total Spent This Month"
          value={formatCurrency(monthTotal)}
          icon={DollarSign}
          loading={monthLoading}
        />
      </div>

      <div className="mb-4 flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
          <SearchBar
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search invoice number..."
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
          <SupplierSelect
            value={filters.supplier}
            onChange={(val) => setFilter('supplier', val)}
            includeAllOption
            className="w-full sm:w-48"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
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
              Reset
            </Button>
          )}

          <Button variant="outline" onClick={() => exportPurchasesToCSV(purchases)} disabled={!purchases.length}>
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
                <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">PO Number</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Date</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Supplier</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Items</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700 dark:text-gray-300">Total</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Status</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Recorded By</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700 dark:text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && <TableSkeleton />}

              {!isLoading && purchases.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <ShoppingCart size={40} className="text-gray-300 dark:text-gray-600" />
                      <p className="text-base font-medium text-gray-600 dark:text-gray-400">
                        No purchases found
                      </p>
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
                purchases.map((purchase) => {
                  const isPending = purchase.status === 'pending';
                  return (
                    <tr
                      key={purchase._id}
                      className="border-b border-gray-100 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/40"
                    >
                      <td className="px-4 py-3 font-mono text-xs font-medium text-gray-900 dark:text-gray-100">
                        {purchase.invoiceNumber}
                      </td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                        {formatDate(purchase.purchaseDate)}
                      </td>
                      <td className="px-4 py-3 text-gray-900 dark:text-gray-100">
                        {purchase.supplier?.name || '—'}
                      </td>
                      <td className="max-w-[200px] truncate px-4 py-3 text-gray-600 dark:text-gray-400">
                        {getItemsSummary(purchase.items)}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-cyan-600 dark:text-cyan-400">
                        {formatCurrency(purchase.totalAmount)}
                      </td>
                      <td className="px-4 py-3">
                        <PurchaseStatusBadge status={purchase.status} />
                      </td>
                      <td className="px-4 py-3 text-gray-900 dark:text-gray-100">
                        {purchase.recordedBy?.name || '—'}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => setSelectedPurchaseId(purchase._id)}
                            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-cyan-600 dark:hover:bg-gray-800 dark:hover:text-cyan-400"
                            aria-label="View purchase details"
                          >
                            <Eye size={16} />
                          </button>
                          {isPending && (
                            <>
                              <button
                                type="button"
                                onClick={() =>
                                  setConfirmAction({ type: 'receive', id: purchase._id })
                                }
                                className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-green-600 dark:hover:bg-gray-800 dark:hover:text-green-400"
                                aria-label="Mark as received"
                              >
                                <CheckCircle size={16} />
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  setConfirmAction({ type: 'cancel', id: purchase._id })
                                }
                                className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-red-600 dark:hover:bg-gray-800 dark:hover:text-red-400"
                                aria-label="Cancel purchase"
                              >
                                <XCircle size={16} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
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

      <PurchaseDetailModal
        isOpen={!!selectedPurchaseId}
        onClose={() => setSelectedPurchaseId(null)}
        purchaseId={selectedPurchaseId}
        actionPending={receiveMutation.isPending || cancelMutation.isPending}
        onMarkReceived={() => {
          if (selectedPurchaseId) {
            handleReceive(selectedPurchaseId);
          }
        }}
        onCancel={() => {
          if (selectedPurchaseId) {
            handleCancel(selectedPurchaseId);
          }
        }}
      />

      <ConfirmDialog
        isOpen={confirmAction?.type === 'receive'}
        onClose={() => setConfirmAction(null)}
        onConfirm={() => handleReceive(confirmAction?.id)}
        title="Mark as Received"
        message="Mark this purchase as received? This will update inventory."
        confirmLabel="Mark as Received"
        variant="primary"
        loading={receiveMutation.isPending}
      />

      <ConfirmDialog
        isOpen={confirmAction?.type === 'cancel'}
        onClose={() => setConfirmAction(null)}
        onConfirm={() => handleCancel(confirmAction?.id)}
        title="Cancel Purchase"
        message="Are you sure you want to cancel this purchase?"
        confirmLabel="Cancel Purchase"
        variant="danger"
        loading={cancelMutation.isPending}
      />
    </div>
  );
}
