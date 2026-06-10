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
    cyan:   { iconBg: 'oklch(94% 0.06 207.078)',  iconColor: 'oklch(45% 0.18 207.078)'  },
    green:  { iconBg: '#dcfce7',                   iconColor: '#16a34a'                   },
    purple: { iconBg: '#ede9fe',                   iconColor: '#7c3aed'                   },
    amber:  { iconBg: '#fef3c7',                   iconColor: '#d97706'                   },
    red:    { iconBg: '#fee2e2',                   iconColor: '#dc2626'                   },
    blue:   { iconBg: '#dbeafe',                   iconColor: '#2563eb'                   },
  };

  const c = colorMap[color] || colorMap.cyan;
  const trendUp = Number(trend) >= 0;

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: c.iconBg }}>
          <Icon size={18} style={{ color: c.iconColor }} />
        </div>
        {trend !== undefined && (
          <span className={`flex items-center gap-0.5 text-xs font-semibold ${trendUp ? 'text-green-500' : 'text-red-500'}`}>
            {trendUp ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <p className="text-lg font-bold text-slate-800 mb-0.5">
        {isCurrency ? formatCurrency(value) : value?.toLocaleString() ?? '—'}
      </p>
      <p className="text-xs font-medium text-slate-400">{label}</p>
    </div>
  );
}
