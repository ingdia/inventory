import { formatCurrency, formatDate } from '../../../shared/utils/formatters';
import Badge from '../../../shared/components/Badge';

const statusVariant = { pending: 'warning', received: 'success', cancelled: 'danger' };

const TH = ({ children, right }) => (
  <th className={`px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider ${right ? 'text-right' : 'text-left'}`}>{children}</th>
);

export default function PurchasesReportTable({ data = [], loading }) {
  if (loading) return (
    <div className="animate-pulse space-y-2 p-4">
      {[...Array(6)].map((_, i) => <div key={i} className="h-10 bg-gray-100 rounded-xl" />)}
    </div>
  );

  if (!data.length) return <p className="text-center text-xs text-slate-400 py-12">No purchases found for this period.</p>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-100">
          <tr>
            <TH>Invoice No</TH>
            <TH>Date</TH>
            <TH>Supplier</TH>
            <TH right>Items</TH>
            <TH right>Total Amount</TH>
            <TH>Status</TH>
            <TH>Recorded By</TH>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {data.map((p, i) => (
            <tr key={i} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 text-xs font-semibold text-cyan-600">{p.invoiceNo || '—'}</td>
              <td className="px-4 py-3 text-xs text-slate-600">{formatDate(p.purchaseDate)}</td>
              <td className="px-4 py-3 text-xs text-slate-600">{p.supplier?.name || '—'}</td>
              <td className="px-4 py-3 text-xs text-right text-slate-600">{p.items?.length ?? 0}</td>
              <td className="px-4 py-3 text-xs text-right font-bold text-slate-800">{formatCurrency(p.totalAmount)}</td>
              <td className="px-4 py-3">
                <Badge variant={statusVariant[p.status] || 'default'}>{p.status}</Badge>
              </td>
              <td className="px-4 py-3 text-xs text-slate-500">
                {p.recordedBy ? `${p.recordedBy.firstName} ${p.recordedBy.lastName}` : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
