import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import CostEntryForm from './components/CostEntry/CostEntryForm';
import InvoiceForm from './components/InvoiceGeneration/InvoiceForm';
import EditInvoiceForm from './components/InvoiceEditing/EditInvoiceForm';
import NotificationCenter from './components/InvoiceDueReminder/NotificationCenter';
import InvoiceList from './components/InvoiceEditing/InvoiceList';
import './App.css';

const App = () => {
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  
  return (
    <AppProvider>
      <Router>
        <div className="app-container">
          <header className="app-header">
            <h1>Cost Management System</h1>
            <nav className="app-nav">
              <ul>
                <li><Link to="/">Cost Entry</Link></li>
                <li><Link to="/invoices/new">Create Invoice</Link></li>
                <li><Link to="/invoices">Manage Invoices</Link></li>
                <li><Link to="/notifications">Notifications</Link></li>
              </ul>
            </nav>
          </header>
          
          <main className="app-main">
            <Routes>
              <Route path="/" element={<CostEntryForm />} />
              <Route path="/invoices/new" element={<InvoiceForm />} />
              <Route 
                path="/invoices" 
                element={
                  selectedInvoice 
                    ? <EditInvoiceForm 
                        invoiceId={selectedInvoice} 
                        onClose={() => setSelectedInvoice(null)} 
                      /> 
                    : <InvoiceList onSelectInvoice={setSelectedInvoice} />
                }
              />
              <Route path="/notifications" element={<NotificationCenter />} />
            </Routes>
          </main>
          
          <footer className="app-footer">
            <p>© 2025 Cost Management System</p>
          </footer>
        </div>
      </Router>
    </AppProvider>
  );
};

export default App;