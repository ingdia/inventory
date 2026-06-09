import { formatCurrency, formatDate } from '../../../shared/utils/formatters';
import Badge from '../../../shared/components/Badge';

const statusVariant = { in_stock: 'success', low_stock: 'warning', out_of_stock: 'danger', expired: 'danger' };
const statusLabel   = { in_stock: 'In Stock', low_stock: 'Low Stock', out_of_stock: 'Out of Stock', expired: 'Expired' };

const TH = ({ children, right }) => (
  <th className={`px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider ${right ? 'text-right' : 'text-left'}`}>{children}</th>
);

export default function InventoryReportTable({ data = [], loading }) {
  if (loading) return (
    <div className="animate-pulse space-y-2 p-4">
      {[...Array(6)].map((_, i) => <div key={i} className="h-10 bg-gray-100 rounded-xl" />)}
    </div>
  );

  if (!data.length) return <p className="text-center text-xs text-slate-400 py-12">No inventory data found.</p>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-100">
          <tr>
            <TH>Medicine</TH>
            <TH>Category</TH>
            <TH right>Qty</TH>
            <TH>Unit</TH>
            <TH right>Reorder Level</TH>
            <TH right>Stock Value</TH>
            <TH>Status</TH>
            <TH>Expiry Date</TH>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {data.map((item, i) => (
            <tr key={i} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 text-xs font-semibold text-slate-700">{item.medicine}</td>
              <td className="px-4 py-3 text-xs text-slate-500">{item.category || '—'}</td>
              <td className="px-4 py-3 text-xs text-right font-bold text-slate-800">{item.quantity}</td>
              <td className="px-4 py-3 text-xs text-slate-500">{item.unit}</td>
              <td className="px-4 py-3 text-xs text-right text-slate-500">{item.reorderLevel}</td>
              <td className="px-4 py-3 text-xs text-right font-semibold text-slate-700">{formatCurrency(item.stockValue)}</td>
              <td className="px-4 py-3">
                <Badge variant={statusVariant[item.status] || 'default'}>{statusLabel[item.status] || item.status}</Badge>
              </td>
              <td className="px-4 py-3 text-xs text-slate-500">{formatDate(item.expiryDate)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
