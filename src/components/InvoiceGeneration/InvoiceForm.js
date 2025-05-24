import React, { useState } from 'react';
import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { useAppContext } from '../../context/AppContext';
import { calculateTax } from '../../utils/calculations';

const InvoiceForm = () => {
  const { dispatch } = useAppContext();
  const [invoice, setInvoice] = useState({
    clientId: '',
    clientName: '',
    issueDate: format(new Date(), 'yyyy-MM-dd'),
    dueDate: format(new Date(new Date().setDate(new Date().getDate() + 30)), 'yyyy-MM-dd'),
    items: [{ id: uuidv4(), name: '', quantity: 1, unitPrice: 0 }],
    taxRate: 0,
    discount: 0,
    notes: ''
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInvoice(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleItemChange = (id, field, value) => {
    setInvoice(prev => ({
      ...prev,
      items: prev.items.map(item => 
        item.id === id ? { ...item, [field]: field === 'quantity' || field === 'unitPrice' ? parseFloat(value) : value } : item
      )
    }));
  };
  
  const addItem = () => {
    setInvoice(prev => ({
      ...prev,
      items: [...prev.items, { id: uuidv4(), name: '', quantity: 1, unitPrice: 0 }]
    }));
  };
  
  const removeItem = (id) => {
    if (invoice.items.length === 1) {
      alert('Invoice must have at least one item');
      return;
    }
    
    setInvoice(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id)
    }));
  };
  
  const calculateSubtotal = () => {
    return invoice.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  };
  
  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const taxAmount = calculateTax(subtotal, parseFloat(invoice.taxRate));
    const discountAmount = (subtotal * parseFloat(invoice.discount)) / 100;
    return subtotal + taxAmount - discountAmount;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    
    if (!invoice.clientId || !invoice.clientName) {
      alert('Please fill in client information');
      return;
    }
    
    if (invoice.items.some(item => !item.name || item.quantity <= 0 || item.unitPrice <= 0)) {
      alert('Please fill in all item details correctly');
      return;
    }
    
    
    const invoiceNumber = `INV-${format(new Date(), 'yyyyMMdd')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
    
    
    dispatch({
      type: 'ADD_INVOICE',
      payload: {
        ...invoice,
        invoiceNumber,
        subtotal: calculateSubtotal(),
        taxAmount: calculateTax(calculateSubtotal(), parseFloat(invoice.taxRate)),
        discount: parseFloat(invoice.discount),
        total: calculateTotal(),
        status: 'PENDING',
        createdAt: new Date().toISOString()
      }
    });
    
    
    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        type: 'INVOICE_DUE',
        invoiceNumber,
        dueDate: invoice.dueDate,
        clientName: invoice.clientName,
        amount: calculateTotal(),
        status: 'UPCOMING',
        createdAt: new Date().toISOString()
      }
    });
    
    alert(`Invoice ${invoiceNumber} created successfully!`);
    
    
    setInvoice({
      clientId: '',
      clientName: '',
      issueDate: format(new Date(), 'yyyy-MM-dd'),
      dueDate: format(new Date(new Date().setDate(new Date().getDate() + 30)), 'yyyy-MM-dd'),
      items: [{ id: uuidv4(), name: '', quantity: 1, unitPrice: 0 }],
      taxRate: 0,
      discount: 0,
      notes: ''
    });
  };
  
  return (
    <div className="invoice-generation">
      <h2>Create Invoice</h2>
      <form onSubmit={handleSubmit}>
        <div className="client-info">
          <h3>Client Information</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="clientId">Client ID*</label>
              <input 
                type="text" 
                id="clientId" 
                name="clientId" 
                value={invoice.clientId} 
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="clientName">Client Name*</label>
              <input 
                type="text" 
                id="clientName" 
                name="clientName" 
                value={invoice.clientName} 
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="issueDate">Issue Date</label>
              <input 
                type="date" 
                id="issueDate" 
                name="issueDate" 
                value={invoice.issueDate} 
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="dueDate">Due Date</label>
              <input 
                type="date" 
                id="dueDate" 
                name="dueDate" 
                value={invoice.dueDate} 
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
        
        <div className="invoice-items">
          <h3>Invoice Items</h3>
          
          {invoice.items.map((item, index) => (
            <div key={item.id} className="item-row">
              <div className="form-row">
                <div className="form-group item-name">
                  <label htmlFor={`item-name-${index}`}>Item Name*</label>
                  <input 
                    type="text" 
                    id={`item-name-${index}`} 
                    value={item.name} 
                    onChange={(e) => handleItemChange(item.id, 'name', e.target.value)}
                    required
                  />
                </div>
                
                <div className="form-group item-quantity">
                  <label htmlFor={`item-quantity-${index}`}>Quantity*</label>
                  <input 
                    type="number" 
                    id={`item-quantity-${index}`} 
                    value={item.quantity} 
                    onChange={(e) => handleItemChange(item.id, 'quantity', e.target.value)}
                    min="1"
                    required
                  />
                </div>
                
                <div className="form-group item-price">
                  <label htmlFor={`item-price-${index}`}>Unit Price*</label>
                  <input 
                    type="number" 
                    id={`item-price-${index}`} 
                    value={item.unitPrice} 
                    onChange={(e) => handleItemChange(item.id, 'unitPrice', e.target.value)}
                    min="0.01"
                    step="0.01"
                    required
                  />
                </div>
                
                <button 
                  type="button" 
                  className="btn btn-danger"
                  onClick={() => removeItem(item.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          
          <button type="button" className="btn btn-secondary" onClick={addItem}>
            Add Item
          </button>
        </div>
        
        <div className="invoice-totals">
          <h3>Invoice Totals</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="taxRate">Tax Rate (%)</label>
              <input 
                type="number" 
                id="taxRate" 
                name="taxRate" 
                value={invoice.taxRate} 
                onChange={handleChange}
                min="0"
                max="100"
                step="0.01"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="discount">Discount (%)</label>
              <input 
                type="number" 
                id="discount" 
                name="discount" 
                value={invoice.discount} 
                onChange={handleChange}
                min="0"
                max="100"
                step="0.01"
              />
            </div>
          </div>
          
          <div className="totals-summary">
            <p><strong>Subtotal:</strong> ${calculateSubtotal().toFixed(2)}</p>
            <p><strong>Tax Amount:</strong> ${calculateTax(calculateSubtotal(), parseFloat(invoice.taxRate)).toFixed(2)}</p>
            <p><strong>Discount:</strong> ${(calculateSubtotal() * parseFloat(invoice.discount) / 100).toFixed(2)}</p>
            <p className="grand-total"><strong>Total:</strong> ${calculateTotal().toFixed(2)}</p>
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="notes">Notes</label>
          <textarea 
            id="notes" 
            name="notes" 
            value={invoice.notes} 
            onChange={handleChange}
            rows="3"
          />
        </div>
        
        <button type="submit" className="btn btn-primary">Generate Invoice</button>
      </form>
    </div>
  );
};

export default InvoiceForm;