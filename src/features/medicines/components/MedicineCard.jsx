import { Pencil, Trash2 } from 'lucide-react';
import Badge from '../../../shared/components/Badge';
import { formatDate, isExpired, isExpiringSoon } from '../../../shared/utils/formatDate';
import { formatCurrency } from '../../../shared/utils/formatCurrency';

const statusVariant = { active: 'success', inactive: 'default' };

export default function MedicineCard({ medicine, onEdit, onDelete }) {
  const expired = isExpired(medicine.expiryDate);
  const expiring = isExpiringSoon(medicine.expiryDate);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-3 hover:border-slate-700 transition-all">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-semibold text-white truncate">{medicine.name}</p>
          {medicine.genericName && <p className="text-xs text-slate-500 truncate">{medicine.genericName}</p>}
        </div>
        <Badge variant={statusVariant[medicine.status]}>{medicine.status}</Badge>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <p className="text-slate-500">Category</p>
          <p className="text-slate-300">{medicine.category?.name || '—'}</p>
        </div>
        <div>
          <p className="text-slate-500">Unit</p>
          <p className="text-slate-300 capitalize">{medicine.unit}</p>
        </div>
        <div>
          <p className="text-slate-500">Purchase Price</p>
          <p className="text-slate-300">{formatCurrency(medicine.purchasePrice)}</p>
        </div>
        <div>
          <p className="text-slate-500">Selling Price</p>
          <p className="text-emerald-400 font-medium">{formatCurrency(medicine.sellingPrice)}</p>
        </div>
        <div>
          <p className="text-slate-500">Expiry Date</p>
          <p className={expired ? 'text-red-400' : expiring ? 'text-amber-400' : 'text-slate-300'}>
            {formatDate(medicine.expiryDate)}
          </p>
        </div>
        <div>
          <p className="text-slate-500">Reorder Level</p>
          <p className="text-slate-300">{medicine.reorderLevel}</p>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-800">
        <button
          onClick={() => onEdit(medicine)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all"
        >
          <Pencil size={12} /> Edit
        </button>
        <button
          onClick={() => onDelete(medicine)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
        >
          <Trash2 size={12} /> Delete
        </button>
      </div>
    </div>
  );
}
