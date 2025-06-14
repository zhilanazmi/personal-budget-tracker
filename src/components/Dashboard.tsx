import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, CreditCard, ArrowRight, BarChart3 } from 'lucide-react';
import { formatCurrency, getDateRange } from '../utils/dateUtils';
import { useBudget } from '../hooks/useBudget';

const Dashboard: React.FC = () => {
  const { getReportData } = useBudget();
  
  const todayData = getReportData(getDateRange('today'));
  const monthData = getReportData(getDateRange('month'));
  const yearData = getReportData(getDateRange('year'));

  const StatCard = ({ 
    title, 
    amount, 
    icon: Icon, 
    trend, 
    color = 'blue' 
  }: {
    title: string;
    amount: number;
    icon: any;
    trend?: string;
    color?: string;
  }) => {
    const colorClasses = {
      blue: 'bg-blue-50 text-blue-600 border-blue-200',
      green: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      red: 'bg-red-50 text-red-600 border-red-200',
      purple: 'bg-purple-50 text-purple-600 border-purple-200',
    };

    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 active:scale-95">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl ${colorClasses[color as keyof typeof colorClasses]}`}>
            <Icon className="w-6 h-6" />
          </div>
          {trend && (
            <span className="text-sm text-gray-500 font-medium bg-gray-50 px-2 py-1 rounded-lg">{trend}</span>
          )}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900">{formatCurrency(amount)}</p>
        </div>
      </div>
    );
  };

  const topCategories = Object.entries(monthData.categoryBreakdown)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center sm:text-left">
        <h2 className="text-3xl sm:text-2xl font-bold text-gray-900 mb-2">Dashboard</h2>
        <p className="text-gray-600 text-lg sm:text-base">Welcome back! Here's your financial overview.</p>
      </div>

      {/* Stats Grid - Mobile First */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Current Balance"
          amount={yearData.balance}
          icon={DollarSign}
          color={yearData.balance >= 0 ? 'green' : 'red'}
        />
        <StatCard
          title="This Month Income"
          amount={monthData.totalIncome}
          icon={TrendingUp}
          color="green"
          trend="+2.1%"
        />
        <StatCard
          title="This Month Expenses"
          amount={monthData.totalExpenses}
          icon={TrendingDown}
          color="red"
          trend="-5.4%"
        />
        <StatCard
          title="Today's Spending"
          amount={todayData.totalExpenses}
          icon={CreditCard}
          color="purple"
        />
      </div>

      {/* Quick Overview - Stacked on Mobile */}
      <div className="space-y-6 lg:grid lg:grid-cols-2 lg:gap-6 lg:space-y-0">
        {/* Recent Transactions */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Recent Transactions</h3>
            <ArrowRight className="w-5 h-5 text-gray-400" />
          </div>
          
          {monthData.transactions.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500">No transactions yet</p>
              <p className="text-sm text-gray-400 mt-1">Add your first transaction to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {monthData.transactions.slice(0, 5).map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center space-x-4">
                    <div className={`w-3 h-3 rounded-full ${
                      transaction.type === 'income' ? 'bg-emerald-400' : 'bg-red-400'
                    }`}></div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-900 truncate">{transaction.description}</p>
                      <p className="text-sm text-gray-500">{transaction.category}</p>
                    </div>
                  </div>
                  <span className={`font-bold text-lg ${
                    transaction.type === 'income' ? 'text-emerald-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Spending Categories */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Top Categories</h3>
            <ArrowRight className="w-5 h-5 text-gray-400" />
          </div>
          
          {topCategories.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500">No spending data</p>
              <p className="text-sm text-gray-400 mt-1">Start tracking expenses to see insights</p>
            </div>
          ) : (
            <div className="space-y-4">
              {topCategories.map(([category, amount], index) => (
                <div key={category} className="flex items-center justify-between py-2">
                  <div className="flex items-center space-x-4">
                    <span className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-bold text-gray-600">
                      {index + 1}
                    </span>
                    <span className="font-medium text-gray-900">{category}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{formatCurrency(amount)}</p>
                    <p className="text-sm text-gray-500">
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