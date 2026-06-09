import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatCurrency, formatPercent } from '../../../shared/utils/formatters';

const TH = ({ children, right }) => (
  <th className={`px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider ${right ? 'text-right' : 'text-left'}`}>{children}</th>
);

export default function ProfitLossTable({ data = [], loading }) {
  if (loading) return (
    <div className="animate-pulse space-y-2 p-4">
      {[...Array(5)].map((_, i) => <div key={i} className="h-10 bg-gray-100 rounded-xl" />)}
    </div>
  );

  if (!data.length) return <p className="text-center text-xs text-slate-400 py-12">No data for this period.</p>;

  return (
    <div className="space-y-6">
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="period" tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
          <Tooltip formatter={(v) => formatCurrency(v)} contentStyle={{ borderRadius: 12, border: '1px solid #cffafe', fontSize: 12 }} />
          <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
          <Bar dataKey="revenue" name="Revenue" fill="#06b6d4" radius={[4,4,0,0]} maxBarSize={24} />
          <Bar dataKey="cogs" name="COGS" fill="#f59e0b" radius={[4,4,0,0]} maxBarSize={24} />
          <Bar dataKey="grossProfit" name="Gross Profit" fill="#10b981" radius={[4,4,0,0]} maxBarSize={24} />
        </BarChart>
      </ResponsiveContainer>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <TH>Period</TH>
              <TH right>Revenue</TH>
              <TH right>COGS</TH>
              <TH right>Gross Profit</TH>
              <TH right>Margin %</TH>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {data.map((row, i) => (
              <tr key={i} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-xs font-semibold text-slate-700">{row.period}</td>
                <td className="px-4 py-3 text-xs text-right text-slate-700">{formatCurrency(row.revenue)}</td>
                <td className="px-4 py-3 text-xs text-right text-amber-600">{formatCurrency(row.cogs)}</td>
                <td className="px-4 py-3 text-xs text-right font-bold text-emerald-600">{formatCurrency(row.grossProfit)}</td>
                <td className="px-4 py-3 text-xs text-right font-bold text-cyan-600">{formatPercent(row.margin)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
