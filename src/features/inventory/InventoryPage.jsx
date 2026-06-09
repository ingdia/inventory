import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useInventory } from './hooks/useInventory';
import InventoryTable from './components/InventoryTable';
import StockMovementForm from './components/StockMovementForm';
import Modal from '../../shared/components/Modal';
import Button from '../../shared/components/Button';
import SearchBar from '../../shared/components/SearchBar';
import Pagination from '../../shared/components/Pagination';
import EmptyState from '../../shared/components/EmptyState';
import useMedicineStore from '../medicines/store/medicineStore';
import { useEffect } from 'react';

export default function InventoryPage() {
  const { inventory, loading, inventoryPagination, filters, handleFilterChange, handlePageChange } = useInventory();
  const { medicines, fetchMedicines } = useMedicineStore();
  const [movementOpen, setMovementOpen] = useState(false);

  useEffect(() => { fetchMedicines(); }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-white">Inventory</h1>
          <p className="text-sm text-slate-400 mt-0.5">{inventoryPagination.total} records total</p>
        </div>
        <Button onClick={() => setMovementOpen(true)}>
          <Plus size={15} /> Record Movement
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <SearchBar
          value={filters.search}
          onChange={(v) => handleFilterChange('search', v)}
          placeholder="Search medicine…"
        />
        <select
          value={filters.status}
          onChange={(e) => handleFilterChange('status', e.target.value)}
          className="rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
        >
          <option value="">All Status</option>
          <option value="in_stock">In Stock</option>
          <option value="low_stock">Low Stock</option>
          <option value="out_of_stock">Out of Stock</option>
          <option value="expired">Expired</option>
        </select>
      </div>

      {/* Table */}
      {!loading && inventory.length === 0 ? (
        <EmptyState title="No inventory records" message="Stock movements will appear here." />
      ) : (
        <InventoryTable inventory={inventory} loading={loading} />
      )}

      <Pagination page={inventoryPagination.page} totalPages={inventoryPagination.totalPages} onPageChange={handlePageChange} />

      {/* Stock Movement Modal */}
      <Modal open={movementOpen} onClose={() => setMovementOpen(false)} title="Record Stock Movement" size="md">
        <StockMovementForm
          medicines={medicines}
          onSuccess={() => setMovementOpen(false)}
          onCancel={() => setMovementOpen(false)}
        />
      </Modal>
    </div>
  );
}
