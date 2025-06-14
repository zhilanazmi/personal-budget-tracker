import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, CreditCard } from 'lucide-react';
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
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-lg ${colorClasses[color as keyof typeof colorClasses]}`}>
            <Icon className="w-6 h-6" />
          </div>
          {trend && (
            <span className="text-sm text-gray-500 font-medium">{trend}</span>
          )}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(amount)}</p>
        </div>
      </div>
    );
  };

  const topCategories = Object.entries(monthData.categoryBreakdown)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-gray-600">Welcome back! Here's your financial overview.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

      {/* Quick Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h3>
          <div className="space-y-3">
            {monthData.transactions.slice(0, 5).map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    transaction.type === 'income' ? 'bg-emerald-400' : 'bg-red-400'
                  }`}></div>
                  <div>
                    <p className="font-medium text-gray-900">{transaction.description}</p>
                    <p className="text-sm text-gray-500">{transaction.category}</p>
                  </div>
                </div>
                <span className={`font-semibold ${
                  transaction.type === 'income' ? 'text-emerald-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Spending Categories */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Spending Categories</h3>
          <div className="space-y-4">
            {topCategories.map(([category, amount], index) => (
              <div key={category} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
                    {index + 1}
                  </span>
                  <span className="font-medium text-gray-900">{category}</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{formatCurrency(amount)}</p>
                  <p className="text-sm text-gray-500">
                    {((amount / monthData.totalExpenses) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;