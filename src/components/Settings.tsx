import React, { useState } from 'react';
import { Trash2, Plus, Palette, ChevronDown, Settings as SettingsIcon, Edit2, X } from 'lucide-react';
import { useBudget } from '../hooks/useBudget';
import { useToast } from '../contexts/ToastContext';
import { Category } from '../types';

const Settings: React.FC = () => {
  const { addCategory, updateCategory, deleteCategory, categories, incomeCategories, loading } = useBudget();
  const { showToast } = useToast();
  const [newCategory, setNewCategory] = useState({ 
    name: '', 
    icon: 'Tag', 
    color: '#3B82F6',
    type: 'expense' as 'expense' | 'income'
  });
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState<{
    category: Category;
    isIncome: boolean;
    name: string;
    color: string;
  } | null>(null);

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-1/3 mb-4"></div>
          <div className="h-40 bg-slate-200 rounded-3xl mb-6"></div>
          <div className="h-60 bg-slate-200 rounded-3xl"></div>
        </div>
      </div>
    );
  }

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategory.name.trim()) {
      try {
        await addCategory({
          name: newCategory.name.trim(),
          icon: newCategory.icon,
          color: newCategory.color,
          isCustom: true,
        }, newCategory.type === 'income');
        setNewCategory({ 
          name: '', 
          icon: 'Tag', 
          color: '#3B82F6',
          type: 'expense'
        });
        setShowAddCategory(false);
        showToast('Kategori berhasil ditambahkan!', 'success');
      } catch {
        showToast('Gagal menambahkan kategori. Silakan coba lagi.', 'error');
      }
    }
  };

  const handleEditCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;

    try {
      await updateCategory(
        editingCategory.category.id,
        {
          name: editingCategory.name.trim(),
          color: editingCategory.color,
        },
        editingCategory.isIncome
      );
      setEditingCategory(null);
      showToast('Kategori berhasil diperbarui!', 'success');
    } catch {
      showToast('Gagal memperbarui kategori. Silakan coba lagi.', 'error');
    }
  };

  const handleDeleteCategory = async (categoryId: string, isIncome: boolean, categoryName: string) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus kategori "${categoryName}"?`)) {
      try {
        await deleteCategory(categoryId, isIncome);
        showToast('Kategori berhasil dihapus!', 'success');
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Gagal menghapus kategori. Silakan coba lagi.';
        showToast(errorMessage, 'error');
      }
    }
  };

  const predefinedColors = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
    '#EC4899', '#F97316', '#06B6D4', '#84CC16', '#6B7280'
  ];

  const CategoryItem = ({ 
    category, 
    isIncome, 
    index 
  }: { 
    category: Category; 
    isIncome: boolean; 
    index: number;
  }) => (
    <div
      className="flex items-center space-x-4 p-6 border-2 border-white/30 rounded-2xl bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-200 fade-in"
      style={{ animationDelay: `${300 + index * 50}ms` }}
    >
      <div
        className="w-12 h-12 rounded-xl shadow-sm"
        style={{ backgroundColor: category.color }}
      />
      <span className="text-lg font-bold text-slate-800 dark:text-slate-100 flex-1">{category.name}</span>
      
      {/* Show label for custom categories */}
      {category.isCustom && (
        <span className="text-sm text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-600 px-3 py-1.5 rounded-full font-semibold">
          Kustom
        </span>
      )}
      
      {/* Edit and Delete buttons for ALL categories */}
      <button
        onClick={() => setEditingCategory({
          category,
          isIncome,
          name: category.name,
          color: category.color
        })}
        className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-xl transition-colors duration-200 focus-ring"
        title="Edit kategori"
      >
        <Edit2 className="w-4 h-4" />
      </button>
      <button
        onClick={() => handleDeleteCategory(category.id, isIncome, category.name)}
        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-xl transition-colors duration-200 focus-ring"
        title="Hapus kategori"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center sm:text-left fade-in">
        <div className="flex items-center space-x-4 justify-center sm:justify-start mb-4">
          <div className="p-4 bg-gradient-to-br from-slate-500 to-gray-600 rounded-2xl shadow-lg">
            <SettingsIcon className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-4xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">Pengaturan</h2>
            <p className="text-slate-600 dark:text-slate-300 text-lg sm:text-base font-medium">Kelola kategori dan data Anda</p>
          </div>
        </div>
      </div>

      {/* Add Custom Category */}
      <div className="glass-effect rounded-3xl p-8 border border-white/20 fade-in" style={{ animationDelay: '100ms' }}>
        <button
          onClick={() => setShowAddCategory(!showAddCategory)}
          className="w-full flex items-center justify-between p-6 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-2xl text-slate-700 dark:text-slate-200 font-bold hover:from-emerald-500/20 hover:to-blue-500/20 transition-all duration-300 button-press focus-ring border border-emerald-200/50 dark:border-emerald-500/30"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-2xl shadow-lg">
              <Plus className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl">Tambah Kategori Kustom</span>
          </div>
          <ChevronDown className={`w-6 h-6 transition-transform duration-200 ${showAddCategory ? 'rotate-180' : ''}`} />
        </button>

        {showAddCategory && (
          <form onSubmit={handleAddCategory} className="mt-8 space-y-8 slide-in">
            <div>
              <label className="block text-lg font-bold text-slate-700 dark:text-slate-200 mb-4">
                Nama Kategori
              </label>
              <input
                type="text"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                className="w-full px-6 py-5 border-2 border-slate-200 dark:border-slate-600 rounded-2xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 text-xl font-semibold bg-white/60 dark:bg-slate-700/60 dark:text-slate-100 backdrop-blur-sm input-focus"
                placeholder="🏷️ Masukkan nama kategori"
                required
              />
            </div>

            <div>
              <label className="block text-lg font-bold text-slate-700 dark:text-slate-200 mb-4">
                Tipe Kategori
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label className={`flex items-center justify-center p-6 border-2 rounded-2xl cursor-pointer transition-all duration-200 ${
                  newCategory.type === 'expense' 
                    ? 'border-red-500 bg-red-50 text-red-700' 
                    : 'border-slate-200 dark:border-slate-600 bg-white/60 dark:bg-slate-700/60 text-slate-700 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-500'
                }`}>
                  <input
                    type="radio"
                    name="categoryType"
                    value="expense"
                    checked={newCategory.type === 'expense'}
                    onChange={(e) => setNewCategory({ ...newCategory, type: e.target.value as 'expense' | 'income' })}
                    className="sr-only"
                  />
                  <div className="text-center">
                    <div className="text-2xl mb-2">💸</div>
                    <div className="font-bold text-lg">Pengeluaran</div>
                  </div>
                </label>
                
                <label className={`flex items-center justify-center p-6 border-2 rounded-2xl cursor-pointer transition-all duration-200 ${
                  newCategory.type === 'income' 
                    ? 'border-green-500 bg-green-50 text-green-700' 
                    : 'border-slate-200 dark:border-slate-600 bg-white/60 dark:bg-slate-700/60 text-slate-700 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-500'
                }`}>
                  <input
                    type="radio"
                    name="categoryType"
                    value="income"
                    checked={newCategory.type === 'income'}
                    onChange={(e) => setNewCategory({ ...newCategory, type: e.target.value as 'expense' | 'income' })}
                    className="sr-only"
                  />
                  <div className="text-center">
                    <div className="text-2xl mb-2">💰</div>
                    <div className="font-bold text-lg">Pemasukan</div>
                  </div>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-lg font-bold text-slate-700 dark:text-slate-200 mb-4">
                Warna
              </label>
              <div className="grid grid-cols-5 sm:flex sm:flex-wrap gap-4">
                {predefinedColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setNewCategory({ ...newCategory, color })}
                    className={`w-16 h-16 rounded-2xl border-4 transition-all duration-200 button-press focus-ring ${
                      newCategory.color === color ? 'border-slate-400 scale-110 shadow-lg' : 'border-slate-200 hover:border-slate-300'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <button
                type="submit"
                className="flex-1 py-5 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-2xl hover:from-emerald-600 hover:to-green-700 transition-all duration-300 font-bold text-xl button-press focus-ring shadow-lg shadow-emerald-500/30"
              >
                Tambah Kategori
              </button>
              <button
                type="button"
                onClick={() => setShowAddCategory(false)}
                className="px-8 py-5 bg-white/60 dark:bg-slate-700/60 text-slate-700 dark:text-slate-200 rounded-2xl hover:bg-white/80 dark:hover:bg-slate-600/80 transition-all duration-300 font-bold border-2 border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500 button-press focus-ring"
              >
                Batal
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Current Categories */}
      <div className="glass-effect rounded-3xl p-8 border border-white/20 fade-in" style={{ animationDelay: '200ms' }}>
        <div className="flex items-center space-x-4 mb-8">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-lg">
            <Palette className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Kategori Saat Ini</h3>
        </div>

        {/* Expense Categories */}
        <div className="mb-8">
          <h4 className="text-xl font-bold text-slate-700 dark:text-slate-200 mb-4 flex items-center">
            <span className="text-2xl mr-2">💸</span>
            Kategori Pengeluaran
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {categories.map((category, index) => (
              <CategoryItem
                key={category.id}
                category={category}
                isIncome={false}
                index={index}
              />
            ))}
          </div>
        </div>

        {/* Income Categories */}
        <div>
          <h4 className="text-xl font-bold text-slate-700 dark:text-slate-200 mb-4 flex items-center">
            <span className="text-2xl mr-2">💰</span>
            Kategori Pemasukan
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {incomeCategories.map((category, index) => (
              <CategoryItem
                key={category.id}
                category={category}
                isIncome={true}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="glass-effect rounded-3xl p-8 border border-white/20 fade-in" style={{ animationDelay: '300ms' }}>
        <div className="flex items-center space-x-4 mb-6">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
            <SettingsIcon className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Informasi Aplikasi</h3>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center p-4 bg-white/20 dark:bg-slate-700/20 rounded-2xl">
            <span className="font-semibold text-slate-700 dark:text-slate-200">Versi Aplikasi</span>
            <span className="text-slate-600 dark:text-slate-300">1.0.1</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-white/20 dark:bg-slate-700/20 rounded-2xl">
            <span className="font-semibold text-slate-700 dark:text-slate-200">Mata Uang</span>
            <span className="text-slate-600 dark:text-slate-300">Rupiah (IDR)</span>
          </div>
        </div>
      </div>

      {/* Edit Category Modal */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 mx-4 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Edit Kategori</h3>
              <button
                onClick={() => setEditingCategory(null)}
                className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors duration-200 focus-ring"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleEditCategory} className="space-y-6">
              <div>
                <label className="block text-lg font-bold text-slate-700 dark:text-slate-200 mb-3">
                  Nama Kategori
                </label>
                <input
                  type="text"
                  value={editingCategory.name}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-600 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 text-lg font-semibold bg-white dark:bg-slate-700 dark:text-slate-100"
                  placeholder="Masukkan nama kategori"
                  required
                />
              </div>

              <div>
                <label className="block text-lg font-bold text-slate-700 dark:text-slate-200 mb-3">
                  Warna
                </label>
                <div className="grid grid-cols-5 gap-3">
                  {predefinedColors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setEditingCategory({ ...editingCategory, color })}
                      className={`w-12 h-12 rounded-xl border-4 transition-all duration-200 button-press focus-ring ${
                        editingCategory.color === color ? 'border-slate-400 scale-110 shadow-lg' : 'border-slate-200 hover:border-slate-300'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl hover:from-emerald-600 hover:to-green-700 transition-all duration-300 font-bold button-press focus-ring shadow-lg shadow-emerald-500/30"
                >
                  Simpan
                </button>
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  className="px-6 py-3 bg-slate-100 dark:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-500 transition-all duration-300 font-bold border-2 border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500 button-press focus-ring"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;