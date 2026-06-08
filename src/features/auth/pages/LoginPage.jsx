import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff } from 'lucide-react';

const SignInPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 flex items-center justify-center p-4">
      {/* Main Container */}
      <div className="w-full max-w-4xl bg-blue-800 rounded-3xl shadow-2xl overflow-hidden">
        <div className="flex flex-col md:flex-row">
          
          {/* Left Side - Welcome Section */}
          <div className="md:w-1/2 bg-blue-700 p-12 relative overflow-hidden min-h-[400px] flex flex-col justify-center">
            {/* Decorative Circles */}
            <div className="absolute top-10 left-10 w-32 h-32 bg-blue-600 rounded-full opacity-50 blur-xl"></div>
            <div className="absolute bottom-20 right-10 w-48 h-48 bg-blue-500 rounded-full opacity-40 blur-2xl"></div>
            <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-blue-400 rounded-full opacity-30 blur-lg"></div>
            
            {/* Content */}
            <div className="relative z-10 text-white">
              <h1 className="text-4xl font-bold mb-4 tracking-wide">WELCOME</h1>
              <p className="text-blue-200 text-lg mb-6 font-medium">YOUR HEADLINE NAME</p>
              <p className="text-blue-300 text-sm leading-relaxed max-w-xs">
                Sign in to access your account and explore amazing features designed just for you.
              </p>
            </div>

            {/* Large decorative circle */}
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-600 rounded-full opacity-60 transform translate-x-1/3 translate-y-1/3"></div>
          </div>

          {/* Right Side - Sign In Form */}
          <div className="md:w-1/2 bg-white p-12 min-h-[400px] flex flex-col justify-center">
            <div className="max-w-sm mx-auto w-full">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Sign in</h2>
              <p className="text-gray-500 text-sm mb-8">
                Enter your credentials to access your account
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Username Input */}
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <User size={20} />
                  </div>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="User Name"
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                {/* Password Input */}
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <Lock size={20} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Password"
                    className="w-full pl-12 pr-24 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600 transition-colors text-sm font-medium"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-gray-600">Remember me</span>
                  </label>
                  <a href="#" className="text-blue-600 hover:text-blue-800 font-medium transition-colors">
                    Forgot Password?
                  </a>
                </div>

                {/* Sign In Button */}
                <button
                  type="submit"
                  className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
                >
                  Sign in
                </button>

                {/* Alternative Sign In */}
                <button
                  type="button"
                  className="w-full bg-white border-2 border-gray-300 hover:border-blue-500 text-gray-700 hover:text-blue-600 font-semibold py-3 rounded-lg transition-all duration-200"
                >
                  Sign in with other
                </button>

                {/* Sign Up Link */}
                <p className="text-center text-sm text-gray-600 mt-6">
                  Don't have an account?{' '}
                  <a href="#" className="text-blue-600 hover:text-blue-800 font-semibold transition-colors">
                    Sign up
                  </a>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;