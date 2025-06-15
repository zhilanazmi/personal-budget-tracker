import React, { useState } from 'react';
import { Search, Calendar, Filter, Trash2, ChevronDown, Eye, Plus, Minus, ArrowRightLeft } from 'lucide-react';
import { useBudget } from '../hooks/useBudget';
import { useToast } from '../contexts/ToastContext';
import { formatCurrency, formatDate } from '../utils/dateUtils';

const TransactionList: React.FC = () => {
  const { transactions, deleteTransaction, loading } = useBudget();
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense' | 'transfer'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [showFilters, setShowFilters] = useState(false);

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-1/3 mb-4"></div>
          <div className="h-20 bg-slate-200 rounded-3xl mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-slate-200 rounded-2xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

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

  const handleDelete = async (id: string, description: string) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus "${description}"?`)) {
      try {
        await deleteTransaction(id);
        showToast('Transaksi berhasil dihapus', 'success');
      } catch (error) {
        showToast('Gagal menghapus transaksi', 'error');
      }
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'income':
        return <Plus className="w-5 h-5 sm:w-6 sm:h-6" />;
      case 'expense':
        return <Minus className="w-5 h-5 sm:w-6 sm:h-6" />;
      case 'transfer':
        return <ArrowRightLeft className="w-5 h-5 sm:w-6 sm:h-6" />;
      default:
        return <Minus className="w-5 h-5 sm:w-6 sm:h-6" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'income':
        return 'bg-gradient-to-br from-emerald-400 to-emerald-500';
      case 'expense':
        return 'bg-gradient-to-br from-red-400 to-red-500';
      case 'transfer':
        return 'bg-gradient-to-br from-purple-400 to-purple-500';
      default:
        return 'bg-gradient-to-br from-slate-400 to-slate-500';
    }
  };

  const getAmountColor = (type: string) => {
    switch (type) {
      case 'income':
        return 'text-emerald-600';
      case 'expense':
        return 'text-red-600';
      case 'transfer':
        return 'text-purple-600';
      default:
        return 'text-slate-600';
    }
  };

  const getAmountPrefix = (type: string) => {
    switch (type) {
      case 'income':
        return '+';
      case 'expense':
        return '-';
      case 'transfer':
        return '';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="text-center sm:text-left fade-in">
        <div className="flex items-center space-x-3 sm:space-x-4 justify-center sm:justify-start mb-4">
          <div className="p-3 sm:p-4 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-lg">
            <Eye className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-4xl lg:text-3xl font-bold text-slate-800 tracking-tight">Riwayat Transaksi</h2>
            <p className="text-base sm:text-lg lg:text-base text-slate-600 font-medium">Kelola riwayat transaksi Anda</p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="glass-effect rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-white/20 fade-in" style={{ animationDelay: '100ms' }}>
        {/* Search Bar */}
        <div className="relative mb-4 sm:mb-6">
          <div className="absolute left-4 sm:left-6 top-1/2 transform -translate-y-1/2 p-1.5 sm:p-2 bg-slate-100 rounded-lg sm:rounded-xl">
            <Search className="text-slate-600 w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <input
            type="text"
            placeholder="Cari transaksi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-14 sm:pl-20 pr-4 sm:pr-6 py-3 sm:py-5 border-2 border-slate-200 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 text-base sm:text-lg font-medium bg-white/60 backdrop-blur-sm input-focus transition-all duration-200"
          />
        </div>

        {/* Filter Toggle Button (Mobile) */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="sm:hidden w-full flex items-center justify-between py-3 px-4 bg-white/40 rounded-xl text-slate-700 font-semibold border border-white/30 hover:bg-white/60 transition-all duration-200 button-press mb-4"
        >
          <div className="flex items-center space-x-3">
            <Filter className="w-4 h-4" />
            <span>Filter & Urutkan</span>
          </div>
          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`} />
        </button>

        {/* Filters */}
        <div className={`${showFilters ? 'block' : 'hidden'} sm:block space-y-3 sm:space-y-0 sm:flex sm:items-center sm:space-x-4 lg:space-x-6`}>
          <div className="relative">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as 'all' | 'income' | 'expense' | 'transfer')}
              className="w-full sm:w-auto px-4 sm:px-6 py-3 sm:py-4 border-2 border-slate-200 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 text-base sm:text-lg font-semibold bg-white/60 backdrop-blur-sm appearance-none cursor-pointer"
            >
              <option value="all">Semua Jenis</option>
              <option value="income">Pemasukan Saja</option>
              <option value="expense">Pengeluaran Saja</option>
              <option value="transfer">Transfer Saja</option>
            </select>
          </div>

          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'amount')}
              className="w-full sm:w-auto px-4 sm:px-6 py-3 sm:py-4 border-2 border-slate-200 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 text-base sm:text-lg font-semibold bg-white/60 backdrop-blur-sm appearance-none cursor-pointer"
            >
              <option value="date">Urutkan berdasarkan Tanggal</option>
              <option value="amount">Urutkan berdasarkan Jumlah</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transaction List */}
      <div className="glass-effect rounded-2xl sm:rounded-3xl border border-white/20 overflow-hidden fade-in" style={{ animationDelay: '200ms' }}>
        <div className="p-4 sm:p-6 lg:p-8 border-b border-white/20 bg-gradient-to-r from-slate-50/50 to-blue-50/50">
          <h3 className="text-lg sm:text-2xl font-bold text-slate-800">
            {filteredTransactions.length} Transaksi
          </h3>
        </div>

        {filteredTransactions.length === 0 ? (
          <div className="text-center py-12 sm:py-16 px-4 sm:px-6">
            <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-inner">
              <Calendar className="w-8 h-8 sm:w-12 sm:h-12 text-slate-400" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-700 mb-2 sm:mb-3">Tidak ada transaksi ditemukan</h3>
            <p className="text-base sm:text-lg text-slate-500 max-w-md mx-auto">
              {searchTerm || filterType !== 'all' 
                ? 'Coba sesuaikan pencarian atau filter Anda'
                : 'Mulai dengan menambahkan transaksi pertama Anda'
              }
            </p>
          </div>
        ) : (
          <div className="divide-y divide-white/20">
            {filteredTransactions.map((transaction, index) => (
              <div 
                key={transaction.id} 
                className="p-4 sm:p-6 lg:p-8 hover:bg-white/30 transition-all duration-300 group"
                style={{ animationDelay: `${300 + index * 50}ms` }}
              >
                {/* Mobile Layout */}
                <div className="sm:hidden">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start space-x-3 min-w-0 flex-1">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg text-white ${getTransactionColor(transaction.type)}`}>
                        {getTransactionIcon(transaction.type)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-slate-800 text-base truncate mb-1">{transaction.description}</h4>
                        <div className="flex items-center space-x-2 text-slate-500 text-sm mb-1">
                          <div className="w-2 h-2 rounded-full bg-slate-300" />
                          <span className="font-semibold truncate">{transaction.category}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-slate-500 text-sm">
                          <Calendar className="w-3 h-3" />
                          <span className="font-medium">{formatDate(transaction.date)}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(transaction.id, transaction.description)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 button-press focus-ring ml-2"
                      title="Hapus transaksi"
                      aria-label={`Hapus ${transaction.description}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-right">
                    <span className={`text-xl font-bold ${getAmountColor(transaction.type)}`}>
                      {getAmountPrefix(transaction.type)}{formatCurrency(transaction.amount)}
                    </span>
                  </div>
                </div>

                {/* Desktop Layout */}
                <div className="hidden sm:flex items-center justify-between">
                  <div className="flex items-center space-x-4 lg:space-x-6 min-w-0 flex-1">
                    <div className={`w-12 h-12 lg:w-16 lg:h-16 rounded-xl lg:rounded-2xl flex items-center justify-center shadow-lg text-white ${getTransactionColor(transaction.type)}`}>
                      {getTransactionIcon(transaction.type)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-slate-800 text-lg lg:text-xl truncate mb-2">{transaction.description}</h4>
                      <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 text-slate-500">
                        <div className="flex items-center space-x-2 mb-1 lg:mb-0">
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
                      <span className={`text-xl lg:text-2xl font-bold ${getAmountColor(transaction.type)}`}>
                        {getAmountPrefix(transaction.type)}{formatCurrency(transaction.amount)}
                      </span>
                    </div>
                    
                    <button
                      onClick={() => handleDelete(transaction.id, transaction.description)}
                      className="p-2 lg:p-3 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl lg:rounded-2xl transition-all duration-200 button-press focus-ring opacity-0 group-hover:opacity-100"
                      title="Hapus transaksi"
                      aria-label={`Hapus ${transaction.description}`}
                    >
                      <Trash2 className="w-5 h-5 lg:w-6 lg:h-6" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="text-center py-6 sm:py-8 fade-in" style={{ animationDelay: '400ms' }}>
        <div className="glass-effect rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-white/20">
          <p className="text-sm sm:text-base text-slate-600 font-medium">
            Copyright 2025 Zhillan Azmi. All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default TransactionList;