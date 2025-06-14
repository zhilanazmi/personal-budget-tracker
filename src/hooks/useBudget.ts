import { useState, useEffect } from 'react';
import { Transaction, Category, DateRange, ReportData } from '../types';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { isDateInRange } from '../utils/dateUtils';

export const useBudget = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [incomeCategories, setIncomeCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { showToast } = useToast();

  // Load data when user changes
  useEffect(() => {
    if (user) {
      loadData();
    } else {
      setTransactions([]);
      setCategories([]);
      setIncomeCategories([]);
      setLoading(false);
    }
  }, [user]);

  const loadData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Load transactions
      const { data: transactionsData, error: transactionsError } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (transactionsError) throw transactionsError;

      // Load categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .or(`user_id.is.null,user_id.eq.${user.id}`)
        .eq('type', 'expense')
        .order('name');

      if (categoriesError) throw categoriesError;

      // Load income categories
      const { data: incomeCategoriesData, error: incomeCategoriesError } = await supabase
        .from('categories')
        .select('*')
        .or(`user_id.is.null,user_id.eq.${user.id}`)
        .eq('type', 'income')
        .order('name');

      if (incomeCategoriesError) throw incomeCategoriesError;

      setTransactions(transactionsData || []);
      setCategories(categoriesData || []);
      setIncomeCategories(incomeCategoriesData || []);
    } catch (error) {
      console.error('Error loading data:', error);
      showToast('Gagal memuat data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const addTransaction = async (transaction: Omit<Transaction, 'id' | 'createdAt'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert([
          {
            user_id: user.id,
            amount: transaction.amount,
            type: transaction.type,
            category: transaction.category,
            description: transaction.description,
            date: transaction.date,
          }
        ])
        .select()
        .single();

      if (error) throw error;

      // Add to local state
      const newTransaction: Transaction = {
        id: data.id,
        amount: data.amount,
        type: data.type,
        category: data.category,
        description: data.description,
        date: data.date,
        createdAt: data.created_at,
      };

      setTransactions(prev => [newTransaction, ...prev]);
    } catch (error) {
      console.error('Error adding transaction:', error);
      throw error;
    }
  };

  const updateTransaction = async (id: string, updates: Partial<Transaction>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('transactions')
        .update({
          amount: updates.amount,
          type: updates.type,
          category: updates.category,
          description: updates.description,
          date: updates.date,
        })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      // Update local state
      setTransactions(prev => 
        prev.map(t => t.id === id ? { ...t, ...updates } : t)
      );
    } catch (error) {
      console.error('Error updating transaction:', error);
      throw error;
    }
  };

  const deleteTransaction = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      // Remove from local state
      setTransactions(prev => prev.filter(t => t.id !== id));
    } catch (error) {
      console.error('Error deleting transaction:', error);
      throw error;
    }
  };

  const addCategory = async (category: Omit<Category, 'id'>, isIncome = false) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('categories')
        .insert([
          {
            user_id: user.id,
            name: category.name,
            icon: category.icon,
            color: category.color,
            type: isIncome ? 'income' : 'expense',
            is_custom: true,
          }
        ])
        .select()
        .single();

      if (error) throw error;

      const newCategory: Category = {
        id: data.id,
        name: data.name,
        icon: data.icon,
        color: data.color,
        isCustom: data.is_custom,
      };

      // Add to local state
      if (isIncome) {
        setIncomeCategories(prev => [...prev, newCategory]);
      } else {
        setCategories(prev => [...prev, newCategory]);
      }
    } catch (error) {
      console.error('Error adding category:', error);
      throw error;
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