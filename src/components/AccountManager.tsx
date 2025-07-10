Here's the fixed version with all missing closing brackets and proper structure:

import React, { useState } from 'react';
import { Plus, Wallet, Building2, Smartphone, CreditCard, PiggyBank, TrendingUp, MoreHorizontal, Edit3, Trash2, Eye, X, Calendar, ArrowUpRight, ArrowDownRight, ArrowRightLeft } from 'lucide-react';
import { useBudget } from '../hooks/useBudget';
import { useToast } from '../contexts/ToastContext';
import { Account, Transaction } from '../types';
import { formatCurrency, formatDate } from '../utils/dateUtils';

const AccountManager: React.FC = () => {
  // ... [previous code remains the same until the accounts mapping] ...

  return (
    <div className="space-y-8">
      {/* ... [previous JSX remains the same until accounts mapping] ... */}

      {/* Accounts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map((account, index) => {
          const IconComponent = getIconComponent(account.icon);
          const accountTransactions = getAccountTransactions(account.id);
          
          return (
            <div 
              key={account.id}
              className="glass-effect rounded-3xl p-6 border border-white/20 transition-all duration-300 group hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2 hover:border-blue-200/50 fade-in relative overflow-hidden"
            >
              {/* ... [account card content remains the same] ... */}
                        {accountTransactions.length > 0 ? (
                          <div className="space-y-1">
                            {accountTransactions.slice(0, 2).map((transaction) => (
                              <div key={transaction.id} className="flex items-center justify-between text-xs">
                                <span className="text-slate-600 dark:text-slate-300 truncate flex-1 mr-2">{transaction.description}</span>
                                <span className={`font-bold ${getTransactionColor(transaction, account.id)}`}>
                                  {getTransactionAmount(transaction, account.id) > 0 ? '+' : ''}
                                  {formatCurrency(Math.abs(getTransactionAmount(transaction, account.id)))}
                                </span>
                              </div>
                            ))}
                            {accountTransactions.length > 2 && (
                              <div className="text-xs text-slate-400 dark:text-slate-500 text-center pt-1">
                                +{accountTransactions.length - 2} transaksi lainnya
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-xs text-slate-400 dark:text-slate-500 italic">Belum ada transaksi</div>
                        )}
                    </div>
                </div>
            </div>
          );
        })}
      </div>

      {/* ... [remaining modal and other JSX] ... */}

      {/* Account Details Modal */}
      {selectedAccountDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
            {/* ... [modal content remains the same] ... */}
            <div className="p-6 border-t border-slate-200 bg-slate-50">
              <button
                onClick={() => setSelectedAccountDetails(null)}
                className="w-full py-3 bg-slate-200 text-slate-700 rounded-2xl hover:bg-slate-300 transition-colors duration-200 font-semibold button-press focus-ring"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountManager;