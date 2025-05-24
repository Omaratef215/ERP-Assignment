import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { format } from 'date-fns';

const InvoiceList = ({ onSelectInvoice }) => {
  const { state } = useAppContext();
  const { invoices } = state;
  
  if (invoices.length === 0) {
    return (
      <div className="invoice-list empty">
        <h2>Manage Invoices</h2>
        <p>No invoices found. Create your first invoice.</p>
      </div>
    );
  }
  
  return (
    <div className="invoice-list">
      <h2>Manage Invoices</h2>
      
      {invoices.map(invoice => (
        <div key={invoice.id} className="invoice-list-item">
          <div className="invoice-details">
            <h3>{invoice.invoiceNumber}</h3>
            <p><strong>Client:</strong> {invoice.clientName}</p>
            <p><strong>Amount:</strong> ${invoice.total.toFixed(2)}</p>
            <p><strong>Due Date:</strong> {format(new Date(invoice.dueDate), 'MMM dd, yyyy')}</p>
          </div>
          
          <div className="invoice-actions">
            <span className={`invoice-status invoice-status-${invoice.status}`}>
              {invoice.status}
            </span>
            <button 
              className="btn btn-primary"
              onClick={() => onSelectInvoice(invoice.id)}
            >
              Edit
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default InvoiceList;