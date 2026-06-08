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
  border: '1.5px solid oklch(91% 0.04 207.078)',
  boxShadow: '0 2px 16px oklch(55% 0.18 207.078 / 0.06)',
  borderRadius: '20px',
};

const SectionHead = ({ icon: Icon, title }) => (
  <div className="flex items-center gap-3 mb-6 pb-4"
    style={{ borderBottom: '1px solid oklch(93% 0.03 207.078)' }}>
    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
      style={{ background: `linear-gradient(135deg,${BM},${B})`, boxShadow: `0 4px 12px oklch(55% 0.18 207.078 / 0.3)` }}>
      <Icon size={15} className="text-white" />
    </div>
    <span className="font-extrabold text-slate-700">{title}</span>
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
    <div className="min-h-screen p-6 pb-16" style={{ background: 'oklch(97% 0.02 207.078)' }}>
      <div className="max-w-2xl mx-auto space-y-5">

        <h1 className="text-2xl font-black text-slate-800 tracking-tight">My Profile</h1>

        {/* ── Hero ── */}
        <div className="bg-white overflow-hidden" style={card}>
          {/* banner */}
          <div className="h-28 relative" style={{ background: `linear-gradient(135deg,${BM} 0%,${B} 55%,oklch(42% 0.17 207.078) 100%)` }}>
            <div className="absolute inset-0"
              style={{ backgroundImage: `radial-gradient(circle at 1px 1px,white 1px,transparent 0)`, backgroundSize: '22px 22px', opacity: 0.12 }} />
            {/* glow blob */}
            <div className="absolute -bottom-8 -right-8 w-40 h-40 rounded-full blur-2xl opacity-40"
              style={{ background: BM }} />
          </div>

          <div className="px-7 pb-7 -mt-11 flex items-end gap-5">
            {/* avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-black text-white border-4 border-white"
                style={{ background: `linear-gradient(135deg,${BM},${B})`, boxShadow: `0 8px 28px oklch(55% 0.18 207.078 / 0.40)` }}>
                {initials}
              </div>
              <button className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-white shadow-lg"
                style={{ background: B }}>
                <Camera size={11} />
              </button>
            </div>

            {/* info */}
            <div className="pt-12 flex-1 min-w-0">
              <p className="text-xl font-black text-slate-800 truncate leading-tight">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-slate-400 text-sm truncate mt-0.5">{user?.email}</p>
              <div className="flex gap-2 mt-2.5">
                <Badge variant={user?.role === 'owner' ? 'warning' : 'info'}>
                  <Shield size={10} /> {user?.role}
                </Badge>
                <Badge variant={user?.isActive ? 'success' : 'danger'}>
                  {user?.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* ── Personal Info ── */}
        <div className="bg-white p-7" style={card}>
          <SectionHead icon={User} title="Personal Info" />
          <form onSubmit={pf.handleSubmit(onProfile)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input label="First Name" placeholder="Jane" icon={User}
                error={pf.formState.errors.firstName?.message} {...pf.register('firstName')} />
              <Input label="Last Name" placeholder="Doe" icon={User}
                error={pf.formState.errors.lastName?.message} {...pf.register('lastName')} />
            </div>
            <Input label="Phone" placeholder="+250 788 000 000" icon={Phone}
              error={pf.formState.errors.phone?.message} {...pf.register('phone')} />
            <div className="flex justify-end pt-2">
              <Button type="submit" loading={pf.formState.isSubmitting}>
                <Save size={13} /> Save Changes
              </Button>
            </div>
          </form>
        </div>

        {/* ── Password ── */}
        <div className="bg-white p-7" style={card}>
          <SectionHead icon={KeyRound} title="Change Password" />
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
            <div className="flex justify-end pt-2">
              <Button type="submit" loading={pwf.formState.isSubmitting}>
                <KeyRound size={13} /> Update Password
              </Button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
