import React, { useState } from 'react';
import { LogIn, UserPlus, Mail, Lock, Eye, EyeOff, Wallet } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Auth: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      return;
    }

    if (isSignUp && password !== confirmPassword) {
      return;
    }

    setIsLoading(true);

    try {
      if (isSignUp) {
        await signUp(email, password);
      } else {
        await signIn(email, password);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    resetForm();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8 fade-in">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="p-4 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-3xl shadow-xl relative overflow-hidden">
              <Wallet className="w-12 h-12 text-white relative z-10" />
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent mb-2">
            BudgetTracker
          </h1>
          <p className="text-slate-600 text-lg font-medium">
            Kelola keuangan pribadi Anda dengan mudah
          </p>
        </div>

        {/* Auth Form */}
        <div className="glass-effect rounded-3xl p-8 border border-white/20 shadow-2xl fade-in" style={{ animationDelay: '200ms' }}>
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              {isSignUp ? 'Buat Akun Baru' : 'Masuk ke Akun'}
            </h2>
            <p className="text-slate-600">
              {isSignUp 
                ? 'Daftar untuk mulai mengelola keuangan Anda' 
                : 'Masuk untuk melanjutkan ke dashboard Anda'
              }
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-slate-700 mb-3">
                Email
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-slate-100 rounded-xl">
                  <Mail className="text-slate-600 w-5 h-5" />
                </div>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-16 pr-4 py-4 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 text-lg font-medium bg-white/60 backdrop-blur-sm input-focus transition-all duration-200"
                  placeholder="nama@email.com"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-bold text-slate-700 mb-3">
                Password
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-slate-100 rounded-xl">
                  <Lock className="text-slate-600 w-5 h-5" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-16 pr-16 py-4 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 text-lg font-medium bg-white/60 backdrop-blur-sm input-focus transition-all duration-200"
                  placeholder="Masukkan password"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 text-slate-500 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors duration-200"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password (Sign Up only) */}
            {isSignUp && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-bold text-slate-700 mb-3">
                  Konfirmasi Password
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-slate-100 rounded-xl">
                    <Lock className="text-slate-600 w-5 h-5" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-16 pr-16 py-4 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 text-lg font-medium bg-white/60 backdrop-blur-sm input-focus transition-all duration-200"
                    placeholder="Konfirmasi password"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 text-slate-500 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors duration-200"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {isSignUp && password && confirmPassword && password !== confirmPassword && (
                  <p className="text-red-600 text-sm mt-2 font-medium">Password tidak cocok</p>
                )}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || (isSignUp && password !== confirmPassword)}
              className="w-full py-4 px-6 bg-gradient-to-r from-emerald-500 to-blue-600 text-white rounded-2xl hover:from-emerald-600 hover:to-blue-700 transition-all duration-300 font-bold text-lg button-press focus-ring shadow-lg shadow-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-3">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{isSignUp ? 'Mendaftar...' : 'Masuk...'}</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-3">
                  {isSignUp ? <UserPlus className="w-5 h-5" /> : <LogIn className="w-5 h-5" />}
                  <span>{isSignUp ? 'Daftar' : 'Masuk'}</span>
                </div>
              )}
            </button>
          </form>

          {/* Toggle Mode */}
          <div className="mt-8 text-center">
            <p className="text-slate-600 mb-4">
              {isSignUp ? 'Sudah punya akun?' : 'Belum punya akun?'}
            </p>
            <button
              onClick={toggleMode}
              className="text-emerald-600 hover:text-emerald-700 font-bold text-lg hover:underline transition-colors duration-200"
            >
              {isSignUp ? 'Masuk di sini' : 'Daftar di sini'}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 fade-in" style={{ animationDelay: '400ms' }}>
          <div className="flex items-center justify-center space-x-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 pulse-ring" />
            <span className="text-sm font-semibold text-slate-600">Aman & Terpercaya</span>
          </div>
          <p className="text-xs text-slate-500">
            Data Anda dilindungi dengan enkripsi tingkat enterprise
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;