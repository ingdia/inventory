import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, BarChart2, Users, LogOut, User, Pill, Menu, X, ChevronRight, TrendingUp, FileText, ShoppingBag } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import useAuthStore from '../../features/auth/store/authStore';
import Badge from '../../shared/components/Badge';

const B  = 'oklch(55% 0.18 207.078)';
const BL = 'oklch(96% 0.04 207.078)';
const BM = 'oklch(86.5% 0.127 207.078)';

const navItems = [
  { to: '/dashboard',          icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/medicines',          icon: Package,         label: 'Medicines'  },
  { to: '/sales',              icon: ShoppingCart,    label: 'Sales'      },
];

const reportItems = [
  { to: '/reports/sales',      icon: BarChart2,   label: 'Sales Report'      },
  { to: '/reports/inventory',  icon: FileText,    label: 'Inventory Report'  },
  { to: '/reports/profit-loss',icon: TrendingUp,  label: 'Profit & Loss'     },
  { to: '/reports/purchases',  icon: ShoppingBag, label: 'Purchases Report'  },
];

const avatarGrads = [
  `linear-gradient(135deg,${BM},${B})`,
  'linear-gradient(135deg,#a78bfa,#7c3aed)',
  'linear-gradient(135deg,#fb7185,#e11d48)',
  'linear-gradient(135deg,#fbbf24,#d97706)',
];
const getGrad = (name = '') => avatarGrads[name.charCodeAt(0) % avatarGrads.length];

export default function AppLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    toast.success('See you soon! 👋');
    navigate('/login');
  };

  const initials = user ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase() : 'U';

  const Sidebar = () => (
    <div className="flex flex-col h-full bg-white" style={{ borderRight: '1px solid oklch(93% 0.03 207.078)' }}>

      {/* Brand */}
      <div className="flex items-center gap-3 px-5 py-[18px]" style={{ borderBottom: '1px solid oklch(93% 0.03 207.078)' }}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: `linear-gradient(135deg,${BM},${B})`, boxShadow: `0 4px 14px oklch(55% 0.18 207.078 / 0.35)` }}>
          <Pill size={17} className="text-white" />
        </div>
        <span className="font-extrabold text-slate-800 text-sm tracking-tight">PharmaManager</span>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to}
            className={({ isActive }) =>
              `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-150
               ${isActive ? 'text-white' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-50'}`
            }
            style={({ isActive }) => isActive
              ? { background: `linear-gradient(135deg,${BM},${B})`, boxShadow: `0 4px 16px oklch(55% 0.18 207.078 / 0.28)` }
              : {}}
          >
            {({ isActive }) => (
              <>
                <span className="flex items-center gap-3"><Icon size={15} />{label}</span>
                {isActive && <ChevronRight size={12} className="opacity-50" />}
              </>
            )}
          </NavLink>
        ))}

        <div className="mx-2 my-3 h-px" style={{ background: 'oklch(93% 0.03 207.078)' }} />
        <p className="px-3.5 text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-1">Reports</p>
        {reportItems.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to}
            className={({ isActive }) =>
              `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-150
               ${isActive ? 'text-white' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-50'}`
            }
            style={({ isActive }) => isActive
              ? { background: `linear-gradient(135deg,${BM},${B})`, boxShadow: `0 4px 16px oklch(55% 0.18 207.078 / 0.28)` }
              : {}}
          >
            {({ isActive }) => (
              <>
                <span className="flex items-center gap-3"><Icon size={15} />{label}</span>
                {isActive && <ChevronRight size={12} className="opacity-50" />}
              </>
            )}
          </NavLink>
        ))}

        {user?.role === 'owner' && (
          <>
            <div className="mx-2 my-3 h-px" style={{ background: 'oklch(93% 0.03 207.078)' }} />
            <NavLink to="/users"
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-150
                 ${isActive ? 'text-white' : 'text-slate-400 hover:text-slate-700 hover:bg-amber-50'}`
              }
              style={({ isActive }) => isActive
                ? { background: 'linear-gradient(135deg,#fbbf24,#f59e0b)', boxShadow: '0 4px 16px rgba(251,191,36,0.3)' }
                : {}}
            >
              {({ isActive }) => (
                <>
                  <span className="flex items-center gap-3"><Users size={15} />Users</span>
                  {isActive && <ChevronRight size={12} className="opacity-50" />}
                </>
              )}
            </NavLink>
          </>
        )}
      </nav>

      {/* User footer */}
      <div className="p-3" style={{ borderTop: '1px solid oklch(93% 0.03 207.078)' }}>
        <div className="rounded-2xl p-3 space-y-2"
          style={{ background: BL, border: `1.5px solid oklch(86.5% 0.127 207.078 / 0.3)` }}>
          <NavLink to="/profile"
            className="flex items-center gap-3 rounded-xl p-1 hover:opacity-75 transition-opacity">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-[11px] font-extrabold text-white flex-shrink-0"
              style={{ background: getGrad(user?.firstName), boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-slate-700 text-xs truncate leading-tight">{user?.firstName} {user?.lastName}</p>
              <Badge variant={user?.role === 'owner' ? 'warning' : 'info'}>{user?.role}</Badge>
            </div>
            <User size={12} className="text-slate-300 flex-shrink-0" />
          </NavLink>

          <button onClick={handleLogout}
            className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-white border text-red-400 hover:text-red-500 hover:bg-red-50 text-xs font-bold transition-all"
            style={{ borderColor: '#fecdd3' }}>
            <LogOut size={12} /> Sign out
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">

      {/* Desktop */}
      <aside className="hidden lg:flex flex-col w-[230px] flex-shrink-0" style={{ boxShadow: `4px 0 24px oklch(55% 0.18 207.078 / 0.06)` }}>
        <Sidebar />
      </aside>

      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <aside className="relative z-10 w-[230px] h-full shadow-2xl"><Sidebar /></aside>
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile topbar */}
        <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-white shadow-sm"
          style={{ borderBottom: '1px solid oklch(93% 0.03 207.078)' }}>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: `linear-gradient(135deg,${BM},${B})` }}>
              <Pill size={14} className="text-white" />
            </div>
            <span className="font-extrabold text-slate-800 text-sm">PharmaManager</span>
          </div>
          <button onClick={() => setOpen(v => !v)} className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 transition-all">
            {open ? <X size={19} /> : <Menu size={19} />}
          </button>
        </header>

        <main className="flex-1 overflow-y-auto"><Outlet /></main>
      </div>
    </div>
  );
}
