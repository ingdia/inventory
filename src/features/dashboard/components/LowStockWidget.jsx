import { AlertTriangle } from 'lucide-react';
import Badge from '../../../shared/components/Badge';

const Skeleton = () => (
  <div className="animate-pulse space-y-2">
    {[1,2,3,4,5].map(i => <div key={i} className="h-10 bg-gray-100 rounded-xl" />)}
  </div>
);

export default function LowStockWidget({ data = [], loading }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle size={15} className="text-amber-500" />
        <p className="text-sm font-bold text-slate-700">Low Stock</p>
      </div>
      {loading ? <Skeleton /> : data.length === 0 ? (
        <p className="text-xs text-slate-400 text-center py-6">All stock levels are healthy</p>
      ) : (
        <div className="space-y-1">
          {data.map((item, i) => (
            <div key={i} className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors">
              <div>
                <p className="text-xs font-semibold text-slate-700">{item.medicine?.name || item.name}</p>
                <p className="text-[10px] text-slate-400">Reorder: {item.reorderLevel}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700">{item.quantity}</span>
                <Badge variant={item.quantity === 0 ? 'danger' : 'warning'}>
                  {item.quantity === 0 ? 'Out' : 'Low'}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
