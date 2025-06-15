import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, CreditCard, ArrowRight, BarChart3, Sparkles, Wallet, Plus, Minus, ArrowRightLeft } from 'lucide-react';
import { formatCurrency, getDateRange } from '../utils/dateUtils';
import { useBudget } from '../hooks/useBudget';

const Dashboard: React.FC = () => {
  const { getReportData, accounts, loading } = useBudget();
  
  if (loading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-40 bg-slate-200 rounded-3xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  const todayData = getReportData(getDateRange('today'));
  const monthData = getReportData(getDateRange('month'));
  const yearData = getReportData(getDateRange('year'));

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);

  const StatCard = ({ 
    title, 
    amount, 
    icon: Icon, 
    trend, 
    color = 'blue',
    delay = 0
  }: {
    title: string;
    amount: number;
    icon: any;
    trend?: string;
    color?: string;
    delay?: number;
  }) => {
    const colorClasses = {
      blue: 'from-blue-500 to-blue-600 shadow-blue-500/25',
      green: 'from-emerald-500 to-emerald-600 shadow-emerald-500/25',
      red: 'from-red-500 to-red-600 shadow-red-500/25',
      purple: 'from-purple-500 to-purple-600 shadow-purple-500/25',
    };

    const bgClasses = {
      blue: 'bg-blue-50 border-blue-100',
      green: 'bg-emerald-50 border-emerald-100',
      red: 'bg-red-50 border-red-100',
      purple: 'bg-purple-50 border-purple-100',
    };

    return (
      <div 
        className="glass-effect rounded-3xl p-6 card-hover fade-in border border-white/20"
        style={{ animationDelay: `${delay}ms` }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className={`p-4 rounded-2xl ${bgClasses[color as keyof typeof bgClasses]} relative overflow-hidden`}>
            <Icon className="w-7 h-7 text-slate-700 relative z-10" />
            <div className="absolute inset-0 bg-gradient-to-br opacity-10 from-white to-transparent" />
          </div>
          {trend && (
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 pulse-ring" />
              <span className="text-sm font-semibold text-slate-600 bg-white/60 px-3 py-1.5 rounded-full border border-white/40">
                {trend}
              </span>
            </div>
          )}
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-600 mb-3 uppercase tracking-wide">{title}</p>
          <p className="text-3xl sm:text-4xl font-bold text-slate-800 tracking-tight">
            {formatCurrency(amount)}
          </p>
        </div>
      </div>
    );
  };

  const topCategories = Object.entries(monthData.categoryBreakdown)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'income':
        return <Plus className="w-5 h-5" />;
      case 'expense':
        return <Minus className="w-5 h-5" />;
      case 'transfer':
        return <ArrowRightLeft className="w-5 h-5" />;
      default:
        return <Minus className="w-5 h-5" />;
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
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center sm:text-left fade-in">
        <div className="flex items-center space-x-3 justify-center sm:justify-start mb-4">
          <div className="p-3 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-2xl shadow-lg">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-4xl sm:text-3xl font-bold text-slate-800 tracking-tight">Dashboard</h2>
            <p className="text-slate-600 text-lg sm:text-base font-medium">Ringkasan keuangan Anda</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Saldo"
          amount={totalBalance}
          icon={Wallet}
          color={totalBalance >= 0 ? 'green' : 'red'}
          delay={0}
        />
        <StatCard
          title="Pemasukan Bulan Ini"
          amount={monthData.totalIncome}
          icon={TrendingUp}
          color="green"
          trend="+2.1%"
          delay={100}
        />
        <StatCard
          title="Pengeluaran Bulan Ini"
          amount={monthData.totalExpenses}
          icon={TrendingDown}
          color="red"
          trend="-5.4%"
          delay={200}
        />
        <StatCard
          title="Pengeluaran Hari Ini"
          amount={todayData.totalExpenses}
          icon={CreditCard}
          color="purple"
          delay={300}
        />
      </div>

      {/* Accounts Overview */}
      <div className="glass-effect rounded-3xl p-8 border border-white/20 fade-in" style={{ animationDelay: '400ms' }}>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800">Saldo Akun</h3>
          </div>
          <button className="p-2 hover:bg-white/50 rounded-xl transition-colors duration-200 focus-ring">
            <ArrowRight className="w-5 h-5 text-slate-500" />
          </button>
        </div>
        
        {accounts.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <Wallet className="w-10 h-10 text-slate-400" />
            </div>
            <h4 className="text-xl font-semibold text-slate-700 mb-2">Belum ada akun</h4>
            <p className="text-slate-500 text-lg">Tambahkan akun pertama Anda</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {accounts.slice(0, 6).map((account, index) => (
              <div 
                key={account.id} 
                className="flex items-center justify-between p-4 hover:bg-white/40 rounded-2xl transition-all duration-200 border border-transparent hover:border-white/40"
                style={{ animationDelay: `${500 + index * 50}ms` }}
              >
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
                    style={{ backgroundColor: account.color }}
                  >
                    <Wallet className="w-5 h-5 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-800 truncate">{account.name}</p>
                    <p className="text-sm text-slate-500 capitalize">{account.type.replace('_', ' ')}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`font-bold text-lg ${
                    account.balance >= 0 ? 'text-emerald-600' : 'text-red-600'
                  }`}>
                    {formatCurrency(account.balance)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Transactions */}
        <div className="glass-effect rounded-3xl p-8 border border-white/20 fade-in" style={{ animationDelay: '500ms' }}>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800">Aktivitas Terbaru</h3>
            </div>
            <button className="p-2 hover:bg-white/50 rounded-xl transition-colors duration-200 focus-ring">
              <ArrowRight className="w-5 h-5 text-slate-500" />
            </button>
          </div>
          
          {monthData.transactions.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                <CreditCard className="w-10 h-10 text-slate-400" />
              </div>
              <h4 className="text-xl font-semibold text-slate-700 mb-2">Belum ada transaksi</h4>
              <p className="text-slate-500 text-lg">Tambahkan transaksi pertama Anda</p>
            </div>
          ) : (
            <div className="space-y-4">
              {monthData.transactions.slice(0, 5).map((transaction, index) => (
                <div 
                  key={transaction.id} 
                  className="flex items-center justify-between p-4 hover:bg-white/40 rounded-2xl transition-all duration-200 border border-transparent hover:border-white/40"
                  style={{ animationDelay: `${600 + index * 50}ms` }}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm text-white ${getTransactionColor(transaction.type)}`}>
                      {getTransactionIcon(transaction.type)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-slate-800 truncate text-lg">{transaction.description}</p>
                      <p className="text-slate-500 font-medium">{transaction.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`font-bold text-xl ${getAmountColor(transaction.type)}`}>
                      {getAmountPrefix(transaction.type)}{formatCurrency(transaction.amount)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Spending Categories */}
        <div className="glass-effect rounded-3xl p-8 border border-white/20 fade-in" style={{ animationDelay: '600ms' }}>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-lg">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800">Kategori Teratas</h3>
            </div>
            <button className="p-2 hover:bg-white/50 rounded-xl transition-colors duration-200 focus-ring">
              <ArrowRight className="w-5 h-5 text-slate-500" />
            </button>
          </div>
          
          {topCategories.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                <BarChart3 className="w-10 h-10 text-slate-400" />
              </div>
              <h4 className="text-xl font-semibold text-slate-700 mb-2">Belum ada data pengeluaran</h4>
              <p className="text-slate-500 text-lg">Mulai catat pengeluaran untuk melihat insight</p>
            </div>
          ) : (
            <div className="space-y-5">
              {topCategories.map(([category, amount], index) => (
                <div 
                  key={category} 
                  className="flex items-center justify-between p-4 hover:bg-white/40 rounded-2xl transition-all duration-200"
                  style={{ animationDelay: `${700 + index * 50}ms` }}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-sm">
                      {index + 1}
                    </div>
                    <span className="font-semibold text-slate-800 text-lg">{category}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-800 text-xl">{formatCurrency(amount)}</p>
                    <p className="text-sm text-slate-500 font-medium">
                      {((amount / monthData.totalExpenses) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;