import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Phone, Lock, Eye, EyeOff, Save, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { updateProfileSchema, updatePasswordSchema } from '../utils/schemas';
import useAuthStore from '../store/authStore';
import Input from '../../../shared/components/Input';
import Button from '../../../shared/components/Button';
import Badge from '../../../shared/components/Badge';

const roleVariant = { owner: 'warning', pharmacist: 'success' };

export default function ProfilePage() {
  const { user, updateProfile, updatePassword } = useAuthStore();
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const profileForm = useForm({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: { firstName: user?.firstName, lastName: user?.lastName, phone: user?.phone || '' },
  });

  const passwordForm = useForm({ resolver: zodResolver(updatePasswordSchema) });

  const onProfileSubmit = async (data) => {
    try {
      await updateProfile(data);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed.');
    }
  };

  const onPasswordSubmit = async (data) => {
    try {
      await updatePassword({ currentPassword: data.currentPassword, newPassword: data.newPassword });
      toast.success('Password changed successfully!');
      passwordForm.reset();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Password change failed.');
    }
  };

  const initials = user ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase() : 'U';

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Header card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex items-center gap-5">
          <div className="flex-shrink-0 w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-emerald-900/40">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-white truncate">{user?.fullName || `${user?.firstName} ${user?.lastName}`}</h1>
            <p className="text-slate-400 text-sm mt-0.5 truncate">{user?.email}</p>
            <div className="mt-2 flex items-center gap-2">
              <Badge variant={roleVariant[user?.role] || 'default'}>
                <ShieldCheck size={11} className="mr-1" />
                {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
              </Badge>
              <Badge variant={user?.isActive ? 'success' : 'danger'}>
                {user?.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Profile form */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-base font-semibold text-white mb-5 flex items-center gap-2">
            <User size={16} className="text-emerald-400" /> Personal Information
          </h2>
          <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="First Name"
                placeholder="Jane"
                icon={User}
                error={profileForm.formState.errors.firstName?.message}
                {...profileForm.register('firstName')}
              />
              <Input
                label="Last Name"
                placeholder="Doe"
                icon={User}
                error={profileForm.formState.errors.lastName?.message}
                {...profileForm.register('lastName')}
              />
            </div>
            <Input
              label="Phone (optional)"
              placeholder="+250 788 000 000"
              icon={Phone}
              error={profileForm.formState.errors.phone?.message}
              {...profileForm.register('phone')}
            />
            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                loading={profileForm.formState.isSubmitting}
                className="gap-2"
              >
                <Save size={14} /> Save Changes
              </Button>
            </div>
          </form>
        </div>

        {/* Password form */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-base font-semibold text-white mb-5 flex items-center gap-2">
            <Lock size={16} className="text-emerald-400" /> Change Password
          </h2>
          <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
            <Input
              label="Current Password"
              type={showCurrent ? 'text' : 'password'}
              placeholder="••••••••"
              icon={Lock}
              error={passwordForm.formState.errors.currentPassword?.message}
              rightElement={
                <button type="button" onClick={() => setShowCurrent((v) => !v)} className="text-slate-400 hover:text-white">
                  {showCurrent ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              }
              {...passwordForm.register('currentPassword')}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="New Password"
                type={showNew ? 'text' : 'password'}
                placeholder="Min 8 chars"
                icon={Lock}
                error={passwordForm.formState.errors.newPassword?.message}
                rightElement={
                  <button type="button" onClick={() => setShowNew((v) => !v)} className="text-slate-400 hover:text-white">
                    {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                }
                {...passwordForm.register('newPassword')}
              />
              <Input
                label="Confirm New Password"
                type={showConfirm ? 'text' : 'password'}
                placeholder="Repeat new password"
                icon={Lock}
                error={passwordForm.formState.errors.confirmPassword?.message}
                rightElement={
                  <button type="button" onClick={() => setShowConfirm((v) => !v)} className="text-slate-400 hover:text-white">
                    {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                }
                {...passwordForm.register('confirmPassword')}
              />
            </div>
            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                loading={passwordForm.formState.isSubmitting}
              >
                <Lock size={14} /> Update Password
              </Button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
