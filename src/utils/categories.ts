import { Category } from '../types';

export const defaultCategories: Category[] = [
  { id: '1', name: 'Transport', icon: 'Car', color: '#3B82F6', isCustom: false },
  { id: '2', name: 'Food & Drink', icon: 'Coffee', color: '#F59E0B', isCustom: false },
  { id: '3', name: 'Snacks', icon: 'Cookie', color: '#EC4899', isCustom: false },
  { id: '4', name: 'Groceries', icon: 'ShoppingCart', color: '#10B981', isCustom: false },
  { id: '5', name: 'Bills', icon: 'FileText', color: '#EF4444', isCustom: false },
  { id: '6', name: 'Rent/Mortgage', icon: 'Home', color: '#8B5CF6', isCustom: false },
  { id: '7', name: 'Entertainment', icon: 'Film', color: '#F97316', isCustom: false },
  { id: '8', name: 'Shopping', icon: 'Bag', color: '#06B6D4', isCustom: false },
  { id: '9', name: 'Education', icon: 'BookOpen', color: '#84CC16', isCustom: false },
  { id: '10', name: 'Health', icon: 'Heart', color: '#EF4444', isCustom: false },
  { id: '11', name: 'Savings', icon: 'PiggyBank', color: '#22C55E', isCustom: false },
  { id: '12', name: 'Others', icon: 'MoreHorizontal', color: '#6B7280', isCustom: false },
];

export const incomeCategories: Category[] = [
  { id: 'salary', name: 'Salary', icon: 'Briefcase', color: '#10B981', isCustom: false },
  { id: 'freelance', name: 'Freelance', icon: 'Laptop', color: '#3B82F6', isCustom: false },
  { id: 'business', name: 'Business', icon: 'Building', color: '#8B5CF6', isCustom: false },
  { id: 'investment', name: 'Investment', icon: 'TrendingUp', color: '#F59E0B', isCustom: false },
  { id: 'other-income', name: 'Other Income', icon: 'Plus', color: '#6B7280', isCustom: false },
];