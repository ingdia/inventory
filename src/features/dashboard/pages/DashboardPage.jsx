import useAuthStore from '../../auth/store/authStore';
import OwnerDashboard from './OwnerDashboard';
import PharmacistDashboard from './PharmacistDashboard';

// Mock user for dev preview — remove when auth is wired
const MOCK_ROLE = 'owner'; // change to 'pharmacist' to preview that dashboard

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const role = user?.role || MOCK_ROLE;
  return role === 'owner' ? <OwnerDashboard /> : <PharmacistDashboard />;
}
