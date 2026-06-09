import React, { useState } from 'react';
import { User, Lock } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

const SignInPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const navigate = useNavigate();
  const { login, isLoading } = useAuthStore();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login({ email: formData.email, password: formData.password });
      toast.success('Welcome back! 👋');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Invalid credentials');
    }
  };

  return (
    // Outer Blue Container (matching the rounded blue background in the image)
    <div className="min-h-screen bg-[#2b78c2] flex items-center justify-center p-6 font-sans">
      
      {/* Main White Card */}
      <div className="w-full max-w-4xl bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row relative">
        
        {/* ================= LEFT SIDE (BLUE) ================= */}
        <div className="md:w-[55%] relative bg-[#2b78c2] min-h-[450px] flex flex-col justify-center p-12 overflow-hidden">
          
          {/* The Curved Right Edge (Creates the arc overlapping the white section) */}
          <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-[#2b78c2] rounded-l-[150px] z-10"></div>

          {/* 3D Bubble 1: Large Dark Blue Sphere */}
          <div className="absolute bottom-[-30px] left-[35%] w-40 h-40 rounded-full z-20 shadow-xl"
               style={{ background: 'radial-gradient(circle at 35% 35%, #5ba0f2, #1a4f8a)' }}>
          </div>

          {/* 3D Bubble 2: Smaller Lighter Blue Sphere */}
          <div className="absolute bottom-[20px] left-[5%] w-24 h-24 rounded-full z-20 shadow-lg"
               style={{ background: 'radial-gradient(circle at 35% 35%, #7ab4ff, #2563a8)' }}>
          </div>

          {/* Subtle background arc for depth */}
          <div className="absolute top-[-50px] right-[20%] w-60 h-60 rounded-full bg-[#2468a8] opacity-40 z-0"></div>

          {/* Text Content */}
          <div className="relative z-30 text-white max-w-[250px]">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
              </div>
              <span className="text-xs font-bold tracking-widest uppercase text-blue-200">PharmaManager</span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-wider mb-2">WELCOME
BACK</h1>
            <p className="text-blue-100 text-[11px] leading-relaxed opacity-80 mt-3">
              Your all-in-one pharmacy management system. Manage medicines, inventory, and your team — all in one place.
            </p>
          </div>
        </div>

        {/* ================= RIGHT SIDE (WHITE FORM) ================= */}
        <div className="md:w-[45%] bg-white p-10 md:p-14 flex flex-col justify-center relative z-20">
          <div className="max-w-sm w-full mx-auto">
            
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Sign in</h2>
            <p className="text-gray-400 text-[11px] mb-8">
              Enter your credentials to access your account
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Input */}
              <div className="relative group">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <User size={16} />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email address"
                  className="w-full pl-10 pr-4 py-3 bg-[#f4f6f9] border border-transparent rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-white transition-all"
                  required
                />
              </div>

              {/* Password Input */}
              <div className="relative group">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Lock size={16} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Password"
                  className="w-full pl-10 pr-14 py-3 bg-[#f4f6f9] border border-transparent rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-white transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#2b78c2] text-[10px] font-bold hover:text-blue-800 transition-colors tracking-wide"
                >
                  {showPassword ? 'HIDE' : 'SHOW'}
                </button>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-[11px] mt-2">
                <label className="flex items-center space-x-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    className="w-3.5 h-3.5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-gray-500">Remember me</span>
                </label>
                <a href="#" className="text-[#2b78c2] hover:text-blue-800 font-medium transition-colors">
                  Forgot Password?
                </a>
              </div>

              {/* Sign In Button (Dark Navy) */}
              <button
                type="submit"
                className="w-full bg-[#1a3c6e] hover:bg-[#142e56] text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 text-sm mt-4 disabled:opacity-60"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>

              {/* Alternative Sign In (White with border) */}
              <button
                type="button"
                className="w-full bg-white border border-gray-300 hover:border-gray-400 text-gray-600 font-medium py-3 rounded-lg transition-all duration-200 text-sm"
              >
                Sign in with other
              </button>

              {/* Sign Up Link */}
              <p className="text-center text-[11px] text-gray-500 mt-6">
                Don't have an account?{' '}
                <Link to="/signup" className="text-[#2b78c2] hover:text-blue-800 font-bold transition-colors">
                  Sign up
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;