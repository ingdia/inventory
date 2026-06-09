import { formatCurrency, formatDate } from '../../../shared/utils/formatters';
import Badge from '../../../shared/components/Badge';

const methodVariant = { cash: 'success', mobile_money: 'info', insurance: 'warning' };
const methodLabel   = { cash: 'Cash', mobile_money: 'Mobile Money', insurance: 'Insurance' };

const TH = ({ children, right }) => (
  <th className={`px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider ${right ? 'text-right' : 'text-left'}`}>{children}</th>
);

export default function SalesReportTable({ data = [], loading }) {
  if (loading) return (
    <div className="animate-pulse space-y-2 p-4">
      {[...Array(6)].map((_, i) => <div key={i} className="h-10 bg-gray-100 rounded-xl" />)}
    </div>
  );

  if (!data.length) return <p className="text-center text-xs text-slate-400 py-12">No sales found for this period.</p>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-100">
          <tr>
            <TH>Receipt No</TH>
            <TH>Date</TH>
            <TH>Customer</TH>
            <TH>Items</TH>
            <TH right>Subtotal</TH>
            <TH right>Discount</TH>
            <TH right>Total</TH>
            <TH>Payment</TH>
            <TH>Cashier</TH>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {data.map((s, i) => (
            <tr key={i} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 text-xs font-semibold text-cyan-600">{s.receiptNo || '—'}</td>
              <td className="px-4 py-3 text-xs text-slate-600">{formatDate(s.createdAt)}</td>
              <td className="px-4 py-3 text-xs text-slate-600">{s.customerName || 'Walk-in'}</td>
              <td className="px-4 py-3 text-xs text-slate-600">{s.items?.length ?? 0}</td>
              <td className="px-4 py-3 text-xs text-right text-slate-700">{formatCurrency(s.subtotal ?? s.totalAmount)}</td>
              <td className="px-4 py-3 text-xs text-right text-slate-500">{formatCurrency(s.discount ?? 0)}</td>
              <td className="px-4 py-3 text-xs text-right font-bold text-slate-800">{formatCurrency(s.totalAmount)}</td>
              <td className="px-4 py-3">
                <Badge variant={methodVariant[s.paymentMethod] || 'default'}>{methodLabel[s.paymentMethod] || s.paymentMethod}</Badge>
              </td>
              <td className="px-4 py-3 text-xs text-slate-500">
                {s.soldBy ? `${s.soldBy.firstName} ${s.soldBy.lastName}` : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
