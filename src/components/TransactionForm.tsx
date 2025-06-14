import React, { useState } from 'react';
import { Plus, Minus, DollarSign, Calendar, Tag, FileText } from 'lucide-react';
import { useBudget } from '../hooks/useBudget';
import { useToast } from '../contexts/ToastContext';
import { Transaction } from '../types';

const TransactionForm: React.FC = () => {
  const { addTransaction, categories, incomeCategories } = useBudget();
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    type: 'expense' as 'income' | 'expense',
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.amount || !formData.category || !formData.description) {
      showToast('Mohon lengkapi semua field yang diperlukan', 'error');
      return;
    }

    const amount = parseFloat(formData.amount);
    if (amount <= 0) {
      showToast('Jumlah harus lebih besar dari nol', 'error');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const transaction: Omit<Transaction, 'id' | 'createdAt'> = {
        type: formData.type,
        amount,
        category: formData.category,
        description: formData.description,
        date: formData.date,
      };

      await addTransaction(transaction);
      
      // Reset form
      setFormData({
        type: 'expense',
        amount: '',
        category: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
      });
      
      showToast(
        `${formData.type === 'income' ? 'Pemasukan' : 'Pengeluaran'} berhasil ditambahkan!`, 
        'success'
      );
    } catch (error) {
      showToast('Gagal menambahkan transaksi. Silakan coba lagi.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const availableCategories = formData.type === 'income' ? incomeCategories : categories;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="glass-effect rounded-3xl p-8 sm:p-10 border border-white/20 slide-in">
        <div className="mb-10 text-center sm:text-left">
          <div className="flex items-center space-x-4 justify-center sm:justify-start mb-6">
            <div className="p-4 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-2xl shadow-lg">
              <Plus className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-4xl sm:text-3xl font-bold text-slate-800 tracking-tight">Tambah Transaksi</h2>
              <p className="text-slate-600 text-lg sm:text-base font-medium">Catat pemasukan atau pengeluaran Anda</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Transaction Type */}
          <div className="fade-in" style={{ animationDelay: '100ms' }}>
            <label className="block text-lg font-bold text-slate-700 mb-6">
              Jenis Transaksi
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'expense', category: '' })}
                className={`flex items-center justify-center space-x-4 py-6 px-6 rounded-3xl border-2 transition-all duration-300 button-press focus-ring ${
                  formData.type === 'expense'
                    ? 'border-red-300 bg-gradient-to-br from-red-50 to-red-100 text-red-700 shadow-lg shadow-red-500/20'
                    : 'border-slate-200 bg-white/60 text-slate-600 hover:border-slate-300 hover:bg-white/80'
                }`}
              >
                <div className={`p-3 rounded-2xl ${
                  formData.type === 'expense' 
                    ? 'bg-red-500 text-white shadow-lg' 
                    : 'bg-slate-100 text-slate-500'
                }`}>
                  <Minus className="w-6 h-6" />
                </div>
                <span className="font-bold text-xl">Pengeluaran</span>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'income', category: '' })}
                className={`flex items-center justify-center space-x-4 py-6 px-6 rounded-3xl border-2 transition-all duration-300 button-press focus-ring ${
                  formData.type === 'income'
                    ? 'border-emerald-300 bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-700 shadow-lg shadow-emerald-500/20'
                    : 'border-slate-200 bg-white/60 text-slate-600 hover:border-slate-300 hover:bg-white/80'
                }`}
              >
                <div className={`p-3 rounded-2xl ${
                  formData.type === 'income' 
                    ? 'bg-emerald-500 text-white shadow-lg' 
                    : 'bg-slate-100 text-slate-500'
                }`}>
                  <Plus className="w-6 h-6" />
                </div>
                <span className="font-bold text-xl">Pemasukan</span>
              </button>
            </div>
          </div>

          {/* Amount */}
          <div className="fade-in" style={{ animationDelay: '200ms' }}>
            <label htmlFor="amount" className="block text-lg font-bold text-slate-700 mb-4">
              Jumlah
            </label>
            <div className="relative">
              <div className="absolute left-6 top-1/2 transform -translate-y-1/2 p-2 bg-slate-100 rounded-xl">
                <span className="text-slate-600 font-bold text-lg">Rp</span>
              </div>
              <input
                type="number"
                id="amount"
                step="1000"
                min="0"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full pl-20 pr-6 py-6 border-2 border-slate-200 rounded-3xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 text-2xl font-bold bg-white/60 backdrop-blur-sm input-focus transition-all duration-200"
                placeholder="0"
                inputMode="numeric"
                required
              />
            </div>
          </div>

          {/* Category */}
          <div className="fade-in" style={{ animationDelay: '300ms' }}>
            <label htmlFor="category" className="block text-lg font-bold text-slate-700 mb-4">
              Kategori
            </label>
            <div className="relative">
              <div className="absolute left-6 top-1/2 transform -translate-y-1/2 p-2 bg-slate-100 rounded-xl">
                <Tag className="text-slate-600 w-6 h-6" />
              </div>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full pl-20 pr-6 py-6 border-2 border-slate-200 rounded-3xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 text-xl font-semibold bg-white/60 backdrop-blur-sm input-focus transition-all duration-200 appearance-none"
                required
              >
                <option value="">Pilih kategori</option>
                {availableCategories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="fade-in" style={{ animationDelay: '400ms' }}>
            <label htmlFor="description" className="block text-lg font-bold text-slate-700 mb-4">
              Deskripsi
            </label>
            <div className="relative">
              <div className="absolute left-6 top-6 p-2 bg-slate-100 rounded-xl">
                <FileText className="text-slate-600 w-6 h-6" />
              </div>
              <input
                type="text"
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full pl-20 pr-6 py-6 border-2 border-slate-200 rounded-3xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 text-xl font-semibold bg-white/60 backdrop-blur-sm input-focus transition-all duration-200"
                placeholder="Masukkan deskripsi..."
                required
              />
            </div>
          </div>

          {/* Date */}
          <div className="fade-in" style={{ animationDelay: '500ms' }}>
            <label htmlFor="date" className="block text-lg font-bold text-slate-700 mb-4">
              Tanggal
            </label>
            <div className="relative">
              <div className="absolute left-6 top-1/2 transform -translate-y-1/2 p-2 bg-slate-100 rounded-xl">
                <Calendar className="text-slate-600 w-6 h-6" />
              </div>
              <input
                type="date"
                id="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full pl-20 pr-6 py-6 border-2 border-slate-200 rounded-3xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 text-xl font-semibold bg-white/60 backdrop-blur-sm input-focus transition-all duration-200"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="fade-in" style={{ animationDelay: '600ms' }}>
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