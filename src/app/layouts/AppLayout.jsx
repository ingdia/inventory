import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Package, ShoppingCart, BarChart2,
  Users, LogOut, User, ShieldCheck, Menu, X,
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

const roleVariant = { owner: 'warning', pharmacist: 'success' };

export default function AppLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out.');
    navigate('/login');
  };

  const initials = user ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase() : 'U';

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-800">
        <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center">
          <ShieldCheck size={16} className="text-emerald-400" />
        </div>
        <span className="font-bold text-white tracking-tight">PharmaManager</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
              ${isActive
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`
            }
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}

        {user?.role === 'owner' && (
          <>
            <div className="pt-3 pb-1 px-3">
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Owner</p>
            </div>
            {ownerNavItems.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                  ${isActive
                    ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`
                }
              >
                <Icon size={16} />
                {label}
              </NavLink>
            ))}
          </>
        )}
      </nav>

      {/* User section */}
      <div className="px-3 py-4 border-t border-slate-800 space-y-1">
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all
            ${isActive ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`
          }
        >
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-white text-xs truncate">{user?.firstName} {user?.lastName}</p>
            <Badge variant={roleVariant[user?.role]}>{user?.role}</Badge>
          </div>
          <User size={14} className="flex-shrink-0" />
        </NavLink>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-all"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-slate-900 border-r border-slate-800 flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="relative z-10 w-72 h-full bg-slate-900 border-r border-slate-800">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile topbar */}
        <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-emerald-400" />
            <span className="font-bold text-white text-sm">PharmaManager</span>
          </div>
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all">
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
