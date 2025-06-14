import React, { useState } from 'react';
import { Download, Upload, Trash2, Plus, Palette } from 'lucide-react';
import { useBudget } from '../hooks/useBudget';
import { storage } from '../utils/storage';

const Settings: React.FC = () => {
  const { addCategory, categories } = useBudget();
  const [newCategory, setNewCategory] = useState({ name: '', icon: 'Tag', color: '#3B82F6' });
  const [importData, setImportData] = useState('');
  const [showImport, setShowImport] = useState(false);

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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
          <p className="text-gray-600">Manage your categories and data</p>
        </div>
      </div>

      {/* Add Custom Category */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Plus className="w-6 h-6 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Add Custom Category</h3>
        </div>

        <form onSubmit={handleAddCategory} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category Name
              </label>
              <input
                type="text"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Enter category name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color
              </label>
              <div className="flex space-x-2">
                {predefinedColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setNewCategory({ ...newCategory, color })}
                    className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                      newCategory.color === color ? 'border-gray-400 scale-110' : 'border-gray-200'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200"
          >
            Add Category
          </button>
        </form>
      </div>

      {/* Current Categories */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Palette className="w-6 h-6 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Current Categories</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {categories.map((category) => (
            <div
              key={category.id}
              className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg"
            >
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: category.color }}
              />
              <span className="text-sm font-medium text-gray-900">{category.name}</span>
              {category.isCustom && (
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  Custom
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Download className="w-6 h-6 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Data Management</h3>
        </div>

        <div className="space-y-4">
          {/* Export */}
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Export Data</h4>
              <p className="text-sm text-gray-500">Download your data as a JSON file</p>
            </div>
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Export
            </button>
          </div>

          {/* Import */}
          <div className="border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between p-4">
              <div>
                <h4 className="font-medium text-gray-900">Import Data</h4>
                <p className="text-sm text-gray-500">Restore data from a JSON file</p>
              </div>
              <button
                onClick={() => setShowImport(!showImport)}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200"
              >
                Import
              </button>
            </div>

            {showImport && (
              <div className="border-t border-gray-200 p-4">
                <form onSubmit={handleImport} className="space-y-4">
                  <textarea
                    value={importData}
                    onChange={(e) => setImportData(e.target.value)}
                    className="w-full h-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Paste your exported JSON data here..."
                    required
                  />
                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200"
                    >
                      Import Data
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowImport(false);
                        setImportData('');
                      }}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* Clear Data */}
          <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
            <div>
              <h4 className="font-medium text-red-900">Clear All Data</h4>
              <p className="text-sm text-red-600">Permanently delete all transactions and categories</p>
            </div>
            <button
              onClick={handleClearData}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
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