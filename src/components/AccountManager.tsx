import React, { useState } from 'react';
import { Plus, Wallet, Building2, Smartphone, CreditCard, PiggyBank, TrendingUp, MoreHorizontal, Edit3, Trash2, Eye, X, Calendar, ArrowUpRight, ArrowDownRight, ArrowRightLeft } from 'lucide-react';
import { useBudget } from '../hooks/useBudget';
import { useToast } from '../contexts/ToastContext';
import { Account, Transaction } from '../types';
import { formatCurrency, formatDate } from '../utils/dateUtils';

const AccountManager: React.FC = () => {
  const { accounts, addAccount, updateAccount, deleteAccount, transactions } = useBudget();
  const { showToast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [selectedAccountDetails, setSelectedAccountDetails] = useState<Account | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'other' as Account['type'],
    balance: '',
    color: '#3B82F6',
    icon: 'Wallet'
  });

  const accountTypes = [
    { value: 'bank', label: 'Bank Account', icon: Building2 },
    { value: 'cash', label: 'Cash', icon: Wallet },
    { value: 'digital_wallet', label: 'Digital Wallet', icon: Smartphone },
    { value: 'credit_card', label: 'Credit Card', icon: CreditCard },
    { value: 'savings', label: 'Savings', icon: PiggyBank },
    { value: 'investment', label: 'Investment', icon: TrendingUp },
    { value: 'other', label: 'Other', icon: MoreHorizontal }
  ];

  const iconOptions = [
    'Wallet', 'Building2', 'Smartphone', 'CreditCard', 'PiggyBank', 'TrendingUp', 'MoreHorizontal'
  ];

  const getIconComponent = (iconName: string) => {
    const icons: { [key: string]: any } = {
      Wallet, Building2, Smartphone, CreditCard, PiggyBank, TrendingUp, MoreHorizontal
    };
    return icons[iconName] || Wallet;
  };

  const getAccountTransactions = (accountId: string) => {
    return transactions
      .filter(t => t.account_id === accountId || t.transfer_to_account_id === accountId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  };

  const getTransactionAmount = (transaction: Transaction, accountId: string) => {
    if (transaction.type === 'transfer') {
      if (transaction.account_id === accountId) {
        return -transaction.amount;
      } else if (transaction.transfer_to_account_id === accountId) {
        return transaction.amount;
      }
    }
    return transaction.type === 'income' ? transaction.amount : -transaction.amount;
  };

  const getTransactionColor = (transaction: Transaction, accountId: string) => {
    const amount = getTransactionAmount(transaction, accountId);
    if (amount > 0) return 'text-green-600 dark:text-green-400';
    return 'text-red-600 dark:text-red-400';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const accountData = {
        name: formData.name,
        type: formData.type,
        balance: parseFloat(formData.balance) || 0,
        color: formData.color,
        icon: formData.icon
      };

      if (editingAccount) {
        await updateAccount(editingAccount.id, accountData);
        showToast('Account updated successfully!', 'success');
      } else {
        await addAccount(accountData);
        showToast('Account created successfully!', 'success');
      }

      resetForm();
    } catch (error) {
      showToast('Failed to save account', 'error');
    }
  };

  const handleEdit = (account: Account) => {
    setEditingAccount(account);
    setFormData({
      name: account.name,
      type: account.type,
      balance: account.balance.toString(),
      color: account.color,
      icon: account.icon
    });
    setShowForm(true);
  };

  const handleDelete = async (accountId: string) => {
    if (window.confirm('Are you sure you want to delete this account?')) {
      try {
        await deleteAccount(accountId);
        showToast('Account deleted successfully!', 'success');
      } catch (error) {
        showToast('Failed to delete account', 'error');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'other',
      balance: '',
      color: '#3B82F6',
      icon: 'Wallet'
    });
    setEditingAccount(null);
    setShowForm(false);
  };

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Account Manager</h1>
          <p className="text-slate-600 dark:text-slate-300 mt-1">
            Manage your financial accounts and track balances
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl button-press focus-ring"
        >
          <Plus className="w-5 h-5" />
          Add Account
        </button>
      </div>

      {/* Summary Card */}
      <div className="glass-effect rounded-3xl p-6 border border-white/20">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Total Balance</h3>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-1">
              {formatCurrency(totalBalance)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-600 dark:text-slate-300">Active Accounts</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {accounts.filter(a => a.is_active).length}
            </p>
          </div>
        </div>
      </div>

      {/* Accounts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map((account, index) => {
          const IconComponent = getIconComponent(account.icon);
          const accountTransactions = getAccountTransactions(account.id);
          
          return (
            <div 
              key={account.id}
              className="glass-effect rounded-3xl p-6 border border-white/20 transition-all duration-300 group hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2 hover:border-blue-200/50 fade-in relative overflow-hidden"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full" style={{ backgroundColor: account.color }}></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full" style={{ backgroundColor: account.color }}></div>
              </div>

              <div className="relative">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg"
                      style={{ backgroundColor: account.color }}
                    >
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white">{account.name}</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-300 capitalize">
                        {account.type.replace('_', ' ')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={() => setSelectedAccountDetails(account)}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-colors duration-200"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEdit(account)}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-colors duration-200"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(account.id)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors duration-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Balance */}
                <div className="mb-4">
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {formatCurrency(account.balance)}
                  </p>
                  <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium mt-2 ${
                    account.is_active 
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400'
                  }`}>
                    {account.is_active ? 'Active' : 'Inactive'}
                  </div>
                </div>

                {/* Recent Transactions */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">Recent Activity</h4>
                  <div className="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-3">
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
                            +{accountTransactions.length - 2} more transactions
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-xs text-slate-400 dark:text-slate-500 italic">No transactions yet</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add/Edit Account Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-md shadow-2xl">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {editingAccount ? 'Edit Account' : 'Add New Account'}
                </h2>
                <button
                  onClick={resetForm}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Account Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white transition-colors duration-200"
                  placeholder="Enter account name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Account Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as Account['type'] })}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white transition-colors duration-200"
                >
                  {accountTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Initial Balance
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.balance}
                  onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white transition-colors duration-200"
                  placeholder="0.00"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Color
                  </label>
                  <input
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-full h-12 border border-slate-300 dark:border-slate-600 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Icon
                  </label>
                  <select
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white transition-colors duration-200"
                  >
                    {iconOptions.map((icon) => (
                      <option key={icon} value={icon}>
                        {icon}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 py-3 px-4 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors duration-200 font-semibold button-press focus-ring"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold button-press focus-ring shadow-lg"
                >
                  {editingAccount ? 'Update' : 'Create'} Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Account Details Modal */}
      {selectedAccountDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg"
                    style={{ backgroundColor: selectedAccountDetails.color }}
                  >
                    {React.createElement(getIconComponent(selectedAccountDetails.icon), { className: "w-6 h-6" })}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                      {selectedAccountDetails.name}
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-300 capitalize">
                      {selectedAccountDetails.type.replace('_', ' ')}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedAccountDetails(null)}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Account Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-4">
                  <p className="text-sm text-slate-600 dark:text-slate-300">Current Balance</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {formatCurrency(selectedAccountDetails.balance)}
                  </p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-4">
                  <p className="text-sm text-slate-600 dark:text-slate-300">Status</p>
                  <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                    selectedAccountDetails.is_active 
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400'
                  }`}>
                    {selectedAccountDetails.is_active ? 'Active' : 'Inactive'}
                  </div>
                </div>
              </div>

              {/* Recent Transactions */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Recent Transactions</h3>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {getAccountTransactions(selectedAccountDetails.id).map((transaction) => {
                    const amount = getTransactionAmount(transaction, selectedAccountDetails.id);
                    const isIncoming = amount > 0;
                    
                    return (
                      <div key={transaction.id} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-2xl">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          transaction.type === 'transfer' 
                            ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                            : isIncoming 
                              ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                              : 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                        }`}>
                          {transaction.type === 'transfer' ? (
                            <ArrowRightLeft className="w-5 h-5" />
                          ) : isIncoming ? (
                            <ArrowDownRight className="w-5 h-5" />
                          ) : (
                            <ArrowUpRight className="w-5 h-5" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-slate-900 dark:text-white">{transaction.description}</p>
                          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                            <Calendar className="w-4 h-4" />
                            {formatDate(transaction.date)}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-bold ${getTransactionColor(transaction, selectedAccountDetails.id)}`}>
                            {amount > 0 ? '+' : ''}
                            {formatCurrency(Math.abs(amount))}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                            {transaction.type}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  {getAccountTransactions(selectedAccountDetails.id).length === 0 && (
                    <div className="text-center py-8 text-slate-400 dark:text-slate-500">
                      <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No transactions found for this account</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50">
              <button
                onClick={() => setSelectedAccountDetails(null)}
                className="w-full py-3 bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-2xl hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors duration-200 font-semibold button-press focus-ring"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountManager;