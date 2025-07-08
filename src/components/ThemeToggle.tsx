import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-3 rounded-2xl transition-all duration-300 button-press focus-ring group relative overflow-hidden bg-white/60 dark:bg-slate-800/60 border-2 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 backdrop-blur-sm"
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {/* Background gradient animation */}
      <div className={`absolute inset-0 transition-all duration-500 ${
        isDark 
          ? 'bg-gradient-to-br from-slate-700 to-slate-800' 
          : 'bg-gradient-to-br from-yellow-400 to-orange-500'
      }`} />
      
      {/* Icon container */}
      <div className="relative z-10 flex items-center justify-center">
        {isDark ? (
          <Moon className="w-6 h-6 text-slate-200 group-hover:text-white transition-colors duration-300" />
        ) : (
          <Sun className="w-6 h-6 text-white group-hover:text-yellow-100 transition-colors duration-300" />
        )}
      </div>
      
      {/* Hover effect */}
      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </button>
  );
};

export default ThemeToggle;