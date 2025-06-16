import React, { useState } from 'react';
import { Download, Upload, Trash2, Plus, Palette, ChevronDown, Settings as SettingsIcon } from 'lucide-react';
import { useBudget } from '../hooks/useBudget';
import { useToast } from '../contexts/ToastContext';

const Settings: React.FC = () => {
  const { addCategory, categories, incomeCategories, loading } = useBudget();
  const { showToast } = useToast();
  const [newCategory, setNewCategory] = useState({ 
    name: '', 
    icon: 'Tag', 
    color: '#3B82F6',
    type: 'expense' as 'expense' | 'income'
  });
  const [showAddCategory, setShowAddCategory] = useState(false);

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
      } catch (error) {
        showToast('Gagal menambahkan kategori. Silakan coba lagi.', 'error');
      }
    }
  };

  const predefinedColors = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
    '#EC4899', '#F97316', '#06B6D4', '#84CC16', '#6B7280'
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center sm:text-left fade-in">
        <div className="flex items-center space-x-4 justify-center sm:justify-start mb-4">
          <div className="p-4 bg-gradient-to-br from-slate-500 to-gray-600 rounded-2xl shadow-lg">
            <SettingsIcon className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-4xl sm:text-3xl font-bold text-slate-800 tracking-tight">Pengaturan</h2>
            <p className="text-slate-600 text-lg sm:text-base font-medium">Kelola kategori dan data Anda</p>
          </div>
        </div>
      </div>

      {/* Add Custom Category */}
      <div className="glass-effect rounded-3xl p-8 border border-white/20 fade-in" style={{ animationDelay: '100ms' }}>
        <button
          onClick={() => setShowAddCategory(!showAddCategory)}
          className="w-full flex items-center justify-between p-6 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-2xl text-slate-700 font-bold hover:from-emerald-500/20 hover:to-blue-500/20 transition-all duration-300 button-press focus-ring border border-emerald-200/50"
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
              <label className="block text-lg font-bold text-slate-700 mb-4">
                Nama Kategori
              </label>
              <input
                type="text"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                className="w-full px-6 py-5 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 text-xl font-semibold bg-white/60 backdrop-blur-sm input-focus"
                placeholder="🏷️ Masukkan nama kategori"
                required
              />
            </div>

            <div>
              <label className="block text-lg font-bold text-slate-700 mb-4">
                Tipe Kategori
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label className={`flex items-center justify-center p-6 border-2 rounded-2xl cursor-pointer transition-all duration-200 ${
                  newCategory.type === 'expense' 
                    ? 'border-red-500 bg-red-50 text-red-700' 
                    : 'border-slate-200 bg-white/60 text-slate-700 hover:border-slate-300'
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
                    : 'border-slate-200 bg-white/60 text-slate-700 hover:border-slate-300'
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
              <label className="block text-lg font-bold text-slate-700 mb-4">
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
                className="px-8 py-5 bg-white/60 text-slate-700 rounded-2xl hover:bg-white/80 transition-all duration-300 font-bold border-2 border-slate-200 hover:border-slate-300 button-press focus-ring"
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
          <h3 className="text-2xl font-bold text-slate-800">Kategori Saat Ini</h3>
        </div>

        {/* Expense Categories */}
        <div className="mb-8">
          <h4 className="text-xl font-bold text-slate-700 mb-4 flex items-center">
            <span className="text-2xl mr-2">💸</span>
            Kategori Pengeluaran
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {categories.map((category, index) => (
              <div
                key={category.id}
                className="flex items-center space-x-4 p-6 border-2 border-white/30 rounded-2xl bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-200 fade-in"
                style={{ animationDelay: `${300 + index * 50}ms` }}
              >
                <div
                  className="w-8 h-8 rounded-full shadow-sm"
                  style={{ backgroundColor: category.color }}
                />
                <span className="text-lg font-bold text-slate-800 flex-1">{category.name}</span>
                {category.isCustom && (
                  <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full font-semibold">
                    Kustom
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Income Categories */}
        <div>
          <h4 className="text-xl font-bold text-slate-700 mb-4 flex items-center">
            <span className="text-2xl mr-2">💰</span>
            Kategori Pemasukan
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {incomeCategories.map((category, index) => (
              <div
                key={category.id}
                className="flex items-center space-x-4 p-6 border-2 border-white/30 rounded-2xl bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-200 fade-in"
                style={{ animationDelay: `${400 + index * 50}ms` }}
              >
                <div
                  className="w-8 h-8 rounded-full shadow-sm"
                  style={{ backgroundColor: category.color }}
                />
                <span className="text-lg font-bold text-slate-800 flex-1">{category.name}</span>
                {category.isCustom && (
                  <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full font-semibold">
                    Kustom
                  </span>
                )}
              </div>
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
          <h3 className="text-2xl font-bold text-slate-800">Informasi Aplikasi</h3>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center p-4 bg-white/20 rounded-2xl">
            <span className="font-semibold text-slate-700">Versi Aplikasi</span>
            <span className="text-slate-600">1.0.0</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-white/20 rounded-2xl">
            <span className="font-semibold text-slate-700">Database</span>
            <span className="text-emerald-600 font-semibold">Supabase</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-white/20 rounded-2xl">
            <span className="font-semibold text-slate-700">Mata Uang</span>
            <span className="text-slate-600">Rupiah (IDR)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;