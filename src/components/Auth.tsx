import React, { useState } from 'react';
import { LogIn, UserPlus, Mail, Lock, Eye, EyeOff, Wallet, Check, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Auth: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const { signIn, signUp } = useAuth();

  // Password validation regex patterns
  const passwordValidation = {
    minLength: /.{8,}/, // minimum 8 characters
    hasUpperCase: /[A-Z]/, // at least one uppercase letter
    hasLowerCase: /[a-z]/, // at least one lowercase letter
    hasNumber: /\d/, // at least one number
  };

  // Validate password with regex
  const validatePassword = (password: string) => {
    const requirements = [
      { regex: passwordValidation.minLength, message: 'Minimal 8 karakter' },
      { regex: passwordValidation.hasUpperCase, message: 'Huruf besar (A-Z)' },
      { regex: passwordValidation.hasLowerCase, message: 'Huruf kecil (a-z)' },
      { regex: passwordValidation.hasNumber, message: 'Angka (0-9)' },
    ];

    const failedRequirements = requirements.filter(req => !req.regex.test(password));
    
    if (failedRequirements.length > 0) {
      setPasswordError(`Password harus mengandung: ${failedRequirements.map(req => req.message).join(', ')}`);
      return false;
    }
    
    setPasswordError('');
    return true;
  };

  // Check individual password requirements
  const getPasswordRequirements = (password: string) => [
    { text: 'Minimal 8 karakter', met: passwordValidation.minLength.test(password) },
    { text: 'Huruf besar (A-Z)', met: passwordValidation.hasUpperCase.test(password) },
    { text: 'Huruf kecil (a-z)', met: passwordValidation.hasLowerCase.test(password) },
    { text: 'Angka (0-9)', met: passwordValidation.hasNumber.test(password) },
  ];

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    
    // Only validate if it's sign up mode and password is not empty
    if (isSignUp && newPassword) {
      validatePassword(newPassword);
    } else {
      setPasswordError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      return;
    }

    // Validate password for sign up
    if (isSignUp && !validatePassword(password)) {
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
    setPasswordError('');
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    resetForm();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4 transition-colors duration-300">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8 fade-in">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="p-4 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-3xl shadow-xl relative overflow-hidden">
              <Wallet className="w-12 h-12 text-white relative z-10" />
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 dark:from-emerald-400 dark:to-blue-400 bg-clip-text text-transparent mb-2">
            FinFlow
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-lg font-medium">
            Kelola keuangan pribadi Anda dengan mudah
          </p>
        </div>

        {/* Auth Form */}
        <div className="glass-effect dark:glass-effect-dark rounded-3xl p-8 border border-white/20 dark:border-slate-700/50 shadow-2xl fade-in" style={{ animationDelay: '200ms' }}>
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">
              {isSignUp ? 'Buat Akun Baru' : 'Masuk ke Akun'}
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              {isSignUp 
                ? 'Daftar untuk mulai mengelola keuangan Anda' 
                : 'Masuk untuk melanjutkan ke dashboard Anda'
              }
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">
                Email
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-slate-100 dark:bg-slate-700 rounded-xl">
                  <Mail className="text-slate-600 dark:text-slate-300 w-5 h-5" />
                </div>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-16 pr-4 py-4 border-2 border-slate-200 dark:border-slate-600 rounded-2xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 text-lg font-medium bg-white/60 dark:bg-slate-800/60 dark:text-slate-200 backdrop-blur-sm input-focus transition-all duration-200"
                  placeholder="nama@email.com"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">
                Password
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-slate-100 dark:bg-slate-700 rounded-xl">
                  <Lock className="text-slate-600 dark:text-slate-300 w-5 h-5" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={handlePasswordChange}
                  className={`w-full pl-16 pr-16 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-emerald-500/20 text-lg font-medium bg-white/60 dark:bg-slate-800/60 dark:text-slate-200 backdrop-blur-sm input-focus transition-all duration-200 ${
                    passwordError 
                      ? 'border-red-500 dark:border-red-400 focus:border-red-500' 
                      : 'border-slate-200 dark:border-slate-600 focus:border-emerald-500'
                  }`}
                  placeholder="Masukkan password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              
              {/* Password Requirements (only show for sign up) */}
              {isSignUp && password && (
                <div className="mt-3 space-y-2">
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Persyaratan Password:</p>
                  <div className="grid grid-cols-1 gap-1">
                    {getPasswordRequirements(password).map((req, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        {req.met ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <X className="w-4 h-4 text-red-500" />
                        )}
                        <span className={`text-sm ${req.met ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                          {req.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Password Error Message */}
              {passwordError && (
                <p className="text-red-600 dark:text-red-400 text-sm mt-2 font-medium">{passwordError}</p>
              )}
            </div>

            {/* Confirm Password (Sign Up only) */}
            {isSignUp && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">
                  Konfirmasi Password
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-slate-100 dark:bg-slate-700 rounded-xl">
                    <Lock className="text-slate-600 dark:text-slate-300 w-5 h-5" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-16 pr-16 py-4 border-2 border-slate-200 dark:border-slate-600 rounded-2xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 text-lg font-medium bg-white/60 dark:bg-slate-800/60 dark:text-slate-200 backdrop-blur-sm input-focus transition-all duration-200"
                    placeholder="Konfirmasi password"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {isSignUp && password && confirmPassword && password !== confirmPassword && (
                  <p className="text-red-600 dark:text-red-400 text-sm mt-2 font-medium">Password tidak cocok</p>
                )}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || (isSignUp && (password !== confirmPassword || passwordError))}
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
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              {isSignUp ? 'Sudah punya akun?' : 'Belum punya akun?'}
            </p>
            <button
              onClick={toggleMode}
              className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-bold text-lg hover:underline transition-colors duration-200"
            >
              {isSignUp ? 'Masuk di sini' : 'Daftar di sini'}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 fade-in" style={{ animationDelay: '400ms' }}>
          <div className="flex items-center justify-center space-x-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 pulse-ring" />
            <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">Aman & Terpercaya</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Data Anda dilindungi dengan enkripsi tingkat enterprise
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;