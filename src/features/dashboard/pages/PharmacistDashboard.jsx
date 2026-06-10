import { ShoppingCart, Package, AlertTriangle, Clock, CheckCircle2, ArrowUpRight, Pill, CalendarCheck } from 'lucide-react';

const B  = '#2b78c2';
const BL = '#eff6ff';
const BM = '#93c5fd';

const todayStats = [
  { label: 'Sales Today',     value: '38',  icon: ShoppingCart, color: `linear-gradient(135deg,${BM},${B})` },
  { label: 'Items Dispensed', value: '112', icon: Pill,          color: 'linear-gradient(135deg,#34d399,#059669)' },
  { label: 'Low Stock Items', value: '4',   icon: AlertTriangle, color: 'linear-gradient(135deg,#fbbf24,#d97706)' },
  { label: 'Expiring Soon',   value: '7',   icon: Clock,         color: 'linear-gradient(135deg,#fb7185,#e11d48)' },
];

const recentSales = [
  { id: '#1042', customer: 'Jean Pierre',    items: 3, amount: 'RWF 12,400', time: '10 min ago' },
  { id: '#1041', customer: 'Alice Uwase',    items: 1, amount: 'RWF  4,200', time: '28 min ago' },
  { id: '#1040', customer: 'Eric Manzi',     items: 5, amount: 'RWF 31,000', time: '1 hr ago'   },
  { id: '#1039', customer: 'Grace Ingabire', items: 2, amount: 'RWF  8,600', time: '2 hr ago'   },
];

const lowStock = [
  { name: 'Amoxicillin 500mg', stock: 8,  threshold: 20 },
  { name: 'Paracetamol 1g',    stock: 12, threshold: 30 },
  { name: 'Metformin 850mg',   stock: 5,  threshold: 15 },
  { name: 'Omeprazole 20mg',   stock: 3,  threshold: 10 },
];

const expiring = [
  { name: 'Vitamin C 1000mg', batch: 'B-2021', date: 'Jul 15, 2026', days: 6 },
  { name: 'Amoxicillin 250mg', batch: 'B-1843', date: 'Jul 20, 2026', days: 11 },
  { name: 'Ibuprofen 200mg', batch: 'B-1799', date: 'Jul 28, 2026', days: 19 },
];

const tasks = [
  { label: 'Process morning stock count',       done: true  },
  { label: 'Reorder Amoxicillin 500mg',         done: true  },
  { label: 'Check refrigerated medicines temp', done: false },
  { label: 'Update expiry register',            done: false },
  { label: 'Prepare end-of-day sales report',   done: false },
];

const quickActions = [
  { label: 'New Sale',       icon: ShoppingCart, color: `linear-gradient(135deg,${BM},${B})`,      shadow: `0 6px 18px oklch(55% 0.18 207.078/0.35)` },
  { label: 'Add Stock',      icon: Package,       color: 'linear-gradient(135deg,#34d399,#059669)', shadow: '0 6px 18px rgba(5,150,105,0.3)'          },
  { label: 'Check Expiry',   icon: Clock,         color: 'linear-gradient(135deg,#fbbf24,#d97706)', shadow: '0 6px 18px rgba(217,119,6,0.3)'           },
  { label: 'View Reports',   icon: CalendarCheck, color: 'linear-gradient(135deg,#a78bfa,#7c3aed)', shadow: '0 6px 18px rgba(124,58,237,0.3)'          },
];

export default function PharmacistDashboard() {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="min-h-screen p-6 pb-12" style={{ background: 'oklch(97% 0.02 207.078)' }}>
      <div className="max-w-6xl mx-auto space-y-6">

        {/* header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Good morning! 👋</h1>
            <p className="text-slate-400 text-sm mt-0.5">{today}</p>
          </div>
          <span className="text-xs px-3 py-1.5 rounded-full font-bold"
            style={{ background: 'oklch(96% 0.06 150)', color: '#059669', border: '1px solid #6ee7b7' }}>
            Pharmacist View
          </span>
        </div>

        {/* quick actions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {quickActions.map(({ label, icon: Icon, color, shadow }) => (
            <button key={label}
              className="flex flex-col items-center gap-2.5 py-5 rounded-2xl text-white font-bold text-sm transition-all active:scale-[0.97] hover:opacity-90"
              style={{ background: color, boxShadow: shadow }}>
              <Icon size={22} />
              {label}
            </button>
          ))}
        </div>

        {/* stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {todayStats.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white rounded-2xl p-5 flex items-center gap-4"
              style={{ border: '1.5px solid oklch(91% 0.04 207.078)', boxShadow: '0 2px 12px oklch(55% 0.18 207.078/0.06)' }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: color }}>
                <Icon size={18} className="text-white" />
              </div>
              <div>
                <p className="text-2xl font-black text-slate-800 leading-tight">{value}</p>
                <p className="text-xs text-slate-400 font-medium">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* middle row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* recent sales */}
          <div className="lg:col-span-2 bg-white rounded-2xl overflow-hidden"
            style={{ border: '1.5px solid oklch(91% 0.04 207.078)', boxShadow: '0 2px 12px oklch(55% 0.18 207.078/0.06)' }}>
            <div className="flex items-center justify-between px-6 py-4"
              style={{ borderBottom: '1px solid oklch(93% 0.03 207.078)' }}>
              <p className="font-extrabold text-slate-800">Today's Sales</p>
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

          {/* tasks */}
          <div className="bg-white rounded-2xl overflow-hidden"
            style={{ border: '1.5px solid oklch(91% 0.04 207.078)', boxShadow: '0 2px 12px oklch(55% 0.18 207.078/0.06)' }}>
            <div className="px-6 py-4" style={{ borderBottom: '1px solid oklch(93% 0.03 207.078)' }}>
              <p className="font-extrabold text-slate-800">Today's Tasks</p>
              <p className="text-xs text-slate-400 mt-0.5">
                {tasks.filter(t => t.done).length}/{tasks.length} completed
              </p>
            </div>
            <div className="p-4 space-y-2">
              {tasks.map((t) => (
                <div key={t.label} className={`flex items-start gap-3 p-2.5 rounded-xl transition-colors ${t.done ? '' : 'hover:bg-slate-50'}`}>
                  <CheckCircle2 size={16} className={`mt-0.5 flex-shrink-0 ${t.done ? 'text-emerald-500' : 'text-slate-200'}`} />
                  <p className={`text-xs font-medium leading-relaxed ${t.done ? 'line-through text-slate-300' : 'text-slate-600'}`}>
                    {t.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* bottom row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* low stock */}
          <div className="bg-white rounded-2xl overflow-hidden"
            style={{ border: '1.5px solid oklch(91% 0.04 207.078)', boxShadow: '0 2px 12px oklch(55% 0.18 207.078/0.06)' }}>
            <div className="flex items-center gap-2 px-6 py-4" style={{ borderBottom: '1px solid oklch(93% 0.03 207.078)' }}>
              <AlertTriangle size={14} className="text-amber-500" />
              <p className="font-extrabold text-slate-800">Low Stock Alert</p>
            </div>
            <div className="p-5 space-y-4">
              {lowStock.map((m) => (
                <div key={m.name}>
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-xs font-semibold text-slate-700 truncate">{m.name}</p>
                    <span className="text-xs font-bold text-red-500 flex-shrink-0 ml-2">{m.stock} left</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-red-400 to-amber-400"
                      style={{ width: `${(m.stock / m.threshold) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* expiring */}
          <div className="bg-white rounded-2xl overflow-hidden"
            style={{ border: '1.5px solid oklch(91% 0.04 207.078)', boxShadow: '0 2px 12px oklch(55% 0.18 207.078/0.06)' }}>
            <div className="flex items-center gap-2 px-6 py-4" style={{ borderBottom: '1px solid oklch(93% 0.03 207.078)' }}>
              <Clock size={14} className="text-red-400" />
              <p className="font-extrabold text-slate-800">Expiring Soon</p>
            </div>
            <div className="divide-y" style={{ borderColor: 'oklch(96% 0.02 207.078)' }}>
              {expiring.map((m) => (
                <div key={m.name} className="flex items-center justify-between px-6 py-3.5 hover:bg-slate-50/60 transition-colors">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{m.name}</p>
                    <p className="text-xs text-slate-400">Batch {m.batch}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-semibold text-slate-600">{m.date}</p>
                    <span className={`text-xs font-bold ${m.days <= 7 ? 'text-red-500' : 'text-amber-500'}`}>
                      {m.days} days left
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
