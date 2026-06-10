import { formatCurrency, formatPercent } from '../../../shared/utils/formatters';

const Skeleton = () => (
  <div className="animate-pulse bg-white rounded-2xl p-5 border border-gray-100 h-72">
    {[1,2,3,4].map(i => <div key={i} className="h-10 bg-gray-100 rounded-xl mb-3" />)}
  </div>
);

const Row = ({ label, value, bold, accent }) => (
  <div className={`flex items-center justify-between py-3 border-b border-gray-50 last:border-0 ${bold ? 'mt-1' : ''}`}>
    <span className={`text-sm ${bold ? 'font-bold text-slate-800' : 'text-slate-500'}`}>{label}</span>
    <span className={`text-sm font-bold ${accent ? 'text-cyan-600' : bold ? 'text-slate-800' : 'text-slate-700'}`}>{value}</span>
  </div>
);

export default function ProfitSummaryCard({ data, loading }) {
  if (loading) return <Skeleton />;

  const { totalRevenue = 0, totalCOGS = 0, grossProfit = 0, grossMargin = 0 } = data || {};

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm h-full">
      <p className="text-sm font-bold text-slate-700 mb-2">Profit Summary</p>
      <Row label="Total Revenue"  value={formatCurrency(totalRevenue)} />
      <Row label="Cost of Goods (COGS)" value={formatCurrency(totalCOGS)} />
      <Row label="Gross Profit"   value={formatCurrency(grossProfit)} bold accent />
      <div className="mt-3">
        <div className="flex justify-between text-xs text-slate-500 mb-1">
          <span>Gross Margin</span>
          <span className="font-bold text-cyan-600">{formatPercent(grossMargin)}</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-cyan-500 rounded-full transition-all duration-700" style={{ width: `${Math.min(grossMargin, 100)}%` }} />
        </div>
      </div>
    </div>
  );
}
