import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import useAuthStore from '../features/auth/store/authStore';
import GuestRoute from './routes/GuestRoute';
import ProtectedRoute from './routes/ProtectedRoute';
import AppLayout from './layouts/AppLayout';
import LoginPage from '../features/auth/pages/LoginPage';
import SignupPage from '../features/auth/pages/SignupPage';
import ProfilePage from '../features/auth/pages/ProfilePage';
import UserManagementPage from '../features/auth/pages/UserManagementPage';
import MedicinesPage from '../features/medicines/MedicinesPage';
import InventoryPage from '../features/inventory/InventoryPage';
import InventoryDashboard from '../features/inventory/InventoryDashboard';
import DashboardPage from '../features/dashboard/DashboardPage';
import { SalesReportPage, InventoryReportPage, ProfitLossPage, PurchasesReportPage } from '../features/reports';

const Placeholder = ({ title }) => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-2xl font-bold text-slate-700">{title}</h1>
      <p className="text-slate-400 mt-2">Coming soon — being built by the team.</p>
    </div>
  </div>
);

export default function AppRouter() {
  const { fetchProfile } = useAuthStore();

  useEffect(() => {
    if (localStorage.getItem('token')) fetchProfile();
  }, []);

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
          <Route path="/signup" element={<SignupPage />} />
        </Route>

        {/* Protected — all authenticated users */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/medicines" element={<MedicinesPage />} />
            <Route path="/inventory/dashboard" element={<InventoryDashboard />} />
            <Route path="/inventory" element={<InventoryPage />} />
            <Route path="/sales" element={<Placeholder title="Sales" />} />
            <Route path="/reports/sales" element={<SalesReportPage />} />
            <Route path="/reports/inventory" element={<InventoryReportPage />} />
            <Route path="/reports/profit-loss" element={<ProfitLossPage />} />
            <Route path="/reports/purchases" element={<PurchasesReportPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route element={<ProtectedRoute allowedRoles={['Owner']} />}>
              <Route path="/users" element={<UserManagementPage />} />
            </Route>
          </Route>
        </Route>

        {/* Root redirect */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
