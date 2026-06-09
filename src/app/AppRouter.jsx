import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import GuestRoute from './routes/GuestRoute';
import ProtectedRoute from './routes/ProtectedRoute';
import AppLayout from './layouts/AppLayout';
import LoginPage from '../features/auth/pages/LoginPage';
import ProfilePage from '../features/auth/pages/ProfilePage';
import UserManagementPage from '../features/auth/pages/UserManagementPage';
import { POSPage, SalesListPage } from '../features/sales';
import { PurchasesListPage, AddPurchasePage } from '../features/purchases';

// Placeholder pages for other modules
const Placeholder = ({ title }) => (
  <div className="flex min-h-screen items-center justify-center bg-slate-950 dark:bg-gray-950">
    <div className="text-center">
      <h1 className="text-2xl font-bold text-white">{title}</h1>
      <p className="mt-2 text-slate-400 dark:text-gray-400">Coming soon — being built by the team.</p>
    </div>
  </div>
);

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#ffffff',
            color: '#0f172a',
            border: '1px solid #cffafe',
            borderRadius: '16px',
            boxShadow: '0 8px 30px rgba(6,182,212,0.12)',
            fontSize: '14px',
            fontWeight: '500',
          },
          success: { iconTheme: { primary: '#06b6d4', secondary: '#ffffff' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#ffffff' } },
        }}
      />
      <Routes>
        {/* Guest only */}
        <Route element={<GuestRoute />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>

        {/* Protected — all authenticated users */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Placeholder title="Dashboard" />} />
            <Route path="/medicines" element={<Placeholder title="Medicines" />} />
            <Route path="/pos" element={<POSPage />} />
            <Route path="/sales" element={<SalesListPage />} />
            <Route path="/purchases" element={<PurchasesListPage />} />
            <Route path="/purchases/new" element={<AddPurchasePage />} />
            <Route path="/reports" element={<Placeholder title="Reports" />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Route>

        {/* Protected — owner only */}
        <Route element={<ProtectedRoute allowedRoles={['owner']} />}>
          <Route element={<AppLayout />}>
            <Route path="/users" element={<UserManagementPage />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
