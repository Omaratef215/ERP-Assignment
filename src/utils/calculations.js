/**
 * Calculate tax amount based on subtotal and tax rate percentage
 * @param {number} subtotal - The subtotal amount
 * @param {number} taxRate - The tax rate percentage
 * @returns {number} - The calculated tax amount
 */
export const calculateTax = (subtotal, taxRate) => {
  if (!subtotal || !taxRate) return 0;
  return (subtotal * taxRate) / 100;
};

/**
 * Calculate the final total after applying tax and discount
 * @param {number} subtotal - The subtotal amount
 * @param {number} taxAmount - The tax amount
 * @param {number} discountAmount - The discount amount
 * @returns {number} - The calculated total
 */
export const calculateTotal = (subtotal, taxAmount, discountAmount) => {
  return subtotal + taxAmount - discountAmount;
};

/**
 * Calculate discount amount based on subtotal and discount percentage
 * @param {number} subtotal - The subtotal amount
 * @param {number} discountPercentage - The discount percentage
 * @returns {number} - The calculated discount amount
 */
export const calculateDiscount = (subtotal, discountPercentage) => {
  if (!subtotal || !discountPercentage) return 0;
  return (subtotal * discountPercentage) / 100;
};

/**
 * Pre-defined tax rates for different regions
 * @type {Object}
 */
export const taxRates = {
  'US-CA': 7.25, // California
  'US-NY': 8.875, // New York
  'US-TX': 6.25, // Texas
  'US-FL': 6.0, // Florida
  'CA-ON': 13.0, // Ontario, Canada (HST)
  'UK': 20.0, // United Kingdom (VAT)
  'EU-DE': 19.0, // Germany (VAT)
  'EU-FR': 20.0, // France (VAT)
  'AU': 10.0, // Australia (GST)
};