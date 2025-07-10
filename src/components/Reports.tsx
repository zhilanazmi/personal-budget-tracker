import React, { useState } from 'react';
import { Calendar, TrendingUp, PieChart, ChevronDown, BarChart3, X, Eye, MapPin, CreditCard, Clock, LineChart, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart as RechartsLineChart, Line } from 'recharts';
import { useBudget } from '../hooks/useBudget';
import { formatCurrency, getDateRange, formatDate } from '../utils/dateUtils';
import { DateRange } from '../types';

const Reports: React.FC = () => {
  const { getReportData, getSpendingTrends, categories, loading, accounts } = useBudget();
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month' | 'year' | 'custom'>('month');
  const [customRange, setCustomRange] = useState<DateRange>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0],
  });
  const [showCustomRange, setShowCustomRange] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showCategoryDetail, setShowCategoryDetail] = useState(false);
  const [showTrendsView, setShowTrendsView] = useState(false);

  // Handle ESC key to close modal
  React.useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showCategoryDetail) {
        setShowCategoryDetail(false);
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [showCategoryDetail]);

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
  const spendingTrends = getSpendingTrends(6); // Get 6 months of trends

  // Get transactions for selected category
  const getCategoryTransactions = (categoryName: string) => {
    return reportData.transactions.filter(t => 
      t.type === 'expense' && t.category === categoryName
    );
  };

  // Get account name by ID
  const getAccountName = (accountId?: string) => {
    if (!accountId) return 'Akun Tidak Diketahui';
    const account = accounts.find(acc => acc.id === accountId);
    return account ? account.name : 'Akun Tidak Diketahui';
  };

  // Handle category click
  const handleCategoryClick = (categoryName: string) => {
    setSelectedCategory(categoryName);
    setShowCategoryDetail(true);
  };

  // Prepare data for charts
  const pieChartData = Object.entries(reportData.categoryBreakdown)
    .map(([category, amount]) => ({
      name: category,
      value: amount,
      color: categories.find(c => c.name === category)?.color || '#6B7280',
    }))
    .sort((a, b) => b.value - a.value);

  const barChartData = pieChartData.slice(0, 8); // Top 8 categories for better visibility

  const COLORS = pieChartData.map(item => item.color);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-xl shadow-lg border border-slate-200">
          <p className="font-semibold text-slate-800">{label || payload[0].payload.name}</p>
          <p className="text-emerald-600 font-bold">
            {formatCurrency(payload[0].value)}
          </p>
          {reportData.totalExpenses > 0 && (
            <p className="text-slate-500 text-sm">
              {((payload[0].value / reportData.totalExpenses) * 100).toFixed(1)}% dari total
            </p>
          )}
          <p className="text-slate-400 text-xs mt-2">👆 Klik untuk melihat detail</p>
        </div>
      );
    }
    return null;
  };

  // Handle chart click
  const handleChartClick = (data: any) => {
    if (data && data.name) {
      handleCategoryClick(data.name);
    }
  };

  const CategoryChart = () => {
    const total = reportData.totalExpenses;
    if (total === 0) return null;

    return (
      <div className="space-y-8">
        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pie Chart */}
          <div className="glass-effect rounded-3xl p-6 border border-white/20">
            <h4 className="text-xl font-bold text-slate-800 mb-6 text-center">Distribusi Pengeluaran</h4>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    onClick={handleChartClick}
                    style={{ cursor: 'pointer' }}
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="glass-effect rounded-3xl p-6 border border-white/20">
            <h4 className="text-xl font-bold text-slate-800 mb-6 text-center">Top Kategori Pengeluaran</h4>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => formatCurrency(value).replace('Rp', 'Rp ')}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="value" 
                    radius={[4, 4, 0, 0]}
                    onClick={handleChartClick}
                    style={{ cursor: 'pointer' }}
                  >
                    {barChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Detailed List */}
        <div className="space-y-4">
          <h4 className="text-xl font-bold text-slate-800 mb-4">Rincian Detail</h4>
          {pieChartData.map(({ name, value, color }, index) => (
            <div 
              key={name} 
              className="space-y-4 fade-in cursor-pointer hover:bg-white/30 rounded-2xl p-4 transition-all duration-300 group"
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => handleCategoryClick(name)}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <div 
                    className="w-6 h-6 rounded-full shadow-sm"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-lg font-bold text-slate-700 group-hover:text-slate-800">{name}</span>
                  <Eye className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-slate-800">
                    {formatCurrency(value)}
                  </span>
                  <span className="text-lg text-slate-500 ml-3 block sm:inline">
                    {((value / total) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-4 overflow-hidden">
                <div
                  className="h-4 rounded-full transition-all duration-1000 ease-out shadow-sm"
                  style={{
                    width: `${(value / total) * 100}%`,
                    backgroundColor: color,
                    animationDelay: `${index * 100 + 500}ms`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const SpendingTrendsView = () => {
    const lineChartData = spendingTrends.trends.map(trend => ({
      month: trend.monthShort,
      fullMonth: trend.month,
      income: trend.income,
      expenses: trend.expenses,
      balance: trend.balance,
    }));

    const getInsightIcon = (type: string) => {
      switch (type) {
        case 'warning': return AlertTriangle;
        case 'success': return CheckCircle;
        case 'info': return Info;
        default: return Info;
      }
    };

    const getInsightColor = (type: string) => {
      switch (type) {
        case 'warning': return 'text-orange-600 bg-orange-50 border-orange-200';
        case 'success': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
        case 'info': return 'text-blue-600 bg-blue-50 border-blue-200';
        default: return 'text-slate-600 bg-slate-50 border-slate-200';
      }
    };

    const TrendTooltip = ({ active, payload, label }: any) => {
      if (active && payload && payload.length) {
        return (
          <div className="bg-white p-4 rounded-xl shadow-lg border border-slate-200">
            <p className="font-semibold text-slate-800 mb-2">{
              spendingTrends.trends.find(t => t.monthShort === label)?.month || label
            }</p>
            {payload.map((item: any, index: number) => (
              <div key={index} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-slate-600 capitalize">{item.dataKey}:</span>
                <span className="font-bold" style={{ color: item.color }}>
                  {formatCurrency(item.value)}
                </span>
              </div>
            ))}
          </div>
        );
      }
      return null;
    };

    return (
      <div className="space-y-8">
        {/* Trends Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-4 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-lg">
              <LineChart className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-slate-800">Tren Pengeluaran 6 Bulan</h3>
          </div>
          <button
            onClick={() => setShowTrendsView(false)}
            className="px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-2xl font-semibold transition-colors duration-200 button-press focus-ring"
          >
            Kembali ke Laporan
          </button>
        </div>

        {/* Smart Insights */}
        {spendingTrends.insights.length > 0 && (
          <div className="glass-effect rounded-3xl p-8 border border-white/20">
            <h4 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
              <Info className="w-6 h-6 mr-3 text-blue-600" />
              Wawasan Cerdas
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {spendingTrends.insights.map((insight, index) => {
                const IconComponent = getInsightIcon(insight.type);
                return (
                  <div 
                    key={index}
                    className={`p-4 rounded-2xl border-2 ${getInsightColor(insight.type)} fade-in`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-start space-x-3">
                      <IconComponent className="w-5 h-5 mt-0.5 flex-shrink-0" />
                      <p className="font-semibold text-sm leading-relaxed">
                        {insight.message}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Line Chart */}
        <div className="glass-effect rounded-3xl p-8 border border-white/20">
          <h4 className="text-xl font-bold text-slate-800 mb-6 text-center">
            Grafik Tren Pemasukan vs Pengeluaran
          </h4>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLineChart data={lineChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 12 }}
                  stroke="#64748b"
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => formatCurrency(value).replace('Rp', 'Rp ')}
                  stroke="#64748b"
                />
                <Tooltip content={<TrendTooltip />} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="income" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  name="Pemasukan"
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, fill: '#10b981' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="expenses" 
                  stroke="#ef4444" 
                  strokeWidth={3}
                  name="Pengeluaran"
                  dot={{ fill: '#ef4444', strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, fill: '#ef4444' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="balance" 
                  stroke="#8b5cf6" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Saldo Bersih"
                  dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                />
              </RechartsLineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Summary Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-effect rounded-3xl p-6 border border-white/20 fade-in">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl shadow-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-600 mb-2 uppercase tracking-wide">
                Rata-rata Pemasukan
              </p>
              <p className="text-2xl font-bold text-emerald-600">
                {formatCurrency(spendingTrends.summary.avgMonthlyIncome)}
              </p>
            </div>
          </div>

          <div className="glass-effect rounded-3xl p-6 border border-white/20 fade-in" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl shadow-lg">
                <TrendingUp className="w-6 h-6 text-white transform rotate-180" />
              </div>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-600 mb-2 uppercase tracking-wide">
                Rata-rata Pengeluaran
              </p>
              <p className="text-2xl font-bold text-red-600">
                {formatCurrency(spendingTrends.summary.avgMonthlyExpenses)}
              </p>
            </div>
          </div>

          <div className="glass-effect rounded-3xl p-6 border border-white/20 fade-in" style={{ animationDelay: '200ms' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl shadow-lg">
                <Calendar className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-600 mb-2 uppercase tracking-wide">
                Pengeluaran Tertinggi
              </p>
              <p className="text-lg font-bold text-orange-600">
                {spendingTrends.summary.highestExpenseMonth.monthShort}
              </p>
              <p className="text-sm text-slate-500">
                {formatCurrency(spendingTrends.summary.highestExpenseMonth.expenses)}
              </p>
            </div>
          </div>

          <div className="glass-effect rounded-3xl p-6 border border-white/20 fade-in" style={{ animationDelay: '300ms' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                <Calendar className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-600 mb-2 uppercase tracking-wide">
                Pengeluaran Terendah
              </p>
              <p className="text-lg font-bold text-blue-600">
                {spendingTrends.summary.lowestExpenseMonth.monthShort}
              </p>
              <p className="text-sm text-slate-500">
                {formatCurrency(spendingTrends.summary.lowestExpenseMonth.expenses)}
              </p>
            </div>
          </div>
        </div>

        {/* Monthly Breakdown Table */}
        <div className="glass-effect rounded-3xl p-8 border border-white/20">
          <h4 className="text-xl font-bold text-slate-800 mb-6">Rincian Bulanan</h4>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-4 px-4 font-bold text-slate-700">Bulan</th>
                  <th className="text-right py-4 px-4 font-bold text-slate-700">Pemasukan</th>
                  <th className="text-right py-4 px-4 font-bold text-slate-700">Pengeluaran</th>
                  <th className="text-right py-4 px-4 font-bold text-slate-700">Saldo</th>
                  <th className="text-center py-4 px-4 font-bold text-slate-700">Transaksi</th>
                </tr>
              </thead>
              <tbody>
                {spendingTrends.trends.map((trend, index) => (
                  <tr 
                    key={trend.month} 
                    className="border-b border-slate-100 hover:bg-slate-50 transition-colors duration-200 fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <td className="py-4 px-4 font-semibold text-slate-800">{trend.month}</td>
                    <td className="py-4 px-4 text-right font-bold text-emerald-600">
                      {formatCurrency(trend.income)}
                    </td>
                    <td className="py-4 px-4 text-right font-bold text-red-600">
                      {formatCurrency(trend.expenses)}
                    </td>
                    <td className={`py-4 px-4 text-right font-bold ${
                      trend.balance >= 0 ? 'text-emerald-600' : 'text-red-600'
                    }`}>
                      {formatCurrency(trend.balance)}
                    </td>
                    <td className="py-4 px-4 text-center text-slate-600 font-medium">
                      {trend.transactionCount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
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

  // Show trends view if selected
  if (showTrendsView) {
    return (
      <div className="space-y-8">
        <SpendingTrendsView />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center sm:text-left fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4 justify-center sm:justify-start">
            <div className="p-4 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl shadow-lg">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-4xl sm:text-3xl font-bold text-slate-800 tracking-tight">Laporan</h2>
              <p className="text-slate-600 text-lg sm:text-base font-medium">Analisis pola pengeluaran dan tren keuangan</p>
            </div>
          </div>
          <button
            onClick={() => setShowTrendsView(true)}
            className="flex items-center space-x-3 px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-2xl hover:from-purple-600 hover:to-pink-700 transition-all duration-300 font-bold shadow-lg shadow-purple-500/30 button-press focus-ring"
          >
            <LineChart className="w-5 h-5" />
            <span>Lihat Tren</span>
          </button>
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

      {/* Category Detail Modal */}
      {showCategoryDetail && selectedCategory && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowCategoryDetail(false)}
        >
          <div 
            className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <div className="flex items-center space-x-4">
                <div 
                  className="w-8 h-8 rounded-full shadow-sm"
                  style={{ 
                    backgroundColor: pieChartData.find(item => item.name === selectedCategory)?.color || '#6B7280'
                  }}
                />
                <div>
                  <h3 className="text-2xl font-bold text-slate-800">{selectedCategory}</h3>
                  <p className="text-slate-600">
                    {getCategoryTransactions(selectedCategory).length} transaksi • {formatCurrency(
                      getCategoryTransactions(selectedCategory).reduce((sum, t) => sum + t.amount, 0)
                    )}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCategoryDetail(false)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors focus-ring"
              >
                <X className="w-6 h-6 text-slate-600" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              <div className="space-y-4">
                {getCategoryTransactions(selectedCategory).length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <PieChart className="w-8 h-8 text-slate-400" />
                    </div>
                    <p className="text-slate-500 text-lg">Tidak ada transaksi ditemukan</p>
                  </div>
                ) : (
                  getCategoryTransactions(selectedCategory)
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((transaction, index) => (
                      <div 
                        key={transaction.id}
                        className="glass-effect rounded-2xl p-6 border border-white/20 hover:bg-white/60 transition-all duration-300"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                          <div className="flex-1">
                            <div className="flex items-start space-x-4">
                              <div className="flex-shrink-0">
                                <div className="p-3 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl shadow-lg">
                                  <TrendingUp className="w-5 h-5 text-white transform rotate-180" />
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-lg font-bold text-slate-800 truncate">
                                  {transaction.description || 'Tidak ada deskripsi'}
                                </h4>
                                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-2 sm:space-y-0 mt-2">
                                  <div className="flex items-center space-x-2 text-slate-600">
                                    <Clock className="w-4 h-4" />
                                    <span className="font-medium">
                                      {formatDate(transaction.date)}
                                    </span>
                                  </div>
                                  <div className="flex items-center space-x-2 text-slate-600">
                                    <CreditCard className="w-4 h-4" />
                                    <span className="font-medium">
                                      {getAccountName(transaction.accountId)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex-shrink-0 text-right">
                            <span className="text-2xl font-bold text-red-600">
                              -{formatCurrency(transaction.amount)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end p-6 border-t border-slate-200">
              <button
                onClick={() => setShowCategoryDetail(false)}
                className="px-6 py-3 bg-gradient-to-r from-slate-500 to-slate-600 text-white font-bold rounded-2xl hover:from-slate-600 hover:to-slate-700 transition-all duration-300 focus-ring"
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

export default Reports;