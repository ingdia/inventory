import { useEffect, useState } from 'react';
import { Package, DollarSign, AlertTriangle, Clock, XCircle, TrendingDown, Plus } from 'lucide-react';
import useInventoryStore from './store/inventoryStore';
import { medicinesService } from '../medicines/services/medicines.service';
import StockChart from './components/StockChart';
import LowStockAlert from './components/LowStockAlert';
import ExpiryAlert from './components/ExpiryAlert';
import StockMovementForm from './components/StockMovementForm';
import Modal from '../../shared/components/Modal';
import Button from '../../shared/components/Button';
import Spinner from '../../shared/components/Spinner';
import { formatCurrency } from '../../shared/utils/formatCurrency';

function SummaryCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-center gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-xs text-slate-400 font-medium">{label}</p>
        <p className="text-xl font-bold text-white mt-0.5">{value ?? '—'}</p>
      </div>
    </div>
  );
}

export default function InventoryDashboard() {
  const { inventory, summary, loading, fetchInventory, fetchSummary } = useInventoryStore();
  const [lowStock, setLowStock] = useState([]);
  const [expiring, setExpiring] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [movementOpen, setMovementOpen] = useState(false);
  const [reorderMed, setReorderMed] = useState(null);

  useEffect(() => {
    fetchInventory({ limit: 100 });
    fetchSummary();
    medicinesService.getLowStock().then(({ data }) => setLowStock(data.data || [])).catch(() => {});
    medicinesService.getExpiring().then(({ data }) => setExpiring(data.data || [])).catch(() => {});
    medicinesService.getAll({ limit: 100 }).then(({ data }) => setMedicines(data.data?.medicines || [])).catch(() => {});
  }, []);

  const handleReorder = (item) => {
    setReorderMed(item);
    setMovementOpen(true);
  };

  const summaryCards = [
    { icon: Package, label: 'Total Medicines', value: summary?.totalMedicines, color: 'bg-emerald-500/15 text-emerald-400' },
    { icon: DollarSign, label: 'Total Stock Value', value: formatCurrency(summary?.totalStockValue), color: 'bg-blue-500/15 text-blue-400' },
    { icon: TrendingDown, label: 'Low Stock', value: summary?.lowStockCount, color: 'bg-amber-500/15 text-amber-400' },
    { icon: Clock, label: 'Expiring Soon', value: summary?.expiringCount, color: 'bg-orange-500/15 text-orange-400' },
    { icon: XCircle, label: 'Expired', value: summary?.expiredCount, color: 'bg-red-500/15 text-red-400' },
    { icon: AlertTriangle, label: 'Out of Stock', value: summary?.outOfStockCount, color: 'bg-red-900/40 text-red-300' },
  ];

  if (loading && !summary) {
    return <div className="flex items-center justify-center h-64"><Spinner /></div>;
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">Inventory Dashboard</h1>
          <p className="text-sm text-slate-400 mt-0.5">Real-time stock overview</p>
        </div>
        <Button onClick={() => { setReorderMed(null); setMovementOpen(true); }}>
          <Plus size={15} /> Record Movement
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {summaryCards.map((card) => <SummaryCard key={card.label} {...card} />)}
      </div>

      {/* Stock Chart */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h2 className="text-sm font-semibold text-white mb-4">Top 10 Medicines by Stock Level</h2>
        <StockChart inventory={inventory} />
        <div className="flex items-center gap-4 mt-3">
          <span className="flex items-center gap-1.5 text-xs text-slate-400"><span className="w-3 h-3 rounded-sm bg-emerald-500 inline-block" /> In Stock</span>
          <span className="flex items-center gap-1.5 text-xs text-slate-400"><span className="w-3 h-3 rounded-sm bg-amber-400 inline-block" /> Low Stock</span>
        </div>
      </div>

      {/* Low Stock Alerts */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle size={15} className="text-amber-400" />
          <h2 className="text-sm font-semibold text-white">Low Stock Alerts</h2>
          {lowStock.length > 0 && (
            <span className="ml-auto text-xs bg-amber-500/15 text-amber-400 ring-1 ring-amber-500/30 rounded-full px-2 py-0.5">{lowStock.length}</span>
          )}
        </div>
        <LowStockAlert items={lowStock} onReorder={handleReorder} />
      </div>

      {/* Expiry Alerts */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock size={15} className="text-orange-400" />
          <h2 className="text-sm font-semibold text-white">Expiry Alerts</h2>
          {expiring.length > 0 && (
            <span className="ml-auto text-xs bg-orange-500/15 text-orange-400 ring-1 ring-orange-500/30 rounded-full px-2 py-0.5">{expiring.length}</span>
          )}
        </div>
        <ExpiryAlert items={expiring} />
      </div>

      {/* Stock Movement Modal */}
      <Modal open={movementOpen} onClose={() => { setMovementOpen(false); setReorderMed(null); }} title="Record Stock Movement" size="md">
        <StockMovementForm
          medicines={medicines}
          onSuccess={() => { setMovementOpen(false); fetchInventory({ limit: 100 }); fetchSummary(); }}
          onCancel={() => setMovementOpen(false)}
        />
      </Modal>
    </div>
  );
}
