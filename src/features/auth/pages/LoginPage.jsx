import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, Eye, EyeOff, Pill, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { loginSchema } from '../utils/schemas';
import useAuthStore from '../store/authStore';
import Input from '../../../shared/components/Input';
import Button from '../../../shared/components/Button';

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

      {/* Left panel — branding */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] bg-gradient-to-br from-cyan-500 via-cyan-600 to-teal-700 p-12 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white/10" />
        <div className="absolute -bottom-32 -right-16 w-80 h-80 rounded-full bg-white/10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-white/5" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
            <Pill size={22} className="text-white" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">PharmaManager</span>
        </div>

        {/* Center content */}
        <div className="relative z-10 space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-white leading-tight">
              Your pharmacy,<br />
              <span className="text-cyan-100">fully in control.</span>
            </h1>
            <p className="text-cyan-100/80 text-lg leading-relaxed">
              Manage medicines, track inventory, process sales and generate reports — all in one place.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 pt-4">
            {[
              { label: 'Medicines tracked', value: '500+' },
              { label: 'Daily transactions', value: '1,200+' },
              { label: 'Reports generated', value: '50+' },
            ].map((s) => (
              <div key={s.label} className="bg-white/15 backdrop-blur rounded-2xl p-4">
                <p className="text-2xl font-bold text-white">{s.value}</p>
                <p className="text-xs text-cyan-100/80 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom quote */}
        <div className="relative z-10">
          <p className="text-cyan-100/70 text-sm italic">
            "The best pharmacy management experience for modern healthcare."
          </p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-gradient-to-br from-cyan-50 via-white to-teal-50">
        <div className="w-full max-w-md space-y-8">

          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3 justify-center">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500 flex items-center justify-center">
              <Pill size={22} className="text-white" />
            </div>
            <span className="text-xl font-bold text-slate-800">PharmaManager</span>
          </div>

          {/* Heading */}
          <div className="space-y-1">
            <h2 className="text-3xl font-bold text-slate-800">Sign in</h2>
            <p className="text-slate-500">Enter your credentials to access the system.</p>
          </div>

          {/* Card */}
          <div className="bg-white rounded-3xl shadow-xl shadow-cyan-100/60 border border-cyan-100 p-8 space-y-5">
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
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="text-slate-400 hover:text-cyan-500 transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                }
                {...register('password')}
              />

              <Button type="submit" loading={isSubmitting} className="w-full gap-2 py-3 text-base">
                Sign In <ArrowRight size={16} />
              </Button>
            </form>
          </div>

          {/* Role badges */}
          <div className="flex items-center gap-3 justify-center">
            <span className="text-xs text-slate-400">Access levels:</span>
            {['Owner', 'Pharmacist'].map((role) => (
              <span key={role} className="text-xs px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-700 font-medium">
                {role}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
