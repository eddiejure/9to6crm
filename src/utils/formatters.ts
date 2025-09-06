// German Formatting Utilities

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount);
};

export const formatDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('de-DE').format(dateObj);
};

export const formatNumber = (number: number): string => {
  return new Intl.NumberFormat('de-DE').format(number);
};

export const generateDocumentNumber = (type: 'quote' | 'invoice', date: Date = new Date()): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const time = String(Date.now()).slice(-4);
  
  const prefix = type === 'quote' ? 'AN' : 'RE'; // Angebot / Rechnung
  return `${prefix}-${year}${month}${day}-${time}`;
};

export const calculateTax = (amount: number, taxRate: number): number => {
  return Math.round(amount * taxRate * 100) / 100;
};

export const calculateTotal = (subtotal: number, taxAmount: number): number => {
  return Math.round((subtotal + taxAmount) * 100) / 100;
};