import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import GuestRoute from './routes/GuestRoute';
import ProtectedRoute from './routes/ProtectedRoute';
import AppLayout from './layouts/AppLayout';
import LoginPage from '../features/auth/pages/LoginPage';
import ProfilePage from '../features/auth/pages/ProfilePage';
import UserManagementPage from '../features/auth/pages/UserManagementPage';
import MedicinesPage from '../features/medicines/MedicinesPage';
import InventoryPage from '../features/inventory/InventoryPage';
import InventoryDashboard from '../features/inventory/InventoryDashboard';

// Placeholder pages for other modules
const Placeholder = ({ title }) => (
  <div className="min-h-screen bg-slate-950 flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-2xl font-bold text-white">{title}</h1>
      <p className="text-slate-400 mt-2">Coming soon — being built by the team.</p>
    </div>
  </div>
);

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: '#1e293b', color: '#f1f5f9', border: '1px solid #334155' },
          success: { iconTheme: { primary: '#10b981', secondary: '#f1f5f9' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#f1f5f9' } },
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
            <Route path="/medicines" element={<MedicinesPage />} />
            <Route path="/inventory/dashboard" element={<InventoryDashboard />} />
            <Route path="/inventory" element={<InventoryPage />} />
            <Route path="/sales" element={<Placeholder title="Sales" />} />
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
