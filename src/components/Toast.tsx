import React, { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { useToast, ToastType } from '../contexts/ToastContext';

const Toast: React.FC = () => {
  const { toasts, removeToast } = useToast();

  const getToastIcon = (type: ToastType) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-6 h-6" />;
      case 'error':
        return <XCircle className="w-6 h-6" />;
      case 'warning':
        return <AlertCircle className="w-6 h-6" />;
      case 'info':
        return <Info className="w-6 h-6" />;
      default:
        return <Info className="w-6 h-6" />;
    }
  };

  const getToastStyles = (type: ToastType) => {
    switch (type) {
      case 'success':
        return 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-emerald-500/30';
      case 'error':
        return 'bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-red-500/30';
      case 'warning':
        return 'bg-gradient-to-r from-orange-500 to-yellow-600 text-white shadow-orange-500/30';
      case 'info':
        return 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-blue-500/30';
      default:
        return 'bg-gradient-to-r from-slate-500 to-gray-600 text-white shadow-slate-500/30';
    }
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm w-full">
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          className={`flex items-center space-x-4 p-4 rounded-2xl shadow-xl border border-white/20 backdrop-blur-sm transition-all duration-300 slide-in ${getToastStyles(toast.type)}`}
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="flex-shrink-0">
            {getToastIcon(toast.type)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-lg leading-tight">{toast.message}</p>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="flex-shrink-0 p-1 hover:bg-white/20 rounded-lg transition-colors duration-200 focus-ring"
            aria-label="Close notification"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default Toast;