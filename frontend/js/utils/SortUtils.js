/**
 * SortUtils.js
 * 
 * Utility functions for sorting business data
 */

/**
 * Sort businesses by a specific field
 * @param {Array} businesses Array of business objects
 * @param {string} field Field to sort by
 * @param {string} direction Sort direction ('asc' or 'desc')
 * @returns {Array} Sorted businesses
 */
export function sortBusinesses(businesses, field, direction = 'asc') {
    if (!businesses || !businesses.length) {
      return [];
    }
    
    // Map sort fields to actual business properties
    const fieldMap = {
      'name': 'Business Name',
      'rating': 'Google Rating',
      'reviews': 'Number of Reviews',
      'city': 'City',
      'country': 'Country',
      'category': 'Category'
    };
    
    const actualField = fieldMap[field] || field;
    
    // Create a copy to avoid mutating the original array
    return [...businesses].sort((a, b) => {
      return compareValues(a[actualField], b[actualField], direction);
    });
  }
  
  /**
   * Compare two values for sorting
   * @param {*} valueA First value
   * @param {*} valueB Second value
   * @param {string} direction Sort direction ('asc' or 'desc')
   * @returns {number} Comparison result (-1, 0, or 1)
   */
  export function compareValues(valueA, valueB, direction = 'asc') {
    // Handle undefined or null values
    const a = valueA === undefined || valueA === null ? '' : valueA;
    const b = valueB === undefined || valueB === null ? '' : valueB;
    
    // Handle numeric comparison
    if (!isNaN(parseFloat(a)) && !isNaN(parseFloat(b))) {
      const numA = parseFloat(a) || 0;
      const numB = parseFloat(b) || 0;
      return direction === 'asc' ? numA - numB : numB - numA;
    }
    
    // Handle string comparison
    const strA = String(a).toLowerCase();
    const strB = String(b).toLowerCase();
    
    const compareResult = strA.localeCompare(strB);
    return direction === 'asc' ? compareResult : -compareResult;
  }
  
  /**
   * Group businesses by field
   * @param {Array} businesses Array of business objects
   * @param {string} field Field to group by
   * @returns {Object} Grouped businesses
   */
  export function groupBusinessesByField(businesses, field) {
    if (!businesses || !businesses.length) {
      return {};
    }
    
    const fieldMap = {
      'category': 'Category',
      'city': 'City',
      'country': 'Country'
    };
    
    const actualField = fieldMap[field] || field;
    
    return businesses.reduce((groups, business) => {
      const value = business[actualField] || 'Unknown';
      
      if (!groups[value]) {
        groups[value] = [];
      }
      
      groups[value].push(business);
      return groups;
    }, {});
  }
  
  /**
   * Sort business groups by count
   * @param {Object} groups Grouped businesses
   * @param {string} direction Sort direction ('asc' or 'desc')
   * @returns {Array} Sorted [key, businesses] pairs
   */
  export function sortGroupsByCount(groups, direction = 'desc') {
    return Object.entries(groups).sort((a, b) => {
      const countA = a[1].length;
      const countB = b[1].length;
      
      return direction === 'asc' ? countA - countB : countB - countA;
    });
  }
  
  /**
   * Get unique values for a field
   * @param {Array} businesses Array of business objects
   * @param {string} field Field to get unique values for
   * @returns {Array} Unique values
   */
  export function getUniqueValues(businesses, field) {
    if (!businesses || !businesses.length) {
      return [];
    }
    
    const fieldMap = {
      'category': 'Category',
      'city': 'City',
      'country': 'Country'
    };
    
    const actualField = fieldMap[field] || field;
    
    const values = businesses.map(business => business[actualField] || 'Unknown');
    return [...new Set(values)].sort();
  }
  
  /**
   * Create a compare function for custom sorting
   * @param {Function} getVal Function to extract value to compare
   * @param {string} direction Sort direction ('asc' or 'desc')
   * @returns {Function} Compare function
   */
  export function createCompareFunction(getVal, direction = 'asc') {
    return (a, b) => {
      const valA = getVal(a);
      const valB = getVal(b);
      
      return compareValues(valA, valB, direction);
    };
  }