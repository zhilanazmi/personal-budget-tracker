import { useBudget } from '../hooks/useBudget';
import { formatCurrency, getDateRange } from '../utils/dateUtils';
import { ReportData, Transaction, Account, Category } from '../types';

// Singleton untuk menyimpan referensi ke useBudget
let budgetInstance: ReturnType<typeof useBudget> | null = null;

// Inisialisasi provider dengan instance dari useBudget
export const initFinanceDataProvider = (instance: ReturnType<typeof useBudget>) => {
  budgetInstance = instance;
};

// Fungsi untuk mendapatkan data keuangan pengguna
export const getFinanceData = () => {
  if (!budgetInstance) {
    throw new Error('Finance data provider not initialized');
  }
  
  return {
    // Mendapatkan ringkasan saldo
    getBalanceSummary: (): {
      totalBalance: number;
      accounts: Array<{
        name: string;
        balance: number;
        type: string;
      }>;
      formattedTotalBalance: string;
    } => {
      const { accounts } = budgetInstance;
      const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
      
      return {
        totalBalance,
        accounts: accounts.map(account => ({
          name: account.name,
          balance: account.balance,
          type: account.type
        })),
        formattedTotalBalance: formatCurrency(totalBalance)
      };
    },
    
    // Mendapatkan riwayat transaksi
    getTransactionHistory: (limit: number = 10): {
      recentTransactions: Array<{
        date: string;
        description: string;
        amount: number;
        type: string;
        category: string;
        accountName?: string;
      }>;
      totalTransactions: number;
    } => {
      const { transactions, accounts } = budgetInstance;
      
      // Mendapatkan nama akun berdasarkan ID
      const getAccountName = (accountId?: string) => {
        if (!accountId) return undefined;
        const account = accounts.find(a => a.id === accountId);
        return account?.name;
      };
      
      // Urutkan transaksi berdasarkan tanggal (terbaru lebih dulu)
      const sortedTransactions = [...transactions]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      return {
        recentTransactions: sortedTransactions.slice(0, limit).map(t => ({
          date: t.date,
          description: t.description,
          amount: t.amount,
          type: t.type,
          category: t.category,
          accountName: getAccountName(t.accountId)
        })),
        totalTransactions: transactions.length
      };
    },
    
    // Mendapatkan laporan pengeluaran
    getExpenseReport: (period: 'today' | 'week' | 'month' | 'year' | 'custom' = 'month', customRange?: { from: string; to: string }): {
      totalExpenses: number;
      totalIncome: number;
      netBalance: number;
      categoryBreakdown: { [key: string]: number };
      formattedTotalExpenses: string;
      formattedTotalIncome: string;
      formattedNetBalance: string;
      period: string;
    } => {
      const { getReportData } = budgetInstance;
      
      let dateRange;
      let periodLabel;
      
      if (period === 'custom' && customRange) {
        dateRange = customRange;
        periodLabel = `${customRange.from} hingga ${customRange.to}`;
      } else {
        dateRange = getDateRange(period);
        switch(period) {
          case 'today': periodLabel = 'Hari Ini'; break;
          case 'week': periodLabel = '7 Hari Terakhir'; break;
          case 'month': periodLabel = 'Bulan Ini'; break;
          case 'year': periodLabel = 'Tahun Ini'; break;
          default: periodLabel = 'Bulan Ini';
        }
      }
      
      const reportData = getReportData(dateRange);
      
      return {
        totalExpenses: reportData.totalExpenses,
        totalIncome: reportData.totalIncome,
        netBalance: reportData.balance,
        categoryBreakdown: reportData.categoryBreakdown,
        formattedTotalExpenses: formatCurrency(reportData.totalExpenses),
        formattedTotalIncome: formatCurrency(reportData.totalIncome),
        formattedNetBalance: formatCurrency(reportData.balance),
        period: periodLabel
      };
    },
    
    // Mendapatkan analitik cerdas
    getSmartAnalytics: (): {
      trends: Array<{
        month: string;
        income: number;
        expenses: number;
        balance: number;
      }>;
      insights: Array<{
        type: string;
        message: string;
      }>;
      summary: {
        avgMonthlyIncome: number;
        avgMonthlyExpenses: number;
        highestExpenseMonth: {
          month: string;
          expenses: number;
        };
        lowestExpenseMonth: {
          month: string;
          expenses: number;
        };
      };
      formattedAvgMonthlyIncome: string;
      formattedAvgMonthlyExpenses: string;
    } => {
      const { getSpendingTrends } = budgetInstance;
      const analytics = getSpendingTrends(6); // 6 bulan terakhir
      
      return {
        trends: analytics.trends.map(trend => ({
          month: trend.month,
          income: trend.income,
          expenses: trend.expenses,
          balance: trend.balance
        })),
        insights: analytics.insights,
        summary: {
          avgMonthlyIncome: analytics.summary.avgMonthlyIncome,
          avgMonthlyExpenses: analytics.summary.avgMonthlyExpenses,
          highestExpenseMonth: {
            month: analytics.summary.highestExpenseMonth.month,
            expenses: analytics.summary.highestExpenseMonth.expenses
          },
          lowestExpenseMonth: {
            month: analytics.summary.lowestExpenseMonth.month,
            expenses: analytics.summary.lowestExpenseMonth.expenses
          }
        },
        formattedAvgMonthlyIncome: formatCurrency(analytics.summary.avgMonthlyIncome),
        formattedAvgMonthlyExpenses: formatCurrency(analytics.summary.avgMonthlyExpenses)
      };
    },
    
    // Mendapatkan top kategori pengeluaran
    getTopExpenseCategories: (period: 'today' | 'week' | 'month' | 'year' = 'month', limit: number = 5): Array<{
      category: string;
      amount: number;
      percentage: number;
      formattedAmount: string;
    }> => {
      const { getReportData } = budgetInstance;
      const reportData = getReportData(getDateRange(period));
      
      const categoryBreakdown = reportData.categoryBreakdown;
      const totalExpenses = reportData.totalExpenses;
      
      // Urutkan kategori berdasarkan jumlah pengeluaran (terbesar lebih dulu)
      const sortedCategories = Object.entries(categoryBreakdown)
        .sort(([, amountA], [, amountB]) => amountB - amountA)
        .slice(0, limit);
      
      return sortedCategories.map(([category, amount]) => ({
        category,
        amount,
        percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0,
        formattedAmount: formatCurrency(amount)
      }));
    },
    
    // Mendapatkan prediksi pengeluaran bulan depan
    getPredictedExpenses: (): {
      predictedAmount: number;
      formattedPredictedAmount: string;
      changePercentage: number;
      categories: Array<{
        category: string;
        predictedAmount: number;
        formattedPredictedAmount: string;
      }>;
    } => {
      const { getSpendingTrends } = budgetInstance;
      const analytics = getSpendingTrends(3); // 3 bulan terakhir untuk prediksi
      
      // Hitung rata-rata pengeluaran 3 bulan terakhir
      const avgExpenses = analytics.summary.avgMonthlyExpenses;
      
      // Hitung tren perubahan (menggunakan 2 bulan terakhir)
      const trends = analytics.trends;
      let changePercentage = 0;
      
      if (trends.length >= 2) {
        const currentMonth = trends[trends.length - 1];
        const previousMonth = trends[trends.length - 2];
        
        if (previousMonth.expenses > 0) {
          changePercentage = ((currentMonth.expenses - previousMonth.expenses) / previousMonth.expenses) * 100;
        }
      }
      
      // Prediksi pengeluaran bulan depan berdasarkan rata-rata dan tren
      // Jika tren positif (pengeluaran naik), tambahkan persentase ke rata-rata
      // Jika tren negatif (pengeluaran turun), kurangi persentase dari rata-rata
      const predictedAmount = avgExpenses * (1 + (changePercentage / 100));
      
      // Prediksi kategori (berdasarkan proporsi bulan terakhir)
      const lastMonth = trends[trends.length - 1];
      const categoryPredictions = [];
      
      if (lastMonth && lastMonth.expenses > 0) {
        for (const [category, amount] of Object.entries(lastMonth.categoryBreakdown)) {
          const proportion = amount / lastMonth.expenses;
          const predictedCategoryAmount = predictedAmount * proportion;
          
          categoryPredictions.push({
            category,
            predictedAmount: predictedCategoryAmount,
            formattedPredictedAmount: formatCurrency(predictedCategoryAmount)
          });
        }
      }
      
      return {
        predictedAmount,
        formattedPredictedAmount: formatCurrency(predictedAmount),
        changePercentage,
        categories: categoryPredictions.sort((a, b) => b.predictedAmount - a.predictedAmount).slice(0, 5)
      };
    }
  };
};

// Fungsi untuk menghasilkan ringkasan keuangan yang akan dikirim ke Gemini AI
export const generateFinanceSummary = (): string | null => {
  try {
    if (!budgetInstance) {
      return null;
    }
    
    const financeData = getFinanceData();
    
    // Ambil data-data yang dibutuhkan
    const balanceSummary = financeData.getBalanceSummary();
    const transactionHistory = financeData.getTransactionHistory(5); // 5 transaksi terakhir
    const expenseReport = financeData.getExpenseReport('month'); // Laporan bulan ini
    const analytics = financeData.getSmartAnalytics();
    const topCategories = financeData.getTopExpenseCategories('month', 3); // 3 kategori teratas
    
    // Format tanggal hari ini
    const today = new Date().toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    // Buat ringkasan keuangan dalam format yang mudah dibaca oleh AI
    return `
# Ringkasan Keuangan Pengguna (${today})

## Saldo Akun
- Total Saldo: ${balanceSummary.formattedTotalBalance}
- Jumlah Akun: ${balanceSummary.accounts.length}
${balanceSummary.accounts.map(acc => `- ${acc.name}: ${formatCurrency(acc.balance)}`).join('\n')}

## Laporan Bulan Ini
- Total Pemasukan: ${expenseReport.formattedTotalIncome}
- Total Pengeluaran: ${expenseReport.formattedTotalExpenses}
- Saldo Bersih: ${expenseReport.formattedNetBalance}

## Kategori Pengeluaran Teratas
${topCategories.map((cat, index) => `${index + 1}. ${cat.category}: ${cat.formattedAmount} (${cat.percentage.toFixed(1)}%)`).join('\n')}

## Transaksi Terbaru
${transactionHistory.recentTransactions.map((t, index) => 
  `${index + 1}. ${t.date} - ${t.description} - ${t.type === 'expense' ? '-' : '+'}${formatCurrency(t.amount)} (${t.category})`
).join('\n')}

## Analitik & Tren
- Rata-rata Pengeluaran Bulanan: ${analytics.formattedAvgMonthlyExpenses}
- Rata-rata Pemasukan Bulanan: ${analytics.formattedAvgMonthlyIncome}
- Bulan dengan Pengeluaran Tertinggi: ${analytics.summary.highestExpenseMonth.month} (${formatCurrency(analytics.summary.highestExpenseMonth.expenses)})
- Bulan dengan Pengeluaran Terendah: ${analytics.summary.lowestExpenseMonth.month} (${formatCurrency(analytics.summary.lowestExpenseMonth.expenses)})

## Insight Keuangan
${analytics.insights.map(insight => `- ${insight.message}`).join('\n')}
`;
  } catch (error) {
    console.error('Error generating finance summary:', error);
    return null;
  }
};