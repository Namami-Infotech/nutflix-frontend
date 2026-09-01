/**
 * Formats a numeric price into a clean string, omitting .00 for whole numbers.
 * e.g. 999 -> '999', 999.00 -> '999', 999.50 -> '999.50'
 */
export function formatPrice(amount: number | string | null | undefined): string {
  if (amount === null || amount === undefined || amount === '') return '0';
  const numericValue = typeof amount === 'number' ? amount : parseFloat(String(amount).replace(/[^0-9.-]+/g, ''));
  if (isNaN(numericValue)) return '0';
  if (numericValue % 1 === 0) {
    return numericValue.toString();
  }
  return numericValue.toFixed(2).replace(/\.00$/, '').replace(/(\.\d)0$/, '$1');
}

/**
 * Formats a numeric price into a currency string (INR ₹ by default) without .00 for whole numbers.
 */
export function formatCurrency(amount: number | string | null | undefined, currencySymbol: string = '₹'): string {
  return `${currencySymbol}${formatPrice(amount)}`;
}

/**
 * Truncates text to specified maximum length.
 */
export function truncateText(text: string, maxLength: number = 80): string {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength).trim()}...`;
}

