/**
 * FilterUtils.js
 * 
 * Utility functions for filtering business data
 */

/**
 * Filter businesses by text search
 * @param {Array} businesses Array of business objects
 * @param {string} searchText Text to search for
 * @returns {Array} Filtered businesses
 */
export function filterBusinessesByText(businesses, searchText) {
    if (!businesses || !businesses.length) {
      return [];
    }
    
    if (!searchText) {
      return businesses;
    }
    
    const searchLower = searchText.toLowerCase();
    
    return businesses.filter(business => {
      // Check name
      if (business['Business Name'] && 
          business['Business Name'].toLowerCase().includes(searchLower)) {
        return true;
      }
      
      // Check address
      if (business['Address'] && 
          business['Address'].toLowerCase().includes(searchLower)) {
        return true;
      }
      
      // Check city
      if (business['City'] && 
          business['City'].toLowerCase().includes(searchLower)) {
        return true;
      }
      
      // Check country
      if (business['Country'] && 
          business['Country'].toLowerCase().includes(searchLower)) {
        return true;
      }
      
      // Check category
      if (business['Category'] && 
          business['Category'].toLowerCase().includes(searchLower)) {
        return true;
      }
      
      return false;
    });
  }
  
  /**
   * Filter businesses by field value
   * @param {Array} businesses Array of business objects
   * @param {string} field Field to filter by
   * @param {*} value Value to filter for
   * @returns {Array} Filtered businesses
   */
  export function filterBusinessesByField(businesses, field, value) {
    if (!businesses || !businesses.length) {
      return [];
    }
    
    // Map filter fields to actual business properties
    const fieldMap = {
      'category': 'Category',
      'city': 'City',
      'country': 'Country'
    };
    
    const actualField = fieldMap[field] || field;
    
    return businesses.filter(business => {
      const fieldValue = business[actualField];
      
      if (fieldValue === undefined || fieldValue === null) {
        return false;
      }
      
      if (typeof value === 'string') {
        return String(fieldValue).toLowerCase() === value.toLowerCase();
      }
      
      return fieldValue === value;
    });
  }
  
  /**
   * Filter businesses by minimum rating
   * @param {Array} businesses Array of business objects
   * @param {number} minRating Minimum rating
   * @returns {Array} Filtered businesses
   */
  export function filterBusinessesByRating(businesses, minRating) {
    if (!businesses || !businesses.length) {
      return [];
    }
    
    return businesses.filter(business => {
      const rating = parseFloat(business['Google Rating']);
      
      if (isNaN(rating)) {
        return false;
      }
      
      return rating >= minRating;
    });
  }
  
  /**
   * Filter businesses by distance from coordinates
   * @param {Array} businesses Array of business objects
   * @param {number} lat Latitude
   * @param {number} lng Longitude
   * @param {number} maxDistanceKm Maximum distance in kilometers
   * @returns {Array} Filtered businesses
   */
  export function filterBusinessesByDistance(businesses, lat, lng, maxDistanceKm) {
    if (!businesses || !businesses.length) {
      return [];
    }
    
    return businesses.filter(business => {
      const businessLat = parseFloat(business['Latitude']);
      const businessLng = parseFloat(business['Longitude']);
      
      if (isNaN(businessLat) || isNaN(businessLng)) {
        return false;
      }
      
      const distance = calculateDistance(lat, lng, businessLat, businessLng);
      return distance <= maxDistanceKm;
    });
  }
  
  /**
   * Calculate distance between two coordinates using Haversine formula
   * @param {number} lat1 First latitude
   * @param {number} lng1 First longitude
   * @param {number} lat2 Second latitude
   * @param {number} lng2 Second longitude
   * @returns {number} Distance in kilometers
   */
  export function calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // Earth radius in kilometers
    
    const dLat = toRadians(lat2 - lat1);
    const dLng = toRadians(lng2 - lng1);
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * 
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
    return R * c;
  }
  
  /**
   * Convert degrees to radians
   * @param {number} degrees Degrees
   * @returns {number} Radians
   */
  function toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }
  
  /**
   * Apply multiple filters to businesses
   * @param {Array} businesses Array of business objects
   * @param {Object} filters Filter object
   * @returns {Array} Filtered businesses
   */
  export function applyFilters(businesses, filters) {
    if (!businesses || !businesses.length) {
      return [];
    }
    
    let filtered = [...businesses];
    
    // Apply text search filter
    if (filters.text) {
      filtered = filterBusinessesByText(filtered, filters.text);
    }
    
    // Apply category filter
    if (filters.category) {
      filtered = filterBusinessesByField(filtered, 'category', filters.category);
    }
    
    // Apply city filter
    if (filters.city) {
      filtered = filterBusinessesByField(filtered, 'city', filters.city);
    }
    
    // Apply country filter
    if (filters.country) {
      filtered = filterBusinessesByField(filtered, 'country', filters.country);
    }
    
    // Apply rating filter
    if (filters.minRating) {
      filtered = filterBusinessesByRating(filtered, filters.minRating);
    }
    
    // Apply distance filter
    if (filters.lat && filters.lng && filters.maxDistance) {
      filtered = filterBusinessesByDistance(
        filtered, 
        filters.lat, 
        filters.lng, 
        filters.maxDistance
      );
    }
    
    return filtered;
  }