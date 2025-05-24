import { v4 as uuidv4 } from 'uuid';

/**
 * Cost Entry SDK
 * Functionality: Log individual cost entries with details
 */
class CostEntrySdk {
  /**
   * Create a new cost entry
   * @param {string} category - The cost category
   * @param {number} amount - The cost amount
   * @param {Date|string} date - The date of the cost
   * @param {string} description - Description of the cost
   * @returns {Object} - Cost record object
   */
  createCostEntry(category, amount, date, description) {
    // Validate inputs
    if (!category) throw new Error('Category is required');
    if (!amount || isNaN(amount)) throw new Error('Valid amount is required');
    if (!date) throw new Error('Date is required');
    
    // Create the cost record object
    const costRecord = {
      id: uuidv4(),
      category,
      amount: Number(amount),
      date: date instanceof Date ? date : new Date(date),
      description: description || '',
      createdAt: new Date(),
    };
    
    return costRecord;
  }
}

export default new CostEntrySdk();