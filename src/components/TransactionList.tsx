import React, { useState } from 'react';
import { Search, Calendar, Filter, Trash2, ChevronDown, Eye } from 'lucide-react';
import { useBudget } from '../hooks/useBudget';
import { useToast } from '../contexts/ToastContext';
import { formatCurrency, formatDate } from '../utils/dateUtils';

const TransactionList: React.FC = () => {
  const { transactions, deleteTransaction } = useBudget();
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [showFilters, setShowFilters] = useState(false);

  const filteredTransactions = transactions
    .filter(transaction => {
      const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           transaction.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || transaction.type === filterType;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else {
        return b.amount - a.amount;
      }
    });

  const handleDelete = (id: string, description: string) => {
    if (window.confirm(`Are you sure you want to delete "${description}"?`)) {
      deleteTransaction(id);
      showToast('Transaction deleted successfully', 'success');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center sm:text-left fade-in">
        <div className="flex items-center space-x-4 justify-center sm:justify-start mb-4">
          <div className="p-4 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-lg">
            <Eye className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-4xl sm:text-3xl font-bold text-slate-800 tracking-tight">Transactions</h2>
            <p className="text-slate-600 text-lg sm:text-base font-medium">Manage your transaction history</p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="glass-effect rounded-3xl p-6 sm:p-8 border border-white/20 fade-in" style={{ animationDelay: '100ms' }}>
        {/* Search Bar */}
        <div className="relative mb-6">
          <div className="absolute left-6 top-1/2 transform -translate-y-1/2 p-2 bg-slate-100 rounded-xl">
            <Search className="text-slate-600 w-5 h-5" />
          </div>
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-20 pr-6 py-5 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 text-lg font-medium bg-white/60 backdrop-blur-sm input-focus transition-all duration-200"
          />
        </div>

        {/* Filter Toggle Button (Mobile) */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="sm:hidden w-full flex items-center justify-between py-4 px-6 bg-white/40 rounded-2xl text-slate-700 font-semibold border border-white/30 hover:bg-white/60 transition-all duration-200 button-press"
        >
          <div className="flex items-center space-x-3">
            <Filter className="w-5 h-5" />
            <span>Filters & Sort</span>
          </div>
          <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`} />
        </button>

        {/* Filters */}
        <div className={`${showFilters ? 'block' : 'hidden'} sm:block mt-6 sm:mt-0 space-y-4 sm:space-y-0 sm:flex sm:items-center sm:space-x-6`}>
          <div className="relative">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as 'all' | 'income' | 'expense')}
              className="w-full sm:w-auto px-6 py-4 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 text-lg font-semibold bg-white/60 backdrop-blur-sm appearance-none cursor-pointer"
            >
              <option value="all">All Types</option>
              <option value="income">Income Only</option>
              <option value="expense">Expenses Only</option>
            </select>
          </div>

          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'amount')}
              className="w-full sm:w-auto px-6 py-4 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 text-lg font-semibold bg-white/60 backdrop-blur-sm appearance-none cursor-pointer"
            >
              <option value="date">Sort by Date</option>
              <option value="amount">Sort by Amount</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transaction List */}
      <div className="glass-effect rounded-3xl border border-white/20 overflow-hidden fade-in" style={{ animationDelay: '200ms' }}>
        <div className="p-6 sm:p-8 border-b border-white/20 bg-gradient-to-r from-slate-50/50 to-blue-50/50">
          <h3 className="text-2xl font-bold text-slate-800">
            {filteredTransactions.length} Transaction{filteredTransactions.length !== 1 ? 's' : ''}
          </h3>
        </div>

        {filteredTransactions.length === 0 ? (
          <div className="text-center py-16 px-6">
            <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <Calendar className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-700 mb-3">No transactions found</h3>
            <p className="text-slate-500 text-lg max-w-md mx-auto">
              {searchTerm || filterType !== 'all' 
                ? 'Try adjusting your search or filters to find what you\'re looking for'
                : 'Start by adding your first transaction to begin tracking your finances'
              }
            </p>
          </div>
        ) : (
          <div className="divide-y divide-white/20">
            {filteredTransactions.map((transaction, index) => (
              <div 
                key={transaction.id} 
                className="p-6 sm:p-8 hover:bg-white/30 transition-all duration-300 group"
                style={{ animationDelay: `${300 + index * 50}ms` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6 min-w-0 flex-1">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${
                      transaction.type === 'income' 
                        ? 'bg-gradient-to-br from-emerald-400 to-emerald-500' 
                        : 'bg-gradient-to-br from-red-400 to-red-500'
                    }`}>
                      <span className="text-white font-bold text-2xl">
                        {transaction.type === 'income' ? '+' : '-'}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-slate-800 text-xl truncate mb-2">{transaction.description}</h4>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-slate-500">
                        <div className="flex items-center space-x-2 mb-1 sm:mb-0">
                          <div className="w-3 h-3 rounded-full bg-slate-300" />
                          <span className="font-semibold">{transaction.category}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4" />
                          <span className="font-medium">{formatDate(transaction.date)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 ml-6">
                    <div className="text-right">
                      <span className={`text-2xl font-bold ${
                        transaction.type === 'income' ? 'text-emerald-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                      </span>
                    </div>
                    
                    <button
                      onClick={() => handleDelete(transaction.id, transaction.description)}
                      className="p-3 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all duration-200 button-press focus-ring opacity-0 group-hover:opacity-100"
                      title="Delete transaction"
                      aria-label={`Delete ${transaction.description}`}
                    >
                      <Trash2 className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionList;