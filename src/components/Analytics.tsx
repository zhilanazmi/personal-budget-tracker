import React, { useState } from 'react';
import { TrendingUp, TrendingDown, AlertTriangle, BarChart3, Calendar, DollarSign, Activity, Brain } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { useBudget } from '../hooks/useBudget';
import { formatCurrency, formatDate } from '../utils/dateUtils';
import { FinancialAnalytics, PredictionData, MonthComparison, CashFlowData, AnomalyDetection } from '../utils/analytics';

const Analytics: React.FC = () => {
  const { transactions, accounts, loading } = useBudget();
  const [activeTab, setActiveTab] = useState<'predictions' | 'comparison' | 'cashflow' | 'anomalies'>('predictions');

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-16 bg-slate-200 rounded-2xl"></div>
            ))}
          </div>
          <div className="h-96 bg-slate-200 rounded-3xl"></div>
        </div>
      </div>
    );
  }

  const predictions = FinancialAnalytics.predictExpenses(transactions);
  const monthComparisons = FinancialAnalytics.compareMonths(transactions);
  const cashFlowData = FinancialAnalytics.analyzeCashFlow(transactions, accounts);
  const anomalies = FinancialAnalytics.detectAnomalies(transactions);

  const tabs = [
    { id: 'predictions', label: 'Prediksi', icon: Brain, color: 'from-purple-500 to-indigo-600' },
    { id: 'comparison', label: 'Perbandingan', icon: BarChart3, color: 'from-blue-500 to-cyan-600' },
    { id: 'cashflow', label: 'Arus Kas', icon: Activity, color: 'from-emerald-500 to-teal-600' },
    { id: 'anomalies', label: 'Deteksi Anomali', icon: AlertTriangle, color: 'from-orange-500 to-red-600' },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-xl shadow-lg border border-slate-200">
          <p className="font-semibold text-slate-800">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="font-bold">
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const PredictionsView = () => (
    <div className="space-y-6">
      <div className="glass-effect rounded-3xl p-8 border border-white/20">
        <div className="flex items-center space-x-4 mb-8">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl shadow-lg">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-slate-800">Prediksi Pengeluaran 3 Bulan Ke Depan</h3>
        </div>

        {predictions.length === 0 ? (
          <div className="text-center py-12">
            <Brain className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h4 className="text-xl font-semibold text-slate-600 mb-2">Belum Cukup Data</h4>
            <p className="text-slate-500">Tambahkan lebih banyak transaksi untuk mendapatkan prediksi yang akurat</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Predictions Chart */}
            <div className="h-80 mb-8">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={predictions.slice(0, 8)} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="category" 
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
                  <Bar dataKey="predictedAmount" radius={[4, 4, 0, 0]}>
                    {predictions.slice(0, 8).map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.trend === 'increasing' ? '#ef4444' : entry.trend === 'decreasing' ? '#10b981' : '#3b82f6'} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Predictions List */}
            <div className="space-y-4">
              {predictions.map((prediction, index) => (
                <div key={prediction.category} className="flex items-center justify-between p-6 bg-white/40 rounded-2xl border border-white/30 hover:bg-white/60 transition-all duration-200" style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                      prediction.trend === 'increasing' ? 'bg-red-100 text-red-600' :
                      prediction.trend === 'decreasing' ? 'bg-green-100 text-green-600' :
                      'bg-blue-100 text-blue-600'
                    }`}>
                      {prediction.trend === 'increasing' ? <TrendingUp className="w-6 h-6" /> :
                       prediction.trend === 'decreasing' ? <TrendingDown className="w-6 h-6" /> :
                       <BarChart3 className="w-6 h-6" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-lg">{prediction.category}</h4>
                      <p className="text-slate-500 text-sm">
                        Rata-rata historis: {formatCurrency(prediction.historicalAverage)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-slate-800">{formatCurrency(prediction.predictedAmount)}</p>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                      <span className="text-sm text-slate-500">
                        {Math.round(prediction.confidence * 100)}% akurasi
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const ComparisonView = () => (
    <div className="space-y-6">
      <div className="glass-effect rounded-3xl p-8 border border-white/20">
        <div className="flex items-center space-x-4 mb-8">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl shadow-lg">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-slate-800">Perbandingan Bulan ke Bulan</h3>
        </div>

        {monthComparisons.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h4 className="text-xl font-semibold text-slate-600 mb-2">Belum Ada Data Perbandingan</h4>
            <p className="text-slate-500">Tambahkan transaksi untuk melihat perbandingan bulanan</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Comparison Chart */}
            <div className="h-80 mb-8">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthComparisons.slice(0, 6)} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="month" 
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
                  <Bar dataKey="income" fill="#10b981" name="Pemasukan" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="expenses" fill="#ef4444" name="Pengeluaran" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Comparison Details */}
            <div className="space-y-4">
              {monthComparisons.map((comparison, index) => (
                <div key={comparison.month} className="p-6 bg-white/40 rounded-2xl border border-white/30" style={{ animationDelay: `${index * 100}ms` }}>
                  <h4 className="font-bold text-slate-800 text-xl mb-4">{comparison.month}</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="text-center">
                      <p className="text-sm font-semibold text-slate-600 mb-2">PEMASUKAN</p>
                      <p className="text-2xl font-bold text-emerald-600">{formatCurrency(comparison.income)}</p>
                      {comparison.changeFromPrevious.income !== 0 && (
                        <div className={`flex items-center justify-center space-x-1 mt-2 ${
                          comparison.changeFromPrevious.income > 0 ? 'text-emerald-600' : 'text-red-600'
                        }`}>
                          {comparison.changeFromPrevious.income > 0 ? 
                            <TrendingUp className="w-4 h-4" /> : 
                            <TrendingDown className="w-4 h-4" />
                          }
                          <span className="text-sm font-semibold">
                            {Math.abs(comparison.changeFromPrevious.income).toFixed(1)}%
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold text-slate-600 mb-2">PENGELUARAN</p>
                      <p className="text-2xl font-bold text-red-600">{formatCurrency(comparison.expenses)}</p>
                      {comparison.changeFromPrevious.expenses !== 0 && (
                        <div className={`flex items-center justify-center space-x-1 mt-2 ${
                          comparison.changeFromPrevious.expenses > 0 ? 'text-red-600' : 'text-emerald-600'
                        }`}>
                          {comparison.changeFromPrevious.expenses > 0 ? 
                            <TrendingUp className="w-4 h-4" /> : 
                            <TrendingDown className="w-4 h-4" />
                          }
                          <span className="text-sm font-semibold">
                            {Math.abs(comparison.changeFromPrevious.expenses).toFixed(1)}%
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold text-slate-600 mb-2">SALDO BERSIH</p>
                      <p className={`text-2xl font-bold ${comparison.balance >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                        {formatCurrency(comparison.balance)}
                      </p>
                      {comparison.changeFromPrevious.balance !== 0 && !isNaN(comparison.changeFromPrevious.balance) && (
                        <div className={`flex items-center justify-center space-x-1 mt-2 ${
                          comparison.changeFromPrevious.balance > 0 ? 'text-emerald-600' : 'text-red-600'
                        }`}>
                          {comparison.changeFromPrevious.balance > 0 ? 
                            <TrendingUp className="w-4 h-4" /> : 
                            <TrendingDown className="w-4 h-4" />
                          }
                          <span className="text-sm font-semibold">
                            {Math.abs(comparison.changeFromPrevious.balance).toFixed(1)}%
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const CashFlowView = () => (
    <div className="space-y-6">
      <div className="glass-effect rounded-3xl p-8 border border-white/20">
        <div className="flex items-center space-x-4 mb-8">
          <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-slate-800">Analisis Arus Kas (30 Hari Terakhir)</h3>
        </div>

        {cashFlowData.length === 0 ? (
          <div className="text-center py-12">
            <Activity className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h4 className="text-xl font-semibold text-slate-600 mb-2">Belum Ada Data Arus Kas</h4>
            <p className="text-slate-500">Tambahkan transaksi untuk melihat analisis arus kas</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Cash Flow Chart */}
            <div className="h-80 mb-8">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={cashFlowData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => new Date(value).toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit' })}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => formatCurrency(value).replace('Rp', 'Rp ')}
                  />
                  <Tooltip 
                    content={<CustomTooltip />}
                    labelFormatter={(value) => formatDate(value)}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="runningBalance" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    name="Saldo Berjalan"
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="netFlow" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    name="Arus Kas Bersih"
                    dot={{ fill: '#10b981', strokeWidth: 2, r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Cash Flow Details */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {cashFlowData.map((flow, index) => (
                <div key={flow.date} className="flex items-center justify-between p-4 bg-white/40 rounded-xl border border-white/30" style={{ animationDelay: `${index * 50}ms` }}>
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      flow.netFlow > 0 ? 'bg-emerald-100 text-emerald-600' : 
                      flow.netFlow < 0 ? 'bg-red-100 text-red-600' : 
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {flow.netFlow > 0 ? '+' : flow.netFlow < 0 ? '-' : '='}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">{formatDate(flow.date)}</p>
                      <p className="text-sm text-slate-500">
                        Masuk: {formatCurrency(flow.income)} | Keluar: {formatCurrency(flow.expenses)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${flow.netFlow >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      {flow.netFlow >= 0 ? '+' : ''}{formatCurrency(flow.netFlow)}
                    </p>
                    <p className="text-sm text-slate-500">
                      Saldo: {formatCurrency(flow.runningBalance)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const AnomaliesView = () => (
    <div className="space-y-6">
      <div className="glass-effect rounded-3xl p-8 border border-white/20">
        <div className="flex items-center space-x-4 mb-8">
          <div className="p-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl shadow-lg">
            <AlertTriangle className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-slate-800">Deteksi Pola Pengeluaran Tidak Biasa</h3>
        </div>

        {anomalies.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-emerald-600" />
            </div>
            <h4 className="text-xl font-semibold text-emerald-600 mb-2">Tidak Ada Anomali Terdeteksi</h4>
            <p className="text-slate-500">Pola pengeluaran Anda terlihat normal dan konsisten</p>
          </div>
        ) : (
          <div className="space-y-4">
            {anomalies.map((anomaly, index) => (
              <div key={`${anomaly.date}-${anomaly.category}`} className={`p-6 rounded-2xl border-2 ${
                anomaly.severity === 'high' ? 'bg-red-50 border-red-200' :
                anomaly.severity === 'medium' ? 'bg-orange-50 border-orange-200' :
                'bg-yellow-50 border-yellow-200'
              }`} style={{ animationDelay: `${index * 100}ms` }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                      anomaly.severity === 'high' ? 'bg-red-100 text-red-600' :
                      anomaly.severity === 'medium' ? 'bg-orange-100 text-orange-600' :
                      'bg-yellow-100 text-yellow-600'
                    }`}>
                      <AlertTriangle className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-lg">{anomaly.category}</h4>
                      <p className="text-slate-600">{anomaly.description}</p>
                      <p className="text-sm text-slate-500 mt-1">
                        {formatDate(anomaly.date)} • Rata-rata: {formatCurrency(anomaly.averageAmount)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-2xl font-bold ${
                      anomaly.severity === 'high' ? 'text-red-600' :
                      anomaly.severity === 'medium' ? 'text-orange-600' :
                      'text-yellow-600'
                    }`}>
                      {formatCurrency(anomaly.amount)}
                    </p>
                    <p className="text-sm text-slate-500">
                      {anomaly.deviation.toFixed(1)}x dari normal
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center sm:text-left fade-in">
        <div className="flex items-center space-x-4 justify-center sm:justify-start mb-4">
          <div className="p-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-4xl sm:text-3xl font-bold text-slate-800 tracking-tight">Analitik Cerdas</h2>
            <p className="text-slate-600 text-lg sm:text-base font-medium">Insight mendalam tentang pola keuangan Anda</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="glass-effect rounded-3xl p-6 border border-white/20 fade-in" style={{ animationDelay: '100ms' }}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {tabs.map((tab, index) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center justify-center space-x-3 px-6 py-4 rounded-2xl font-bold transition-all duration-300 button-press focus-ring ${
                  activeTab === tab.id
                    ? `bg-gradient-to-r ${tab.color} text-white shadow-lg`
                    : 'bg-white/60 text-slate-600 border-2 border-slate-200 hover:bg-white/80 hover:border-slate-300'
                }`}
                style={{ animationDelay: `${200 + index * 50}ms` }}
              >
                <Icon className="w-5 h-5" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="fade-in" style={{ animationDelay: '300ms' }}>
        {activeTab === 'predictions' && <PredictionsView />}
        {activeTab === 'comparison' && <ComparisonView />}
        {activeTab === 'cashflow' && <CashFlowView />}
        {activeTab === 'anomalies' && <AnomaliesView />}
      </div>
    </div>
  );
};

export default Analytics;