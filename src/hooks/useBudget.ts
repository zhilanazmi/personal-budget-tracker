import { useState, useEffect } from 'react';
import { Transaction, Category, Account, DateRange, ReportData } from '../types';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { isDateInRange } from '../utils/dateUtils';
import { getCategoryIconSuggestion } from '../utils/iconUtils';

export const useBudget = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [incomeCategories, setIncomeCategories] = useState<Category[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
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
      setAccounts([]);
      setLoading(false);
    }
  }, [user]);

  const loadData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Load accounts first
      const { data: accountsData, error: accountsError } = await supabase
        .from('accounts')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('created_at');

      if (accountsError) throw accountsError;

      // If no accounts exist, create default ones
      if (!accountsData || accountsData.length === 0) {
        await createDefaultAccounts();
        // Reload accounts after creating defaults
        const { data: newAccountsData, error: newAccountsError } = await supabase
          .from('accounts')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_active', true)
          .order('created_at');
        
        if (newAccountsError) throw newAccountsError;
        setAccounts(newAccountsData?.map(mapAccountFromDB) || []);
      } else {
        setAccounts(accountsData.map(mapAccountFromDB));
      }
      
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

      setTransactions(transactionsData?.map(mapTransactionFromDB) || []);
      setCategories(categoriesData || []);
      setIncomeCategories(incomeCategoriesData || []);
    } catch (error) {
      console.error('Error loading data:', error);
      showToast('Gagal memuat data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const createDefaultAccounts = async () => {
    if (!user) return;

    const defaultAccounts = [
      { name: 'Tunai', type: 'cash', color: '#10B981', icon: 'Banknote' },
      { name: 'Bank Utama', type: 'bank', color: '#3B82F6', icon: 'Building2' },
      { name: 'Dompet Digital', type: 'digital_wallet', color: '#8B5CF6', icon: 'Smartphone' },
    ];

    try {
      const { error } = await supabase
        .from('accounts')
        .insert(
          defaultAccounts.map(account => ({
            user_id: user.id,
            name: account.name,
            type: account.type,
            color: account.color,
            icon: account.icon,
            balance: 0,
          }))
        );

      if (error) throw error;
    } catch (error) {
      console.error('Error creating default accounts:', error);
    }
  };

  const mapAccountFromDB = (dbAccount: any): Account => ({
    id: dbAccount.id,
    name: dbAccount.name,
    type: dbAccount.type,
    balance: parseFloat(dbAccount.balance),
    color: dbAccount.color,
    icon: dbAccount.icon,
    isActive: dbAccount.is_active,
    createdAt: dbAccount.created_at,
  });

  const mapTransactionFromDB = (dbTransaction: any): Transaction => ({
    id: dbTransaction.id,
    amount: parseFloat(dbTransaction.amount),
    type: dbTransaction.type,
    category: dbTransaction.category,
    description: dbTransaction.description,
    date: dbTransaction.date,
    createdAt: dbTransaction.created_at,
    accountId: dbTransaction.account_id,
    transferToAccountId: dbTransaction.transfer_to_account_id,
    icon: dbTransaction.icon,
  });

  const addAccount = async (account: Omit<Account, 'id' | 'createdAt' | 'balance'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('accounts')
        .insert([
          {
            user_id: user.id,
            name: account.name,
            type: account.type,
            color: account.color,
            icon: account.icon,
            balance: 0,
            is_active: account.isActive,
          }
        ])
        .select()
        .single();

      if (error) throw error;

      const newAccount = mapAccountFromDB(data);
      setAccounts(prev => [...prev, newAccount]);
      return newAccount;
    } catch (error) {
      console.error('Error adding account:', error);
      throw error;
    }
  };

  const updateAccount = async (id: string, updates: Partial<Account>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('accounts')
        .update({
          name: updates.name,
          type: updates.type,
          color: updates.color,
          icon: updates.icon,
          is_active: updates.isActive,
        })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setAccounts(prev => 
        prev.map(account => account.id === id ? { ...account, ...updates } : account)
      );
    } catch (error) {
      console.error('Error updating account:', error);
      throw error;
    }
  };

  const deleteAccount = async (id: string) => {
    if (!user) return;

    try {
      // Check if account has any transactions
      const { data: transactionsData, error: transactionError } = await supabase
        .from('transactions')
        .select('id')
        .or(`account_id.eq.${id},transfer_to_account_id.eq.${id}`)
        .eq('user_id', user.id)
        .limit(1);

      if (transactionError) throw transactionError;

      if (transactionsData && transactionsData.length > 0) {
        throw new Error('Tidak dapat menghapus akun yang memiliki transaksi. Hapus semua transaksi terlebih dahulu.');
      }

      // Check if account has balance
      const account = accounts.find(acc => acc.id === id);
      if (account && account.balance !== 0) {
        throw new Error('Tidak dapat menghapus akun dengan saldo yang tidak nol. Pindahkan atau hapus saldo terlebih dahulu.');
      }

      // Delete account
      const { error } = await supabase
        .from('accounts')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      // Remove from local state
      setAccounts(prev => prev.filter(account => account.id !== id));
    } catch (error) {
      console.error('Error deleting account:', error);
      throw error;
    }
  };

  const addTransaction = async (transaction: Omit<Transaction, 'id' | 'createdAt'>) => {
    if (!user) return;

    try {
      // Start a transaction to ensure data consistency
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
            account_id: transaction.accountId,
            transfer_to_account_id: transaction.transferToAccountId,
            icon: transaction.icon,
          }
        ])
        .select()
        .single();

      if (error) throw error;

      // Update account balances
      if (transaction.type === 'transfer' && transaction.accountId && transaction.transferToAccountId) {
        // Transfer: subtract from source, add to destination
        await updateAccountBalance(transaction.accountId, -transaction.amount);
        await updateAccountBalance(transaction.transferToAccountId, transaction.amount);
      } else if (transaction.accountId) {
        // Regular transaction: update the account balance
        const balanceChange = transaction.type === 'income' ? transaction.amount : -transaction.amount;
        await updateAccountBalance(transaction.accountId, balanceChange);
      }

      // Add to local state
      const newTransaction = mapTransactionFromDB(data);
      setTransactions(prev => [newTransaction, ...prev]);

      // Reload accounts to get updated balances
      await loadAccounts();
    } catch (error) {
      console.error('Error adding transaction:', error);
      throw error;
    }
  };

  const updateAccountBalance = async (accountId: string, balanceChange: number) => {
    const { error } = await supabase.rpc('update_account_balance', {
      account_id: accountId,
      balance_change: balanceChange
    });

    if (error) {
      // Fallback: manual balance update
      const { data: account } = await supabase
        .from('accounts')
        .select('balance')
        .eq('id', accountId)
        .single();

      if (account) {
        const newBalance = parseFloat(account.balance) + balanceChange;
        await supabase
          .from('accounts')
          .update({ balance: newBalance })
          .eq('id', accountId);
      }
    }
  };

  const loadAccounts = async () => {
    if (!user) return;

    const { data: accountsData, error } = await supabase
      .from('accounts')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .order('created_at');

    if (!error && accountsData) {
      setAccounts(accountsData.map(mapAccountFromDB));
    }
  };

  const deleteTransaction = async (id: string) => {
    if (!user) return;

    try {
      // Get transaction details before deleting
      const transactionToDelete = transactions.find(t => t.id === id);
      if (!transactionToDelete) return;

      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      // Reverse the balance changes
      if (transactionToDelete.type === 'transfer' && transactionToDelete.accountId && transactionToDelete.transferToAccountId) {
        // Reverse transfer: add back to source, subtract from destination
        await updateAccountBalance(transactionToDelete.accountId, transactionToDelete.amount);
        await updateAccountBalance(transactionToDelete.transferToAccountId, -transactionToDelete.amount);
      } else if (transactionToDelete.accountId) {
        // Reverse regular transaction
        const balanceChange = transactionToDelete.type === 'income' ? -transactionToDelete.amount : transactionToDelete.amount;
        await updateAccountBalance(transactionToDelete.accountId, balanceChange);
      }

      // Remove from local state
      setTransactions(prev => prev.filter(t => t.id !== id));

      // Reload accounts to get updated balances
      await loadAccounts();
    } catch (error) {
      console.error('Error deleting transaction:', error);
      throw error;
    }
  };

  const addCategory = async (category: Omit<Category, 'id'>, isIncome = false) => {
    if (!user) return;

    try {
      // Auto-suggest icon based on category name
      const suggestedIcon = category.icon || getCategoryIconSuggestion(category.name);
      
      const { data, error } = await supabase
        .from('categories')
        .insert([
          {
            user_id: user.id,
            name: category.name,
            icon: suggestedIcon,
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

  const updateCategory = async (id: string, updates: Partial<Category>, isIncome = false) => {
    if (!user) return;

    try {
      // For default categories (user_id is null), we need to handle differently
      const categoryList = isIncome ? incomeCategories : categories;
      const category = categoryList.find(cat => cat.id === id);
      
      if (!category) throw new Error('Kategori tidak ditemukan');

      // If it's a default category (no user_id), create a new custom category for this user
      if (!category.isCustom) {
        // Create a new custom category with the updated values
        const { data, error } = await supabase
          .from('categories')
          .insert([
            {
              user_id: user.id,
              name: updates.name || category.name,
              icon: updates.icon || category.icon,
              color: updates.color || category.color,
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

        // Add new custom category and remove old default one from local state
        if (isIncome) {
          setIncomeCategories(prev => 
            prev.filter(cat => cat.id !== id).concat(newCategory)
          );
        } else {
          setCategories(prev => 
            prev.filter(cat => cat.id !== id).concat(newCategory)
          );
        }
      } else {
        // For custom categories, update normally
        const { error } = await supabase
          .from('categories')
          .update({
            name: updates.name,
            icon: updates.icon,
            color: updates.color,
          })
          .eq('id', id)
          .eq('user_id', user.id);

        if (error) throw error;

        // Update local state
        if (isIncome) {
          setIncomeCategories(prev => 
            prev.map(cat => cat.id === id ? { ...cat, ...updates } : cat)
          );
        } else {
          setCategories(prev => 
            prev.map(cat => cat.id === id ? { ...cat, ...updates } : cat)
          );
        }
      }
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  };

  const deleteCategory = async (id: string, isIncome = false) => {
    if (!user) return;

    try {
      const categoryList = isIncome ? incomeCategories : categories;
      const category = categoryList.find(cat => cat.id === id);
      
      if (!category) throw new Error('Kategori tidak ditemukan');

      // Check if category is being used in transactions
      const { data: transactionCheck, error: checkError } = await supabase
        .from('transactions')
        .select('id')
        .eq('user_id', user.id)
        .eq('category', category.name)
        .limit(1);

      if (checkError) throw checkError;

      if (transactionCheck && transactionCheck.length > 0) {
        throw new Error('Kategori tidak dapat dihapus karena masih digunakan dalam transaksi');
      }

      // For default categories, just remove from local state (can't delete from DB)
      // For custom categories, delete from DB
      if (category.isCustom) {
        const { error } = await supabase
          .from('categories')
          .delete()
          .eq('id', id)
          .eq('user_id', user.id);

        if (error) throw error;
      }

      // Update local state (remove category regardless of type)
      if (isIncome) {
        setIncomeCategories(prev => prev.filter(cat => cat.id !== id));
      } else {
        setCategories(prev => prev.filter(cat => cat.id !== id));
      }
    } catch (error) {
      console.error('Error deleting category:', error);
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

    const accountBalances = accounts.reduce((acc, account) => {
      acc[account.name] = account.balance;
      return acc;
    }, {} as { [key: string]: number });

    return {
      totalIncome,
      totalExpenses,
      balance: totalIncome - totalExpenses,
      transactions: filteredTransactions,
      categoryBreakdown,
      accountBalances,
    };
  };

  return {
    transactions,
    categories,
    incomeCategories,
    accounts,
    loading,
    addTransaction,
    deleteTransaction,
    addCategory,
    updateCategory,
    deleteCategory,
    addAccount,
    updateAccount,
    deleteAccount,
    getReportData,
  };
};