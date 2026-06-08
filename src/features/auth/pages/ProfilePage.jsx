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

const B = 'oklch(55% 0.18 207.078)';
const BL = 'oklch(96% 0.04 207.078)';
const BM = 'oklch(86.5% 0.127 207.078)';
const card = { borderColor: 'oklch(86.5% 0.127 207.078 / 0.35)', boxShadow: '0 8px 32px oklch(55% 0.18 207.078 / 0.07)' };

export default function ProfilePage() {
  const { user, updateProfile, updatePassword } = useAuthStore();
  const [show, setShow] = useState({ cur: false, nw: false, cf: false });

  const pf = useForm({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: { firstName: user?.firstName, lastName: user?.lastName, phone: user?.phone || '' },
  });
  const pwf = useForm({ resolver: zodResolver(updatePasswordSchema) });

  const onProfile = async (data) => {
    try { await updateProfile(data); toast.success('Saved!'); }
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
    <div className="min-h-screen p-6" style={{ background: BL }}>
      <div className="max-w-2xl mx-auto space-y-5">

        <h1 className="text-xl font-bold text-slate-800">Profile</h1>

        {/* Hero */}
        <div className="bg-white rounded-2xl overflow-hidden border" style={card}>
          <div className="h-20" style={{ background: `linear-gradient(135deg, ${BM}, ${B})` }}>
            <div className="w-full h-full opacity-10"
              style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
          </div>
          <div className="px-6 pb-6 -mt-8 flex items-end gap-4">
            <div className="relative flex-shrink-0">
              <div className="w-16 h-16 rounded-xl flex items-center justify-center text-lg font-bold text-white border-4 border-white"
                style={{ background: `linear-gradient(135deg, ${BM}, ${B})`, boxShadow: `0 6px 20px oklch(55% 0.18 207.078 / 0.3)` }}>
                {initials}
              </div>
              <button className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full text-white flex items-center justify-center"
                style={{ background: B }}>
                <Camera size={10} />
              </button>
            </div>
            <div className="pb-0.5">
              <p className="font-bold text-slate-800">{user?.firstName} {user?.lastName}</p>
              <p className="text-slate-400 text-xs">{user?.email}</p>
              <div className="flex gap-1.5 mt-1.5">
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

        {/* Info form */}
        <div className="bg-white rounded-2xl p-6 border" style={card}>
          <div className="flex items-center gap-2 mb-5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: BL }}>
              <User size={14} style={{ color: B }} />
            </div>
            <p className="font-semibold text-slate-800 text-sm">Personal Info</p>
          </div>
          <form onSubmit={pf.handleSubmit(onProfile)} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Input label="First Name" placeholder="Jane" icon={User}
                error={pf.formState.errors.firstName?.message} {...pf.register('firstName')} />
              <Input label="Last Name" placeholder="Doe" icon={User}
                error={pf.formState.errors.lastName?.message} {...pf.register('lastName')} />
            </div>
            <Input label="Phone" placeholder="+250 788 000 000" icon={Phone}
              error={pf.formState.errors.phone?.message} {...pf.register('phone')} />
            <div className="flex justify-end">
              <Button type="submit" loading={pf.formState.isSubmitting}>
                <Save size={13} /> Save
              </Button>
            </div>
          </form>
        </div>

        {/* Password form */}
        <div className="bg-white rounded-2xl p-6 border" style={card}>
          <div className="flex items-center gap-2 mb-5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: BL }}>
              <Lock size={14} style={{ color: B }} />
            </div>
            <p className="font-semibold text-slate-800 text-sm">Change Password</p>
          </div>
          <form onSubmit={pwf.handleSubmit(onPassword)} className="space-y-4">
            <Input label="Current" type={show.cur ? 'text' : 'password'} placeholder="••••••••" icon={Lock}
              error={pwf.formState.errors.currentPassword?.message}
              rightElement={<button type="button" onClick={() => setShow(s => ({ ...s, cur: !s.cur }))} className="text-slate-400">{show.cur ? <EyeOff size={14} /> : <Eye size={14} />}</button>}
              {...pwf.register('currentPassword')} />
            <div className="grid grid-cols-2 gap-3">
              <Input label="New" type={show.nw ? 'text' : 'password'} placeholder="Min 8 chars" icon={Lock}
                error={pwf.formState.errors.newPassword?.message}
                rightElement={<button type="button" onClick={() => setShow(s => ({ ...s, nw: !s.nw }))} className="text-slate-400">{show.nw ? <EyeOff size={14} /> : <Eye size={14} />}</button>}
                {...pwf.register('newPassword')} />
              <Input label="Confirm" type={show.cf ? 'text' : 'password'} placeholder="Repeat" icon={Lock}
                error={pwf.formState.errors.confirmPassword?.message}
                rightElement={<button type="button" onClick={() => setShow(s => ({ ...s, cf: !s.cf }))} className="text-slate-400">{show.cf ? <EyeOff size={14} /> : <Eye size={14} />}</button>}
                {...pwf.register('confirmPassword')} />
            </div>
            <div className="flex justify-end">
              <Button type="submit" loading={pwf.formState.isSubmitting}>
                <Lock size={13} /> Update
              </Button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
