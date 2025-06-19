export interface Transaction {
  id: string;
  amount: number;
  type: 'income' | 'expense' | 'transfer';
  category: string;
  description: string;
  date: string;
  createdAt: string;
  accountId?: string;
  transferToAccountId?: string;
  icon?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  isCustom: boolean;
}

export interface Account {
  id: string;
  name: string;
  type: 'bank' | 'cash' | 'digital_wallet' | 'credit_card' | 'savings' | 'investment' | 'other';
  balance: number;
  color: string;
  icon: string;
  isActive: boolean;
  createdAt: string;
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
  accountBalances: { [key: string]: number };
}