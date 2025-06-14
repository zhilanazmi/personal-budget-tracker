import React, { useState } from 'react';
import { Calendar, TrendingUp, PieChart, ChevronDown } from 'lucide-react';
import { useBudget } from '../hooks/useBudget';
import { formatCurrency, getDateRange, formatDate } from '../utils/dateUtils';
import { DateRange } from '../types';

const Reports: React.FC = () => {
  const { getReportData, categories } = useBudget();
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month' | 'year' | 'custom'>('month');
  const [customRange, setCustomRange] = useState<DateRange>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0],
  });
  const [showCustomRange, setShowCustomRange] = useState(false);

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
      <div className="space-y-4">
        {categoryData.map(({ category, amount, percentage, color }) => (
          <div key={category} className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-base font-medium text-gray-700">{category}</span>
              <div className="text-right">
                <span className="text-lg font-bold text-gray-900">
                  {formatCurrency(amount)}
                </span>
                <span className="text-sm text-gray-500 ml-2 block sm:inline">
                  {percentage.toFixed(1)}%
                </span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="h-3 rounded-full transition-all duration-500"
                style={{
                  width: `${percentage}%`,
                  backgroundColor: color,
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
      case 'today': return 'Today';
      case 'week': return 'This Week';
      case 'month': return 'This Month';
      case 'year': return 'This Year';
      case 'custom': return `${formatDate(customRange.from)} - ${formatDate(customRange.to)}`;
      default: return '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center sm:text-left">
        <h2 className="text-3xl sm:text-2xl font-bold text-gray-900 mb-2">Reports</h2>
        <p className="text-gray-600 text-lg sm:text-base">Analyze your spending patterns and trends</p>
      </div>

      {/* Period Selection */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="space-y-4">
          {/* Quick Period Buttons */}
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-3">
            {(['today', 'week', 'month', 'year'] as const).map((period) => (
              <button
                key={period}
                onClick={() => {
                  setSelectedPeriod(period);
                  setShowCustomRange(false);
                }}
                className={`px-4 py-3 rounded-xl font-semibold transition-all duration-200 active:scale-95 ${
                  selectedPeriod === period
                    ? 'bg-emerald-100 text-emerald-700 border-2 border-emerald-300 shadow-sm'
                    : 'bg-gray-50 text-gray-600 border-2 border-gray-200 hover:bg-gray-100'
                }`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>

          {/* Custom Range Toggle */}
          <button
            onClick={() => {
              setSelectedPeriod('custom');
              setShowCustomRange(!showCustomRange);
            }}
            className={`w-full sm:w-auto flex items-center justify-between px-4 py-3 rounded-xl font-semibold transition-all duration-200 active:scale-95 ${
              selectedPeriod === 'custom'
                ? 'bg-emerald-100 text-emerald-700 border-2 border-emerald-300 shadow-sm'
                : 'bg-gray-50 text-gray-600 border-2 border-gray-200 hover:bg-gray-100'
            }`}
          >
            <span>Custom Range</span>
            <ChevronDown className={`w-5 h-5 ml-2 transition-transform ${showCustomRange ? 'rotate-180' : ''}`} />
          </button>

          {/* Custom Date Range Inputs */}
          {showCustomRange && selectedPeriod === 'custom' && (
            <div className="space-y-3 sm:space-y-0 sm:flex sm:items-center sm:space-x-4 pt-4 border-t border-gray-200">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
                <input
                  type="date"
                  value={customRange.from}
                  onChange={(e) => setCustomRange({ ...customRange, from: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-base"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
                <input
                  type="date"
                  value={customRange.to}
                  onChange={(e) => setCustomRange({ ...customRange, to: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-base"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Summary Cards - Mobile Optimized */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-emerald-100 rounded-xl">
              <TrendingUp className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 mb-2">Total Income</p>
            <p className="text-2xl sm:text-3xl font-bold text-emerald-600">{formatCurrency(reportData.totalIncome)}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-red-100 rounded-xl">
              <TrendingUp className="w-6 h-6 text-red-600 transform rotate-180" />
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 mb-2">Total Expenses</p>
            <p className="text-2xl sm:text-3xl font-bold text-red-600">{formatCurrency(reportData.totalExpenses)}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-xl ${
              reportData.balance >= 0 ? 'bg-emerald-100' : 'bg-red-100'
            }`}>
              <Calendar className={`w-6 h-6 ${
                reportData.balance >= 0 ? 'text-emerald-600' : 'text-red-600'
              }`} />
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 mb-2">Net Balance</p>
            <p className={`text-2xl sm:text-3xl font-bold ${
              reportData.balance >= 0 ? 'text-emerald-600' : 'text-red-600'
            }`}>
              {formatCurrency(reportData.balance)}
            </p>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <PieChart className="w-6 h-6 text-gray-600" />
          <h3 className="text-xl font-semibold text-gray-900">
            Expense Breakdown - {getPeriodLabel()}
          </h3>
        </div>

        {reportData.totalExpenses === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <PieChart className="w-10 h-10 text-gray-400" />
            </div>
            <h4 className="text-xl font-medium text-gray-900 mb-2">No expenses found</h4>
            <p className="text-gray-500 text-lg">No expense data available for the selected period</p>
          </div>
        ) : (
          <CategoryChart />
        )}
      </div>
    </div>
  );
};

export default Reports;