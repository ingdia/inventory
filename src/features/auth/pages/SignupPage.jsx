import React, { useState } from 'react';
import { User, Lock, Mail, Phone } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/auth.service';
import toast from 'react-hot-toast';

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
  });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await authService.register(formData);
      toast.success('Account created! Please sign in.');
      navigate('/login', { replace: true });
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = "w-full pl-10 pr-4 py-3 bg-[#f4f6f9] border border-transparent rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-white transition-all";

  return (
    <div className="min-h-screen bg-[#2b78c2] flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-4xl bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row relative">

        {/* LEFT SIDE (BLUE) */}
        <div className="md:w-[55%] relative bg-[#2b78c2] min-h-[450px] flex flex-col justify-center p-12 overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-[#2b78c2] rounded-l-[150px] z-10"></div>
          <div className="absolute bottom-[-30px] left-[35%] w-40 h-40 rounded-full z-20 shadow-xl"
               style={{ background: 'radial-gradient(circle at 35% 35%, #5ba0f2, #1a4f8a)' }}></div>
          <div className="absolute bottom-[20px] left-[5%] w-24 h-24 rounded-full z-20 shadow-lg"
               style={{ background: 'radial-gradient(circle at 35% 35%, #7ab4ff, #2563a8)' }}></div>
          <div className="absolute top-[-50px] right-[20%] w-60 h-60 rounded-full bg-[#2468a8] opacity-40 z-0"></div>
          <div className="relative z-30 text-white max-w-[250px]">
            <h1 className="text-4xl font-extrabold tracking-wider mb-2">JOIN US</h1>
            <p className="text-blue-200 text-xs font-bold tracking-widest uppercase mb-6">
              Create your account
            </p>
            <p className="text-blue-100 text-[10px] leading-relaxed opacity-80">
              Register to access PharmaManager and manage your pharmacy with ease.
            </p>
          </div>
        </div>

        {/* RIGHT SIDE (WHITE FORM) */}
        <div className="md:w-[45%] bg-white p-10 md:p-14 flex flex-col justify-center relative z-20">
          <div className="max-w-sm w-full mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Sign up</h2>
            <p className="text-gray-400 text-[11px] mb-6">Fill in your details to create an account</p>

            <form onSubmit={handleSubmit} className="space-y-3">
              {/* First & Last Name */}
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><User size={16} /></div>
                  <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange}
                    placeholder="First Name" className={inputClass} required />
                </div>
                <div className="relative flex-1">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><User size={16} /></div>
                  <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange}
                    placeholder="Last Name" className={inputClass} required />
                </div>
              </div>

              {/* Username */}
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><User size={16} /></div>
                <input type="text" name="username" value={formData.username} onChange={handleInputChange}
                  placeholder="Username" className={inputClass} required />
              </div>

              {/* Email */}
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Mail size={16} /></div>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange}
                  placeholder="Email" className={inputClass} required />
              </div>

              {/* Password */}
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Lock size={16} /></div>
                <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password}
                  onChange={handleInputChange} placeholder="Password" className="w-full pl-10 pr-14 py-3 bg-[#f4f6f9] border border-transparent rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-white transition-all" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#2b78c2] text-[10px] font-bold hover:text-blue-800 transition-colors tracking-wide">
                  {showPassword ? 'HIDE' : 'SHOW'}
                </button>
              </div>

              {/* Submit */}
              <button type="submit" disabled={isLoading}
                className="w-full bg-[#1a3c6e] hover:bg-[#142e56] text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 text-sm mt-2 disabled:opacity-60">
                {isLoading ? 'Creating account...' : 'Create Account'}
              </button>

              <p className="text-center text-[11px] text-gray-500 mt-4">
                Already have an account?{' '}
                <Link to="/login" className="text-[#2b78c2] hover:text-blue-800 font-bold transition-colors">
                  Sign in
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
