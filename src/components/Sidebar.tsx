import React from 'react';
import { 
  LayoutDashboard, 
  Plus, 
  Receipt, 
  BarChart3, 
  Settings,
  Wallet,
  X,
  LogOut,
  ArrowRightLeft,
  CreditCard,
  Brain,
  HelpCircle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import ThemeToggle from './ThemeToggle';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, onClose }) => {
  const { user, signOut } = useAuth();
  
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, color: 'from-blue-500 to-indigo-600' },
    { id: 'accounts', label: 'Kelola Akun', icon: CreditCard, color: 'from-indigo-500 to-purple-600' },
    { id: 'add', label: 'Tambah Transaksi', icon: Plus, color: 'from-emerald-500 to-green-600' },
    { id: 'transfer', label: 'Transfer Dana', icon: ArrowRightLeft, color: 'from-purple-500 to-pink-600' },
    { id: 'transactions', label: 'Riwayat Transaksi', icon: Receipt, color: 'from-pink-500 to-rose-600' },
    { id: 'reports', label: 'Laporan', icon: BarChart3, color: 'from-orange-500 to-red-600' },
    { id: 'analytics', label: 'Analitik Cerdas', icon: Brain, color: 'from-indigo-500 to-purple-600' },
    { id: 'help', label: 'Panduan Pengguna', icon: HelpCircle, color: 'from-cyan-500 to-blue-600', badge: 'NEW' },
    { id: 'settings', label: 'Pengaturan', icon: Settings, color: 'from-slate-500 to-gray-600' },
  ];

  return (
    <div className="w-80 sm:w-72 glass-effect dark:glass-effect-dark shadow-2xl lg:shadow-xl border-r border-white/20 dark:border-slate-700/50 flex flex-col h-full">
      {/* Header */}
      <div className="p-8 border-b border-white/20 dark:border-slate-700/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-2xl shadow-lg relative overflow-hidden">
              <Wallet className="w-8 h-8 text-white relative z-10" />
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 dark:from-emerald-400 dark:to-blue-400 bg-clip-text text-transparent">
                BudgetTracker
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Keuangan Pribadi</p>
            </div>
          </div>
          
          {/* Close button for mobile */}
          <button
            onClick={onClose}
            className="lg:hidden p-3 rounded-2xl text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-700/50 focus-ring transition-all duration-200 button-press"
            aria-label="Close navigation menu"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* User Info */}
      <div className="p-6 border-b border-white/20 dark:border-slate-700/50 bg-gradient-to-r from-slate-50/50 to-blue-50/50 dark:from-slate-800/50 dark:to-slate-700/50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">
              {user?.email?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">
              {user?.email}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Pengguna Aktif</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-6 space-y-3 overflow-y-auto">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center space-x-4 px-6 py-4 rounded-2xl text-left transition-all duration-300 focus-ring button-press group ${
                isActive 
                  ? 'bg-gradient-to-r from-emerald-500/10 to-blue-500/10 dark:from-emerald-500/20 dark:to-blue-500/20 text-slate-800 dark:text-slate-200 shadow-lg border border-emerald-200/50 dark:border-emerald-500/30 backdrop-blur-sm' 
                  : 'text-slate-600 dark:text-slate-300 hover:bg-white/40 dark:hover:bg-slate-700/40 hover:text-slate-800 dark:hover:text-slate-200 border border-transparent hover:border-white/30 dark:hover:border-slate-600/30'
              }`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className={`p-2 rounded-xl transition-all duration-300 ${
                isActive 
                  ? `bg-gradient-to-br ${item.color} shadow-lg` 
                  : 'bg-slate-100 dark:bg-slate-700 group-hover:bg-white dark:group-hover:bg-slate-600'
              }`}>
                <Icon className={`w-6 h-6 transition-colors duration-300 ${
                  isActive ? 'text-white' : 'text-slate-600 dark:text-slate-300 group-hover:text-slate-700 dark:group-hover:text-slate-200'
                }`} />
              </div>
              <div className="flex items-center space-x-2 flex-1">
                <span className="font-semibold text-lg">{item.label}</span>
                {(item as any).badge && (
                  <span className="px-2 py-1 bg-gradient-to-r from-red-500 to-pink-600 text-white text-xs font-bold rounded-full pulse-ring">
                    {(item as any).badge}
                  </span>
                )}
              </div>
              {isActive && (
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-emerald-400 to-blue-500 pulse-ring" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Sign Out Button */}
      <div className="p-6 border-t border-white/20 dark:border-slate-700/50">
        <button
          onClick={signOut}
          className="w-full flex items-center space-x-4 px-6 py-4 rounded-2xl text-left transition-all duration-300 focus-ring button-press group text-slate-600 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 border border-transparent hover:border-red-200 dark:hover:border-red-700"
        >
          <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 group-hover:bg-red-100 dark:group-hover:bg-red-900/30 transition-all duration-300">
            <LogOut className="w-6 h-6 text-slate-600 dark:text-slate-300 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors duration-300" />
          </div>
          <span className="font-semibold text-lg">Keluar</span>
        </button>
      </div>

      {/* Theme Toggle */}
      <div className="p-6 border-t border-white/20 dark:border-slate-700/50">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">Tema</span>
          <ThemeToggle />
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-white/20 dark:border-slate-700/50">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 pulse-ring" />
            <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">Aman & Privat</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Data Anda tersimpan dengan aman
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;