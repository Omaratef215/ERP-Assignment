import React, { useState } from 'react';
import { format } from 'date-fns';
import { useAppContext } from '../../context/AppContext';

const CostEntryForm = () => {
  const { dispatch } = useAppContext();
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    description: ''
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.category || !formData.amount) {
      alert('Please fill in all required fields');
      return;
    }
    
    // Dispatch action to add cost
    dispatch({
      type: 'ADD_COST',
      payload: {
        ...formData,
        amount: parseFloat(formData.amount),
        createdAt: new Date().toISOString()
      }
    });
    
    // Reset form
    setFormData({
      category: '',
      amount: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      description: ''
    });
    
    alert('Cost entry added successfully!');
  };
  
  return (
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
  );
};

export default CostEntryForm;