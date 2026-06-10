import { ShoppingCart } from 'lucide-react';
import { formatCurrency, formatDate } from '../../../shared/utils/formatters';
import Badge from '../../../shared/components/Badge';

const Skeleton = () => (
  <div className="animate-pulse space-y-2">
    {[1,2,3,4,5].map(i => <div key={i} className="h-12 bg-gray-100 rounded-xl" />)}
  </div>
);

const methodVariant = { cash: 'success', mobile_money: 'info', insurance: 'warning' };
const methodLabel   = { cash: 'Cash', mobile_money: 'Mobile', insurance: 'Insurance' };

export default function RecentSalesWidget({ data = [], loading }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <ShoppingCart size={15} className="text-cyan-500" />
        <p className="text-sm font-bold text-slate-700">Recent Sales</p>
      </div>
      {loading ? <Skeleton /> : data.length === 0 ? (
        <p className="text-xs text-slate-400 text-center py-6">No recent sales</p>
      ) : (
        <div className="space-y-1">
          {data.map((sale, i) => (
            <div key={i} className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors">
              <div>
                <p className="text-xs font-semibold text-slate-700">{sale.receiptNo || `#${String(i + 1).padStart(4, '0')}`}</p>
                <p className="text-[10px] text-slate-400">
                  {sale.soldBy ? `${sale.soldBy.firstName} ${sale.soldBy.lastName}` : 'Unknown'} · {formatDate(sale.createdAt, 'hh:mm a')}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={methodVariant[sale.paymentMethod] || 'default'}>
                  {methodLabel[sale.paymentMethod] || sale.paymentMethod}
                </Badge>
                <span className="text-xs font-bold text-slate-700">{formatCurrency(sale.totalAmount)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
