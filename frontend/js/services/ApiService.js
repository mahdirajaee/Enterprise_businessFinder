/**
 * ApiService.js
 * 
 * Responsible for all API communication
 * Makes requests to the backend and handles responses
 */

export default class ApiService {
    /**
     * Initialize the API service
     * @param {string} baseUrl Base URL for the API
     */
    constructor(baseUrl) {
      this.baseUrl = baseUrl;
      this.defaultHeaders = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };
    }
  
    /**
     * Search for businesses based on parameters
     * @param {Object} params Search parameters
     * @returns {Promise<Array>} Promise resolving to array of business objects
     */
    async searchBusinesses(params) {
      try {
        // Build URL with query parameters
        const url = new URL(`${this.baseUrl}/api/businesses`);
        
        // Add each parameter to the URL
        Object.keys(params).forEach(key => {
          if (params[key] !== null && params[key] !== undefined) {
            url.searchParams.append(key, params[key]);
          }
        });
  
        // Make the request
        const response = await fetch(url, {
          method: 'GET',
          headers: this.defaultHeaders
        });
  
        // Check for errors
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `Error searching businesses: ${response.statusText}`);
        }
  
        // Parse and return the response
        const data = await response.json();
        return data.results || [];
      } catch (error) {
        console.error('Search error:', error);
        throw error;
      }
    }
  
    /**
     * Get detailed information about a specific business
     * @param {string} id Business ID
     * @returns {Promise<Object>} Promise resolving to business details object
     */
    async getBusinessDetails(id) {
      try {
        const response = await fetch(`${this.baseUrl}/api/businesses/${id}`, {
          method: 'GET',
          headers: this.defaultHeaders
        });
  
        // Check for errors
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `Error fetching business details: ${response.statusText}`);
        }
  
        // Parse and return the response
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Details error:', error);
        throw error;
      }
    }
  
    /**
     * Get available business categories
     * @returns {Promise<Array>} Promise resolving to array of category objects
     */
    async getCategories() {
      try {
        const response = await fetch(`${this.baseUrl}/api/categories`, {
          method: 'GET',
          headers: this.defaultHeaders
        });
  
        // Check for errors
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `Error fetching categories: ${response.statusText}`);
        }
  
        // Parse and return the response
        const data = await response.json();
        return data || [];
      } catch (error) {
        console.error('Categories error:', error);
        throw error;
      }
    }
  
    /**
     * Get popular locations for search suggestions
     * @returns {Promise<Array>} Promise resolving to array of location objects
     */
    async getPopularLocations() {
      try {
        const response = await fetch(`${this.baseUrl}/api/locations/popular`, {
          method: 'GET',
          headers: this.defaultHeaders
        });
  
        // Check for errors
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `Error fetching locations: ${response.statusText}`);
        }
  
        // Parse and return the response
        const data = await response.json();
        return data || [];
      } catch (error) {
        console.error('Locations error:', error);
        throw error;
      }
    }
  }