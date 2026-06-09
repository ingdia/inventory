import { AlertTriangle } from 'lucide-react';
import { formatCurrency } from '../../../shared/utils/formatCurrency';
import EmptyState from '../../../shared/components/EmptyState';

export default function LowStockAlert({ items = [], onReorder }) {
  if (items.length === 0) return <EmptyState title="No low stock items" message="All medicines are well stocked." icon={AlertTriangle} />;

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-800">
      <table className="w-full text-sm">
        <thead className="bg-slate-800/50">
          <tr>
            {['Medicine', 'Current Qty', 'Reorder Level', 'Selling Price', 'Action'].map((h) => (
              <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {items.map((item) => (
            <tr key={item._id} className="hover:bg-slate-800/40 transition-colors">
              <td className="px-4 py-3">
                <p className="font-medium text-white">{item.medicine?.name || item.name}</p>
                <p className="text-xs text-slate-500">{item.medicine?.genericName || item.genericName}</p>
              </td>
              <td className="px-4 py-3 font-semibold text-amber-400">{item.quantity ?? item.currentStock}</td>
              <td className="px-4 py-3 text-slate-300">{item.medicine?.reorderLevel ?? item.reorderLevel}</td>
              <td className="px-4 py-3 text-slate-300">{formatCurrency(item.medicine?.sellingPrice ?? item.sellingPrice)}</td>
              <td className="px-4 py-3">
                <button
                  onClick={() => onReorder?.(item)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 text-xs font-medium hover:bg-emerald-500/25 transition-all"
                >
                  Reorder
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
