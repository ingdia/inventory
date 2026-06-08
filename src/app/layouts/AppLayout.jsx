import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, BarChart2, Users, LogOut, User, Pill, Menu, X, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import useAuthStore from '../../features/auth/store/authStore';
import Badge from '../../shared/components/Badge';

const BRAND = 'oklch(55% 0.18 207.078)';
const BRAND_LIGHT = 'oklch(96% 0.04 207.078)';
const BRAND_MID = 'oklch(86.5% 0.127 207.078)';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/medicines', icon: Package, label: 'Medicines' },
  { to: '/sales', icon: ShoppingCart, label: 'Sales' },
  { to: '/reports', icon: BarChart2, label: 'Reports' },
];

const gradients = [
  `linear-gradient(135deg, ${BRAND_MID}, ${BRAND})`,
  'linear-gradient(135deg, #a78bfa, #7c3aed)',
  'linear-gradient(135deg, #fb7185, #e11d48)',
  'linear-gradient(135deg, #fbbf24, #d97706)',
];
const getGradient = (name = '') => gradients[name.charCodeAt(0) % gradients.length];

export default function AppLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    toast.success('See you soon! 👋');
    navigate('/login');
  };

  const initials = user ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase() : 'U';

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white border-r border-slate-100">

      {/* Brand */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-100">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md"
          style={{ background: `linear-gradient(135deg, ${BRAND_MID}, ${BRAND})`, boxShadow: `0 4px 12px oklch(55% 0.18 207.078 / 0.35)` }}>
          <Pill size={18} className="text-white" />
        </div>
        <div>
          <p className="font-bold text-slate-800 text-sm leading-tight">PharmaManager</p>
          <p className="text-xs font-medium" style={{ color: BRAND }}>Healthcare System</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="text-xs font-bold text-slate-300 uppercase tracking-widest px-3 pb-2">Main Menu</p>

        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to}
            className={({ isActive }) =>
              `flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive ? 'text-white' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`
            }
            style={({ isActive }) => isActive ? { background: `linear-gradient(135deg, ${BRAND_MID}, ${BRAND})`, boxShadow: `0 4px 14px oklch(55% 0.18 207.078 / 0.3)` } : {}}
          >
            {({ isActive }) => (
              <>
                <span className="flex items-center gap-3"><Icon size={16} />{label}</span>
                {isActive && <ChevronRight size={13} className="opacity-60" />}
              </>
            )}
          </NavLink>
        ))}

        {user?.role === 'owner' && (
          <>
            <p className="text-xs font-bold text-slate-300 uppercase tracking-widest px-3 pt-4 pb-2">Owner</p>
            <NavLink to="/users"
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive ? 'text-white' : 'text-slate-500 hover:text-slate-800 hover:bg-amber-50'}`
              }
              style={({ isActive }) => isActive ? { background: 'linear-gradient(135deg, #fbbf24, #d97706)', boxShadow: '0 4px 14px oklch(75% 0.15 75 / 0.35)' } : {}}
            >
              {({ isActive }) => (
                <>
                  <span className="flex items-center gap-3"><Users size={16} />Users</span>
                  {isActive && <ChevronRight size={13} className="opacity-60" />}
                </>
              )}
            </NavLink>
          </>
        )}
      </nav>

      {/* User card */}
      <div className="p-3 border-t border-slate-100">
        <div className="rounded-2xl p-3 space-y-2.5" style={{ background: BRAND_LIGHT, border: `1px solid oklch(86.5% 0.127 207.078 / 0.4)` }}>
          <NavLink to="/profile" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold text-white flex-shrink-0 shadow-sm"
              style={{ background: getGradient(user?.firstName) }}>
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-slate-800 text-xs truncate">{user?.firstName} {user?.lastName}</p>
              <Badge variant={user?.role === 'owner' ? 'warning' : 'info'}>{user?.role}</Badge>
            </div>
            <User size={13} className="text-slate-400 flex-shrink-0" />
          </NavLink>

          <button onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-white text-red-500 hover:bg-red-50 text-xs font-semibold transition-all border border-red-100">
            <LogOut size={13} /> Sign Out
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: BRAND_LIGHT }}>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 flex-shrink-0" style={{ boxShadow: `0 0 40px oklch(55% 0.18 207.078 / 0.08)` }}>
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="relative z-10 w-72 h-full shadow-2xl"><SidebarContent /></aside>
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile topbar */}
        <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-slate-100 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${BRAND_MID}, ${BRAND})` }}>
              <Pill size={14} className="text-white" />
            </div>
            <span className="font-bold text-slate-800 text-sm">PharmaManager</span>
          </div>
          <button onClick={() => setSidebarOpen((v) => !v)} className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-all">
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </header>

        <main className="flex-1 overflow-y-auto"><Outlet /></main>
      </div>
    </div>
  );
}
