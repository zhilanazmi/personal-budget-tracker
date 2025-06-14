import React, { useState } from 'react';
import { Calendar, TrendingUp, PieChart } from 'lucide-react';
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
          <div key={category} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">{category}</span>
              <div className="text-right">
                <span className="text-sm font-semibold text-gray-900">
                  {formatCurrency(amount)}
                </span>
                <span className="text-xs text-gray-500 ml-2">
                  {percentage.toFixed(1)}%
                </span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all duration-300"
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Reports</h2>
          <p className="text-gray-600">Analyze your spending patterns and trends</p>
        </div>
      </div>

      {/* Period Selection */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex flex-wrap gap-2">
            {(['today', 'week', 'month', 'year'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  selectedPeriod === period
                    ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                    : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
                }`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
            <button
              onClick={() => setSelectedPeriod('custom')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                selectedPeriod === 'custom'
                  ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                  : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              Custom Range
            </button>
          </div>

          {selectedPeriod === 'custom' && (
            <div className="flex items-center space-x-4">
              <input
                type="date"
                value={customRange.from}
                onChange={(e) => setCustomRange({ ...customRange, from: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
              <span className="text-gray-500">to</span>
              <input
                type="date"
                value={customRange.to}
                onChange={(e) => setCustomRange({ ...customRange, to: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-emerald-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Total Income</p>
            <p className="text-2xl font-bold text-emerald-600">{formatCurrency(reportData.totalIncome)}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-red-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-red-600 transform rotate-180" />
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Total Expenses</p>
            <p className="text-2xl font-bold text-red-600">{formatCurrency(reportData.totalExpenses)}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg ${
              reportData.balance >= 0 ? 'bg-emerald-100' : 'bg-red-100'
            }`}>
              <Calendar className={`w-6 h-6 ${
                reportData.balance >= 0 ? 'text-emerald-600' : 'text-red-600'
              }`} />
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Net Balance</p>
            <p className={`text-2xl font-bold ${
              reportData.balance >= 0 ? 'text-emerald-600' : 'text-red-600'
            }`}>
              {formatCurrency(reportData.balance)}
            </p>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <PieChart className="w-6 h-6 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Expense Breakdown - {getPeriodLabel()}
          </h3>
        </div>

        {reportData.totalExpenses === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <PieChart className="w-8 h-8 text-gray-400" />
            </div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">No expenses found</h4>
            <p className="text-gray-500">No expense data available for the selected period</p>
          </div>
        ) : (
          <CategoryChart />
        )}
      </div>
    </div>
  );
};

export default Reports;