import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { loginSchema } from '../utils/schemas';
import useAuthStore from '../store/authStore';
import Input from '../../../shared/components/Input';
import Button from '../../../shared/components/Button';

export default function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data) => {
    try {
      const user = await login(data);
      toast.success(`Welcome back, ${user.firstName}!`);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_40%,transparent_100%)]" />

      <div className="relative w-full max-w-md">
        {/* Logo / Brand */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 mb-4">
            <ShieldCheck className="text-emerald-400" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">PharmaManager</h1>
          <p className="text-slate-400 text-sm mt-1">Sign in to your account</p>
        </div>

        {/* Card */}
        <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-2xl p-8 shadow-2xl shadow-black/40">
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
              placeholder="••••••••"
              icon={Lock}
              error={errors.password?.message}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="text-slate-400 hover:text-slate-200 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
              {...register('password')}
            />

            <Button type="submit" loading={isSubmitting} className="w-full mt-2">
              Sign In
            </Button>
          </form>

          {/* Divider info */}
          <div className="mt-6 pt-6 border-t border-slate-800">
            <p className="text-center text-xs text-slate-500">
              Protected by JWT + Role-Based Access Control
            </p>
          </div>
        </div>

        {/* Roles hint */}
        <div className="mt-4 flex gap-3 justify-center">
          {['Owner', 'Pharmacist'].map((role) => (
            <span
              key={role}
              className="text-xs px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-400"
            >
              {role}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
