import { Clock } from 'lucide-react';
import { differenceInDays } from 'date-fns';
import { formatDate } from '../../../shared/utils/formatters';

const Skeleton = () => (
  <div className="animate-pulse space-y-2">
    {[1,2,3,4,5].map(i => <div key={i} className="h-10 bg-gray-100 rounded-xl" />)}
  </div>
);

const DaysChip = ({ days }) => {
  const color = days <= 7 ? 'bg-red-50 text-red-600' : days <= 14 ? 'bg-amber-50 text-amber-600' : 'bg-yellow-50 text-yellow-600';
  return <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${color}`}>{days}d left</span>;
};

export default function ExpiryWidget({ data = [], loading }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Clock size={15} className="text-red-500" />
        <p className="text-sm font-bold text-slate-700">Expiring Soon</p>
      </div>
      {loading ? <Skeleton /> : data.length === 0 ? (
        <p className="text-xs text-slate-400 text-center py-6">No medicines expiring within 30 days</p>
      ) : (
        <div className="space-y-1">
          {data.map((item, i) => {
            const days = differenceInDays(new Date(item.expiryDate), new Date());
            return (
              <div key={i} className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors">
                <div>
                  <p className="text-xs font-semibold text-slate-700">{item.medicine?.name || item.name}</p>
                  <p className="text-[10px] text-slate-400">{formatDate(item.expiryDate)}</p>
                </div>
                <DaysChip days={days} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
