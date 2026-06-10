import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Lock } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { loginSchema } from '../utils/schemas';
import useAuthStore from '../store/authStore';

export default function LoginPage() {
  const navigate = useNavigate();
  const login    = useAuthStore((s) => s.login);
  const [showPwd, setShowPwd] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      await login(data);
      toast.success('Welcome back! 👋');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-[#2b78c2] flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-4xl bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row relative">

        {/* ── LEFT BLUE PANEL ── */}
        <div className="md:w-[55%] relative bg-[#2b78c2] min-h-[480px] flex flex-col justify-center p-12 overflow-hidden">

          {/* curved right edge */}
          <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-[#2b78c2] rounded-l-[150px] z-10" />

          {/* 3D bubble large */}
          <div className="absolute bottom-[-30px] left-[35%] w-40 h-40 rounded-full z-20 shadow-xl"
            style={{ background: 'radial-gradient(circle at 35% 35%,#5ba0f2,#1a4f8a)' }} />

          {/* 3D bubble small */}
          <div className="absolute bottom-[20px] left-[5%] w-24 h-24 rounded-full z-20 shadow-lg"
            style={{ background: 'radial-gradient(circle at 35% 35%,#7ab4ff,#2563a8)' }} />

          {/* depth arc */}
          <div className="absolute top-[-50px] right-[20%] w-60 h-60 rounded-full bg-[#2468a8] opacity-40 z-0" />

          {/* text */}
          <div className="relative z-30 text-white max-w-[250px]">
            <h1 className="text-4xl font-extrabold tracking-wider mb-2">WELCOME</h1>
            <p className="text-blue-200 text-xs font-bold tracking-widest uppercase mb-6">
              PharmaManager
            </p>
            <p className="text-blue-100 text-[11px] leading-relaxed opacity-80">
              Manage your pharmacy — inventory, sales, staff and reports all in one place.
            </p>
          </div>
        </div>

        {/* ── RIGHT FORM ── */}
        <div className="md:w-[45%] bg-white p-10 md:p-14 flex flex-col justify-center relative z-20">
          <div className="max-w-sm w-full mx-auto">

            <h2 className="text-2xl font-bold text-gray-900 mb-1">Sign in</h2>
            <p className="text-gray-400 text-[11px] mb-8">Enter your credentials to access your account</p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

              {/* email */}
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="email" placeholder="Email address"
                  {...register('email')}
                  className="w-full pl-10 pr-4 py-3 bg-[#f4f6f9] border border-transparent rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-white transition-all" />
                {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>}
              </div>

              {/* password */}
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type={showPwd ? 'text' : 'password'} placeholder="Password"
                  {...register('password')}
                  className="w-full pl-10 pr-14 py-3 bg-[#f4f6f9] border border-transparent rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-white transition-all" />
                <button type="button" onClick={() => setShowPwd(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#2b78c2] text-[10px] font-bold tracking-wide hover:text-blue-800 transition-colors">
                  {showPwd ? 'HIDE' : 'SHOW'}
                </button>
                {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password.message}</p>}
              </div>

              {/* remember + forgot */}
              <div className="flex items-center justify-between text-[11px]">
                <label className="flex items-center gap-1.5 cursor-pointer text-gray-500">
                  <input type="checkbox" className="w-3.5 h-3.5 rounded text-blue-600 focus:ring-blue-500" />
                  Remember me
                </label>
                <a href="#" className="text-[#2b78c2] hover:text-blue-800 font-medium transition-colors">
                  Forgot Password?
                </a>
              </div>

              {/* submit */}
              <button type="submit" disabled={isSubmitting}
                className="w-full bg-[#1a3c6e] hover:bg-[#142e56] text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 text-sm mt-2 flex items-center justify-center gap-2">
                {isSubmitting
                  ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  : 'Sign in'}
              </button>

            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
