/**
 * Save data to localStorage
 * @param {string} key - Key to store data under
 * @param {any} data - Data to store (will be JSON stringified)
 */
export const saveToLocalStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

/**
 * Load data from localStorage
 * @param {string} key - Key to retrieve data from
 * @param {any} defaultValue - Default value if key doesn't exist
 * @returns {any} - Parsed data or default value
 */
export const loadFromLocalStorage = (key, defaultValue) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return defaultValue;
  }
};

/**
 * Remove item from localStorage
 * @param {string} key - Key to remove
 */
export const removeFromLocalStorage = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
};

/**
 * Clear all items from localStorage
 */
export const clearLocalStorage = () => {
  try {
    localStorage.clear();
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
};