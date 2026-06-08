import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Package, ShoppingCart, BarChart2,
  Users, LogOut, User, Pill, Menu, X, ChevronRight,
} from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import useAuthStore from '../../features/auth/store/authStore';
import Badge from '../../shared/components/Badge';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/medicines', icon: Package, label: 'Medicines' },
  { to: '/sales', icon: ShoppingCart, label: 'Sales' },
  { to: '/reports', icon: BarChart2, label: 'Reports' },
];

const ownerNavItems = [
  { to: '/users', icon: Users, label: 'Users' },
];

const avatarColors = ['from-cyan-400 to-teal-500', 'from-violet-400 to-purple-500', 'from-rose-400 to-pink-500'];
const getColor = (name = '') => avatarColors[name.charCodeAt(0) % avatarColors.length];

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
      <div className="flex items-center gap-3 px-6 py-5">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-teal-500 flex items-center justify-center shadow-lg shadow-cyan-200">
          <Pill size={18} className="text-white" />
        </div>
        <div>
          <span className="font-bold text-slate-800 text-sm tracking-tight">PharmaManager</span>
          <p className="text-xs text-cyan-500 font-medium">Healthcare System</p>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-4 h-px bg-gradient-to-r from-transparent via-cyan-100 to-transparent mb-3" />

      {/* Nav */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        <p className="text-xs font-bold text-slate-300 uppercase tracking-widest px-3 mb-2">Main Menu</p>
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all group
              ${isActive
                ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-md shadow-cyan-200'
                : 'text-slate-500 hover:text-slate-800 hover:bg-cyan-50'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className="flex items-center gap-3">
                  <Icon size={16} />
                  {label}
                </span>
                {isActive && <ChevronRight size={14} className="opacity-60" />}
              </>
            )}
          </NavLink>
        ))}

        {user?.role === 'owner' && (
          <>
            <div className="pt-4 pb-1 px-3">
              <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">Owner Tools</p>
            </div>
            {ownerNavItems.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                  ${isActive
                    ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-md shadow-amber-100'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-amber-50'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span className="flex items-center gap-3">
                      <Icon size={16} />
                      {label}
                    </span>
                    {isActive && <ChevronRight size={14} className="opacity-60" />}
                  </>
                )}
              </NavLink>
            ))}
          </>
        )}
      </nav>

      {/* User card */}
      <div className="p-3">
        <div className="bg-gradient-to-br from-cyan-50 to-teal-50 border border-cyan-100 rounded-2xl p-3 space-y-3">
          <NavLink to="/profile" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${getColor(user?.firstName)} flex items-center justify-center text-xs font-bold text-white shadow-sm flex-shrink-0`}>
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-slate-800 text-xs truncate">{user?.firstName} {user?.lastName}</p>
              <Badge variant={user?.role === 'owner' ? 'warning' : 'info'}>{user?.role}</Badge>
            </div>
            <User size={13} className="text-slate-400 flex-shrink-0" />
          </NavLink>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-white border border-red-100 text-red-500 hover:bg-red-50 text-xs font-semibold transition-all"
          >
            <LogOut size={13} /> Sign Out
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 flex-shrink-0 shadow-xl shadow-cyan-100/30">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="relative z-10 w-72 h-full shadow-2xl">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile topbar */}
        <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-slate-100 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-400 to-teal-500 flex items-center justify-center">
              <Pill size={14} className="text-white" />
            </div>
            <span className="font-bold text-slate-800 text-sm">PharmaManager</span>
          </div>
          <button onClick={() => setSidebarOpen((v) => !v)} className="p-2 rounded-xl text-slate-500 hover:bg-cyan-50 transition-all">
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </header>

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
