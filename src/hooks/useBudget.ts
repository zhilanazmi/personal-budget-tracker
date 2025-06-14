import { useState, useEffect } from 'react';
import { Transaction, Category, DateRange, ReportData } from '../types';
import { storage } from '../utils/storage';
import { isDateInRange } from '../utils/dateUtils';

export const useBudget = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [incomeCategories, setIncomeCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = () => {
      setTransactions(storage.getTransactions());
      setCategories(storage.getCategories());
      setIncomeCategories(storage.getIncomeCategories());
      setLoading(false);
    };

    loadData();
  }, []);

  const addTransaction = (transaction: Omit<Transaction, 'id' | 'createdAt'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };

    const updatedTransactions = [newTransaction, ...transactions];
    setTransactions(updatedTransactions);
    storage.saveTransactions(updatedTransactions);
  };

  const updateTransaction = (id: string, updates: Partial<Transaction>) => {
    const updatedTransactions = transactions.map(t => 
      t.id === id ? { ...t, ...updates } : t
    );
    setTransactions(updatedTransactions);
    storage.saveTransactions(updatedTransactions);
  };

  const deleteTransaction = (id: string) => {
    const updatedTransactions = transactions.filter(t => t.id !== id);
    setTransactions(updatedTransactions);
    storage.saveTransactions(updatedTransactions);
  };

  const addCategory = (category: Omit<Category, 'id'>, isIncome = false) => {
    const newCategory: Category = {
      ...category,
      id: Date.now().toString(),
    };

    if (isIncome) {
      const updated = [...incomeCategories, newCategory];
      setIncomeCategories(updated);
      storage.saveIncomeCategories(updated);
    } else {
      const updated = [...categories, newCategory];
      setCategories(updated);
      storage.saveCategories(updated);
    }
  };

  const getReportData = (dateRange?: DateRange): ReportData => {
    let filteredTransactions = transactions;
    
    if (dateRange) {
      filteredTransactions = transactions.filter(t => 
        isDateInRange(t.date, dateRange.from, dateRange.to)
      );
    }

    const totalIncome = filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const categoryBreakdown = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as { [key: string]: number });

    return {
      totalIncome,
      totalExpenses,
      balance: totalIncome - totalExpenses,
      transactions: filteredTransactions,
      categoryBreakdown,
    };
  };

  return {
    transactions,
    categories,
    incomeCategories,
    loading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addCategory,
    getReportData,
  };
};