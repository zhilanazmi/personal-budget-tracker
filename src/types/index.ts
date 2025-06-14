export interface Transaction {
  id: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  description: string;
  date: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  isCustom: boolean;
}

export interface DateRange {
  from: string;
  to: string;
}

export interface ReportData {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  transactions: Transaction[];
  categoryBreakdown: { [key: string]: number };
}