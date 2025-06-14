import { Transaction, Category } from '../types';
import { defaultCategories, incomeCategories } from './categories';

const STORAGE_KEYS = {
  TRANSACTIONS: 'budget_transactions',
  CATEGORIES: 'budget_categories',
  INCOME_CATEGORIES: 'budget_income_categories',
};

export const storage = {
  getTransactions: (): Transaction[] => {
    const stored = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    return stored ? JSON.parse(stored) : [];
  },

  saveTransactions: (transactions: Transaction[]): void => {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  },

  getCategories: (): Category[] => {
    const stored = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    return stored ? JSON.parse(stored) : defaultCategories;
  },

  saveCategories: (categories: Category[]): void => {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  },

  getIncomeCategories: (): Category[] => {
    const stored = localStorage.getItem(STORAGE_KEYS.INCOME_CATEGORIES);
    return stored ? JSON.parse(stored) : incomeCategories;
  },

  saveIncomeCategories: (categories: Category[]): void => {
    localStorage.setItem(STORAGE_KEYS.INCOME_CATEGORIES, JSON.stringify(categories));
  },

  exportData: () => {
    const data = {
      transactions: storage.getTransactions(),
      categories: storage.getCategories(),
      incomeCategories: storage.getIncomeCategories(),
      exportDate: new Date().toISOString(),
    };
    return JSON.stringify(data, null, 2);
  },

  importData: (jsonData: string): boolean => {
    try {
      const data = JSON.parse(jsonData);
      if (data.transactions) storage.saveTransactions(data.transactions);
      if (data.categories) storage.saveCategories(data.categories);
      if (data.incomeCategories) storage.saveIncomeCategories(data.incomeCategories);
      return true;
    } catch (error) {
      console.error('Import failed:', error);
      return false;
    }
  },
};