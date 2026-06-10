import { TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency } from '../../../shared/utils/formatters';

const Skeleton = () => (
  <div className="animate-pulse bg-white rounded-2xl p-5 border border-gray-100">
    <div className="h-4 bg-gray-100 rounded w-1/2 mb-3" />
    <div className="h-7 bg-gray-100 rounded w-3/4 mb-2" />
    <div className="h-3 bg-gray-100 rounded w-1/3" />
  </div>
);

export default function MetricCard({ icon: Icon, label, value, trend, color = 'cyan', isCurrency = false, loading, onClick }) {
  if (loading) return <Skeleton />;

  const colorMap = {
    cyan:   { bg: 'bg-cyan-50',   icon: 'bg-cyan-500',   text: 'text-cyan-600'   },
    green:  { bg: 'bg-green-50',  icon: 'bg-green-500',  text: 'text-green-600'  },
    purple: { bg: 'bg-purple-50', icon: 'bg-purple-500', text: 'text-purple-600' },
    amber:  { bg: 'bg-amber-50',  icon: 'bg-amber-500',  text: 'text-amber-600'  },
    red:    { bg: 'bg-red-50',    icon: 'bg-red-500',    text: 'text-red-600'    },
    blue:   { bg: 'bg-blue-50',   icon: 'bg-blue-500',   text: 'text-blue-600'   },
  };

  const c = colorMap[color] || colorMap.cyan;
  const trendUp = Number(trend) >= 0;

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${c.icon}`}>
          <Icon size={18} className="text-white" />
        </div>
        {trend !== undefined && (
          <span className={`flex items-center gap-0.5 text-xs font-semibold ${trendUp ? 'text-green-500' : 'text-red-500'}`}>
            {trendUp ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <p className="text-2xl font-extrabold text-slate-800 mb-0.5">
        {isCurrency ? formatCurrency(value) : value?.toLocaleString() ?? '—'}
      </p>
      <p className="text-xs font-medium text-slate-400">{label}</p>
    </div>
  );
}
