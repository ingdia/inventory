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

import { POSPage, SalesListPage } from '../features/sales';
import { PurchasesListPage, AddPurchasePage } from '../features/purchases';

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
          <Route path="/signup" element={<SignupPage />} />
        </Route>

        {/* Protected — all authenticated users */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>

            {/* Dashboard */}
            <Route path="/dashboard" element={<DashboardPage />} />

            {/* Medicines & Inventory — Esther */}
            <Route path="/medicines" element={<MedicinesPage />} />
            <Route path="/inventory" element={<InventoryPage />} />
            <Route path="/inventory/dashboard" element={<InventoryDashboard />} />

            {/* Sales & Purchases — Kelia */}
            <Route path="/pos" element={<POSPage />} />
            <Route path="/sales" element={<SalesListPage />} />
            <Route path="/purchases" element={<PurchasesListPage />} />
            <Route path="/purchases/new" element={<AddPurchasePage />} />

            {/* Reports — Chantal */}
            <Route path="/reports/sales" element={<SalesReportPage />} />
            <Route path="/reports/inventory" element={<InventoryReportPage />} />
            <Route path="/reports/profit-loss" element={<ProfitLossPage />} />
            <Route path="/reports/purchases" element={<PurchasesReportPage />} />

            {/* Profile */}
            <Route path="/profile" element={<ProfilePage />} />

          </Route>
        </Route>

        {/* Protected — owner only */}
        <Route element={<ProtectedRoute allowedRoles={['owner']} />}>
          <Route element={<AppLayout />}>
            <Route path="/users" element={<UserManagementPage />} />
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