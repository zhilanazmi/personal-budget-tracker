import React from 'react';
import { HelpCircle } from 'lucide-react';

interface FloatingHelpButtonProps {
  onNavigate: (tab: string) => void;
}

const FloatingHelpButton: React.FC<FloatingHelpButtonProps> = ({ onNavigate }) => {
  return (
    <button
      onClick={() => onNavigate('help')}
      className="fixed bottom-20 right-6 z-50 p-4 bg-gradient-to-br from-cyan-500 to-blue-600 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 group button-press focus-ring"
      title="Buka Panduan Pengguna"
    >
      <HelpCircle className="w-7 h-7 group-hover:scale-110 transition-transform duration-200" />
      
      {/* Pulse effect */}
      <div className="absolute inset-0 rounded-full bg-cyan-400 opacity-75 animate-ping group-hover:animate-none"></div>
      
      {/* Tooltip */}
      <div className="absolute bottom-full right-0 mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        <div className="bg-slate-800 text-white text-sm font-medium px-3 py-2 rounded-xl shadow-lg whitespace-nowrap">
          Panduan Pengguna
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-800"></div>
        </div>
      </div>
    </button>
  );
};

export default FloatingHelpButton; 