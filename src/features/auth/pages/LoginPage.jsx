import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Pill, ShieldCheck, TrendingUp, Package } from 'lucide-react';
import toast from 'react-hot-toast';
import { loginSchema } from '../utils/schemas';
import useAuthStore from '../store/authStore';
import Input from '../../../shared/components/Input';
import Button from '../../../shared/components/Button';
import pharmaBg from '../../../assets/pharmacy-bg.jpg';

export default function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      const user = await login(data);
      toast.success(`Welcome back, ${user.firstName}! 👋`);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials.');
    }
  };

  return (
    <div className="min-h-screen flex">

      {/* ── Left panel: background image + oklch overlay ── */}
      <div
        className="hidden lg:flex flex-col justify-between w-[52%] relative overflow-hidden"
        style={{
          backgroundImage: `url(${pharmaBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* oklch color overlay */}
        <div
          className="absolute inset-0"
          style={{ background: 'oklch(52% 0.105 223.128 / 0.85)' }}
        />

        {/* Noise texture layer */}
        <div className="absolute inset-0 opacity-30"
          style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")', backgroundSize: '128px' }} />

        {/* Content */}
        <div className="relative z-10 flex items-center gap-3 p-10">
          <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
            <Pill size={20} className="text-white" />
          </div>
          <div>
            <span className="text-lg font-bold text-white tracking-tight">PharmaManager</span>
            <p className="text-white/60 text-xs">Healthcare Management System</p>
          </div>
        </div>

        {/* Center hero text */}
        <div className="relative z-10 px-10 space-y-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 border border-white/20 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span className="text-white/90 text-xs font-semibold tracking-wide">Trusted by 200+ pharmacies</span>
            </div>
            <h1 className="text-5xl font-extrabold text-white leading-[1.1] tracking-tight">
              Smart pharmacy<br />
              <span className="text-white/70">management.</span>
            </h1>
            <p className="text-white/65 text-lg leading-relaxed max-w-md">
              Track inventory, process sales, manage staff and generate reports — all from one beautiful dashboard.
            </p>
          </div>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-3">
            {[
              { icon: Package, label: 'Inventory Tracking' },
              { icon: TrendingUp, label: 'Sales Analytics' },
              { icon: ShieldCheck, label: 'Role-Based Access' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm">
                <Icon size={13} className="text-white/80" />
                <span className="text-white/90 text-xs font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom stats */}
        <div className="relative z-10 p-10">
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: '500+', label: 'Medicines' },
              { value: '99.9%', label: 'Uptime' },
              { value: '24/7', label: 'Support' },
            ].map((s) => (
              <div key={s.label} className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-4 text-center">
                <p className="text-2xl font-extrabold text-white">{s.value}</p>
                <p className="text-white/60 text-xs mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right panel: login form ── */}
      <div className="flex-1 flex items-center justify-center p-8"
        style={{ background: 'oklch(96% 0.04 207.078)' }}>

        <div className="w-full max-w-md space-y-8">

          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3 justify-center">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center"
              style={{ background: 'oklch(55% 0.18 207.078)' }}>
              <Pill size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold text-slate-800">PharmaManager</span>
          </div>

          {/* Heading */}
          <div>
            <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Welcome back</h2>
            <p className="text-slate-500 mt-1.5">Sign in to your pharmacy account.</p>
          </div>

          {/* Form card */}
          <div className="bg-white rounded-3xl p-8 shadow-2xl border"
            style={{ borderColor: 'oklch(86.5% 0.127 207.078 / 0.4)', boxShadow: '0 20px 60px oklch(55% 0.18 207.078 / 0.12)' }}>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <Input
                label="Email address"
                type="email"
                placeholder="you@pharmacy.com"
                icon={Mail}
                error={errors.email?.message}
                {...register('email')}
              />
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                icon={Lock}
                error={errors.password?.message}
                rightElement={
                  <button type="button" onClick={() => setShowPassword((v) => !v)}
                    className="text-slate-400 transition-colors"
                    style={{ '--hover-color': 'var(--brand-deep)' }}>
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                }
                {...register('password')}
              />

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-white font-semibold text-sm transition-all active:scale-95 disabled:opacity-60 mt-2"
                style={{ background: 'oklch(55% 0.18 207.078)', boxShadow: '0 8px 24px oklch(55% 0.18 207.078 / 0.35)' }}
              >
                {isSubmitting
                  ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  : <> Sign In <ArrowRight size={16} /> </>
                }
              </button>
            </form>
          </div>

          {/* Role info */}
          <div className="flex items-center justify-center gap-3">
            <span className="text-xs text-slate-400">Access roles:</span>
            {['Owner', 'Pharmacist'].map((role) => (
              <span key={role}
                className="text-xs px-3 py-1 rounded-full border font-medium"
                style={{ borderColor: 'oklch(86.5% 0.127 207.078)', color: 'oklch(45% 0.18 207.078)', background: 'oklch(96% 0.04 207.078)' }}>
                {role}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
