import React, { useState } from 'react';
import { Plus, Minus, Calendar, Tag, FileText, Wallet, DollarSign, HelpCircle } from 'lucide-react';
import { useBudget } from '../hooks/useBudget';
import { useToast } from '../contexts/ToastContext';
import { Transaction } from '../types';
import { formatCurrency, formatNumberWithDots, parseFormattedNumber, getTodayDateString } from '../utils/dateUtils';

interface TransactionFormProps {
  onNavigate?: (tab: string) => void;
  initialTemplate?: {
    type: 'income' | 'expense';
    amount?: number;
    category: string;
    description: string;
    accountId?: string;
  };
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onNavigate, initialTemplate }) => {
  const { addTransaction, categories, incomeCategories, accounts } = useBudget();
  const { showToast } = useToast();
  
  // Initialize form data with template if provided
  const getInitialFormData = () => {
    if (initialTemplate) {
      return {
        type: initialTemplate.type,
        amount: initialTemplate.amount ? initialTemplate.amount.toString() : '',
        category: initialTemplate.category,
        description: initialTemplate.description,
        date: new Date().toISOString().split('T')[0],
        accountId: initialTemplate.accountId || '',
      };
    }
    return {
      type: 'expense' as 'income' | 'expense',
      amount: '',
      category: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      accountId: '',
    };
  };

  const [formData, setFormData] = useState(getInitialFormData());
  const [displayAmount, setDisplayAmount] = useState(
    initialTemplate?.amount ? formatNumberWithDots(initialTemplate.amount.toString()) : ''
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.amount || !formData.category || !formData.description || !formData.accountId) {
      showToast('Mohon lengkapi semua field yang diperlukan', 'error');
      return;
    }

    const amount = parseFloat(parseFormattedNumber(formData.amount));
    if (amount <= 0 || isNaN(amount)) {
      showToast('Jumlah harus lebih besar dari nol', 'error');
      return;
    }

    // Check if account has sufficient balance for expenses
    if (formData.type === 'expense') {
      const selectedAccount = accounts.find(acc => acc.id === formData.accountId);
      if (selectedAccount && selectedAccount.balance < amount) {
        showToast('Saldo akun tidak mencukupi untuk pengeluaran ini', 'error');
        return;
      }
    }

    setIsSubmitting(true);
    
    try {
      const transaction: Omit<Transaction, 'id' | 'createdAt'> = {
        type: formData.type,
        amount,
        category: formData.category,
        description: formData.description,
        date: formData.date,
        accountId: formData.accountId,
      };

      // DEBUG: Log transaksi yang akan ditambahkan
      console.log('=== DEBUG TAMBAH TRANSAKSI ===');
      console.log('Tanggal hari ini (sistem):', getTodayDateString());
      console.log('Transaksi yang akan ditambahkan:', transaction);
      console.log('Apakah transaksi ini hari ini?', transaction.date === getTodayDateString());
      console.log('=============================');

      await addTransaction(transaction);
      
      // Reset form
      setFormData({
        type: 'expense',
        amount: '',
        category: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        accountId: '',
      });
      setDisplayAmount('');
      
      showToast(
        `${formData.type === 'income' ? 'Pemasukan' : 'Pengeluaran'} berhasil ditambahkan!`, 
        'success'
      );
    } catch {
      showToast('Gagal menambahkan transaksi. Silakan coba lagi.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const availableCategories = formData.type === 'income' ? incomeCategories : categories;
  const selectedAccount = accounts.find(acc => acc.id === formData.accountId);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="glass-effect rounded-3xl p-8 sm:p-10 border border-white/20 slide-in">
        <div className="mb-10 text-center sm:text-left">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4 justify-center sm:justify-start">
              <div className="p-4 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-2xl shadow-lg">
                <Plus className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-4xl sm:text-3xl font-bold text-slate-800 tracking-tight">Tambah Transaksi</h2>
                <p className="text-slate-600 text-lg sm:text-base font-medium">Catat pemasukan atau pengeluaran Anda</p>
              </div>
            </div>
            {onNavigate && (
              <button
                type="button"
                onClick={() => onNavigate('help')}
                className="p-3 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 group"
                title="Buka Panduan Cara Tambah Transaksi"
              >
                <HelpCircle className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-200" />
              </button>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Transaction Type */}
          <div className="fade-in" style={{ animationDelay: '100ms' }}>
            <label className="block text-lg font-bold text-slate-700 mb-6">
              Jenis Transaksi
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'expense', category: '', accountId: '' })}
                className={`flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-3 py-4 sm:py-6 px-3 sm:px-6 rounded-3xl border-2 transition-all duration-300 button-press focus-ring ${
                  formData.type === 'expense'
                    ? 'border-red-300 bg-gradient-to-br from-red-50 to-red-100 text-red-700 shadow-lg shadow-red-500/20'
                    : 'border-slate-200 bg-white/60 text-slate-600 hover:border-slate-300 hover:bg-white/80'
                }`}
              >
                <div className={`p-2 sm:p-3 rounded-2xl ${
                  formData.type === 'expense' 
                    ? 'bg-red-500 text-white shadow-lg' 
                    : 'bg-slate-100 text-slate-500'
                }`}>
                  <Minus className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <span className="font-bold text-sm sm:text-base text-center">Pengeluaran</span>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'income', category: '', accountId: '' })}
                className={`flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-3 py-4 sm:py-6 px-3 sm:px-6 rounded-3xl border-2 transition-all duration-300 button-press focus-ring ${
                  formData.type === 'income'
                    ? 'border-emerald-300 bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-700 shadow-lg shadow-emerald-500/20'
                    : 'border-slate-200 bg-white/60 text-slate-600 hover:border-slate-300 hover:bg-white/80'
                }`}
              >
                <div className={`p-2 sm:p-3 rounded-2xl ${
                  formData.type === 'income' 
                    ? 'bg-emerald-500 text-white shadow-lg' 
                    : 'bg-slate-100 text-slate-500'
                }`}>
                  <Plus className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <span className="font-bold text-sm sm:text-base text-center">Pemasukan</span>
              </button>
            </div>
          </div>

          {/* Account Selection */}
          <div className="fade-in" style={{ animationDelay: '200ms' }}>
            <label htmlFor="account" className="block text-lg font-bold text-slate-700 mb-4">
              Pilih Akun
            </label>
            <div className="relative">
              <div className="absolute left-6 top-1/2 transform -translate-y-1/2 p-2 bg-slate-100 rounded-xl z-10">
                <Wallet className="text-slate-600 w-6 h-6" />
              </div>
              <select
                id="account"
                value={formData.accountId}
                onChange={(e) => setFormData({ ...formData, accountId: e.target.value })}
                className="w-full pl-20 pr-6 py-6 border-2 border-slate-200 rounded-3xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 text-m font-semibold bg-white/60 backdrop-blur-sm input-focus transition-all duration-200 appearance-none"
                required
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: 'right 1.5rem center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '1.5em 1.5em'
                }}
              >
                <option value="">Pilih akun</option>
                {accounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.name} - {formatCurrency(account.balance)}
                  </option>
                ))}
              </select>
              
              {/* Color indicator for selected account */}
              {selectedAccount && (
                <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
                  <div 
                    className="w-6 h-6 rounded-full border-2 border-white shadow-lg"
                    style={{ backgroundColor: selectedAccount.color }}
                  />
                </div>
              )}
            </div>
            {selectedAccount && (
              <p className="mt-3 text-slate-600 font-medium">
                Saldo tersedia: <span className="font-bold text-emerald-600">{formatCurrency(selectedAccount.balance)}</span>
              </p>
            )}
          </div>

          {/* Amount */}
          <div className="fade-in" style={{ animationDelay: '300ms' }}>
            <label htmlFor="amount" className="block text-lg font-bold text-slate-700 mb-4">
              Jumlah
            </label>
            <div className="relative">
              <div className="absolute left-6 top-1/2 transform -translate-y-1/2 p-2 bg-slate-100 rounded-xl z-10">
                <DollarSign className="text-slate-600 w-6 h-6" />
              </div>
              <input
                type="text"
                id="amount"
                value={displayAmount}
                onChange={(e) => {
                  const formatted = formatNumberWithDots(e.target.value);
                  setDisplayAmount(formatted);
                  setFormData({ ...formData, amount: formatted });
                }}
                className="w-full pl-20 pr-6 py-6 border-2 border-slate-200 rounded-3xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 text-2xl font-bold bg-white/60 backdrop-blur-sm input-focus transition-all duration-200"
                placeholder="Contoh: 50.000"
                inputMode="numeric"
                required
              />
              <div className="absolute right-6 top-1/2 transform -translate-y-1/2 text-slate-500 font-bold text-lg">
                IDR
              </div>
            </div>
          </div>

          {/* Category */}
          <div className="fade-in" style={{ animationDelay: '400ms' }}>
            <label htmlFor="category" className="block text-lg font-bold text-slate-700 mb-4">
              Kategori
            </label>
            <div className="relative">
              <div className="absolute left-6 top-1/2 transform -translate-y-1/2 p-2 bg-slate-100 rounded-xl z-10">
                <Tag className="text-slate-600 w-6 h-6" />
              </div>
              
              {/* Custom Dropdown */}
              <div className="relative">
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full pl-20 pr-6 py-6 border-2 border-slate-200 rounded-3xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 text-m font-semibold bg-white/60 backdrop-blur-sm input-focus transition-all duration-200 appearance-none"
                  required
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: 'right 1.5rem center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '1.5em 1.5em'
                  }}
                >
                  <option value="">Pilih kategori</option>
                  {availableCategories.map((category) => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
                
                {/* Color indicator for selected category */}
                {formData.category && (
                  <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
                    <div 
                      className="w-6 h-6 rounded-full border-2 border-white shadow-lg"
                      style={{ 
                        backgroundColor: availableCategories.find(cat => cat.name === formData.category)?.color || '#6B7280'
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
            
            {/* Category preview with colors */}
            {availableCategories.length > 0 && (
              <div className="mt-4 p-4 bg-white/40 rounded-2xl border border-white/30">
                <p className="text-sm font-semibold text-slate-600 mb-3">Kategori Tersedia:</p>
                <div className="flex flex-wrap gap-2">
                  {availableCategories.slice(0, 8).map((category) => (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, category: category.name })}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-xl border-2 transition-all duration-200 button-press ${
                        formData.category === category.name
                          ? 'border-emerald-300 bg-emerald-50 text-emerald-700 shadow-md'
                          : 'border-slate-200 bg-white/60 text-slate-600 hover:border-slate-300 hover:bg-white/80'
                      }`}
                    >
                      <div 
                        className="w-4 h-4 rounded-full shadow-sm"
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="text-sm font-medium">{category.name}</span>
                    </button>
                  ))}
                  {availableCategories.length > 8 && (
                    <div className="flex items-center px-3 py-2 text-sm text-slate-500">
                      +{availableCategories.length - 8} lainnya
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="fade-in" style={{ animationDelay: '500ms' }}>
            <label htmlFor="description" className="block text-lg font-bold text-slate-700 mb-4">
              Deskripsi
            </label>
            <div className="relative">
              <div className="absolute left-6 top-6 p-2 bg-slate-100 rounded-xl z-10">
                <FileText className="text-slate-600 w-6 h-6" />
              </div>
              <input
                type="text"
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full pl-20 pr-6 py-6 border-2 border-slate-200 rounded-3xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 text-m font-semibold bg-white/60 backdrop-blur-sm input-focus transition-all duration-200"
                placeholder="Masukkan deskripsi..."
                required
              />
            </div>
          </div>

          {/* Date */}
          <div className="fade-in" style={{ animationDelay: '600ms' }}>
            <label htmlFor="date" className="block text-lg font-bold text-slate-700 mb-4">
              Tanggal
            </label>
            <div className="relative">
              <div className="w-full flex items-center border-2 border-slate-200 rounded-3xl bg-white/60 backdrop-blur-sm input-focus transition-all duration-200 focus-within:ring-1 focus-within:ring-emerald-500/20 focus-within:border-emerald-500">
                <div className="absolute left-6 top-1/2 transform -translate-y-1/2 p-2 bg-slate-100 rounded-xl z-10">
                  <Calendar className="text-slate-600 w-6 h-6" />
                </div>
                <input
                  type="date"
                  id="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full pl-20 pr-6 py-6 border-none outline-none bg-transparent text-m font-semibold"
                  required
                  style={{
                    // Ensures the text is centered if you want to mimic the image
                    textAlign: 'center',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="fade-in" style={{ animationDelay: '700ms' }}>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-6 px-8 rounded-3xl font-bold text-2xl transition-all duration-300 button-press focus-ring shadow-xl disabled:opacity-50 disabled:cursor-not-allowed ${
                formData.type === 'income'
                  ? 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-emerald-500/30'
                  : 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white shadow-red-500/30'
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center space-x-3">
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Menambahkan...</span>
                </div>
              ) : (
                `Tambah ${formData.type === 'income' ? 'Pemasukan' : 'Pengeluaran'}`
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionForm;