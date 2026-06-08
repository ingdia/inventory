import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Phone, Lock, Eye, EyeOff, Save, Shield, Camera, KeyRound } from 'lucide-react';
import toast from 'react-hot-toast';
import { updateProfileSchema, updatePasswordSchema } from '../utils/schemas';
import useAuthStore from '../store/authStore';
import Input from '../../../shared/components/Input';
import Button from '../../../shared/components/Button';
import Badge from '../../../shared/components/Badge';

const B  = 'oklch(55% 0.18 207.078)';
const BL = 'oklch(96% 0.04 207.078)';
const BM = 'oklch(86.5% 0.127 207.078)';
const card = {
  border: `1.5px solid oklch(86.5% 0.127 207.078 / 0.35)`,
  boxShadow: '0 4px 24px oklch(55% 0.18 207.078 / 0.07)',
};

const SectionHead = ({ icon: Icon, label }) => (
  <div className="flex items-center gap-2.5 mb-6">
    <div className="w-8 h-8 rounded-xl flex items-center justify-center"
      style={{ background: BL, border: `1px solid ${BM}50` }}>
      <Icon size={14} style={{ color: B }} />
    </div>
    <span className="font-bold text-slate-700 text-sm tracking-wide">{label}</span>
  </div>
);

export default function ProfilePage() {
  const { user, updateProfile, updatePassword } = useAuthStore();
  const [show, setShow] = useState({ cur: false, nw: false, cf: false });

  const pf = useForm({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: { firstName: user?.firstName, lastName: user?.lastName, phone: user?.phone || '' },
  });
  const pwf = useForm({ resolver: zodResolver(updatePasswordSchema) });

  const onProfile = async (data) => {
    try { await updateProfile(data); toast.success('Profile saved!'); }
    catch (err) { toast.error(err.response?.data?.message || 'Failed.'); }
  };

  const onPassword = async (data) => {
    try {
      await updatePassword({ currentPassword: data.currentPassword, newPassword: data.newPassword });
      toast.success('Password updated!');
      pwf.reset();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed.'); }
  };

  const initials = user ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase() : 'U';

  return (
    <div className="min-h-screen p-6 pb-12" style={{ background: 'oklch(97.5% 0.025 207.078)' }}>
      <div className="max-w-2xl mx-auto space-y-5">

        <h1 className="text-xl font-extrabold text-slate-800 tracking-tight">My Profile</h1>

        {/* ── Hero card ── */}
        <div className="bg-white rounded-3xl overflow-hidden" style={card}>
          {/* Banner with mesh pattern */}
          <div className="h-24 relative" style={{ background: `linear-gradient(135deg, ${BM} 0%, ${B} 60%, oklch(45% 0.18 207.078) 100%)` }}>
            <div className="absolute inset-0"
              style={{ backgroundImage: `radial-gradient(circle at 1px 1px, oklch(100% 0 0 / 0.15) 1px, transparent 0)`, backgroundSize: '20px 20px' }} />
          </div>

          <div className="px-7 pb-7 -mt-10 flex items-end gap-5">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-[72px] h-[72px] rounded-2xl flex items-center justify-center text-xl font-extrabold text-white border-[3px] border-white"
                style={{ background: `linear-gradient(135deg, ${BM}, ${B})`, boxShadow: `0 8px 24px oklch(55% 0.18 207.078 / 0.35)` }}>
                {initials}
              </div>
              <button
                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full text-white flex items-center justify-center shadow-lg"
                style={{ background: B, boxShadow: `0 2px 8px oklch(55% 0.18 207.078 / 0.5)` }}>
                <Camera size={11} />
              </button>
            </div>

            {/* Info */}
            <div className="pb-1 flex-1 min-w-0 pt-10">
              <p className="font-extrabold text-slate-800 text-lg leading-tight truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-slate-400 text-xs mt-0.5 truncate">{user?.email}</p>
              <div className="flex gap-1.5 mt-2">
                <Badge variant={user?.role === 'owner' ? 'warning' : 'info'}>
                  <Shield size={9} /> {user?.role}
                </Badge>
                <Badge variant={user?.isActive ? 'success' : 'danger'}>
                  {user?.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* ── Personal info ── */}
        <div className="bg-white rounded-3xl p-7" style={card}>
          <SectionHead icon={User} label="Personal Info" />
          <form onSubmit={pf.handleSubmit(onProfile)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input label="First Name" placeholder="Jane" icon={User}
                error={pf.formState.errors.firstName?.message} {...pf.register('firstName')} />
              <Input label="Last Name" placeholder="Doe" icon={User}
                error={pf.formState.errors.lastName?.message} {...pf.register('lastName')} />
            </div>
            <Input label="Phone" placeholder="+250 788 000 000" icon={Phone}
              error={pf.formState.errors.phone?.message} {...pf.register('phone')} />
            <div className="flex justify-end pt-1">
              <Button type="submit" loading={pf.formState.isSubmitting}>
                <Save size={13} /> Save
              </Button>
            </div>
          </form>
        </div>

        {/* ── Password ── */}
        <div className="bg-white rounded-3xl p-7" style={card}>
          <SectionHead icon={KeyRound} label="Change Password" />
          <form onSubmit={pwf.handleSubmit(onPassword)} className="space-y-4">
            <Input label="Current password" type={show.cur ? 'text' : 'password'} placeholder="••••••••" icon={Lock}
              error={pwf.formState.errors.currentPassword?.message}
              rightElement={<button type="button" onClick={() => setShow(s => ({ ...s, cur: !s.cur }))} className="text-slate-300 hover:text-slate-500 transition-colors">{show.cur ? <EyeOff size={14} /> : <Eye size={14} />}</button>}
              {...pwf.register('currentPassword')} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="New password" type={show.nw ? 'text' : 'password'} placeholder="Min 8 chars" icon={Lock}
                error={pwf.formState.errors.newPassword?.message}
                rightElement={<button type="button" onClick={() => setShow(s => ({ ...s, nw: !s.nw }))} className="text-slate-300 hover:text-slate-500 transition-colors">{show.nw ? <EyeOff size={14} /> : <Eye size={14} />}</button>}
                {...pwf.register('newPassword')} />
              <Input label="Confirm" type={show.cf ? 'text' : 'password'} placeholder="Repeat" icon={Lock}
                error={pwf.formState.errors.confirmPassword?.message}
                rightElement={<button type="button" onClick={() => setShow(s => ({ ...s, cf: !s.cf }))} className="text-slate-300 hover:text-slate-500 transition-colors">{show.cf ? <EyeOff size={14} /> : <Eye size={14} />}</button>}
                {...pwf.register('confirmPassword')} />
            </div>
            <div className="flex justify-end pt-1">
              <Button type="submit" loading={pwf.formState.isSubmitting}>
                <KeyRound size={13} /> Update
              </Button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
