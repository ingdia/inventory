import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuthStore from '../../features/auth/store/authStore';

export default function ProtectedRoute({ allowedRoles }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isInitialized  = useAuthStore((s) => s.isInitialized);
  const role           = useAuthStore((s) => s.user?.role);
  const location = useLocation();

  if (!isInitialized) return null;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
