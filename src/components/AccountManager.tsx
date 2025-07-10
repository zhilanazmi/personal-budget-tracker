import React, { useState } from 'react';
import { Plus, Wallet, Building2, Smartphone, CreditCard, PiggyBank, TrendingUp, MoreHorizontal, Edit3, Trash2, Eye, X, Calendar, ArrowUpRight, ArrowDownRight, ArrowRightLeft } from 'lucide-react';
import { useBudget } from '../hooks/useBudget';
import { useToast } from '../contexts/ToastContext';
import { Account, Transaction } from '../types';
import { formatCurrency, formatDate } from '../utils/dateUtils';

const AccountManager: React.FC = () => {
  const { accounts, addAccount, updateAccount, deleteAccount, loading, transactions } = useBudget();
  const { showToast } = useToast();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [selectedAccountDetails, setSelectedAccountDetails] = useState<Account | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'other' as Account['type'],
    color: '#3B82F6',
    icon: 'Wallet',
  });

  const accountTypes = [
    { value: 'bank', label: 'Bank', icon: Building2 },
    { value: 'cash', label: 'Tunai', icon: Wallet },
    { value: 'digital_wallet', label: 'Dompet Digital', icon: Smartphone },
    { value: 'credit_card', label: 'Kartu Kredit', icon: CreditCard },
    { value: 'savings', label: 'Tabungan', icon: PiggyBank },
    { value: 'investment', label: 'Investasi', icon: TrendingUp },
    { value: 'other', label: 'Lainnya', icon: MoreHorizontal },
  ];

  const accountIcons = [
    'Wallet', 'Building2', 'Smartphone', 'CreditCard', 'PiggyBank', 
    'TrendingUp', 'Banknote', 'Landmark', 'Phone', 'MoreHorizontal'
  ];

  const predefinedColors = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
    '#EC4899', '#F97316', '#06B6D4', '#84CC16', '#6B7280'
  ];

  const getIconComponent = (iconName: string) => {
    const icons: { [key: string]: any } = {
      Wallet, Building2, Smartphone, CreditCard, PiggyBank, 
      TrendingUp, MoreHorizontal
    };
    return icons[iconName] || Wallet;
  };

  // Get transactions for a specific account
  const getAccountTransactions = (accountId: string): Transaction[] => {
    return transactions
      .filter(t => t.accountId === accountId || t.transferToAccountId === accountId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10); // Show last 10 transactions
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      showToast('Nama akun tidak boleh kosong', 'error');
      return;
    }

    try {
      if (editingAccount) {
        await updateAccount(editingAccount.id, {
          name: formData.name.trim(),
          type: formData.type,
          color: formData.color,
          icon: formData.icon,
          isActive: true,
        });
        showToast('Akun berhasil diperbarui!', 'success');
        setEditingAccount(null);
      } else {
        await addAccount({
          name: formData.name.trim(),
          type: formData.type,
          color: formData.color,
          icon: formData.icon,
          isActive: true,
        });
        showToast('Akun berhasil ditambahkan!', 'success');
      }
      
      resetForm();
    } catch (error) {
      showToast('Gagal menyimpan akun. Silakan coba lagi.', 'error');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'other',
      color: '#3B82F6',
      icon: 'Wallet',
    });
    setShowAddForm(false);
    setEditingAccount(null);
  };

  const startEdit = (account: Account) => {
    setFormData({
      name: account.name,
      type: account.type,
      color: account.color,
      icon: account.icon,
    });
    setEditingAccount(account);
    setShowAddForm(true);
  };

  const handleDelete = async (account: Account) => {
    const confirmMessage = `Apakah Anda yakin ingin menghapus akun "${account.name}"?\n\nPerhatian: Akun tidak dapat dihapus jika:\n- Memiliki transaksi\n- Memiliki saldo yang tidak nol`;
    
    if (window.confirm(confirmMessage)) {
      try {
        await deleteAccount(account.id);
        showToast(`Akun "${account.name}" berhasil dihapus!`, 'success');
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Gagal menghapus akun';
        showToast(errorMessage, 'error');
      }
    }
  };

  const getTransactionIcon = (transaction: Transaction, accountId: string) => {
    if (transaction.type === 'transfer') {
      if (transaction.accountId === accountId) {
        return <ArrowUpRight className="w-4 h-4" />; // Outgoing transfer
      } else {
        return <ArrowDownRight className="w-4 h-4" />; // Incoming transfer
      }
    } else if (transaction.type === 'income') {
      return <ArrowDownRight className="w-4 h-4" />;
    } else {
      return <ArrowUpRight className="w-4 h-4" />;
    }
  };

  const getTransactionColor = (transaction: Transaction, accountId: string) => {
    if (transaction.type === 'transfer') {
      if (transaction.accountId === accountId) {
        return 'text-orange-600'; // Outgoing transfer
      } else {
        return 'text-blue-600'; // Incoming transfer
      }
    } else if (transaction.type === 'income') {
      return 'text-emerald-600';
    } else {
      return 'text-red-600';
    }
  };

  const getTransactionAmount = (transaction: Transaction, accountId: string) => {
    if (transaction.type === 'transfer') {
      if (transaction.accountId === accountId) {
        return -transaction.amount; // Outgoing transfer (negative)
      } else {
        return transaction.amount; // Incoming transfer (positive)
      }
    } else if (transaction.type === 'income') {
      return transaction.amount;
    } else {
      return -transaction.amount;
    }
  };

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-40 bg-slate-200 rounded-3xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center sm:text-left fade-in">
        <div className="flex items-center space-x-4 justify-center sm:justify-start mb-4">
          <div className="p-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg">
            <Wallet className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-4xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">Kelola Akun</h2>
            <p className="text-slate-600 dark:text-slate-300 text-lg sm:text-base font-medium">Atur dompet dan rekening Anda</p>
          </div>
        </div>
      </div>

      {/* Total Balance Card */}
      <div className="glass-effect rounded-3xl p-8 border border-white/20 fade-in" style={{ animationDelay: '100ms' }}>
        <div className="text-center">
          <p className="text-lg font-bold text-slate-600 dark:text-slate-300 mb-2 uppercase tracking-wide">Total Saldo</p>
          <p className={`text-5xl font-bold tracking-tight ${
            totalBalance >= 0 ? 'text-emerald-600' : 'text-red-600'
          }`}>
            {formatCurrency(totalBalance)}
          </p>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">{accounts.length} Akun Aktif</p>
        </div>
      </div>

      {/* Add Account Button */}
      <div className="fade-in" style={{ animationDelay: '200ms' }}>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="w-full flex items-center justify-center space-x-4 p-6 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-3xl text-slate-700 dark:text-slate-200 font-bold hover:from-emerald-500/20 hover:to-blue-500/20 transition-all duration-300 button-press focus-ring border-2 border-emerald-200/50 dark:border-emerald-500/30 hover:border-emerald-300/70"
        >
          <div className="p-3 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-2xl shadow-lg">
            <Plus className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl">{editingAccount ? 'Edit Akun' : 'Tambah Akun Baru'}</span>
        </button>
      </div>

      {/* Add/Edit Account Form */}
      {showAddForm && (
        <div className="glass-effect rounded-3xl p-8 border border-white/20 slide-in">
          <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-8">
            {editingAccount ? 'Edit Akun' : 'Tambah Akun Baru'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Account Name */}
            <div>
              <label className="block text-lg font-bold text-slate-700 dark:text-slate-200 mb-4">
                Nama Akun
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-6 py-5 border-2 border-slate-200 dark:border-slate-600 rounded-2xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 text-xl font-semibold bg-white/60 dark:bg-slate-700/60 dark:text-slate-100 backdrop-blur-sm input-focus"
                placeholder="Contoh: Bank BCA, GoPay, Tunai"
                required
              />
            </div>

            {/* Account Type */}
            <div>
              <label className="block text-lg font-bold text-slate-700 dark:text-slate-200 mb-4">
                Jenis Akun
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {accountTypes.map((type) => {
                  const IconComponent = type.icon;
                  return (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, type: type.value as Account['type'] })}
                      className={`flex items-center space-x-3 p-4 rounded-2xl border-2 transition-all duration-200 button-press ${
                        formData.type === type.value
                          ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                          : 'border-slate-200 dark:border-slate-600 bg-white/60 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-500'
                      }`}
                    >
                      <IconComponent className="w-5 h-5" />
                      <span className="font-semibold text-sm">{type.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Color Selection */}
            <div>
              <label className="block text-lg font-bold text-slate-700 dark:text-slate-200 mb-4">
                Warna
              </label>
              <div className="grid grid-cols-5 sm:flex sm:flex-wrap gap-3">
                {predefinedColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormData({ ...formData, color })}
                    className={`w-12 h-12 rounded-2xl border-4 transition-all duration-200 button-press focus-ring ${
                      formData.color === color ? 'border-slate-400 scale-110 shadow-lg' : 'border-slate-200 hover:border-slate-300'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
              <button
                type="submit"
                className="flex-1 py-5 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-2xl hover:from-emerald-600 hover:to-green-700 transition-all duration-300 font-bold text-xl button-press focus-ring shadow-lg shadow-emerald-500/30"
              >
                {editingAccount ? 'Perbarui Akun' : 'Tambah Akun'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-8 py-5 bg-white/60 dark:bg-slate-700/60 text-slate-700 dark:text-slate-200 rounded-2xl hover:bg-white/80 dark:hover:bg-slate-600/80 transition-all duration-300 font-bold border-2 border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500 button-press focus-ring"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Accounts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map((account, index) => {
          const IconComponent = getIconComponent(account.icon);
          const accountTransactions = getAccountTransactions(account.id);
          
          return (
            <div
              key={account.id}
              className="glass-effect rounded-3xl p-6 border border-white/20 transition-all duration-300 group hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2 hover:border-blue-200/50 fade-in relative overflow-hidden"
              style={{ animationDelay: `${300 + index * 100}ms` }}
            >
              {/* Hover Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl" />
              
              {/* Card Content */}
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div 
                    className="p-4 rounded-2xl shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl"
                    style={{ backgroundColor: account.color }}
                  >
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                    <button
                      onClick={() => setSelectedAccountDetails(account)}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all duration-200 button-press focus-ring"
                      title="Lihat detail transaksi"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => startEdit(account)}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all duration-200 button-press focus-ring"
                      title="Edit akun"
                    >
                      <Edit3 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(account)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-200 button-press focus-ring"
                      title="Hapus akun"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2 group-hover:text-blue-800 dark:group-hover:text-blue-300 transition-colors duration-300">{account.name}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 capitalize font-medium">
                    {accountTypes.find(t => t.value === account.type)?.label || account.type}
                  </p>
                  <p className={`text-3xl font-bold tracking-tight transition-all duration-300 group-hover:scale-105 ${
                    account.balance >= 0 ? 'text-emerald-600' : 'text-red-600'
                  }`}>
                    {formatCurrency(account.balance)}
                  </p>
                  
                  {/* Quick Transaction Preview */}
                  <div className="mt-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <div className="text-xs text-slate-500 dark:text-slate-400 mb-2 font-semibold">Transaksi Terbaru:</div>
                    {accountTransactions.length > 0 ? (
                      <div className="space-y-1">
                        {accountTransactions.slice(0, 2).map((transaction) => (
                          <div key={transaction.id} className="flex items-center justify-between text-xs">
                            <span className="text-slate-600 dark:text-slate-300 truncate flex-1 mr-2">{transaction.description}</span>
                            <span className={`font-bold ${getTransactionColor(transaction, account.id)}`}>
                              {getTransactionAmount(transaction, account.id) > 0 ? '+' : ''}
                              {formatCurrency(Math.abs(getTransactionAmount(transaction, account.id)))}
                            </span>
                          </div>
                        ))}
                        {accountTransactions.length > 2 && (
                          <div className="text-xs text-slate-400 dark:text-slate-500 text-center pt-1">
                            +{accountTransactions.length - 2} transaksi lainnya
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-xs text-slate-400 dark:text-slate-500 italic">Belum ada transaksi</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {accounts.length === 0 && (
        <div className="text-center py-16 fade-in" style={{ animationDelay: '400ms' }}>
          <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <Wallet className="w-12 h-12 text-slate-400" />
          </div>
          <h3 className="text-2xl font-bold text-slate-700 dark:text-slate-200 mb-3">Belum ada akun</h3>
          <p className="text-slate-500 dark:text-slate-400 text-lg max-w-md mx-auto">
            Tambahkan akun pertama Anda untuk mulai mengelola keuangan dengan lebih terorganisir
          </p>
        </div>
      )}

      {/* Account Details Modal */}
      {selectedAccountDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-800 dark:to-slate-700">
              <div className="flex items-center space-x-4">
                <div 
                  className="p-3 rounded-2xl shadow-lg"
                  style={{ backgroundColor: selectedAccountDetails.color }}
                >
                  {React.createElement(getIconComponent(selectedAccountDetails.icon), { className: "w-6 h-6 text-white" })}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{selectedAccountDetails.name}</h3>
                  <p className="text-slate-600 dark:text-slate-300 capitalize">
                    {accountTypes.find(t => t.value === selectedAccountDetails.type)?.label || selectedAccountDetails.type}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedAccountDetails(null)}
                className="p-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors duration-200 focus-ring"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Account Balance */}
            <div className="p-6 border-b border-slate-200 dark:border-slate-700 text-center bg-gradient-to-r from-slate-50/50 to-blue-50/50 dark:from-slate-800/50 dark:to-slate-700/50">
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-2 uppercase tracking-wide">Saldo Saat Ini</p>
              <p className={`text-4xl font-bold tracking-tight ${
                selectedAccountDetails.balance >= 0 ? 'text-emerald-600' : 'text-red-600'
              }`}>
                {formatCurrency(selectedAccountDetails.balance)}
              </p>
            </div>

            {/* Transactions List */}
            <div className="p-6">
              <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Riwayat Transaksi (10 Terbaru)
              </h4>
              
              <div className="max-h-96 overflow-y-auto space-y-3">
                {getAccountTransactions(selectedAccountDetails.id).length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h5 className="text-xl font-semibold text-slate-600 dark:text-slate-300 mb-2">Belum ada transaksi</h5>
                    <p className="text-slate-500 dark:text-slate-400">Transaksi akan muncul di sini setelah Anda menambahkannya</p>
                  </div>
                ) : (
                  getAccountTransactions(selectedAccountDetails.id).map((transaction, index) => {
                    const amount = getTransactionAmount(transaction, selectedAccountDetails.id);
                    const isIncoming = amount > 0;
                    
                    return (
                      <div 
                        key={transaction.id} 
                        className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-600/50 transition-colors duration-200"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div className="flex items-center space-x-4 flex-1 min-w-0">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            transaction.type === 'transfer' 
                              ? (transaction.accountId === selectedAccountDetails.id ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600')
                              : isIncoming 
                              ? 'bg-emerald-100 text-emerald-600' 
                              : 'bg-red-100 text-red-600'
                          }`}>
                            {getTransactionIcon(transaction, selectedAccountDetails.id)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h6 className="font-semibold text-slate-800 dark:text-slate-100 truncate">{transaction.description}</h6>
                            <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
                              <span>{transaction.category}</span>
                              <span>•</span>
                              <span>{formatDate(transaction.date)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <span className={`text-lg font-bold ${getTransactionColor(transaction, selectedAccountDetails.id)}`}>
                            {isIncoming ? '+' : ''}{formatCurrency(Math.abs(amount))}
                          </span>
                          {transaction.type === 'transfer' && (
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {transaction.accountId === selectedAccountDetails.id ? 'Keluar' : 'Masuk'}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50">
              <button
                onClick={() => setSelectedAccountDetails(null)}
                className="w-full py-3 bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-2xl hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors duration-200 font-semibold button-press focus-ring"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountManager;