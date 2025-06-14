import React from 'react';
import { 
  LayoutDashboard, 
  Plus, 
  Receipt, 
  BarChart3, 
  Settings,
  Wallet,
  X
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, onClose }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, color: 'from-blue-500 to-indigo-600' },
    { id: 'add', label: 'Add Transaction', icon: Plus, color: 'from-emerald-500 to-green-600' },
    { id: 'transactions', label: 'Transactions', icon: Receipt, color: 'from-purple-500 to-pink-600' },
    { id: 'reports', label: 'Reports', icon: BarChart3, color: 'from-orange-500 to-red-600' },
    { id: 'settings', label: 'Settings', icon: Settings, color: 'from-slate-500 to-gray-600' },
  ];

  return (
    <div className="w-80 sm:w-72 glass-effect shadow-2xl lg:shadow-xl border-r border-white/20 flex flex-col h-full">
      {/* Header */}
      <div className="p-8 border-b border-white/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-2xl shadow-lg relative overflow-hidden">
              <Wallet className="w-8 h-8 text-white relative z-10" />
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                BudgetTracker
              </h1>
              <p className="text-sm text-slate-500 font-medium">Personal Finance</p>
            </div>
          </div>
          
          {/* Close button for mobile */}
          <button
            onClick={onClose}
            className="lg:hidden p-3 rounded-2xl text-slate-500 hover:text-slate-700 hover:bg-white/50 focus-ring transition-all duration-200 button-press"
            aria-label="Close navigation menu"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-6 space-y-3">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center space-x-4 px-6 py-4 rounded-2xl text-left transition-all duration-300 focus-ring button-press group ${
                isActive 
                  ? 'bg-gradient-to-r from-emerald-500/10 to-blue-500/10 text-slate-800 shadow-lg border border-emerald-200/50 backdrop-blur-sm' 
                  : 'text-slate-600 hover:bg-white/40 hover:text-slate-800 border border-transparent hover:border-white/30'
              }`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className={`p-2 rounded-xl transition-all duration-300 ${
                isActive 
                  ? `bg-gradient-to-br ${item.color} shadow-lg` 
                  : 'bg-slate-100 group-hover:bg-white'
              }`}>
                <Icon className={`w-6 h-6 transition-colors duration-300 ${
                  isActive ? 'text-white' : 'text-slate-600 group-hover:text-slate-700'
                }`} />
              </div>
              <span className="font-semibold text-lg">{item.label}</span>
              {isActive && (
                <div className="ml-auto w-2 h-2 rounded-full bg-gradient-to-r from-emerald-400 to-blue-500 pulse-ring" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-6 border-t border-white/20">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 pulse-ring" />
            <span className="text-sm font-semibold text-slate-600">Secure & Private</span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Your data stays on your device
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;