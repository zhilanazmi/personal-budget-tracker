export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const getDateRange = (period: 'today' | 'week' | 'month' | 'year'): { from: string; to: string } => {
  const today = new Date();
  const from = new Date();
  
  switch (period) {
    case 'today': {
      const todayString = today.toISOString().split('T')[0];
      return {
        from: todayString,
        to: todayString,
      };
    }
    case 'week':
      from.setDate(today.getDate() - today.getDay());
      from.setHours(0, 0, 0, 0);
      break;
    case 'month':
      from.setDate(1);
      from.setHours(0, 0, 0, 0);
      break;
    case 'year':
      from.setFullYear(today.getFullYear(), 0, 1);
      from.setHours(0, 0, 0, 0);
      break;
  }
  
  return {
    from: from.toISOString().split('T')[0],
    to: today.toISOString().split('T')[0],
  };
};

export const isDateInRange = (date: string, from: string, to: string): boolean => {
  // Ekstrak tanggal saja (YYYY-MM-DD) dari string tanggal transaksi
  const transactionDate = date.split('T')[0];
  
  // Untuk kasus 'today', from dan to akan sama, jadi cukup cek equality
  if (from === to) {
    return transactionDate === from;
  }
  
  // Untuk kasus lain (week, month, year), gunakan range comparison
  const checkDate = new Date(transactionDate);
  const fromDate = new Date(from);
  const toDate = new Date(to);
  toDate.setHours(23, 59, 59, 999);
  
  return checkDate >= fromDate && checkDate <= toDate;
};

// Format number with dots as thousand separators (e.g., 1000000 -> "1.000.000")
export const formatNumberWithDots = (value: string): string => {
  // Remove all non-digit characters
  const numericValue = value.replace(/\D/g, '');
  
  // If empty, return empty string
  if (!numericValue) return '';
  
  // Add dots as thousand separators
  return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

// Parse formatted number back to plain number string (e.g., "1.000.000" -> "1000000")
export const parseFormattedNumber = (value: string): string => {
  return value.replace(/\./g, '');
};

// Utility function untuk mendapatkan tanggal hari ini dalam format YYYY-MM-DD
export const getTodayDateString = (): string => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

// Utility function untuk mengecek apakah tanggal transaksi adalah hari ini
export const isTransactionToday = (transactionDate: string): boolean => {
  const today = getTodayDateString();
  const dateOnly = transactionDate.split('T')[0]; // Ambil bagian tanggal saja
  return dateOnly === today;
};
