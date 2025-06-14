import React, { useState } from 'react';
import { Download, Upload, Trash2, Plus, Palette, ChevronDown, Settings as SettingsIcon } from 'lucide-react';
import { useBudget } from '../hooks/useBudget';
import { useToast } from '../contexts/ToastContext';
import { storage } from '../utils/storage';

const Settings: React.FC = () => {
  const { addCategory, categories } = useBudget();
  const { showToast } = useToast();
  const [newCategory, setNewCategory] = useState({ name: '', icon: 'Tag', color: '#3B82F6' });
  const [importData, setImportData] = useState('');
  const [showImport, setShowImport] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);

  const handleExport = () => {
    try {
      const data = storage.exportData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `budget-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('Data exported successfully!', 'success');
    } catch (error) {
      showToast('Failed to export data. Please try again.', 'error');
    }
  };

  const handleImport = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (storage.importData(importData)) {
        showToast('Data imported successfully! Please refresh the page.', 'success');
        setImportData('');
        setShowImport(false);
      } else {
        showToast('Import failed. Please check your data format.', 'error');
      }
    } catch (error) {
      showToast('Import failed. Please check your data format.', 'error');
    }
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategory.name.trim()) {
      try {
        addCategory({
          name: newCategory.name.trim(),
          icon: newCategory.icon,
          color: newCategory.color,
          isCustom: true,
        });
        setNewCategory({ name: '', icon: 'Tag', color: '#3B82F6' });
        setShowAddCategory(false);
        showToast('Category added successfully!', 'success');
      } catch (error) {
        showToast('Failed to add category. Please try again.', 'error');
      }
    }
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      try {
        localStorage.clear();
        showToast('All data cleared successfully!', 'success');
        setTimeout(() => window.location.reload(), 1000);
      } catch (error) {
        showToast('Failed to clear data. Please try again.', 'error');
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
            <h2 className="text-4xl sm:text-3xl font-bold text-slate-800 tracking-tight">Settings</h2>
            <p className="text-slate-600 text-lg sm:text-base font-medium">Manage your categories and data</p>
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
            <span className="text-xl">Add Custom Category</span>
          </div>
          <ChevronDown className={`w-6 h-6 transition-transform duration-200 ${showAddCategory ? 'rotate-180' : ''}`} />
        </button>

        {showAddCategory && (
          <form onSubmit={handleAddCategory} className="mt-8 space-y-8 slide-in">
            <div>
              <label className="block text-lg font-bold text-slate-700 mb-4">
                Category Name
              </label>
              <input
                type="text"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                className="w-full px-6 py-5 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 text-xl font-semibold bg-white/60 backdrop-blur-sm input-focus"
                placeholder="Enter category name"
                required
              />
            </div>

            <div>
              <label className="block text-lg font-bold text-slate-700 mb-4">
                Color
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
                Add Category
              </button>
              <button
                type="button"
                onClick={() => setShowAddCategory(false)}
                className="px-8 py-5 bg-white/60 text-slate-700 rounded-2xl hover:bg-white/80 transition-all duration-300 font-bold border-2 border-slate-200 hover:border-slate-300 button-press focus-ring"
              >
                Cancel
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
          <h3 className="text-2xl font-bold text-slate-800">Current Categories</h3>
        </div>

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
                  Custom
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Data Management */}
      <div className="glass-effect rounded-3xl p-8 border border-white/20 fade-in" style={{ animationDelay: '300ms' }}>
        <div className="flex items-center space-x-4 mb-8">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
            <Download className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-slate-800">Data Management</h3>
        </div>

        <div className="space-y-6">
          {/* Export */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-6 border-2 border-white/30 rounded-2xl bg-white/20 backdrop-blur-sm space-y-4 sm:space-y-0">
            <div>
              <h4 className="font-bold text-slate-800 text-xl mb-2">Export Data</h4>
              <p className="text-slate-600 font-medium">Download your data as a JSON file</p>
            </div>
            <button
              onClick={handleExport}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 font-bold button-press focus-ring shadow-lg shadow-blue-500/30"
            >
              Export
            </button>
          </div>

          {/* Import */}
          <div className="border-2 border-white/30 rounded-2xl bg-white/20 backdrop-blur-sm overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-6 space-y-4 sm:space-y-0">
              <div>
                <h4 className="font-bold text-slate-800 text-xl mb-2">Import Data</h4>
                <p className="text-slate-600 font-medium">Restore data from a JSON file</p>
              </div>
              <button
                onClick={() => setShowImport(!showImport)}
                className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-2xl hover:from-emerald-600 hover:to-green-700 transition-all duration-300 font-bold button-press focus-ring shadow-lg shadow-emerald-500/30"
              >
                Import
              </button>
            </div>

            {showImport && (
              <div className="border-t-2 border-white/30 p-6 bg-white/10 slide-in">
                <form onSubmit={handleImport} className="space-y-6">
                  <textarea
                    value={importData}
                    onChange={(e) => setImportData(e.target.value)}
                    className="w-full h-48 px-6 py-5 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 text-lg font-medium bg-white/60 backdrop-blur-sm resize-none"
                    placeholder="Paste your exported JSON data here..."
                    required
                  />
                  <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                    <button
                      type="submit"
                      className="flex-1 py-5 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-2xl hover:from-emerald-600 hover:to-green-700 transition-all duration-300 font-bold text-xl button-press focus-ring shadow-lg shadow-emerald-500/30"
                    >
                      Import Data
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowImport(false);
                        setImportData('');
                      }}
                      className="flex-1 py-5 bg-white/60 text-slate-700 rounded-2xl hover:bg-white/80 transition-all duration-300 font-bold border-2 border-slate-200 hover:border-slate-300 button-press focus-ring"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* Clear Data */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-6 border-2 border-red-200 rounded-2xl bg-gradient-to-r from-red-50/50 to-pink-50/50 backdrop-blur-sm space-y-4 sm:space-y-0">
            <div>
              <h4 className="font-bold text-red-800 text-xl mb-2">Clear All Data</h4>
              <p className="text-red-600 font-medium">Permanently delete all transactions and categories</p>
            </div>
            <button
              onClick={handleClearData}
              className="px-8 py-4 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-2xl hover:from-red-600 hover:to-pink-700 transition-all duration-300 font-bold button-press focus-ring shadow-lg shadow-red-500/30"
            >
              Clear Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;