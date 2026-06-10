import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, User, LogOut, Pill, Menu, X, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import useAuthStore from '../../features/auth/store/authStore';

// same blue family as login but slightly different shade for pharmacist
const BLUE      = '#2b78c2';
const BLUE_DARK = '#1e5fa0';
const TEAL      = '#0e7490';

// Pharmacist only sees: Dashboard + Profile (team builds the rest)
const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
];

export default function PharmacistLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    toast.success('See you soon!');
    navigate('/login');
  };

  const initials = user ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase() : 'PH';

  const Sidebar = () => (
    <div className="flex flex-col h-full" style={{ background: BLUE_DARK }}>

      {/* brand */}
      <div className="flex items-center gap-3 px-5 py-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)' }}>
          <Pill size={17} className="text-white" />
        </div>
        <div>
          <p className="font-extrabold text-white text-sm tracking-tight leading-tight">PharmaManager</p>
          <p className="text-[10px] font-semibold" style={{ color: '#7dd3fc' }}>Pharmacist Portal</p>
        </div>
      </div>

      {/* nav — only dashboard. Others built by team */}
      <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to}
            className={({ isActive }) =>
              `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-150
               ${isActive ? 'text-white' : 'text-blue-200 hover:text-white hover:bg-white/10'}`
            }
            style={({ isActive }) => isActive
              ? { background: BLUE, boxShadow: '0 4px 16px rgba(0,0,0,0.25)' }
              : {}}
          >
            {({ isActive }) => (
              <>
                <span className="flex items-center gap-3"><Icon size={15} />{label}</span>
                {isActive && <ChevronRight size={12} className="opacity-60" />}
              </>
            )}
          </NavLink>
        ))}

        {/* placeholders — clearly marked as coming soon */}
        <div className="pt-4 pb-1 px-2">
          <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.25)' }}>
            Coming Soon
          </p>
        </div>
        {[
          { label: 'Medicines',  emoji: '💊' },
          { label: 'Inventory',  emoji: '📦' },
          { label: 'Sales',      emoji: '🛒' },
          { label: 'Purchases',  emoji: '📋' },
        ].map(({ label, emoji }) => (
          <div key={label}
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-semibold cursor-not-allowed"
            style={{ color: 'rgba(255,255,255,0.2)' }}>
            <span>{emoji}</span>{label}
            <span className="ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.3)' }}>Soon</span>
          </div>
        ))}
      </nav>

      {/* user footer */}
      <div className="p-3" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="rounded-2xl p-3 space-y-2" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}>
          <NavLink to="/profile" className="flex items-center gap-3 rounded-xl p-1 hover:opacity-75 transition-opacity">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-[11px] font-extrabold flex-shrink-0"
              style={{ background: TEAL, color: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-white text-xs truncate">{user?.firstName} {user?.lastName}</p>
              <p className="text-[10px] font-semibold" style={{ color: '#7dd3fc' }}>Pharmacist</p>
            </div>
            <User size={12} className="text-blue-300 flex-shrink-0" />
          </NavLink>

          <button onClick={handleLogout}
            className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all"
            style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', color: '#fca5a5' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.2)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}>
            <LogOut size={12} /> Sign out
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-[#f0f4f8]">
      <aside className="hidden lg:flex flex-col w-[230px] flex-shrink-0 shadow-2xl">
        <Sidebar />
      </aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <aside className="relative z-10 w-[230px] h-full shadow-2xl"><Sidebar /></aside>
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="lg:hidden flex items-center justify-between px-4 py-3 shadow-sm" style={{ background: BLUE_DARK }}>
          <div className="flex items-center gap-2">
            <Pill size={16} className="text-white" />
            <span className="font-extrabold text-white text-sm">PharmaManager</span>
          </div>
          <button onClick={() => setOpen(v => !v)} className="p-2 rounded-xl text-white hover:bg-white/10 transition-all">
            {open ? <X size={19} /> : <Menu size={19} />}
          </button>
        </header>
        <main className="flex-1 overflow-y-auto"><Outlet /></main>
      </div>
    </div>
  );
}
