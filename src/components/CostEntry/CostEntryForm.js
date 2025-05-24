import React, { useState } from 'react';
import { format } from 'date-fns';
import CostEntrySdk from '../../services/CostEntrySdk';
import '../CostEntry/CostEntry.css'; 

const CostEntryForm = () => {
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    description: ''
  });
  
  
  const [costRecord, setCostRecord] = useState(null);
  const [error, setError] = useState('');
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setCostRecord(null);
    
    try {
      
      const record = CostEntrySdk.createCostEntry(
        formData.category,
        formData.amount,
        new Date(formData.date),
        formData.description
      );
      
      
      setCostRecord(record);
      
      
      setFormData({
        category: '',
        amount: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        description: ''
      });
      
    } catch (err) {
      setError(err.message);
    }
  };
  
  return (
    <div className="cost-entry-container">
      <div className="cost-entry-form">
        <h2>Cost Entry Form</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="category">Category*</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select a category</option>
              <option value="Materials">Materials</option>
              <option value="Labor">Labor</option>
              <option value="Overhead">Overhead</option>
              <option value="Administrative">Administrative</option>
              <option value="Marketing">Marketing</option>
              <option value="Other">Other</option>
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
          
          <button type="submit" className="btn-primary">Add Cost Entry</button>
        </form>
      </div>
      

      {costRecord && (
        <div className="cost-record-output">
          <h3>Cost Record Output:</h3>
          <div className="output-container">
            <pre>{JSON.stringify(costRecord, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default CostEntryForm;