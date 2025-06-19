import React, { useState } from 'react';
import { ArrowRightLeft, ArrowRight, Calendar, FileText, DollarSign, Wallet } from 'lucide-react';
import { useBudget } from '../hooks/useBudget';
import { useToast } from '../contexts/ToastContext';
import { formatCurrency, formatNumberWithDots, parseFormattedNumber } from '../utils/dateUtils';

const TransferForm: React.FC = () => {
  const { accounts, addTransaction } = useBudget();
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    fromAccountId: '',
    toAccountId: '',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });

  const [displayAmount, setDisplayAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fromAccountId || !formData.toAccountId || !formData.amount || !formData.description) {
      showToast('Mohon lengkapi semua field yang diperlukan', 'error');
      return;
    }

    if (formData.fromAccountId === formData.toAccountId) {
      showToast('Akun asal dan tujuan tidak boleh sama', 'error');
      return;
    }

    const amount = parseFloat(parseFormattedNumber(formData.amount));
    if (amount <= 0 || isNaN(amount)) {
      showToast('Jumlah transfer harus lebih besar dari nol', 'error');
      return;
    }

    // Check if source account has sufficient balance
    const sourceAccount = accounts.find(acc => acc.id === formData.fromAccountId);
    if (sourceAccount && sourceAccount.balance < amount) {
      showToast('Saldo tidak mencukupi untuk transfer ini', 'error');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await addTransaction({
        type: 'transfer',
        amount,
        category: 'Transfer',
        description: formData.description,
        date: formData.date,
        accountId: formData.fromAccountId,
        transferToAccountId: formData.toAccountId,
      });
      
      // Reset form
      setFormData({
        fromAccountId: '',
        toAccountId: '',
        amount: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
      });
      setDisplayAmount('');

      
      showToast('Transfer berhasil dilakukan!', 'success');
    } catch {
      showToast('Gagal melakukan transfer. Silakan coba lagi.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fromAccount = accounts.find(acc => acc.id === formData.fromAccountId);
  const toAccount = accounts.find(acc => acc.id === formData.toAccountId);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="glass-effect rounded-3xl p-8 sm:p-10 border border-white/20 slide-in">
        <div className="mb-10 text-center sm:text-left">
          <div className="flex items-center space-x-4 justify-center sm:justify-start mb-6">
            <div className="p-4 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-lg">
              <ArrowRightLeft className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-4xl sm:text-3xl font-bold text-slate-800 tracking-tight">Transfer Antar Akun</h2>
              <p className="text-slate-600 text-lg sm:text-base font-medium">Pindahkan dana antar akun Anda</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* From Account */}
          <div className="fade-in" style={{ animationDelay: '100ms' }}>
            <label className="block text-lg font-bold text-slate-700 mb-4">
              Dari Akun
            </label>
            <div className="relative">
              <div className="absolute left-6 top-1/2 transform -translate-y-1/2 p-2 bg-slate-100 rounded-xl z-10">
                <Wallet className="text-slate-600 w-6 h-6" />
              </div>
              <select
                value={formData.fromAccountId}
                onChange={(e) => setFormData({ ...formData, fromAccountId: e.target.value })}
                className="w-full pl-20 pr-6 py-6 border-2 border-slate-200 rounded-3xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 text-xl font-semibold bg-white/60 backdrop-blur-sm input-focus transition-all duration-200 appearance-none"
                required
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: 'right 1.5rem center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '1.5em 1.5em'
                }}
              >
                <option value="">Pilih akun sumber</option>
                {accounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.name} - {formatCurrency(account.balance)}
                  </option>
                ))}
              </select>
              
              {/* Color indicator for selected from account */}
              {fromAccount && (
                <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
                  <div 
                    className="w-6 h-6 rounded-full border-2 border-white shadow-lg"
                    style={{ backgroundColor: fromAccount.color }}
                  />
                </div>
              )}
            </div>
            {fromAccount && (
              <p className="mt-3 text-slate-600 font-medium">
                Saldo tersedia: <span className="font-bold text-emerald-600">{formatCurrency(fromAccount.balance)}</span>
              </p>
            )}
          </div>

          {/* Transfer Arrow */}
          <div className="flex justify-center fade-in" style={{ animationDelay: '200ms' }}>
            <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full shadow-lg">
              <ArrowRight className="w-8 h-8 text-white" />
            </div>
          </div>

          {/* To Account */}
          <div className="fade-in" style={{ animationDelay: '300ms' }}>
            <label className="block text-lg font-bold text-slate-700 mb-4">
              Ke Akun
            </label>
            <div className="relative">
              <div className="absolute left-6 top-1/2 transform -translate-y-1/2 p-2 bg-slate-100 rounded-xl z-10">
                <Wallet className="text-slate-600 w-6 h-6" />
              </div>
              <select
                value={formData.toAccountId}
                onChange={(e) => setFormData({ ...formData, toAccountId: e.target.value })}
                className="w-full pl-20 pr-6 py-6 border-2 border-slate-200 rounded-3xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 text-xl font-semibold bg-white/60 backdrop-blur-sm input-focus transition-all duration-200 appearance-none"
                required
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: 'right 1.5rem center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '1.5em 1.5em'
                }}
              >
                <option value="">Pilih akun tujuan</option>
                {accounts
                  .filter(account => account.id !== formData.fromAccountId)
                  .map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.name} - {formatCurrency(account.balance)}
                    </option>
                  ))}
              </select>
              
              {/* Color indicator for selected to account */}
              {toAccount && (
                <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
                  <div 
                    className="w-6 h-6 rounded-full border-2 border-white shadow-lg"
                    style={{ backgroundColor: toAccount.color }}
                  />
                </div>
              )}
            </div>
            {toAccount && (
              <p className="mt-3 text-slate-600 font-medium">
                Saldo saat ini: <span className="font-bold text-blue-600">{formatCurrency(toAccount.balance)}</span>
              </p>
            )}
          </div>

          {/* Amount */}
          <div className="fade-in" style={{ animationDelay: '400ms' }}>
            <label className="block text-lg font-bold text-slate-700 mb-4">
              Jumlah Transfer
            </label>
            <div className="relative">
              <div className="absolute left-6 top-1/2 transform -translate-y-1/2 p-2 bg-slate-100 rounded-xl z-10">
                <DollarSign className="text-slate-600 w-6 h-6" />
              </div>
              <input
                type="text"
                value={displayAmount}
                onChange={(e) => {
                  const formatted = formatNumberWithDots(e.target.value);
                  setDisplayAmount(formatted);
                  setFormData({ ...formData, amount: formatted });
                }}
                className="w-full pl-20 pr-6 py-6 border-2 border-slate-200 rounded-3xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 text-2xl font-bold bg-white/60 backdrop-blur-sm input-focus transition-all duration-200"
                placeholder="Contoh: 100.000"
                inputMode="numeric"
                required
              />
              <div className="absolute right-6 top-1/2 transform -translate-y-1/2 text-slate-500 font-bold text-lg">
                IDR
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="fade-in" style={{ animationDelay: '500ms' }}>
            <label className="block text-lg font-bold text-slate-700 mb-4">
              Keterangan
            </label>
            <div className="relative">
              <div className="absolute left-6 top-6 p-2 bg-slate-100 rounded-xl z-10">
                <FileText className="text-slate-600 w-6 h-6" />
              </div>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full pl-20 pr-6 py-6 border-2 border-slate-200 rounded-3xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 text-xl font-semibold bg-white/60 backdrop-blur-sm input-focus transition-all duration-200"
                placeholder="Contoh: Tarik tunai, Top up e-wallet"
                required
              />
            </div>
          </div>

          {/* Date */}
          <div className="fade-in" style={{ animationDelay: '600ms' }}>
            <label className="block text-lg font-bold text-slate-700 mb-4">
              Tanggal
            </label>
            <div className="relative">
              <div className="absolute left-6 top-1/2 transform -translate-y-1/2 p-2 bg-slate-100 rounded-xl z-10">
                <Calendar className="text-slate-600 w-6 h-6" />
              </div>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full pl-20 pr-6 py-6 border-2 border-slate-200 rounded-3xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 text-xl font-semibold bg-white/60 backdrop-blur-sm input-focus transition-all duration-200"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="fade-in" style={{ animationDelay: '700ms' }}>
            <button
              type="submit"
              disabled={isSubmitting || !formData.fromAccountId || !formData.toAccountId}
              className="w-full py-6 px-8 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white rounded-3xl font-bold text-2xl transition-all duration-300 button-press focus-ring shadow-xl shadow-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center space-x-3">
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Memproses Transfer...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-3">
                  <ArrowRightLeft className="w-6 h-6" />
                  <span>Transfer Dana</span>
                </div>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransferForm;