import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../../../shared/utils/formatters';

const Skeleton = () => (
  <div className="animate-pulse bg-white rounded-2xl p-5 border border-gray-100 h-80">
    <div className="h-4 bg-gray-100 rounded w-1/4 mb-4" />
    <div className="h-60 bg-gray-50 rounded-xl" />
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-cyan-100 rounded-xl shadow-lg p-3 text-xs">
      <p className="font-semibold text-slate-600 mb-1">{label}</p>
      <p className="text-cyan-600 font-bold">{formatCurrency(payload[0]?.value)}</p>
      <p className="text-slate-400">{payload[1]?.value} transactions</p>
    </div>
  );
};

export default function RevenueChart({ data = [], loading }) {
  if (loading) return <Skeleton />;

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
      <p className="text-sm font-bold text-slate-700 mb-4">Revenue Over Time</p>
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.18} />
              <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="revenue" stroke="#06b6d4" strokeWidth={2.5} fill="url(#revenueGrad)" dot={false} activeDot={{ r: 5, fill: '#06b6d4' }} />
          <Area type="monotone" dataKey="transactions" stroke="#a5f3fc" strokeWidth={1.5} fill="none" dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
