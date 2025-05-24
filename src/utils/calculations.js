export const calculateTax = (subtotal, taxRate) => {
  if (!subtotal || !taxRate) return 0;
  return (subtotal * taxRate) / 100;
};

export const calculateTotal = (subtotal, taxAmount, discountAmount) => {
  return subtotal + taxAmount - discountAmount;
};

export const calculateDiscount = (subtotal, discountPercentage) => {
  if (!subtotal || !discountPercentage) return 0;
  return (subtotal * discountPercentage) / 100;
};

export const taxRates = {
  'US-CA': 7.25,
  'US-NY': 8.875,
  'US-TX': 6.25,
  'US-FL': 6.0,
  'CA-ON': 13.0,
  'UK': 20.0,
  'EU-DE': 19.0,
  'EU-FR': 20.0,
  'AU': 10.0,
};