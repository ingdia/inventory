import { Pencil, Trash2 } from 'lucide-react';
import Table from '../../../shared/components/Table';
import Badge from '../../../shared/components/Badge';
import { formatDate, isExpired, isExpiringSoon } from '../../../shared/utils/formatDate';
import { formatCurrency } from '../../../shared/utils/formatCurrency';

const statusVariant = { active: 'success', inactive: 'default' };

export default function MedicineTable({ medicines, loading, onEdit, onDelete, onSort, sortBy, sortOrder, inventoryMap = {} }) {
  const columns = [
    { key: 'name', label: 'Name', sortable: true, render: (m) => (
      <div>
        <p className="font-medium text-white">{m.name}</p>
        {m.genericName && <p className="text-xs text-slate-500">{m.genericName}</p>}
      </div>
    )},
    { key: 'category', label: 'Category', render: (m) => m.category?.name || '—' },
    { key: 'supplier', label: 'Supplier', render: (m) => m.supplier?.name || '—' },
    { key: 'unit', label: 'Unit', render: (m) => <span className="capitalize">{m.unit}</span> },
    { key: 'sellingPrice', label: 'Unit Price', sortable: true, render: (m) => formatCurrency(m.sellingPrice) },
    { key: 'stock', label: 'Stock Qty', render: (m) => {
      const qty = inventoryMap[m._id];
      if (qty == null) return <span className="text-slate-500">—</span>;
      const low = qty <= (m.reorderLevel ?? 10);
      return <span className={qty === 0 ? 'text-red-400 font-semibold' : low ? 'text-amber-400 font-semibold' : 'text-emerald-400 font-semibold'}>{qty}</span>;
    }},
    { key: 'expiryDate', label: 'Expiry Date', render: (m) => {
      const expired = isExpired(m.expiryDate);
      const expiring = isExpiringSoon(m.expiryDate);
      return (
        <span className={expired ? 'text-red-400' : expiring ? 'text-amber-400' : 'text-slate-300'}>
          {formatDate(m.expiryDate)}
        </span>
      );
    }},
    { key: 'status', label: 'Status', render: (m) => (
      <Badge variant={statusVariant[m.status]}>{m.status}</Badge>
    )},
    { key: 'actions', label: '', render: (m) => (
      <div className="flex items-center gap-2">
        <button onClick={() => onEdit(m)} className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all">
          <Pencil size={14} />
        </button>
        <button onClick={() => onDelete(m)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all">
          <Trash2 size={14} />
        </button>
      </div>
    )},
  ];

  return <Table columns={columns} data={medicines} loading={loading} onSort={onSort} sortBy={sortBy} sortOrder={sortOrder} />;
}
