import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import useCostManagement from '../../hooks/useCostManagement';

const CostEntryForm = () => {
  const { addCostEntry, costs, formatCostEntries, calculateTotalCosts, getCostsByCategory } = useCostManagement();
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    description: ''
  });
  const [formattedCosts, setFormattedCosts] = useState([]);
  const [totalCost, setTotalCost] = useState(0);
  const [categorySummary, setCategorySummary] = useState({});
  const [filter, setFilter] = useState({
    category: '',
    startDate: '',
    endDate: ''
  });
  
  
  useEffect(() => {
    setFormattedCosts(formatCostEntries());
    setTotalCost(calculateTotalCosts());
    setCategorySummary(getCostsByCategory());
  }, [costs]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter(prevFilter => ({
      ...prevFilter,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.category || !formData.amount) {
      alert('Please fill in all required fields');
      return;
    }
    
    try {
      addCostEntry({
        ...formData,
        amount: parseFloat(formData.amount)
      });
      
      
      setFormData({
        category: '',
        amount: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        description: ''
      });
      
      alert('Cost entry added successfully!');
    } catch (error) {
      alert(`Error adding cost entry: ${error.message}`);
    }
  };
  
  const handleClearFilters = () => {
    setFilter({
      category: '',
      startDate: '',
      endDate: ''
    });
  };
  
  
  const getFilteredCosts = () => {
    let filtered = [...formattedCosts];
    
    if (filter.category) {
      filtered = filtered.filter(cost => cost.category === filter.category);
    }
    
    if (filter.startDate) {
      const startDate = new Date(filter.startDate);
      filtered = filtered.filter(cost => new Date(cost.date) >= startDate);
    }
    
    if (filter.endDate) {
      const endDate = new Date(filter.endDate);
      filtered = filtered.filter(cost => new Date(cost.date) <= endDate);
    }
    
    return filtered;
  };
  
  const filteredCosts = getFilteredCosts();
  const filteredTotal = filteredCosts.reduce((sum, cost) => sum + cost.amount, 0);
  
  return (
    <div className="cost-entry-container">
      <div className="cost-entry">
        <h2>Cost Entry</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="category">Cost Category*</label>
            <select 
              id="category" 
              name="category" 
              value={formData.category} 
              onChange={handleChange}
              required
            >
              <option value="">Select a category</option>
              <option value="Materials">Cost 1</option>
              <option value="Labor">Cost 2</option>
              <option value="Overhead">Cost 3</option>
              <option value="Transportation">Cost 4</option>
              <option value="Other">Cost 5</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="amount">Amount*</label>
            <input 
              type="number" 
              id="amount" 
              name="amount" 
              value={formData.amount} 
              onChange={handleChange}
              min="0.01" 
              step="0.01"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="date">Date*</label>
            <input 
              type="date" 
              id="date" 
              name="date" 
              value={formData.date} 
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea 
              id="description" 
              name="description" 
              value={formData.description} 
              onChange={handleChange}
              rows="3"
            />
          </div>
          
          <button type="submit" className="btn btn-primary">Submit Cost Entry</button>
        </form>
      </div>
      
      <div className="cost-output">
        <h2>Cost Entries</h2>
        
        <div className="filter-section">
          <h3>Filter Entries</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="filter-category">Category</label>
              <select
                id="filter-category"
                name="category"
                value={filter.category}
                onChange={handleFilterChange}
              >
                <option value="">All Categories</option>
                <option value="Materials">Cost 1</option>
                <option value="Labor">Cost 2</option>
                <option value="Overhead">Cost 3</option>
                <option value="Transportation">Cost 4</option>
                <option value="Other">Cost 5</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="filter-startDate">From Date</label>
              <input
                type="date"
                id="filter-startDate"
                name="startDate"
                value={filter.startDate}
                onChange={handleFilterChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="filter-endDate">To Date</label>
              <input
                type="date"
                id="filter-endDate"
                name="endDate"
                value={filter.endDate}
                onChange={handleFilterChange}
              />
            </div>
            
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={handleClearFilters}
            >
              Clear Filters
            </button>
          </div>
        </div>
        
        <div className="cost-summary">
          <h3>Summary</h3>
          <div className="summary-stats">
            <div className="stat-card">
              <div className="stat-label">Total Entries</div>
              <div className="stat-value">{filteredCosts.length}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Total Amount</div>
              <div className="stat-value">${filteredTotal.toFixed(2)}</div>
            </div>
          </div>
          
          <h4>Category Breakdown</h4>
          <div className="category-summary">
            {Object.keys(categorySummary).map(category => (
              <div key={category} className="category-stat">
                <span className="category-name">{category}</span>
                <span className="category-amount">${categorySummary[category].toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="cost-table">
          <h3>Cost Entries</h3>
          {filteredCosts.length === 0 ? (
            <p>No cost entries found.</p>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {filteredCosts.map(cost => (
                  <tr key={cost.id}>
                    <td>{cost.formattedDate}</td>
                    <td>{cost.category}</td>
                    <td>{cost.description || 'N/A'}</td>
                    <td className="amount-cell">{cost.formattedAmount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default CostEntryForm;