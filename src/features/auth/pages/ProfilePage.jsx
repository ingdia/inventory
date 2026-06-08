import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Phone, Lock, Eye, EyeOff, Save, Shield, Camera } from 'lucide-react';
import toast from 'react-hot-toast';
import { updateProfileSchema, updatePasswordSchema } from '../utils/schemas';
import useAuthStore from '../store/authStore';
import Input from '../../../shared/components/Input';
import Button from '../../../shared/components/Button';
import Badge from '../../../shared/components/Badge';

const BRAND = 'oklch(55% 0.18 207.078)';
const BRAND_LIGHT = 'oklch(96% 0.04 207.078)';
const BRAND_MID = 'oklch(86.5% 0.127 207.078)';
const roleVariant = { owner: 'warning', pharmacist: 'info' };

const card = {
  borderColor: 'oklch(86.5% 0.127 207.078 / 0.4)',
  boxShadow: '0 16px 48px oklch(55% 0.18 207.078 / 0.08)',
};

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
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed.');
    }
  };

  const onPasswordSubmit = async (data) => {
    try {
      await updatePassword({ currentPassword: data.currentPassword, newPassword: data.newPassword });
      toast.success('Password changed!');
      passwordForm.reset();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Password change failed.');
    }
  };

  const initials = user ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase() : 'U';

  return (
    <div className="min-h-screen p-6" style={{ background: BRAND_LIGHT }}>
      <div className="max-w-3xl mx-auto space-y-6">

        <div>
          <h1 className="text-2xl font-bold text-slate-800">My Profile</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your personal information and security.</p>
        </div>

        {/* Hero card */}
        <div className="bg-white rounded-3xl overflow-hidden border" style={card}>
          {/* Banner */}
          <div className="h-28 relative" style={{ background: `linear-gradient(135deg, ${BRAND}, oklch(45% 0.18 207.078))` }}>
            <div className="absolute inset-0 opacity-20"
              style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
          </div>
          {/* Info row */}
          <div className="px-8 pb-8 -mt-10 flex items-end gap-5">
            <div className="relative flex-shrink-0">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold text-white border-4 border-white"
                style={{ background: `linear-gradient(135deg, ${BRAND_MID}, ${BRAND})`, boxShadow: `0 8px 24px oklch(55% 0.18 207.078 / 0.35)` }}>
                {initials}
              </div>
              <button className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full text-white flex items-center justify-center shadow-md"
                style={{ background: BRAND }}>
                <Camera size={11} />
              </button>
            </div>
            <div className="pb-1 flex-1 min-w-0">
              <h2 className="text-xl font-bold text-slate-800 truncate">{user?.firstName} {user?.lastName}</h2>
              <p className="text-slate-500 text-sm truncate">{user?.email}</p>
              <div className="flex gap-2 mt-2">
                <Badge variant={roleVariant[user?.role] || 'default'}>
                  <Shield size={10} /> {user?.role}
                </Badge>
                <Badge variant={user?.isActive ? 'success' : 'danger'}>
                  {user?.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Personal info */}
        <div className="bg-white rounded-3xl p-8 border" style={card}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: BRAND_LIGHT }}>
              <User size={16} style={{ color: BRAND }} />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Personal Information</h3>
              <p className="text-xs text-slate-400">Update your name and contact details.</p>
            </div>
          </div>
          <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="First Name" placeholder="Jane" icon={User}
                error={profileForm.formState.errors.firstName?.message}
                {...profileForm.register('firstName')} />
              <Input label="Last Name" placeholder="Doe" icon={User}
                error={profileForm.formState.errors.lastName?.message}
                {...profileForm.register('lastName')} />
            </div>
            <Input label="Phone (optional)" placeholder="+250 788 000 000" icon={Phone}
              error={profileForm.formState.errors.phone?.message}
              {...profileForm.register('phone')} />
            <div className="flex justify-end pt-2">
              <Button type="submit" loading={profileForm.formState.isSubmitting}>
                <Save size={14} /> Save Changes
              </Button>
            </div>
          </form>
        </div>

        {/* Password */}
        <div className="bg-white rounded-3xl p-8 border" style={card}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: BRAND_LIGHT }}>
              <Lock size={16} style={{ color: BRAND }} />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Change Password</h3>
              <p className="text-xs text-slate-400">Keep your account secure with a strong password.</p>
            </div>
          </div>
          <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
            <Input label="Current Password" type={showCurrent ? 'text' : 'password'} placeholder="••••••••" icon={Lock}
              error={passwordForm.formState.errors.currentPassword?.message}
              rightElement={<button type="button" onClick={() => setShowCurrent(v => !v)} className="text-slate-400">{showCurrent ? <EyeOff size={15} /> : <Eye size={15} />}</button>}
              {...passwordForm.register('currentPassword')} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="New Password" type={showNew ? 'text' : 'password'} placeholder="Min 8 chars" icon={Lock}
                error={passwordForm.formState.errors.newPassword?.message}
                rightElement={<button type="button" onClick={() => setShowNew(v => !v)} className="text-slate-400">{showNew ? <EyeOff size={15} /> : <Eye size={15} />}</button>}
                {...passwordForm.register('newPassword')} />
              <Input label="Confirm Password" type={showConfirm ? 'text' : 'password'} placeholder="Repeat password" icon={Lock}
                error={passwordForm.formState.errors.confirmPassword?.message}
                rightElement={<button type="button" onClick={() => setShowConfirm(v => !v)} className="text-slate-400">{showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}</button>}
                {...passwordForm.register('confirmPassword')} />
            </div>
            <div className="flex justify-end pt-2">
              <Button type="submit" loading={passwordForm.formState.isSubmitting}>
                <Lock size={14} /> Update Password
              </Button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
