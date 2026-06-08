import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Pill } from 'lucide-react';
import toast from 'react-hot-toast';
import { loginSchema } from '../utils/schemas';
import useAuthStore from '../store/authStore';
import Input from '../../../shared/components/Input';
import pharmaBg from '../../../assets/pharmacy-bg.jpg';

const BRAND = 'oklch(55% 0.18 207.078)';
const BRAND_LIGHT = 'oklch(96% 0.04 207.078)';

export default function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const [showPwd, setShowPwd] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      const user = await login(data);
      toast.success(`Welcome, ${user.firstName}!`);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials.');
    }
  };

  return (
    <div className="min-h-screen flex">

      {/* Left — image + overlay */}
      <div className="hidden lg:flex flex-col justify-between w-[52%] relative overflow-hidden"
        style={{ backgroundImage: `url(${pharmaBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>

        <div className="absolute inset-0" style={{ background: 'oklch(42% 0.18 207.078 / 0.88)' }} />
        {/* dot pattern */}
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3 p-10">
          <div className="w-9 h-9 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center">
            <Pill size={18} className="text-white" />
          </div>
          <span className="text-base font-bold text-white tracking-tight">PharmaManager</span>
        </div>

        {/* Hero */}
        <div className="relative z-10 px-10 space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span className="text-white/80 text-xs font-medium">200+ pharmacies trust us</span>
          </div>
          <h1 className="text-5xl font-extrabold text-white leading-[1.1] tracking-tight">
            Your pharmacy,<br /><span className="text-white/60">fully in control.</span>
          </h1>
        </div>

        {/* Stats */}
        <div className="relative z-10 p-10">
          <div className="grid grid-cols-3 gap-3">
            {[['500+', 'Medicines'], ['99.9%', 'Uptime'], ['24/7', 'Support']].map(([v, l]) => (
              <div key={l} className="bg-white/10 border border-white/10 rounded-2xl p-4 text-center">
                <p className="text-2xl font-extrabold text-white">{v}</p>
                <p className="text-white/50 text-xs mt-0.5">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center p-8" style={{ background: BRAND_LIGHT }}>
        <div className="w-full max-w-sm space-y-7">

          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2 justify-center">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: BRAND }}>
              <Pill size={16} className="text-white" />
            </div>
            <span className="font-bold text-slate-800">PharmaManager</span>
          </div>

          <div>
            <h2 className="text-2xl font-extrabold text-slate-800">Sign in</h2>
            <p className="text-slate-400 text-sm mt-1">Access your pharmacy dashboard.</p>
          </div>

          <div className="bg-white rounded-2xl p-7 border"
            style={{ borderColor: 'oklch(86.5% 0.127 207.078 / 0.4)', boxShadow: '0 16px 48px oklch(55% 0.18 207.078 / 0.1)' }}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input label="Email" type="email" placeholder="you@pharmacy.com" icon={Mail}
                error={errors.email?.message} {...register('email')} />
              <Input label="Password" type={showPwd ? 'text' : 'password'} placeholder="••••••••" icon={Lock}
                error={errors.password?.message}
                rightElement={
                  <button type="button" onClick={() => setShowPwd(v => !v)} className="text-slate-400">
                    {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                }
                {...register('password')} />

              <button type="submit" disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white font-semibold text-sm transition-all active:scale-95 disabled:opacity-60 mt-1"
                style={{ background: BRAND, boxShadow: '0 6px 20px oklch(55% 0.18 207.078 / 0.35)' }}>
                {isSubmitting
                  ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  : <> Sign In <ArrowRight size={15} /> </>}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
