import React, { useState } from 'react';
import { 
  Car, Coffee, ShoppingCart, FileText, Home, Film, ShoppingBag, BookOpen, 
  Heart, PiggyBank, MoreHorizontal, Briefcase, Laptop, Building, TrendingUp, 
  Plus, Wallet, Building2, Smartphone, CreditCard, Banknote, Landmark, 
  Phone, Tag, Utensils, Gamepad2, Music, Plane, Bus, Fuel, Shirt, 
  Gift, Baby, Stethoscope, Dumbbell, GraduationCap, Wrench, Zap, 
  Wifi, Tv, Newspaper, Coffee as CoffeeIcon, Pizza, IceCream, 
  Search, X, ChevronDown
} from 'lucide-react';

interface IconPickerProps {
  selectedIcon: string;
  onIconSelect: (iconName: string) => void;
  onClose: () => void;
}

const IconPicker: React.FC<IconPickerProps> = ({ selectedIcon, onIconSelect, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const iconCategories = {
    all: 'Semua',
    transport: 'Transportasi',
    food: 'Makanan & Minuman',
    shopping: 'Belanja',
    entertainment: 'Hiburan',
    health: 'Kesehatan',
    education: 'Pendidikan',
    bills: 'Tagihan',
    finance: 'Keuangan',
    work: 'Pekerjaan',
    other: 'Lainnya'
  };

  const availableIcons = [
    // Transport
    { name: 'Car', icon: Car, category: 'transport', label: 'Mobil' },
    { name: 'Bus', icon: Bus, category: 'transport', label: 'Bus' },
    { name: 'Plane', icon: Plane, category: 'transport', label: 'Pesawat' },
    { name: 'Fuel', icon: Fuel, category: 'transport', label: 'Bahan Bakar' },
    
    // Food & Drink
    { name: 'Coffee', icon: Coffee, category: 'food', label: 'Kopi' },
    { name: 'Utensils', icon: Utensils, category: 'food', label: 'Makanan' },
    { name: 'Pizza', icon: Pizza, category: 'food', label: 'Pizza' },
    { name: 'IceCream', icon: IceCream, category: 'food', label: 'Es Krim' },
    { name: 'ShoppingCart', icon: ShoppingCart, category: 'food', label: 'Belanja Groceries' },
    
    // Shopping
    { name: 'ShoppingBag', icon: ShoppingBag, category: 'shopping', label: 'Belanja' },
    { name: 'Shirt', icon: Shirt, category: 'shopping', label: 'Pakaian' },
    { name: 'Gift', icon: Gift, category: 'shopping', label: 'Hadiah' },
    
    // Entertainment
    { name: 'Film', icon: Film, category: 'entertainment', label: 'Film' },
    { name: 'Gamepad2', icon: Gamepad2, category: 'entertainment', label: 'Game' },
    { name: 'Music', icon: Music, category: 'entertainment', label: 'Musik' },
    { name: 'Tv', icon: Tv, category: 'entertainment', label: 'TV' },
    
    // Health
    { name: 'Heart', icon: Heart, category: 'health', label: 'Kesehatan' },
    { name: 'Stethoscope', icon: Stethoscope, category: 'health', label: 'Dokter' },
    { name: 'Dumbbell', icon: Dumbbell, category: 'health', label: 'Fitness' },
    { name: 'Baby', icon: Baby, category: 'health', label: 'Bayi' },
    
    // Education
    { name: 'BookOpen', icon: BookOpen, category: 'education', label: 'Buku' },
    { name: 'GraduationCap', icon: GraduationCap, category: 'education', label: 'Pendidikan' },
    
    // Bills & Utilities
    { name: 'FileText', icon: FileText, category: 'bills', label: 'Tagihan' },
    { name: 'Home', icon: Home, category: 'bills', label: 'Rumah' },
    { name: 'Zap', icon: Zap, category: 'bills', label: 'Listrik' },
    { name: 'Wifi', icon: Wifi, category: 'bills', label: 'Internet' },
    { name: 'Phone', icon: Phone, category: 'bills', label: 'Telepon' },
    { name: 'Wrench', icon: Wrench, category: 'bills', label: 'Perbaikan' },
    
    // Finance
    { name: 'Wallet', icon: Wallet, category: 'finance', label: 'Dompet' },
    { name: 'PiggyBank', icon: PiggyBank, category: 'finance', label: 'Tabungan' },
    { name: 'TrendingUp', icon: TrendingUp, category: 'finance', label: 'Investasi' },
    { name: 'CreditCard', icon: CreditCard, category: 'finance', label: 'Kartu Kredit' },
    { name: 'Building2', icon: Building2, category: 'finance', label: 'Bank' },
    { name: 'Banknote', icon: Banknote, category: 'finance', label: 'Uang Tunai' },
    { name: 'Landmark', icon: Landmark, category: 'finance', label: 'Bank' },
    { name: 'Smartphone', icon: Smartphone, category: 'finance', label: 'Dompet Digital' },
    
    // Work
    { name: 'Briefcase', icon: Briefcase, category: 'work', label: 'Kerja' },
    { name: 'Laptop', icon: Laptop, category: 'work', label: 'Freelance' },
    { name: 'Building', icon: Building, category: 'work', label: 'Bisnis' },
    
    // Other
    { name: 'Tag', icon: Tag, category: 'other', label: 'Tag' },
    { name: 'Plus', icon: Plus, category: 'other', label: 'Tambah' },
    { name: 'MoreHorizontal', icon: MoreHorizontal, category: 'other', label: 'Lainnya' },
    { name: 'Newspaper', icon: Newspaper, category: 'other', label: 'Berita' },
  ];

  const filteredIcons = availableIcons.filter(iconData => {
    const matchesSearch = iconData.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         iconData.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || iconData.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h3 className="text-2xl font-bold text-slate-800">Pilih Ikon</h3>
          <button
            onClick={onClose}
            className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors duration-200 focus-ring"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Search and Filter */}
        <div className="p-6 border-b border-slate-200 space-y-4">
          {/* Search */}
          <div className="relative">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 p-1.5 bg-slate-100 rounded-lg">
              <Search className="text-slate-600 w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Cari ikon..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 text-lg font-medium bg-white input-focus transition-all duration-200"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 text-lg font-medium bg-white appearance-none cursor-pointer"
            >
              {Object.entries(iconCategories).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500 pointer-events-none" />
          </div>
        </div>

        {/* Icons Grid */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {filteredIcons.length === 0 ? (
            <div className="text-center py-12">
              <Search className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-slate-600 mb-2">Tidak ada ikon ditemukan</h4>
              <p className="text-slate-500">Coba ubah kata kunci pencarian atau kategori</p>
            </div>
          ) : (
            <div className="grid grid-cols-6 sm:grid-cols-8 gap-3">
              {filteredIcons.map((iconData, index) => {
                const IconComponent = iconData.icon;
                const isSelected = selectedIcon === iconData.name;
                
                return (
                  <button
                    key={iconData.name}
                    onClick={() => {
                      onIconSelect(iconData.name);
                      onClose();
                    }}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all duration-200 button-press focus-ring group ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-lg'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                    style={{ animationDelay: `${index * 20}ms` }}
                    title={iconData.label}
                  >
                    <IconComponent className="w-6 h-6 mb-1" />
                    <span className="text-xs font-medium text-center leading-tight">
                      {iconData.label}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-200 bg-slate-50">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-600">
              {filteredIcons.length} ikon tersedia
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-slate-200 text-slate-700 rounded-xl hover:bg-slate-300 transition-colors duration-200 font-semibold button-press focus-ring"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IconPicker;