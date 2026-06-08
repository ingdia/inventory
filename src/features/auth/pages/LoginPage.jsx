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

const B  = 'oklch(55% 0.18 207.078)';
const BL = 'oklch(96% 0.04 207.078)';
const BM = 'oklch(86.5% 0.127 207.078)';

export default function LoginPage() {
  const navigate = useNavigate();
  const login    = useAuthStore((s) => s.login);
  const [showPwd, setShowPwd] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      const user = await login(data);
      toast.success(`Welcome back, ${user.firstName}!`);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials.');
    }
  };

  return (
    <div className="min-h-screen flex">

      {/* ── LEFT: photo panel ── */}
      <div
        className="hidden lg:block w-[55%] relative overflow-hidden"
        style={{ backgroundImage: `url(${pharmaBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0" style={{ background: 'oklch(35% 0.17 207.078 / 0.88)' }} />
        <div className="absolute inset-0"
          style={{
            backgroundImage: 'linear-gradient(oklch(100% 0 0 / 0.04) 1px,transparent 1px),linear-gradient(90deg,oklch(100% 0 0 / 0.04) 1px,transparent 1px)',
            backgroundSize: '48px 48px',
          }} />

        {/* logo */}
        <div className="absolute top-10 left-10 flex items-center gap-3 z-10">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center backdrop-blur-md"
            style={{ background: 'oklch(100% 0 0 / 0.15)', border: '1px solid oklch(100% 0 0 / 0.25)' }}>
            <Pill size={20} className="text-white" />
          </div>
          <span className="text-white font-extrabold text-lg tracking-tight">PharmaManager</span>
        </div>

        {/* hero copy */}
        <div className="absolute inset-0 flex flex-col justify-center px-14 z-10">
          <p className="text-sm font-bold uppercase tracking-[0.2em] mb-4" style={{ color: BM }}>
            Healthcare Management
          </p>
          <h1 className="text-6xl font-black text-white leading-[1.05] tracking-tight">
            Your pharmacy,<br />
            <span style={{ color: BM }}>fully in control.</span>
          </h1>
          <p className="mt-5 text-white/50 text-base max-w-sm leading-relaxed">
            Inventory · Sales · Reports · Staff — all in one place.
          </p>
        </div>

        {/* stats */}
        <div className="absolute bottom-10 left-10 right-10 z-10">
          <div className="grid grid-cols-3 gap-3">
            {[['500+','Medicines'],['99.9%','Uptime'],['24/7','Support']].map(([v, l]) => (
              <div key={l} className="rounded-2xl p-4 text-center backdrop-blur-md"
                style={{ background: 'oklch(100% 0 0 / 0.08)', border: '1px solid oklch(100% 0 0 / 0.14)' }}>
                <p className="text-2xl font-black text-white">{v}</p>
                <p className="text-xs font-semibold mt-0.5" style={{ color: BM }}>{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT: form panel ── */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white relative overflow-hidden">
        <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full opacity-[0.07] pointer-events-none" style={{ background: B }} />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full opacity-[0.05] pointer-events-none" style={{ background: BM }} />

        <div className="relative z-10 w-full max-w-[380px] space-y-8">

          {/* mobile logo */}
          <div className="flex lg:hidden items-center gap-2">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: `linear-gradient(135deg,${BM},${B})` }}>
              <Pill size={17} className="text-white" />
            </div>
            <span className="font-extrabold text-slate-800">PharmaManager</span>
          </div>

          <div>
            <h2 className="text-4xl font-black text-slate-800 tracking-tight">Sign in</h2>
            <p className="text-slate-400 mt-2">Welcome back — enter your credentials.</p>
          </div>

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
              type={showPwd ? 'text' : 'password'}
              placeholder="••••••••"
              icon={Lock}
              error={errors.password?.message}
              rightElement={
                <button type="button" onClick={() => setShowPwd(v => !v)}
                  className="text-slate-300 hover:text-slate-500 transition-colors">
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
              {...register('password')}
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-white font-bold text-base tracking-wide transition-all active:scale-[0.98] disabled:opacity-60 mt-2"
              style={{
                background: `linear-gradient(135deg,${BM},${B})`,
                boxShadow: `0 10px 30px oklch(55% 0.18 207.078 / 0.35)`,
              }}
            >
              {isSubmitting
                ? <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                : <> Sign In <ArrowRight size={18} strokeWidth={2.5} /> </>
              }
            </button>
          </form>

          <div className="flex items-center gap-3 pt-2">
            <div className="flex-1 h-px bg-slate-100" />
            <div className="flex gap-2">
              {['Owner', 'Pharmacist'].map(r => (
                <span key={r} className="text-xs px-3 py-1.5 rounded-full font-semibold"
                  style={{ background: BL, color: B, border: `1px solid ${BM}` }}>
                  {r}
                </span>
              ))}
            </div>
            <div className="flex-1 h-px bg-slate-100" />
          </div>

        </div>
      </div>
    </div>
  );
}
