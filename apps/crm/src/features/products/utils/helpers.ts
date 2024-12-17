export const getStockColor = (stock: number): 'success' | 'warning' | 'error' => {
  if (stock > 50) return 'success';
  if (stock > 20) return 'warning';
  return 'error';
};

export const getStockPercentage = (stock: number): number => {
  return Math.min((stock / 100) * 100, 100);
};

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
};

export const extractFormData = (form: HTMLFormElement) => {
  const formData = new FormData(form);
  const entries = Object.fromEntries(formData);
  
  return {
    ...entries,
    price: entries.price ? parseFloat(entries.price as string) : 0,
    stock: entries.stock ? parseInt(entries.stock as string) : 0
  };
};
