import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../../features/auth/store/authStore';

export default function GuestRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />;
}
