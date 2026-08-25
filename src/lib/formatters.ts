/**
 * Formats a numeric price into a currency string (INR ₹ by default).
 */
export function formatCurrency(amount: number | string, currencySymbol: string = '₹'): string {
  const numericValue = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(numericValue)) return `${currencySymbol}0.00`;
  return `${currencySymbol}${numericValue.toFixed(2)}`;
}

/**
 * Truncates text to specified maximum length.
 */
export function truncateText(text: string, maxLength: number = 80): string {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength).trim()}...`;
}
