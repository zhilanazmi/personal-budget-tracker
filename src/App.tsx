import React, { useState, useEffect } from 'react';
import { Menu, LogOut } from 'lucide-react';
import { useAuth } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { AuthProvider } from './contexts/AuthContext';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import AccountManager from './components/AccountManager';
import TransactionForm from './components/TransactionForm';
import TransferForm from './components/TransferForm';
import TransactionList from './components/TransactionList';
import Reports from './components/Reports';
import Analytics from './components/Analytics';
import Help from './components/Help';
import Settings from './components/Settings';
import FloatingHelpButton from './components/FloatingHelpButton';
import Toast from './components/Toast';
import Auth from './components/Auth';

function AppContent() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, loading, signOut } = useAuth();

  // Close sidebar when tab changes on mobile
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSidebarOpen(false);
  };

  // Close sidebar on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSidebarOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [sidebarOpen]);

  const renderContent = () => {
    const contentMap = {
      dashboard: <Dashboard onNavigate={setActiveTab} />,
      accounts: <AccountManager />,
      add: <TransactionForm onNavigate={setActiveTab} />,
      transfer: <TransferForm />,
      transactions: <TransactionList />,
      reports: <Reports />,
      analytics: <Analytics />,
      help: <Help />,
      settings: <Settings />,
    };
    
    return contentMap[activeTab as keyof typeof contentMap] || <Dashboard onNavigate={setActiveTab} />;
  };

  // Show loading screen
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Memuat...</p>
        </div>
      </div>
    );
  }

  // Show auth screen if not authenticated
  if (!user) {
    return <Auth />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex flex-col">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Main Content Container */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-out lg:relative lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <Sidebar 
            activeTab={activeTab} 
            onTabChange={handleTabChange} 
            onClose={() => setSidebarOpen(false)} 
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Mobile Header */}
          <header className="lg:hidden glass-effect shadow-sm border-b border-white/20 px-4 py-4 sticky top-0 z-30">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-3 rounded-2xl text-slate-600 hover:text-slate-800 hover:bg-white/50 focus-ring transition-all duration-200 button-press"
                aria-label="Open navigation menu"
                aria-expanded={sidebarOpen}
              >
                <Menu className="w-6 h-6" />
              </button>
              <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                BudgetTracker
              </h1>
              <button
                onClick={signOut}
                className="p-3 rounded-2xl text-slate-600 hover:text-red-600 hover:bg-red-50 focus-ring transition-all duration-200 button-press"
                aria-label="Sign out"
              >
                <LogOut className="w-6 h-6" />
              </button>
            </div>
          </header>

          {/* Content Area */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
            <div className="max-w-7xl mx-auto">
              <div className="slide-in">
                {renderContent()}
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Floating Help Button - Only show when not on help page */}
      {activeTab !== 'help' && <FloatingHelpButton onNavigate={setActiveTab} />}

      {/* Global Footer */}
      <footer className="glass-effect border-t border-white/20 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 mt-auto">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm sm:text-base text-slate-600 font-medium">
            Copyright 2025 Zhillan Azmi. All Rights Reserved.
          </p>
        </div>
      </footer>

      {/* Toast Container */}
      <Toast />
    </div>
  );
}

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;