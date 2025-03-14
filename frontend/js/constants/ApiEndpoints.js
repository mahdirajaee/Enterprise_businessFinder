/**
 * ApiEndpoints.js
 * 
 * Constants for API endpoints
 */

// Determine API base URL based on environment
const isProduction = window.location.hostname !== 'localhost' && 
                     window.location.hostname !== '127.0.0.1';

// Production API URL (change this to your deployed backend URL)
const PRODUCTION_API = 'https://business-finder-api.example.com';

// Development API URL (local development server)
const DEVELOPMENT_API = 'http://localhost:5000';

// Set API base URL based on environment
export const API_BASE_URL = isProduction ? PRODUCTION_API : DEVELOPMENT_API;

// API endpoints
export const API_ENDPOINTS = {
  // Business search endpoint
  BUSINESSES: `${API_BASE_URL}/api/businesses`,
  
  // Business details endpoint (requires ID parameter)
  BUSINESS_DETAILS: (id) => `${API_BASE_URL}/api/businesses/${id}`,
  
  // Categories endpoint
  CATEGORIES: `${API_BASE_URL}/api/categories`,
  
  // Popular locations endpoint
  POPULAR_LOCATIONS: `${API_BASE_URL}/api/locations/popular`
};

// Default export for all endpoints
export default API_ENDPOINTS;