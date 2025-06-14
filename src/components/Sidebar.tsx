import React from 'react';
import { 
  LayoutDashboard, 
  Plus, 
  Receipt, 
  BarChart3, 
  Settings,
  Wallet
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'add', label: 'Add Transaction', icon: Plus },
    { id: 'transactions', label: 'Transactions', icon: Receipt },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="w-64 bg-white shadow-lg border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-emerald-100 rounded-lg">
            <Wallet className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">BudgetTracker</h1>
            <p className="text-sm text-gray-500">Personal Finance</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-left transition-all duration-200 mb-1 ${
                isActive 
                  ? 'bg-emerald-50 text-emerald-700 border-r-2 border-emerald-500' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-600' : ''}`} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          Secure • Private • Local Storage
        </div>
      </div>
    </div>
  );
};

export default Sidebar;