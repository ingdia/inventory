import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import GuestRoute from './routes/GuestRoute';
import ProtectedRoute from './routes/ProtectedRoute';
import OwnerLayout from './layouts/OwnerLayout';
import PharmacistLayout from './layouts/PharmacistLayout';
import LoginPage from '../features/auth/pages/LoginPage';
import ProfilePage from '../features/auth/pages/ProfilePage';
import UserManagementPage from '../features/auth/pages/UserManagementPage';
import DashboardPage from '../features/dashboard/pages/DashboardPage';
import useAuthStore from '../features/auth/store/authStore';

// ── DEV PREVIEW ONLY ─────────────────────────────────────────────────────────
// Change role here to 'pharmacist' to preview pharmacist view
const DEV_USER = { firstName: 'Diane', lastName: 'Ingabire', email: 'd.ingabire2@alustudent.com', role: 'owner', isActive: true };

function DevMock({ children }) {
  useEffect(() => {
    useAuthStore.setState({ user: DEV_USER, isAuthenticated: true });
  }, []);
  return children;
}
// ─────────────────────────────────────────────────────────────────────────────

const ComingSoon = ({ title }) => (
  <div className="min-h-screen flex items-center justify-center bg-[#f0f4f8]">
    <div className="bg-white rounded-2xl p-10 text-center shadow-sm border border-blue-50">
      <p className="text-5xl mb-4">🚧</p>
      <h1 className="text-lg font-extrabold text-slate-700">{title}</h1>
      <p className="text-slate-400 text-sm mt-1">Your teammate is building this.</p>
    </div>
  </div>
);

export default function AppRouter() {
  return (
    <BrowserRouter>
      <DevMock>
        <Toaster position="top-right"
          toastOptions={{
            style: { background: '#fff', color: '#0f172a', border: '1px solid #bfdbfe', borderRadius: '12px', boxShadow: '0 8px 24px rgba(43,120,194,0.12)', fontSize: '14px', fontWeight: '500' },
            success: { iconTheme: { primary: '#2b78c2', secondary: '#fff' } },
            error:   { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
          }} />

        <Routes>
          {/* public */}
          <Route element={<GuestRoute />}>
            <Route path="/login" element={<LoginPage />} />
          </Route>

          {/* ── OWNER routes ── */}
          <Route element={<OwnerLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/users"     element={<UserManagementPage />} />
            <Route path="/profile"   element={<ProfilePage />} />
          </Route>

          {/* ── PHARMACIST routes (swap layout to PharmacistLayout to preview) ── */}
          {/* <Route element={<PharmacistLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/profile"   element={<ProfilePage />} />
            <Route path="/medicines" element={<ComingSoon title="Medicines" />} />
            <Route path="/inventory" element={<ComingSoon title="Inventory" />} />
            <Route path="/sales"     element={<ComingSoon title="Sales" />} />
            <Route path="/purchases" element={<ComingSoon title="Purchases" />} />
          </Route> */}

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </DevMock>
    </BrowserRouter>
  );
}
