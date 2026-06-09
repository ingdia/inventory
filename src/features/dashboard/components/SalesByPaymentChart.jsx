import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { formatCurrency } from '../../../shared/utils/formatters';

const COLORS = ['#06b6d4', '#6366f1', '#f59e0b'];
const LABELS = { cash: 'Cash', mobile_money: 'Mobile Money', insurance: 'Insurance' };

const Skeleton = () => (
  <div className="animate-pulse bg-white rounded-2xl p-5 border border-gray-100 h-72">
    <div className="h-4 bg-gray-100 rounded w-1/3 mb-4" />
    <div className="h-48 bg-gray-50 rounded-full mx-auto w-48" />
  </div>
);

export default function SalesByPaymentChart({ data = [], loading }) {
  if (loading) return <Skeleton />;

  const chartData = data.map((d) => ({
    name: LABELS[d.paymentMethod] || d.paymentMethod,
    value: d.total,
    percentage: d.percentage,
    count: d.count,
  }));

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
      <p className="text-sm font-bold text-slate-700 mb-4">Sales by Payment Method</p>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie data={chartData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
            {chartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Pie>
          <Tooltip
            formatter={(v, n, p) => [formatCurrency(v), `${p.payload.percentage}%`]}
            contentStyle={{ borderRadius: 12, border: '1px solid #cffafe', fontSize: 12 }}
          />
          <Legend iconType="circle" iconSize={8} formatter={(v) => <span style={{ fontSize: 12, color: '#64748b' }}>{v}</span>} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
