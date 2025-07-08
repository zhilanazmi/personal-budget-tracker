import React, { useState } from 'react';
import { Plus, Zap, Edit, TrendingUp, Clock, Star } from 'lucide-react';
import { useQuickAction } from '../contexts/QuickActionContext';
import { useBudget } from '../hooks/useBudget';
import { useToast } from '../contexts/ToastContext';

interface QuickAddButtonsProps {
  onTransactionFormOpen: (type?: 'income' | 'expense', template?: any) => void;
}

export const QuickAddButtons: React.FC<QuickAddButtonsProps> = ({ onTransactionFormOpen }) => {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const { getPopularTemplates, useTemplate, generateTemplatesFromTransactions } = useQuickAction();
  const { addTransaction, accounts } = useBudget();
  const { showToast } = useToast();

  const popularTemplates = getPopularTemplates(6);

  const handleQuickAdd = async (template: any) => {
    setIsLoading(template.id);
    
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

      // Add haptic feedback if available
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    } catch (error) {
      console.error('Error adding quick transaction:', error);
      showToast('Gagal menambahkan transaksi', 'error');
    } finally {
      setIsLoading(null);
    }
  };

  const handleEdit = (template: any) => {
    onTransactionFormOpen(template.type, template);
  };

  const handleGenerateTemplates = () => {
    generateTemplatesFromTransactions();
    showToast('Template otomatis telah diperbarui!', 'success');
  };

  if (popularTemplates.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-purple-500" />
            Quick Add
          </h3>
          <button
            onClick={handleGenerateTemplates}
            className="text-sm text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 transition-colors"
          >
            Generate Auto
          </button>
        </div>
        
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Zap className="w-8 h-8 text-gray-400" />
          </div>
          <h4 className="text-gray-900 dark:text-white font-medium mb-2">Belum ada template quick add</h4>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 max-w-sm mx-auto">
            Template akan muncul otomatis berdasarkan transaksi yang sering Anda lakukan, atau klik "Generate Auto" untuk membuat sekarang.
          </p>
          <button
            onClick={() => onTransactionFormOpen()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Tambah Transaksi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Zap className="w-5 h-5 text-purple-500" />
          Quick Add
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
            {popularTemplates.length} template
          </span>
          <button
            onClick={handleGenerateTemplates}
            className="text-sm text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 transition-colors"
            title="Generate template otomatis dari transaksi"
          >
            <TrendingUp className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {popularTemplates.map((template) => (
          <div
            key={template.id}
            className="group relative bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-200 cursor-pointer"
          >
            {/* Quick Add Button */}
            <div
              onClick={() => handleQuickAdd(template)}
              className="w-full"
            >
              <div className="flex items-center justify-center mb-3">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white shadow-md transition-transform group-hover:scale-110"
                  style={{ backgroundColor: template.color }}
                >
                  {template.icon === 'Coffee' && <span className="text-lg">☕</span>}
                  {template.icon === 'Car' && <span className="text-lg">🚗</span>}
                  {template.icon === 'Briefcase' && <span className="text-lg">💼</span>}
                  {template.icon === 'Tag' && <span className="text-lg">🏷️</span>}
                  {!['Coffee', 'Car', 'Briefcase', 'Tag'].includes(template.icon) && (
                    <Edit className="w-6 h-6" />
                  )}
                </div>
              </div>

              <div className="text-center">
                <h4 className="font-medium text-gray-900 dark:text-white text-sm mb-1 truncate">
                  {template.name}
                </h4>
                {template.amount && (
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                    Rp {template.amount.toLocaleString('id-ID')}
                  </p>
                )}
                
                {/* Usage stats */}
                <div className="flex items-center justify-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                  {template.frequency > 0 && (
                    <>
                      <Star className="w-3 h-3" />
                      <span>{template.frequency}x</span>
                    </>
                  )}
                  {template.frequency > 0 && (
                    <span className="mx-1">•</span>
                  )}
                  <Clock className="w-3 h-3" />
                  <span>
                    {new Date(template.lastUsed).toLocaleDateString('id-ID', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>
              </div>

              {/* Loading state */}
              {isLoading === template.id && (
                <div className="absolute inset-0 bg-white dark:bg-gray-800 bg-opacity-90 rounded-lg flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>

            {/* Edit button (appears on hover) */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleEdit(template);
              }}
              className="absolute top-2 right-2 w-6 h-6 bg-white dark:bg-gray-800 rounded-full shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              title="Edit template"
            >
              <Edit className="w-3 h-3 text-gray-600 dark:text-gray-300" />
            </button>

            {/* Type indicator */}
            <div
              className={`absolute bottom-2 left-2 w-2 h-2 rounded-full ${
                template.type === 'income' ? 'bg-green-500' : 'bg-red-500'
              }`}
              title={template.type === 'income' ? 'Pemasukan' : 'Pengeluaran'}
            />
          </div>
        ))}

        {/* Add New Template Button */}
        <div
          onClick={() => onTransactionFormOpen()}
          className="group bg-gray-50 dark:bg-gray-700 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-200 cursor-pointer"
        >
          <div className="flex flex-col items-center justify-center h-full">
            <div className="w-12 h-12 bg-gray-200 dark:bg-gray-600 group-hover:bg-purple-200 dark:group-hover:bg-purple-700 rounded-full flex items-center justify-center mb-3 transition-colors">
              <Plus className="w-6 h-6 text-gray-500 group-hover:text-purple-600 dark:text-gray-400 dark:group-hover:text-purple-300" />
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-300 font-medium">
              Tambah Baru
            </span>
          </div>
        </div>
      </div>

      {popularTemplates.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            💡 Tip: Tap untuk tambah langsung, hover dan klik ikon pensil untuk edit template
          </p>
        </div>
      )}
    </div>
  );
}; 