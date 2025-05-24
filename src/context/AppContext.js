import React, { createContext, useReducer, useContext, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Initial state
const initialState = {
  costs: [],
  invoices: [],
  notifications: []
};

// Load state from localStorage
const loadState = () => {
  try {
    const storedState = localStorage.getItem('costManagementState');
    return storedState ? JSON.parse(storedState) : initialState;
  } catch (e) {
    console.error('Error loading state from localStorage', e);
    return initialState;
  }
};

// Actions
const ADD_COST = 'ADD_COST';
const ADD_INVOICE = 'ADD_INVOICE';
const UPDATE_INVOICE = 'UPDATE_INVOICE';
const ADD_NOTIFICATION = 'ADD_NOTIFICATION';

// Reducer
const reducer = (state, action) => {
  switch (action.type) {
    case ADD_COST:
      return {
        ...state,
        costs: [...state.costs, { ...action.payload, id: uuidv4() }]
      };
    case ADD_INVOICE:
      return {
        ...state,
        invoices: [...state.invoices, { ...action.payload, id: uuidv4() }]
      };
    case UPDATE_INVOICE:
      return {
        ...state,
        invoices: state.invoices.map(invoice => 
          invoice.id === action.payload.id ? action.payload : invoice
        )
      };
    case ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [...state.notifications, { ...action.payload, id: uuidv4() }]
      };
    default:
      return state;
  }
};

// Create context
const AppContext = createContext();

// Context provider
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState, loadState);
  
  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('costManagementState', JSON.stringify(state));
  }, [state]);
  
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the context
export const useAppContext = () => useContext(AppContext);