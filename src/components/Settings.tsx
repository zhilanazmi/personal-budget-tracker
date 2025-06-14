import React, { useState } from 'react';
import { Download, Upload, Trash2, Plus, Palette, ChevronDown } from 'lucide-react';
import { useBudget } from '../hooks/useBudget';
import { storage } from '../utils/storage';

const Settings: React.FC = () => {
  const { addCategory, categories } = useBudget();
  const [newCategory, setNewCategory] = useState({ name: '', icon: 'Tag', color: '#3B82F6' });
  const [importData, setImportData] = useState('');
  const [showImport, setShowImport] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);

  const handleExport = () => {
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
  };

  const handleImport = (e: React.FormEvent) => {
    e.preventDefault();
    if (storage.importData(importData)) {
      alert('Data imported successfully! Please refresh the page.');
      setImportData('');
      setShowImport(false);
    } else {
      alert('Import failed. Please check your data format.');
    }
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategory.name.trim()) {
      addCategory({
        name: newCategory.name.trim(),
        icon: newCategory.icon,
        color: newCategory.color,
        isCustom: true,
      });
      setNewCategory({ name: '', icon: 'Tag', color: '#3B82F6' });
      setShowAddCategory(false);
    }
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const predefinedColors = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
    '#EC4899', '#F97316', '#06B6D4', '#84CC16', '#6B7280'
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center sm:text-left">
        <h2 className="text-3xl sm:text-2xl font-bold text-gray-900 mb-2">Settings</h2>
        <p className="text-gray-600 text-lg sm:text-base">Manage your categories and data</p>
      </div>

      {/* Add Custom Category */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <button
          onClick={() => setShowAddCategory(!showAddCategory)}
          className="w-full flex items-center justify-between p-4 bg-emerald-50 rounded-xl text-emerald-700 font-semibold hover:bg-emerald-100 transition-colors duration-200 active:scale-95"
        >
          <div className="flex items-center space-x-3">
            <Plus className="w-6 h-6" />
            <span className="text-lg">Add Custom Category</span>
          </div>
          <ChevronDown className={`w-5 h-5 transition-transform ${showAddCategory ? 'rotate-180' : ''}`} />
        </button>

        {showAddCategory && (
          <form onSubmit={handleAddCategory} className="mt-6 space-y-6">
            <div>
              <label className="block text-base font-semibold text-gray-700 mb-3">
                Category Name
              </label>
              <input
                type="text"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-lg"
                placeholder="Enter category name"
                required
              />
            </div>

            <div>
              <label className="block text-base font-semibold text-gray-700 mb-3">
                Color
              </label>
              <div className="grid grid-cols-5 sm:flex sm:flex-wrap gap-3">
                {predefinedColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setNewCategory({ ...newCategory, color })}
                    className={`w-12 h-12 rounded-xl border-3 transition-all duration-200 active:scale-95 ${
                      newCategory.color === color ? 'border-gray-400 scale-110' : 'border-gray-200'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                className="flex-1 py-4 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors duration-200 font-semibold text-lg active:scale-95"
              >
                Add Category
              </button>
              <button
                type="button"
                onClick={() => setShowAddCategory(false)}
                className="px-6 py-4 bg-gray-300 text-gray-700 rounded-xl hover:bg-gray-400 transition-colors duration-200 font-semibold active:scale-95"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Current Categories */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Palette className="w-6 h-6 text-gray-600" />
          <h3 className="text-xl font-semibold text-gray-900">Current Categories</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {categories.map((category) => (
            <div
              key={category.id}
              className="flex items-center space-x-4 p-4 border-2 border-gray-200 rounded-xl"
            >
              <div
                className="w-6 h-6 rounded-full"
                style={{ backgroundColor: category.color }}
              />
              <span className="text-base font-medium text-gray-900 flex-1">{category.name}</span>
              {category.isCustom && (
                <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  Custom
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Download className="w-6 h-6 text-gray-600" />
          <h3 className="text-xl font-semibold text-gray-900">Data Management</h3>
        </div>

        <div className="space-y-4">
          {/* Export */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border-2 border-gray-200 rounded-xl space-y-3 sm:space-y-0">
            <div>
              <h4 className="font-semibold text-gray-900 text-lg">Export Data</h4>
              <p className="text-gray-500">Download your data as a JSON file</p>
            </div>
            <button
              onClick={handleExport}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200 font-semibold active:scale-95"
            >
              Export
            </button>
          </div>

          {/* Import */}
          <div className="border-2 border-gray-200 rounded-xl">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 space-y-3 sm:space-y-0">
              <div>
                <h4 className="font-semibold text-gray-900 text-lg">Import Data</h4>
                <p className="text-gray-500">Restore data from a JSON file</p>
              </div>
              <button
                onClick={() => setShowImport(!showImport)}
                className="px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors duration-200 font-semibold active:scale-95"
              >
                Import
              </button>
            </div>

            {showImport && (
              <div className="border-t-2 border-gray-200 p-4">
                <form onSubmit={handleImport} className="space-y-4">
                  <textarea
                    value={importData}
                    onChange={(e) => setImportData(e.target.value)}
                    className="w-full h-40 px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-base"
                    placeholder="Paste your exported JSON data here..."
                    required
                  />
                  <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                    <button
                      type="submit"
                      className="flex-1 py-4 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors duration-200 font-semibold active:scale-95"
                    >
                      Import Data
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowImport(false);
                        setImportData('');
                      }}
                      className="flex-1 py-4 bg-gray-300 text-gray-700 rounded-xl hover:bg-gray-400 transition-colors duration-200 font-semibold active:scale-95"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* Clear Data */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border-2 border-red-200 rounded-xl bg-red-50 space-y-3 sm:space-y-0">
            <div>
              <h4 className="font-semibold text-red-900 text-lg">Clear All Data</h4>
              <p className="text-red-600">Permanently delete all transactions and categories</p>
            </div>
            <button
              onClick={handleClearData}
              className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors duration-200 font-semibold active:scale-95"
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