import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Skeleton = () => (
  <div className="animate-pulse bg-white rounded-2xl p-5 border border-gray-100 h-80">
    <div className="h-4 bg-gray-100 rounded w-1/3 mb-4" />
    <div className="h-60 bg-gray-50 rounded-xl" />
  </div>
);

export default function TopMedicinesChart({ data = [], loading }) {
  if (loading) return <Skeleton />;

  const chartData = data.map((d) => ({ name: d.medicineName?.substring(0, 16), qty: d.totalQuantitySold }));

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
      <p className="text-sm font-bold text-slate-700 mb-4">Top 10 Best Selling Medicines</p>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
          <XAxis type="number" tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
          <YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 10, fill: '#64748b' }} tickLine={false} axisLine={false} />
          <Tooltip
            formatter={(v) => [v, 'Units Sold']}
            contentStyle={{ borderRadius: 12, border: '1px solid #cffafe', fontSize: 12 }}
          />
          <Bar dataKey="qty" fill="#06b6d4" radius={[0, 6, 6, 0]} maxBarSize={18} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
