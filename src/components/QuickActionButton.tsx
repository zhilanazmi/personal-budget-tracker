import React, { useState, useRef, useEffect } from 'react';
import { Plus, X, Zap, CreditCard, ArrowUpRight, ArrowDownRight, Pencil } from 'lucide-react';
import { useQuickAction } from '../contexts/QuickActionContext';
import { useBudget } from '../hooks/useBudget';
import { useToast } from '../contexts/ToastContext';

interface QuickActionButtonProps {
  onTransactionFormOpen: (type?: 'income' | 'expense', template?: any) => void;
  onTransferFormOpen: () => void;
}

export const QuickActionButton: React.FC<QuickActionButtonProps> = ({
  onTransactionFormOpen,
  onTransferFormOpen,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const { getPopularTemplates, useTemplate } = useQuickAction();
  const { addTransaction, accounts } = useBudget();
  const { showToast } = useToast();
  const containerRef = useRef<HTMLDivElement>(null);

  const popularTemplates = getPopularTemplates(4);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
        setShowQuickAdd(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Quick actions data
  const quickActions = [
    {
      id: 'expense',
      label: 'Pengeluaran',
      icon: ArrowDownRight,
      color: 'bg-red-500 hover:bg-red-600',
      action: () => onTransactionFormOpen('expense'),
    },
    {
      id: 'income',
      label: 'Pemasukan',
      icon: ArrowUpRight,
      color: 'bg-green-500 hover:bg-green-600',
      action: () => onTransactionFormOpen('income'),
    },
    {
      id: 'transfer',
      label: 'Transfer',
      icon: CreditCard,
      color: 'bg-blue-500 hover:bg-blue-600',
      action: () => onTransferFormOpen(),
    },
    {
      id: 'quick-add',
      label: 'Quick Add',
      icon: Zap,
      color: 'bg-purple-500 hover:bg-purple-600',
      action: () => setShowQuickAdd(!showQuickAdd),
    },
  ];

  const handleQuickAddTransaction = async (template: any) => {
    try {
      if (!template.accountId || !accounts.find(acc => acc.id === template.accountId)) {
        // Use first available account if template account not found
        const defaultAccount = accounts[0];
        if (!defaultAccount) {
          showToast('Tidak ada akun tersedia', 'error');
          return;
        }
        template.accountId = defaultAccount.id;
      }

      const transaction = {
        id: `tx-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        description: template.description,
        amount: template.amount || 0,
        category: template.category,
        type: template.type,
        accountId: template.accountId,
      };

      await addTransaction(transaction);
      useTemplate(template.id);
      showToast(`${template.name} berhasil ditambahkan!`, 'success');
      setIsExpanded(false);
      setShowQuickAdd(false);

      // Add haptic feedback if available
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    } catch (error) {
      console.error('Error adding quick transaction:', error);
      showToast('Gagal menambahkan transaksi', 'error');
    }
  };

  const handleEditTemplate = (template: any) => {
    onTransactionFormOpen(template.type, template);
    setIsExpanded(false);
    setShowQuickAdd(false);
  };

  return (
    <div ref={containerRef} className="fixed bottom-6 right-6 z-50">
      {/* Quick Add Templates Overlay */}
      {showQuickAdd && (
        <div className="absolute bottom-16 right-0 mb-2 w-72 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-purple-500" />
              Quick Add
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Tap untuk tambah langsung, tahan untuk edit
            </p>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {popularTemplates.length > 0 ? (
              <div className="p-2">
                {popularTemplates.map((template) => (
                  <div
                    key={template.id}
                    className="flex items-center justify-between p-3 mb-2 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <div
                      className="flex items-center gap-3 flex-1 cursor-pointer"
                      onClick={() => handleQuickAddTransaction(template)}
                    >
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-medium"
                        style={{ backgroundColor: template.color }}
                      >
                        {template.icon === 'Coffee' && '☕'}
                        {template.icon === 'Car' && '🚗'}
                        {template.icon === 'Briefcase' && '💼'}
                        {template.icon === 'Tag' && '🏷️'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 dark:text-white truncate">
                          {template.name}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {template.amount ? `Rp ${template.amount.toLocaleString('id-ID')}` : 'Tanpa jumlah tetap'}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleEditTemplate(template)}
                      className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
                      title="Edit template"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                <Zap className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Belum ada template quick add</p>
                <p className="text-xs mt-1">Template akan muncul otomatis dari transaksi yang sering dilakukan</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Expanded Action Buttons */}
      {isExpanded && (
        <div className="absolute bottom-16 right-0 flex flex-col gap-3 mb-2">
          {quickActions.map((action, index) => (
            <div
              key={action.id}
              className="animate-scale-in opacity-0"
              style={{
                animationDelay: `${index * 50}ms`,
                animationFillMode: 'forwards',
              }}
            >
              <button
                onClick={action.action}
                className={`
                  ${action.color} text-white p-3 rounded-full shadow-lg 
                  transform transition-all duration-200 hover:scale-110 active:scale-95
                  flex items-center gap-2 whitespace-nowrap
                  ${action.id === 'quick-add' && showQuickAdd ? 'bg-purple-600' : ''}
                `}
                title={action.label}
              >
                <action.icon className="w-5 h-5" />
                <span className="text-sm font-medium pr-1">{action.label}</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Main FAB */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`
          w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-lg 
          flex items-center justify-center transform transition-all duration-300 hover:scale-110 active:scale-95
          ${isExpanded ? 'rotate-45' : 'rotate-0'}
        `}
        aria-label={isExpanded ? 'Tutup quick actions' : 'Buka quick actions'}
      >
        {isExpanded ? <X className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
      </button>

      {/* Backdrop */}
      {isExpanded && (
        <div
          className="fixed inset-0 bg-black bg-opacity-20 -z-10"
          onClick={() => {
            setIsExpanded(false);
            setShowQuickAdd(false);
          }}
        />
      )}

      <style jsx>{`
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.8) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}; 