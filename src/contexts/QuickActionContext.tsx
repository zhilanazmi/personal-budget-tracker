import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Transaction } from '../types';
import { useBudget } from '../hooks/useBudget';

export interface QuickActionTemplate {
  id: string;
  name: string;
  type: 'income' | 'expense';
  category: string;
  description: string;
  amount?: number;
  accountId?: string;
  icon: string;
  color: string;
  frequency: number; // Berapa kali digunakan
  lastUsed: string;
}

interface QuickActionContextType {
  templates: QuickActionTemplate[];
  addTemplate: (template: Omit<QuickActionTemplate, 'id' | 'frequency' | 'lastUsed'>) => void;
  updateTemplate: (id: string, updates: Partial<QuickActionTemplate>) => void;
  deleteTemplate: (id: string) => void;
  useTemplate: (templateId: string) => void;
  getPopularTemplates: (limit?: number) => QuickActionTemplate[];
  generateTemplatesFromTransactions: () => void;
}

const QuickActionContext = createContext<QuickActionContextType | undefined>(undefined);

export const useQuickAction = () => {
  const context = useContext(QuickActionContext);
  if (!context) {
    throw new Error('useQuickAction must be used within a QuickActionProvider');
  }
  return context;
};

interface QuickActionProviderProps {
  children: ReactNode;
}

export const QuickActionProvider: React.FC<QuickActionProviderProps> = ({ children }) => {
  const [templates, setTemplates] = useState<QuickActionTemplate[]>([]);
  const { transactions, categories, incomeCategories } = useBudget();

  // Load templates from localStorage on mount
  useEffect(() => {
    const savedTemplates = localStorage.getItem('budget_quick_templates');
    if (savedTemplates) {
      try {
        setTemplates(JSON.parse(savedTemplates));
      } catch (error) {
        console.error('Error loading quick templates:', error);
      }
    } else {
      // Initialize with default templates if none exist
      initializeDefaultTemplates();
    }
  }, []);

  // Save templates to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('budget_quick_templates', JSON.stringify(templates));
  }, [templates]);

  const initializeDefaultTemplates = () => {
    const defaultTemplates: QuickActionTemplate[] = [
      {
        id: 'quick-1',
        name: 'Makan Siang',
        type: 'expense',
        category: 'Food & Drink',
        description: 'Makan siang',
        amount: 25000,
        icon: 'Coffee',
        color: '#F59E0B',
        frequency: 0,
        lastUsed: new Date().toISOString(),
      },
      {
        id: 'quick-2',
        name: 'Bensin',
        type: 'expense',
        category: 'Transport',
        description: 'Isi bensin',
        amount: 50000,
        icon: 'Car',
        color: '#3B82F6',
        frequency: 0,
        lastUsed: new Date().toISOString(),
      },
      {
        id: 'quick-3',
        name: 'Grab/Ojol',
        type: 'expense',
        category: 'Transport',
        description: 'Naik ojek online',
        amount: 15000,
        icon: 'Car',
        color: '#3B82F6',
        frequency: 0,
        lastUsed: new Date().toISOString(),
      },
      {
        id: 'quick-4',
        name: 'Gaji',
        type: 'income',
        category: 'Salary',
        description: 'Gaji bulanan',
        icon: 'Briefcase',
        color: '#10B981',
        frequency: 0,
        lastUsed: new Date().toISOString(),
      },
    ];
    setTemplates(defaultTemplates);
  };

  const addTemplate = (template: Omit<QuickActionTemplate, 'id' | 'frequency' | 'lastUsed'>) => {
    const newTemplate: QuickActionTemplate = {
      ...template,
      id: `quick-${Date.now()}`,
      frequency: 0,
      lastUsed: new Date().toISOString(),
    };
    setTemplates(prev => [...prev, newTemplate]);
  };

  const updateTemplate = (id: string, updates: Partial<QuickActionTemplate>) => {
    setTemplates(prev => 
      prev.map(template => 
        template.id === id ? { ...template, ...updates } : template
      )
    );
  };

  const deleteTemplate = (id: string) => {
    setTemplates(prev => prev.filter(template => template.id !== id));
  };

  const useTemplate = (templateId: string) => {
    setTemplates(prev => 
      prev.map(template => 
        template.id === templateId 
          ? { 
              ...template, 
              frequency: template.frequency + 1, 
              lastUsed: new Date().toISOString() 
            }
          : template
      )
    );
  };

  const getPopularTemplates = (limit = 4) => {
    return [...templates]
      .sort((a, b) => {
        // Sort by frequency first, then by lastUsed
        if (b.frequency !== a.frequency) {
          return b.frequency - a.frequency;
        }
        return new Date(b.lastUsed).getTime() - new Date(a.lastUsed).getTime();
      })
      .slice(0, limit);
  };

  const generateTemplatesFromTransactions = () => {
    if (transactions.length === 0) return;

    // Analyze frequent transactions to suggest new templates
    const transactionPatterns = new Map<string, {
      count: number;
      fixedAmount: number;
      category: string;
      type: 'income' | 'expense';
      lastTransaction: Transaction;
    }>();

    transactions.forEach(transaction => {
      const key = `${transaction.description.toLowerCase()}-${transaction.category}`;
      const existing = transactionPatterns.get(key);
      
      if (existing) {
        existing.count++;
        // Use the latest transaction amount as the fixed amount
        if (new Date(transaction.date) > new Date(existing.lastTransaction.date)) {
          existing.lastTransaction = transaction;
          existing.fixedAmount = transaction.amount;
        }
      } else {
        transactionPatterns.set(key, {
          count: 1,
          fixedAmount: transaction.amount,
          category: transaction.category,
          type: transaction.type as 'income' | 'expense',
          lastTransaction: transaction,
        });
      }
    });

    // Convert frequent patterns to templates (if used 3+ times and not already exists)
    const newTemplates: QuickActionTemplate[] = [];
    transactionPatterns.forEach((pattern, key) => {
      if (pattern.count >= 3) {
        const existingTemplate = templates.find(t => 
          t.description.toLowerCase() === pattern.lastTransaction.description.toLowerCase() &&
          t.category === pattern.category
        );

        if (!existingTemplate) {
          const categoryData = pattern.type === 'income' 
            ? incomeCategories.find(c => c.name === pattern.category)
            : categories.find(c => c.name === pattern.category);

          newTemplates.push({
            id: `auto-${Date.now()}-${key}`,
            name: pattern.lastTransaction.description,
            type: pattern.type,
            category: pattern.category,
            description: pattern.lastTransaction.description,
            amount: pattern.fixedAmount,
            accountId: pattern.lastTransaction.accountId,
            icon: categoryData?.icon || 'Tag',
            color: categoryData?.color || '#6B7280',
            frequency: pattern.count,
            lastUsed: pattern.lastTransaction.date,
          });
        }
      }
    });

    if (newTemplates.length > 0) {
      setTemplates(prev => [...prev, ...newTemplates]);
    }
  };

  const value = {
    templates,
    addTemplate,
    updateTemplate,
    deleteTemplate,
    useTemplate,
    getPopularTemplates,
    generateTemplatesFromTransactions,
  };

  return <QuickActionContext.Provider value={value}>{children}</QuickActionContext.Provider>;
}; 