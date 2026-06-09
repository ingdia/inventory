import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm">
      <p className="text-white font-medium">{payload[0].payload.name}</p>
      <p className="text-emerald-400">Qty: {payload[0].value}</p>
    </div>
  );
};

export default function StockChart({ inventory = [] }) {
  const data = [...inventory]
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 10)
    .map((item) => ({
      name: item.medicine?.name?.length > 12 ? item.medicine.name.slice(0, 12) + '…' : (item.medicine?.name || '—'),
      quantity: item.quantity,
      low: item.quantity <= (item.medicine?.reorderLevel ?? 10),
    }));

  if (data.length === 0) return (
    <div className="flex items-center justify-center h-48 text-slate-500 text-sm">No inventory data</div>
  );

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(148,163,184,0.08)' }} />
        <Bar dataKey="quantity" radius={[4, 4, 0, 0]}>
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.low ? '#f59e0b' : '#10b981'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
