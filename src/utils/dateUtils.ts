export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const getDateRange = (period: 'today' | 'week' | 'month' | 'year'): { from: string; to: string } => {
  const today = new Date();
  const from = new Date();
  
  switch (period) {
    case 'today':
      from.setHours(0, 0, 0, 0);
      break;
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
  const checkDate = new Date(date);
  const fromDate = new Date(from);
  const toDate = new Date(to);
  toDate.setHours(23, 59, 59, 999);
  
  return checkDate >= fromDate && checkDate <= toDate;
};