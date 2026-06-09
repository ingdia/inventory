import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import GuestRoute from './routes/GuestRoute';
import ProtectedRoute from './routes/ProtectedRoute';
import AppLayout from './layouts/AppLayout';
import LoginPage from '../features/auth/pages/LoginPage';
import SignupPage from '../features/auth/pages/SignupPage';
import ProfilePage from '../features/auth/pages/ProfilePage';
import UserManagementPage from '../features/auth/pages/UserManagementPage';

// Placeholder pages for other modules
const Placeholder = ({ title }) => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-2xl font-bold text-slate-700">{title}</h1>
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
            <Route path="/dashboard" element={<Placeholder title="Dashboard" />} />
            <Route path="/medicines" element={<Placeholder title="Medicines" />} />
            <Route path="/sales" element={<Placeholder title="Sales" />} />
            <Route path="/reports" element={<Placeholder title="Reports" />} />
            <Route path="/profile" element={<ProfilePage />} />
            {/* Owner only — handled inside AppLayout nav guard */}
            <Route element={<ProtectedRoute allowedRoles={['owner']} />}>
              <Route path="/users" element={<UserManagementPage />} />
            </Route>
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
