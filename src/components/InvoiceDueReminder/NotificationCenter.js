import React, { useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { format, isPast, addDays, isWithinInterval } from 'date-fns';

const NotificationCenter = () => {
  const { state, dispatch } = useAppContext();
  
  // Check for due dates and update statuses
  useEffect(() => {
    const today = new Date();
    
    state.invoices.forEach(invoice => {
      const dueDate = new Date(invoice.dueDate);
      
      // If invoice is already paid, skip
      if (invoice.status === 'PAID') {
        return;
      }
      
      // If due date is past and status isn't already OVERDUE
      if (isPast(dueDate) && invoice.status !== 'OVERDUE') {
        dispatch({
          type: 'ADD_NOTIFICATION',
          payload: {
            type: 'INVOICE_OVERDUE',
            invoiceId: invoice.id,
            invoiceNumber: invoice.invoiceNumber,
            clientName: invoice.clientName,
            amount: invoice.total,
            dueDate: invoice.dueDate,
            status: 'OVERDUE',
            createdAt: new Date().toISOString()
          }
        });
      }
      // If due date is approaching within 7 days
      else if (isWithinInterval(dueDate, { start: today, end: addDays(today, 7) })) {
        // Check if we already have an UPCOMING notification for this invoice
        const hasUpcomingNotification = state.notifications.some(
          n => n.invoiceNumber === invoice.invoiceNumber && n.status === 'UPCOMING'
        );
        
        if (!hasUpcomingNotification) {
          dispatch({
            type: 'ADD_NOTIFICATION',
            payload: {
              type: 'INVOICE_DUE_SOON',
              invoiceId: invoice.id,
              invoiceNumber: invoice.invoiceNumber,
              clientName: invoice.clientName,
              amount: invoice.total,
              dueDate: invoice.dueDate,
              status: 'UPCOMING',
              createdAt: new Date().toISOString()
            }
          });
        }
      }
    });
  }, [state.invoices, dispatch]);
  
  // Filter notifications to show only recent ones (last 30 days)
  const recentNotifications = state.notifications
    .filter(notification => {
      const notifDate = new Date(notification.createdAt);
      const thirtyDaysAgo = addDays(new Date(), -30);
      return notifDate >= thirtyDaysAgo;
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
  const getNotificationClass = (status) => {
    switch(status) {
      case 'OVERDUE': return 'notification-overdue';
      case 'UPCOMING': return 'notification-upcoming';
      default: return 'notification-info';
    }
  };
  
  return (
    <div className="notification-center">
      <h2>Invoice Reminders</h2>
      
      {recentNotifications.length === 0 ? (
        <p>No recent notifications</p>
      ) : (
        <ul className="notification-list">
          {recentNotifications.map(notification => (
            <li 
              key={notification.id} 
              className={`notification-item ${getNotificationClass(notification.status)}`}
            >
              <div className="notification-header">
                <strong>{notification.status === 'OVERDUE' ? 'OVERDUE!' : 'UPCOMING'}</strong>
                <span className="notification-date">
                  {format(new Date(notification.createdAt), 'MMM dd, yyyy')}
                </span>
              </div>
              <div className="notification-body">
                 <p>
                  <strong>Client Name:</strong> {notification.clientName}
                </p>
                <p>
                  <strong>Invoice:</strong> {notification.invoiceNumber} for {notification.clientName}
                </p>
                <p>
                  <strong>Amount:</strong> ${notification.amount.toFixed(2)}
                </p>
                <p>
                  <strong>Due Date:</strong> {format(new Date(notification.dueDate), 'MMM dd, yyyy')}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationCenter;