import { useAppContext } from '../context/AppContext';
import CostEntrySdk from '../services/CostEntrySdk';
import { format } from 'date-fns';

const useCostManagement = () => {
  const { state, dispatch } = useAppContext();

  const addCostEntry = (costData) => {
    try {
      const costEntry = CostEntrySdk.createCostEntry(
        costData.category,
        costData.amount,
        costData.date,
        costData.description
      );

      dispatch({
        type: 'ADD_COST',
        payload: costEntry
      });

      return costEntry;
    } catch (error) {
      console.error('Error adding cost entry:', error);
      throw error;
    }
  };

  const getCostEntries = (filters = {}) => {
    let filteredCosts = [...state.costs];

    if (filters.category) {
      filteredCosts = filteredCosts.filter(cost => 
        cost.category === filters.category
      );
    }

    if (filters.startDate) {
      const startDate = new Date(filters.startDate);
      filteredCosts = filteredCosts.filter(cost => 
        new Date(cost.date) >= startDate
      );
    }

    if (filters.endDate) {
      const endDate = new Date(filters.endDate);
      filteredCosts = filteredCosts.filter(cost => 
        new Date(cost.date) <= endDate
      );
    }

    if (filters.minAmount) {
      filteredCosts = filteredCosts.filter(cost => 
        cost.amount >= filters.minAmount
      );
    }

    if (filters.maxAmount) {
      filteredCosts = filteredCosts.filter(cost => 
        cost.amount <= filters.maxAmount
      );
    }

    return filteredCosts;
  };

  const calculateTotalCosts = (costs = state.costs) => {
    return costs.reduce((total, cost) => total + cost.amount, 0);
  };

  const getCostsByCategory = () => {
    const categorySummary = {};
    
    state.costs.forEach(cost => {
      if (!categorySummary[cost.category]) {
        categorySummary[cost.category] = 0;
      }
      categorySummary[cost.category] += cost.amount;
    });
    
    return categorySummary;
  };

  const formatCostEntries = (costs = state.costs) => {
    return costs.map(cost => ({
      ...cost,
      formattedDate: format(new Date(cost.date), 'MMM dd, yyyy'),
      formattedAmount: `$${cost.amount.toFixed(2)}`,
      formattedCreatedAt: format(new Date(cost.createdAt), 'MMM dd, yyyy HH:mm')
    }));
  };

  const exportCostsAsCsv = (costs = state.costs) => {
    if (costs.length === 0) {
      return '';
    }

    const headers = ['ID', 'Category', 'Amount', 'Date', 'Description', 'Created At'];
    const rows = costs.map(cost => [
      cost.id,
      cost.category,
      cost.amount,
      format(new Date(cost.date), 'yyyy-MM-dd'),
      cost.description,
      format(new Date(cost.createdAt), 'yyyy-MM-dd HH:mm:ss')
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    return csvContent;
  };

  return {
    costs: state.costs,
    addCostEntry,
    getCostEntries,
    calculateTotalCosts,
    getCostsByCategory,
    formatCostEntries,
    exportCostsAsCsv
  };
};

export default useCostManagement;