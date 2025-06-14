import React, { useState } from 'react';
import { Calendar, TrendingUp, PieChart, ChevronDown, BarChart3 } from 'lucide-react';
import { useBudget } from '../hooks/useBudget';
import { formatCurrency, getDateRange, formatDate } from '../utils/dateUtils';
import { DateRange } from '../types';

const Reports: React.FC = () => {
  const { getReportData, categories, loading } = useBudget();
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month' | 'year' | 'custom'>('month');
  const [customRange, setCustomRange] = useState<DateRange>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0],
  });
  const [showCustomRange, setShowCustomRange] = useState(false);

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-1/3 mb-4"></div>
          <div className="h-40 bg-slate-200 rounded-3xl mb-6"></div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-slate-200 rounded-3xl"></div>
            ))}
          </div>
          <div className="h-96 bg-slate-200 rounded-3xl"></div>
        </div>
      </div>
    );
  }

  const getDateRangeForPeriod = () => {
    if (selectedPeriod === 'custom') {
      return customRange;
    }
    return getDateRange(selectedPeriod);
  };

  const reportData = getReportData(getDateRangeForPeriod());

  const CategoryChart = () => {
    const total = reportData.totalExpenses;
    if (total === 0) return null;

    const categoryData = Object.entries(reportData.categoryBreakdown)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: (amount / total) * 100,
        color: categories.find(c => c.name === category)?.color || '#6B7280',
      }))
      .sort((a, b) => b.amount - a.amount);

    return (
      <div className="space-y-6">
        {categoryData.map(({ category, amount, percentage, color }, index) => (
          <div 
            key={category} 
            className="space-y-4 fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div 
                  className="w-6 h-6 rounded-full shadow-sm"
                  style={{ backgroundColor: color }}
                />
                <span className="text-lg font-bold text-slate-700">{category}</span>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-slate-800">
                  {formatCurrency(amount)}
                </span>
                <span className="text-lg text-slate-500 ml-3 block sm:inline">
                  {percentage.toFixed(1)}%
                </span>
              </div>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-4 overflow-hidden">
              <div
                className="h-4 rounded-full transition-all duration-1000 ease-out shadow-sm"
                style={{
                  width: `${percentage}%`,
                  backgroundColor: color,
                  animationDelay: `${index * 100 + 500}ms`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    );
  };

  const getPeriodLabel = () => {
    switch (selectedPeriod) {
      case 'today': return 'Hari Ini';
      case 'week': return 'Minggu Ini';
      case 'month': return 'Bulan Ini';
      case 'year': return 'Tahun Ini';
      case 'custom': return `${formatDate(customRange.from)} - ${formatDate(customRange.to)}`;
      default: return '';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center sm:text-left fade-in">
        <div className="flex items-center space-x-4 justify-center sm:justify-start mb-4">
          <div className="p-4 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl shadow-lg">
            <BarChart3 className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-4xl sm:text-3xl font-bold text-slate-800 tracking-tight">Laporan</h2>
            <p className="text-slate-600 text-lg sm:text-base font-medium">Analisis pola pengeluaran dan tren keuangan</p>
          </div>
        </div>
      </div>

      {/* Period Selection */}
      <div className="glass-effect rounded-3xl p-6 sm:p-8 border border-white/20 fade-in" style={{ animationDelay: '100ms' }}>
        <div className="space-y-6">
          {/* Quick Period Buttons */}
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-3 sm:gap-4">
            {(['today', 'week', 'month', 'year'] as const).map((period, index) => {
              const labels = {
                today: 'Hari Ini',
                week: 'Minggu',
                month: 'Bulan',
                year: 'Tahun'
              };
              
              return (
                <button
                  key={period}
                  onClick={() => {
                    setSelectedPeriod(period);
                    setShowCustomRange(false);
                  }}
                  className={`px-6 py-4 rounded-2xl font-bold transition-all duration-300 button-press focus-ring ${
                    selectedPeriod === period
                      ? 'bg-gradient-to-r from-emerald-500 to-blue-600 text-white shadow-lg shadow-emerald-500/30'
                      : 'bg-white/60 text-slate-600 border-2 border-slate-200 hover:bg-white/80 hover:border-slate-300'
                  }`}
                  style={{ animationDelay: `${200 + index * 50}ms` }}
                >
                  {labels[period]}
                </button>
              );
            })}
          </div>

          {/* Custom Range Toggle */}
          <button
            onClick={() => {
              setSelectedPeriod('custom');
              setShowCustomRange(!showCustomRange);
            }}
            className={`w-full sm:w-auto flex items-center justify-between px-6 py-4 rounded-2xl font-bold transition-all duration-300 button-press focus-ring ${
              selectedPeriod === 'custom'
                ? 'bg-gradient-to-r from-emerald-500 to-blue-600 text-white shadow-lg shadow-emerald-500/30'
                : 'bg-white/60 text-slate-600 border-2 border-slate-200 hover:bg-white/80 hover:border-slate-300'
            }`}
          >
            <span>Rentang Kustom</span>
            <ChevronDown className={`w-5 h-5 ml-3 transition-transform duration-200 ${showCustomRange ? 'rotate-180' : ''}`} />
          </button>

          {/* Custom Date Range Inputs */}
          {showCustomRange && selectedPeriod === 'custom' && (
            <div className="space-y-4 sm:space-y-0 sm:flex sm:items-end sm:space-x-6 pt-6 border-t border-white/20 slide-in">
              <div className="flex-1">
                <label className="block text-lg font-bold text-slate-700 mb-3">Dari</label>
                <input
                  type="date"
                  value={customRange.from}
                  onChange={(e) => setCustomRange({ ...customRange, from: e.target.value })}
                  className="w-full px-6 py-4 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 text-lg font-semibold bg-white/60 backdrop-blur-sm input-focus"
                />
              </div>
              <div className="flex-1">
                <label className="block text-lg font-bold text-slate-700 mb-3">Sampai</label>
                <input
                  type="date"
                  value={customRange.to}
                  onChange={(e) => setCustomRange({ ...customRange, to: e.target.value })}
                  className="w-full px-6 py-4 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 text-lg font-semibold bg-white/60 backdrop-blur-sm input-focus"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass-effect rounded-3xl p-8 border border-white/20 fade-in" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center justify-between mb-6">
            <div className="p-4 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl shadow-lg">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
          </div>
          <div>
            <p className="text-lg font-bold text-slate-600 mb-3 uppercase tracking-wide">Total Pemasukan</p>
            <p className="text-4xl font-bold text-emerald-600 tracking-tight">{formatCurrency(reportData.totalIncome)}</p>
          </div>
        </div>

        <div className="glass-effect rounded-3xl p-8 border border-white/20 fade-in" style={{ animationDelay: '300ms' }}>
          <div className="flex items-center justify-between mb-6">
            <div className="p-4 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl shadow-lg">
              <TrendingUp className="w-8 h-8 text-white transform rotate-180" />
            </div>
          </div>
          <div>
            <p className="text-lg font-bold text-slate-600 mb-3 uppercase tracking-wide">Total Pengeluaran</p>
            <p className="text-4xl font-bold text-red-600 tracking-tight">{formatCurrency(reportData.totalExpenses)}</p>
          </div>
        </div>

        <div className="glass-effect rounded-3xl p-8 border border-white/20 fade-in" style={{ animationDelay: '400ms' }}>
          <div className="flex items-center justify-between mb-6">
            <div className={`p-4 rounded-2xl shadow-lg ${
              reportData.balance >= 0 
                ? 'bg-gradient-to-br from-emerald-500 to-green-600' 
                : 'bg-gradient-to-br from-red-500 to-pink-600'
            }`}>
              <Calendar className="w-8 h-8 text-white" />
            </div>
          </div>
          <div>
            <p className="text-lg font-bold text-slate-600 mb-3 uppercase tracking-wide">Saldo Bersih</p>
            <p className={`text-4xl font-bold tracking-tight ${
              reportData.balance >= 0 ? 'text-emerald-600' : 'text-red-600'
            }`}>
              {formatCurrency(reportData.balance)}
            </p>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="glass-effect rounded-3xl p-8 border border-white/20 fade-in" style={{ animationDelay: '500ms' }}>
        <div className="flex items-center space-x-4 mb-8">
          <div className="p-4 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-lg">
            <PieChart className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-3xl font-bold text-slate-800">
            Rincian Pengeluaran - {getPeriodLabel()}
          </h3>
        </div>

        {reportData.totalExpenses === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <PieChart className="w-12 h-12 text-slate-400" />
            </div>
            <h4 className="text-2xl font-bold text-slate-700 mb-3">Tidak ada pengeluaran ditemukan</h4>
            <p className="text-slate-500 text-lg max-w-md mx-auto">Tidak ada data pengeluaran untuk periode yang dipilih</p>
          </div>
        ) : (
          <CategoryChart />
        )}
      </div>
    </div>
  );
};

export default Reports;