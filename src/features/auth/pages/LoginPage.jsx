import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Pill, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { loginSchema } from '../utils/schemas';
import useAuthStore from '../store/authStore';
import Input from '../../../shared/components/Input';
import pharmaBg from '../../../assets/pharmacy-bg.jpg';

const B  = 'oklch(55% 0.18 207.078)';
const BL = 'oklch(96% 0.04 207.078)';
const BM = 'oklch(86.5% 0.127 207.078)';

export default function LoginPage() {
  const navigate  = useNavigate();
  const login     = useAuthStore((s) => s.login);
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

      {/* ── Left: photo + colour overlay ── */}
      <div
        className="hidden lg:flex flex-col justify-between w-[52%] relative overflow-hidden"
        style={{ backgroundImage: `url(${pharmaBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        {/* deep teal overlay */}
        <div className="absolute inset-0" style={{ background: 'oklch(38% 0.16 207.078 / 0.90)' }} />
        {/* subtle grid */}
        <div className="absolute inset-0 opacity-[0.07]"
          style={{ backgroundImage: 'linear-gradient(white 1px,transparent 1px),linear-gradient(90deg,white 1px,transparent 1px)', backgroundSize: '40px 40px' }} />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3 p-10">
          <div className="w-9 h-9 rounded-xl bg-white/15 border border-white/25 flex items-center justify-center backdrop-blur-sm">
            <Pill size={18} className="text-white" />
          </div>
          <span className="font-bold text-white tracking-tight">PharmaManager</span>
        </div>

        {/* Hero copy */}
        <div className="relative z-10 px-10 space-y-6">
          {/* pill badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm">
            <Sparkles size={12} className="text-white/70" />
            <span className="text-white/80 text-xs font-medium tracking-wide">200 + pharmacies trust us</span>
          </div>

          <h1 className="text-[3.25rem] font-extrabold text-white leading-[1.08] tracking-tight">
            Your pharmacy,<br />
            <span style={{ color: BM }}>fully in control.</span>
          </h1>

          <p className="text-white/55 text-base leading-relaxed max-w-sm">
            Inventory · Sales · Reports · Staff — one clean dashboard.
          </p>
        </div>

        {/* Stats row */}
        <div className="relative z-10 p-10">
          <div className="grid grid-cols-3 gap-3">
            {[['500+','Medicines'],['99.9%','Uptime'],['24/7','Support']].map(([v,l]) => (
              <div key={l} className="rounded-2xl p-4 text-center backdrop-blur-sm"
                style={{ background: 'oklch(100% 0 0 / 0.08)', border: '1px solid oklch(100% 0 0 / 0.12)' }}>
                <p className="text-2xl font-extrabold text-white">{v}</p>
                <p className="text-xs mt-0.5" style={{ color: BM }}>{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right: form ── */}
      <div className="flex-1 flex items-center justify-center relative overflow-hidden"
        style={{ background: 'oklch(97.5% 0.025 207.078)' }}>

        {/* soft background blobs */}
        <div className="absolute top-[-80px] right-[-80px] w-72 h-72 rounded-full opacity-30 blur-3xl pointer-events-none"
          style={{ background: BM }} />
        <div className="absolute bottom-[-60px] left-[-60px] w-56 h-56 rounded-full opacity-20 blur-3xl pointer-events-none"
          style={{ background: B }} />

        <div className="relative z-10 w-full max-w-sm px-6 space-y-8">

          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2 justify-center">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: B }}>
              <Pill size={15} className="text-white" />
            </div>
            <span className="font-bold text-slate-800">PharmaManager</span>
          </div>

          {/* Heading */}
          <div className="space-y-1">
            <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Sign in</h2>
            <p className="text-slate-400 text-sm">Access your pharmacy dashboard.</p>
          </div>

          {/* Card */}
          <div className="bg-white rounded-3xl p-8 space-y-5"
            style={{ boxShadow: `0 20px 60px oklch(55% 0.18 207.078 / 0.13), 0 2px 8px oklch(55% 0.18 207.078 / 0.06)`, border: `1.5px solid ${BM}40` }}>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input label="Email" type="email" placeholder="you@pharmacy.com"
                icon={Mail} error={errors.email?.message} {...register('email')} />

              <Input label="Password" type={showPwd ? 'text' : 'password'} placeholder="••••••••"
                icon={Lock} error={errors.password?.message}
                rightElement={
                  <button type="button" onClick={() => setShowPwd(v => !v)}
                    className="text-slate-300 hover:text-slate-500 transition-colors">
                    {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                }
                {...register('password')} />

              <button type="submit" disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-white font-bold text-sm tracking-wide transition-all active:scale-[0.98] disabled:opacity-60"
                style={{ background: `linear-gradient(135deg, ${BM}, ${B})`, boxShadow: `0 8px 24px oklch(55% 0.18 207.078 / 0.35)` }}>
                {isSubmitting
                  ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  : <> Sign In <ArrowRight size={15} strokeWidth={2.5} /> </>}
              </button>
            </form>

            {/* divider */}
            <div className="flex items-center gap-3 pt-1">
              <div className="flex-1 h-px bg-slate-100" />
              <span className="text-xs text-slate-300 font-medium">secure access</span>
              <div className="flex-1 h-px bg-slate-100" />
            </div>

            {/* Role chips */}
            <div className="flex gap-2 justify-center">
              {['Owner', 'Pharmacist'].map(r => (
                <span key={r} className="text-xs px-3 py-1 rounded-full font-semibold"
                  style={{ background: BL, color: B, border: `1px solid ${BM}60` }}>
                  {r}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
