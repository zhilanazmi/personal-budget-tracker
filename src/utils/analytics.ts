export interface PredictionData {
  category: string;
  predictedAmount: number;
  confidence: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  historicalAverage: number;
}

export interface MonthComparison {
  month: string;
  income: number;
  expenses: number;
  balance: number;
  changeFromPrevious: {
    income: number;
    expenses: number;
    balance: number;
  };
}

export interface CashFlowData {
  date: string;
  income: number;
  expenses: number;
  netFlow: number;
  runningBalance: number;
}

export interface AnomalyDetection {
  date: string;
  category: string;
  amount: number;
  averageAmount: number;
  deviation: number;
  severity: 'low' | 'medium' | 'high';
  description: string;
}

export class FinancialAnalytics {
  static predictExpenses(transactions: any[], months: number = 3): PredictionData[] {
    const expenseTransactions = transactions.filter(t => t.type === 'expense');
    const categoryData = new Map<string, number[]>();
    
    // Group expenses by category and month
    expenseTransactions.forEach(transaction => {
      const monthKey = new Date(transaction.date).toISOString().slice(0, 7);
      if (!categoryData.has(transaction.category)) {
        categoryData.set(transaction.category, []);
      }
      
      const existing = categoryData.get(transaction.category)!;
      const monthIndex = existing.findIndex(item => item && item.month === monthKey);
      
      if (monthIndex >= 0) {
        existing[monthIndex].amount += transaction.amount;
      } else {
        existing.push({ month: monthKey, amount: transaction.amount });
      }
    });

    const predictions: PredictionData[] = [];
    
    categoryData.forEach((monthlyData, category) => {
      if (monthlyData.length < 2) return; // Need at least 2 months of data
      
      const amounts = monthlyData.map(d => d.amount).sort((a, b) => a - b);
      const average = amounts.reduce((sum, amt) => sum + amt, 0) / amounts.length;
      
      // Simple linear regression for trend
      const trend = this.calculateTrend(monthlyData);
      const confidence = Math.min(0.9, monthlyData.length * 0.15); // More data = higher confidence
      
      predictions.push({
        category,
        predictedAmount: Math.max(0, average + trend * months),
        confidence,
        trend: trend > 5 ? 'increasing' : trend < -5 ? 'decreasing' : 'stable',
        historicalAverage: average
      });
    });
    
    return predictions.sort((a, b) => b.predictedAmount - a.predictedAmount);
  }

  static compareMonths(transactions: any[], monthsToCompare: number = 6): MonthComparison[] {
    const monthlyData = new Map<string, { income: number; expenses: number }>();
    
    transactions.forEach(transaction => {
      const monthKey = new Date(transaction.date).toISOString().slice(0, 7);
      if (!monthlyData.has(monthKey)) {
        monthlyData.set(monthKey, { income: 0, expenses: 0 });
      }
      
      const data = monthlyData.get(monthKey)!;
      if (transaction.type === 'income') {
        data.income += transaction.amount;
      } else if (transaction.type === 'expense') {
        data.expenses += transaction.amount;
      }
    });
    
    const sortedMonths = Array.from(monthlyData.entries())
      .sort(([a], [b]) => b.localeCompare(a))
      .slice(0, monthsToCompare);
    
    const comparisons: MonthComparison[] = [];
    
    sortedMonths.forEach(([month, data], index) => {
      const previousData = index < sortedMonths.length - 1 ? sortedMonths[index + 1][1] : null;
      
      comparisons.push({
        month: new Date(month + '-01').toLocaleDateString('id-ID', { 
          year: 'numeric', 
          month: 'long' 
        }),
        income: data.income,
        expenses: data.expenses,
        balance: data.income - data.expenses,
        changeFromPrevious: {
          income: previousData ? ((data.income - previousData.income) / previousData.income) * 100 : 0,
          expenses: previousData ? ((data.expenses - previousData.expenses) / previousData.expenses) * 100 : 0,
          balance: previousData ? 
            (((data.income - data.expenses) - (previousData.income - previousData.expenses)) / Math.abs(previousData.income - previousData.expenses)) * 100 : 0
        }
      });
    });
    
    return comparisons;
  }

  static analyzeCashFlow(transactions: any[], accounts: any[]): CashFlowData[] {
    const dailyFlow = new Map<string, { income: number; expenses: number }>();
    
    transactions.forEach(transaction => {
      const dateKey = transaction.date;
      if (!dailyFlow.has(dateKey)) {
        dailyFlow.set(dateKey, { income: 0, expenses: 0 });
      }
      
      const data = dailyFlow.get(dateKey)!;
      if (transaction.type === 'income') {
        data.income += transaction.amount;
      } else if (transaction.type === 'expense') {
        data.expenses += transaction.amount;
      }
    });
    
    const sortedDates = Array.from(dailyFlow.keys()).sort();
    const cashFlowData: CashFlowData[] = [];
    let runningBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
    
    // Calculate running balance backwards from current balance
    for (let i = sortedDates.length - 1; i >= 0; i--) {
      const date = sortedDates[i];
      const data = dailyFlow.get(date)!;
      const netFlow = data.income - data.expenses;
      
      cashFlowData.unshift({
        date,
        income: data.income,
        expenses: data.expenses,
        netFlow,
        runningBalance
      });
      
      runningBalance -= netFlow;
    }
    
    return cashFlowData.slice(-30); // Last 30 days
  }

  static detectAnomalies(transactions: any[]): AnomalyDetection[] {
    const categoryStats = new Map<string, { amounts: number[]; average: number; stdDev: number }>();
    
    // Calculate statistics for each category
    transactions.filter(t => t.type === 'expense').forEach(transaction => {
      if (!categoryStats.has(transaction.category)) {
        categoryStats.set(transaction.category, { amounts: [], average: 0, stdDev: 0 });
      }
      categoryStats.get(transaction.category)!.amounts.push(transaction.amount);
    });
    
    // Calculate average and standard deviation
    categoryStats.forEach((stats, category) => {
      const amounts = stats.amounts;
      stats.average = amounts.reduce((sum, amt) => sum + amt, 0) / amounts.length;
      
      const variance = amounts.reduce((sum, amt) => sum + Math.pow(amt - stats.average, 2), 0) / amounts.length;
      stats.stdDev = Math.sqrt(variance);
    });
    
    const anomalies: AnomalyDetection[] = [];
    
    // Detect anomalies (transactions > 2 standard deviations from mean)
    transactions.filter(t => t.type === 'expense').forEach(transaction => {
      const stats = categoryStats.get(transaction.category);
      if (!stats || stats.amounts.length < 5) return; // Need enough data
      
      const deviation = Math.abs(transaction.amount - stats.average) / stats.stdDev;
      
      if (deviation > 2) {
        let severity: 'low' | 'medium' | 'high' = 'low';
        let description = '';
        
        if (deviation > 3) {
          severity = 'high';
          description = `Pengeluaran sangat tidak biasa untuk kategori ${transaction.category}`;
        } else if (deviation > 2.5) {
          severity = 'medium';
          description = `Pengeluaran cukup tinggi untuk kategori ${transaction.category}`;
        } else {
          severity = 'low';
          description = `Pengeluaran sedikit di atas normal untuk kategori ${transaction.category}`;
        }
        
        anomalies.push({
          date: transaction.date,
          category: transaction.category,
          amount: transaction.amount,
          averageAmount: stats.average,
          deviation,
          severity,
          description
        });
      }
    });
    
    return anomalies.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10);
  }

  private static calculateTrend(data: any[]): number {
    if (data.length < 2) return 0;
    
    const sortedData = data.sort((a, b) => a.month.localeCompare(b.month));
    const n = sortedData.length;
    
    let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
    
    sortedData.forEach((point, index) => {
      const x = index;
      const y = point.amount;
      sumX += x;
      sumY += y;
      sumXY += x * y;
      sumXX += x * x;
    });
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    return slope || 0;
  }
}