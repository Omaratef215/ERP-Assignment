import { v4 as uuidv4 } from 'uuid';
import { saveToLocalStorage, loadFromLocalStorage } from '../utils/localStorage';


class CostEntrySdk {
  constructor() {
    this.storageKey = 'costManagementState';
  }


  createCostEntry(category, amount, date, description) {
    
    if (!category) throw new Error('Category is required');
    if (!amount || isNaN(Number(amount))) throw new Error('Valid amount is required');
    if (!date) throw new Error('Date is required');
    
    
    const costRecord = {
      id: uuidv4(),
      category,
      amount: Number(amount),
      date: date instanceof Date ? date : new Date(date),
      description: description || '',
      createdAt: new Date()
    };
    
    
    const state = loadFromLocalStorage(this.storageKey, { costs: [] });
    
    
    state.costs = [...state.costs, costRecord];
    
    
    saveToLocalStorage(this.storageKey, state);
    
    
    return costRecord;
  }
  

  getAllCostEntries() {
    const state = loadFromLocalStorage(this.storageKey, { costs: [] });
    return state.costs;
  }
  
  getCostEntryById(id) {
    const state = loadFromLocalStorage(this.storageKey, { costs: [] });
    return state.costs.find(cost => cost.id === id) || null;
  }
}


export default new CostEntrySdk();