import { TrendingUp, TrendingDown, DollarSign, Package, Users, ShoppingCart, AlertTriangle, ArrowUpRight } from 'lucide-react';

const B  = '#2b78c2';
const BL = '#eff6ff';
const BM = '#93c5fd';

const stats = [
  { label: 'Total Revenue',    value: 'RWF 4,280,000', change: '+12.5%', up: true,  icon: DollarSign, color: `linear-gradient(135deg,${BM},${B})` },
  { label: 'Sales Today',      value: '124',           change: '+8.2%',  up: true,  icon: ShoppingCart, color: 'linear-gradient(135deg,#34d399,#059669)' },
  { label: 'Medicines in Stock',value: '386',          change: '-3.1%',  up: false, icon: Package,      color: 'linear-gradient(135deg,#fbbf24,#d97706)' },
  { label: 'Active Staff',     value: '6',             change: '+1',     up: true,  icon: Users,        color: 'linear-gradient(135deg,#a78bfa,#7c3aed)' },
];

const recentSales = [
  { id: '#1042', customer: 'Jean Pierre', items: 3, amount: 'RWF 12,400', time: '10 min ago',  status: 'paid' },
  { id: '#1041', customer: 'Alice Uwase', items: 1, amount: 'RWF  4,200', time: '28 min ago',  status: 'paid' },
  { id: '#1040', customer: 'Eric Manzi',  items: 5, amount: 'RWF 31,000', time: '1 hr ago',    status: 'paid' },
  { id: '#1039', customer: 'Grace Ingabire', items: 2, amount: 'RWF 8,600', time: '2 hr ago', status: 'paid' },
  { id: '#1038', customer: 'Patrick Nkusi', items: 4, amount: 'RWF 19,500', time: '3 hr ago', status: 'paid' },
];

const lowStock = [
  { name: 'Amoxicillin 500mg', stock: 8,  threshold: 20 },
  { name: 'Paracetamol 1g',    stock: 12, threshold: 30 },
  { name: 'Metformin 850mg',   stock: 5,  threshold: 15 },
  { name: 'Omeprazole 20mg',   stock: 3,  threshold: 10 },
];

const topMeds = [
  { name: 'Amoxicillin 500mg', sales: 248, pct: 88 },
  { name: 'Paracetamol 1g',    sales: 201, pct: 72 },
  { name: 'Ibuprofen 400mg',   sales: 175, pct: 63 },
  { name: 'Metformin 850mg',   sales: 140, pct: 50 },
  { name: 'Omeprazole 20mg',   sales: 98,  pct: 35 },
];

export default function OwnerDashboard() {
  const today = new Date().toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric' });

  return (
    <div className="min-h-screen p-6 pb-12" style={{ background: 'oklch(97% 0.02 207.078)' }}>
      <div className="max-w-7xl mx-auto space-y-6">

        {/* header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Owner Dashboard</h1>
            <p className="text-slate-400 text-sm mt-0.5">{today}</p>
          </div>
          <span className="text-xs px-3 py-1.5 rounded-full font-bold"
            style={{ background: 'oklch(96% 0.04 207.078)', color: B, border: `1px solid ${BM}` }}>
            Owner View
          </span>
        </div>

        {/* stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(({ label, value, change, up, icon: Icon, color }) => (
            <div key={label} className="bg-white rounded-2xl p-5 flex flex-col gap-3"
              style={{ border: '1.5px solid oklch(91% 0.04 207.078)', boxShadow: '0 2px 12px oklch(55% 0.18 207.078/0.06)' }}>
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: color }}>
                  <Icon size={18} className="text-white" />
                </div>
                <span className={`text-xs font-bold flex items-center gap-0.5 ${up ? 'text-emerald-500' : 'text-red-400'}`}>
                  {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />} {change}
                </span>
              </div>
              <div>
                <p className="text-2xl font-black text-slate-800 leading-tight">{value}</p>
                <p className="text-xs text-slate-400 mt-0.5 font-medium">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* middle row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* recent sales — 2 cols */}
          <div className="lg:col-span-2 bg-white rounded-2xl overflow-hidden"
            style={{ border: '1.5px solid oklch(91% 0.04 207.078)', boxShadow: '0 2px 12px oklch(55% 0.18 207.078/0.06)' }}>
            <div className="flex items-center justify-between px-6 py-4"
              style={{ borderBottom: '1px solid oklch(93% 0.03 207.078)' }}>
              <p className="font-extrabold text-slate-800">Recent Sales</p>
              <button className="text-xs font-semibold flex items-center gap-1" style={{ color: B }}>
                View all <ArrowUpRight size={12} />
              </button>
            </div>
            <div className="divide-y" style={{ borderColor: 'oklch(96% 0.02 207.078)' }}>
              {recentSales.map((s) => (
                <div key={s.id} className="flex items-center justify-between px-6 py-3.5 hover:bg-slate-50/60 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black text-white flex-shrink-0"
                      style={{ background: `linear-gradient(135deg,${BM},${B})` }}>
                      {s.customer[0]}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{s.customer}</p>
                      <p className="text-xs text-slate-400">{s.id} · {s.items} item{s.items > 1 ? 's' : ''}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-800">{s.amount}</p>
                    <p className="text-xs text-slate-400">{s.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* low stock */}
          <div className="bg-white rounded-2xl overflow-hidden"
            style={{ border: '1.5px solid oklch(91% 0.04 207.078)', boxShadow: '0 2px 12px oklch(55% 0.18 207.078/0.06)' }}>
            <div className="flex items-center gap-2 px-6 py-4" style={{ borderBottom: '1px solid oklch(93% 0.03 207.078)' }}>
              <AlertTriangle size={15} className="text-amber-500" />
              <p className="font-extrabold text-slate-800">Low Stock</p>
            </div>
            <div className="p-4 space-y-3">
              {lowStock.map((m) => (
                <div key={m.name}>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs font-semibold text-slate-700 truncate max-w-[160px]">{m.name}</p>
                    <span className="text-xs font-bold text-red-500">{m.stock} left</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-red-400 to-amber-400"
                      style={{ width: `${(m.stock / m.threshold) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* bottom row */}
        <div className="bg-white rounded-2xl overflow-hidden"
          style={{ border: '1.5px solid oklch(91% 0.04 207.078)', boxShadow: '0 2px 12px oklch(55% 0.18 207.078/0.06)' }}>
          <div className="px-6 py-4" style={{ borderBottom: '1px solid oklch(93% 0.03 207.078)' }}>
            <p className="font-extrabold text-slate-800">Top Selling Medicines</p>
            <p className="text-xs text-slate-400 mt-0.5">This month</p>
          </div>
          <div className="p-6 space-y-4">
            {topMeds.map((m) => (
              <div key={m.name} className="flex items-center gap-4">
                <p className="text-sm font-semibold text-slate-700 w-44 truncate flex-shrink-0">{m.name}</p>
                <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full rounded-full transition-all"
                    style={{ width: `${m.pct}%`, background: `linear-gradient(90deg,${BM},${B})` }} />
                </div>
                <p className="text-xs font-bold text-slate-500 w-12 text-right flex-shrink-0">{m.sales} sold</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
