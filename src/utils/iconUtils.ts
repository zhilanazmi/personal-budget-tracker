import { 
  Car, Coffee, ShoppingCart, FileText, Home, Film, ShoppingBag, BookOpen, 
  Heart, PiggyBank, MoreHorizontal, Briefcase, Laptop, Building, TrendingUp, 
  Plus, Wallet, Building2, Smartphone, CreditCard, Banknote, Landmark, 
  Phone, Tag, Utensils, Gamepad2, Music, Plane, Bus, Fuel, Shirt, 
  Gift, Baby, Stethoscope, Dumbbell, GraduationCap, Wrench, Zap, 
  Wifi, Tv, Newspaper, Pizza, IceCream, Minus, ArrowRightLeft
} from 'lucide-react';

// Icon mapping for all available icons
export const iconMap = {
  // Transport
  Car,
  Bus,
  Plane,
  Fuel,
  
  // Food & Drink
  Coffee,
  Utensils,
  Pizza,
  IceCream,
  ShoppingCart,
  
  // Shopping
  ShoppingBag,
  Shirt,
  Gift,
  
  // Entertainment
  Film,
  Gamepad2,
  Music,
  Tv,
  
  // Health
  Heart,
  Stethoscope,
  Dumbbell,
  Baby,
  
  // Education
  BookOpen,
  GraduationCap,
  
  // Bills & Utilities
  FileText,
  Home,
  Zap,
  Wifi,
  Phone,
  Wrench,
  
  // Finance
  Wallet,
  PiggyBank,
  TrendingUp,
  CreditCard,
  Building2,
  Banknote,
  Landmark,
  Smartphone,
  
  // Work
  Briefcase,
  Laptop,
  Building,
  
  // Transaction Types
  Plus,
  Minus,
  ArrowRightLeft,
  
  // Other
  Tag,
  MoreHorizontal,
  Newspaper,
};

// Helper function to get icon component by name
export const getIconComponent = (iconName: string) => {
  return iconMap[iconName as keyof typeof iconMap] || Tag;
};

// Helper function to get category icon suggestions based on category name
export const getCategoryIconSuggestion = (categoryName: string): string => {
  const name = categoryName.toLowerCase();
  
  // Transport
  if (name.includes('transport') || name.includes('mobil') || name.includes('motor')) return 'Car';
  if (name.includes('bus') || name.includes('angkot')) return 'Bus';
  if (name.includes('pesawat') || name.includes('tiket')) return 'Plane';
  if (name.includes('bensin') || name.includes('bahan bakar')) return 'Fuel';
  
  // Food & Drink
  if (name.includes('makanan') || name.includes('makan') || name.includes('food')) return 'Utensils';
  if (name.includes('kopi') || name.includes('coffee') || name.includes('drink')) return 'Coffee';
  if (name.includes('snack') || name.includes('cemilan')) return 'IceCream';
  if (name.includes('groceries') || name.includes('belanja')) return 'ShoppingCart';
  
  // Shopping
  if (name.includes('shopping') || name.includes('belanja') || name.includes('beli')) return 'ShoppingBag';
  if (name.includes('pakaian') || name.includes('baju') || name.includes('clothes')) return 'Shirt';
  if (name.includes('hadiah') || name.includes('gift')) return 'Gift';
  
  // Entertainment
  if (name.includes('film') || name.includes('movie') || name.includes('cinema')) return 'Film';
  if (name.includes('game') || name.includes('gaming')) return 'Gamepad2';
  if (name.includes('musik') || name.includes('music')) return 'Music';
  if (name.includes('tv') || name.includes('netflix')) return 'Tv';
  
  // Health
  if (name.includes('kesehatan') || name.includes('health') || name.includes('dokter')) return 'Heart';
  if (name.includes('rumah sakit') || name.includes('hospital')) return 'Stethoscope';
  if (name.includes('gym') || name.includes('fitness') || name.includes('olahraga')) return 'Dumbbell';
  if (name.includes('bayi') || name.includes('baby')) return 'Baby';
  
  // Education
  if (name.includes('pendidikan') || name.includes('sekolah') || name.includes('education')) return 'BookOpen';
  if (name.includes('kuliah') || name.includes('universitas')) return 'GraduationCap';
  
  // Bills & Utilities
  if (name.includes('tagihan') || name.includes('bill') || name.includes('bayar')) return 'FileText';
  if (name.includes('rumah') || name.includes('sewa') || name.includes('rent')) return 'Home';
  if (name.includes('listrik') || name.includes('electric')) return 'Zap';
  if (name.includes('internet') || name.includes('wifi')) return 'Wifi';
  if (name.includes('telepon') || name.includes('phone') || name.includes('pulsa')) return 'Phone';
  if (name.includes('perbaikan') || name.includes('service')) return 'Wrench';
  
  // Finance
  if (name.includes('tabungan') || name.includes('saving')) return 'PiggyBank';
  if (name.includes('investasi') || name.includes('investment')) return 'TrendingUp';
  if (name.includes('kartu kredit') || name.includes('credit')) return 'CreditCard';
  if (name.includes('bank')) return 'Building2';
  if (name.includes('tunai') || name.includes('cash')) return 'Banknote';
  if (name.includes('dompet digital') || name.includes('e-wallet')) return 'Smartphone';
  
  // Work
  if (name.includes('gaji') || name.includes('salary') || name.includes('kerja')) return 'Briefcase';
  if (name.includes('freelance') || name.includes('project')) return 'Laptop';
  if (name.includes('bisnis') || name.includes('business')) return 'Building';
  
  // Default
  return 'Tag';
};