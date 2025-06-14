import React, { useState } from 'react';
import { Plus, Minus, DollarSign } from 'lucide-react';
import { useBudget } from '../hooks/useBudget';
import { Transaction } from '../types';

const TransactionForm: React.FC = () => {
  const { addTransaction, categories, incomeCategories } = useBudget();
  const [formData, setFormData] = useState({
    type: 'expense' as 'income' | 'expense',
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.amount || !formData.category || !formData.description) {
      return;
    }

    setIsSubmitting(true);
    
    const transaction: Omit<Transaction, 'id' | 'createdAt'> = {
      type: formData.type,
      amount: parseFloat(formData.amount),
      category: formData.category,
      description: formData.description,
      date: formData.date,
    };

    addTransaction(transaction);
    
    // Reset form
    setFormData({
      type: 'expense',
      amount: '',
      category: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
    });
    
    setIsSubmitting(false);
  };

  const availableCategories = formData.type === 'income' ? incomeCategories : categories;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
        <div className="mb-8 text-center sm:text-left">
          <h2 className="text-3xl sm:text-2xl font-bold text-gray-900 mb-2">Add Transaction</h2>
          <p className="text-gray-600 text-lg sm:text-base">Record your income or expenses</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Transaction Type - Mobile Optimized */}
          <div>
            <label className="block text-base font-semibold text-gray-700 mb-4">
              Transaction Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'expense', category: '' })}
                className={`flex items-center justify-center space-x-3 py-4 px-4 rounded-2xl border-2 transition-all duration-200 active:scale-95 ${
                  formData.type === 'expense'
                    ? 'border-red-300 bg-red-50 text-red-700 shadow-sm'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                }`}
              >
                <Minus className="w-6 h-6" />
                <span className="font-semibold text-lg">Expense</span>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'income', category: '' })}
                className={`flex items-center justify-center space-x-3 py-4 px-4 rounded-2xl border-2 transition-all duration-200 active:scale-95 ${
                  formData.type === 'income'
                    ? 'border-emerald-300 bg-emerald-50 text-emerald-700 shadow-sm'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                }`}
              >
                <Plus className="w-6 h-6" />
                <span className="font-semibold text-lg">Income</span>
              </button>
            </div>
          </div>

          {/* Amount - Large Touch Target */}
          <div>
            <label htmlFor="amount" className="block text-base font-semibold text-gray-700 mb-3">
              Amount
            </label>
            <div className="relative">
              <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-6 h-6" />
              <input
                type="number"
                id="amount"
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-xl font-semibold"
                placeholder="0.00"
                inputMode="decimal"
                required
              />
            </div>
          </div>

          {/* Category - Large Select */}
          <div>
            <label htmlFor="category" className="block text-base font-semibold text-gray-700 mb-3">
              Category
            </label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-4 border-2 border-gray-300 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-lg"
              required
            >
              <option value="">Select a category</option>
              {availableCategories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-base font-semibold text-gray-700 mb-3">
              Description
            </label>
            <input
              type="text"
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-4 border-2 border-gray-300 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-lg"
              placeholder="Enter description..."
              required
            />
          </div>

          {/* Date */}
          <div>
            <label htmlFor="date" className="block text-base font-semibold text-gray-700 mb-3">
              Date
            </label>
            <input
              type="date"
              id="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-4 py-4 border-2 border-gray-300 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-lg"
              required
            />
          </div>

          {/* Submit Button - Large Touch Target */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-5 px-6 rounded-2xl font-bold text-xl transition-all duration-200 active:scale-95 ${
              formData.type === 'income'
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg'
                : 'bg-red-600 hover:bg-red-700 text-white shadow-lg'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isSubmitting ? 'Adding...' : `Add ${formData.type === 'income' ? 'Income' : 'Expense'}`}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TransactionForm;