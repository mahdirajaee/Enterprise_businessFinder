/**
 * CacheService.js
 * 
 * Handles client-side caching using localStorage
 * Caches search parameters, results, and other data for better performance
 */

export default class CacheService {
    /**
     * Initialize the cache service
     * @param {string} namespace Namespace to use for storing data
     */
    constructor(namespace = 'app-cache') {
      this.namespace = namespace;
      this.TTL = 1000 * 60 * 60; // 1 hour cache TTL by default
    }
  
    /**
     * Save state to localStorage
     * @param {Object} state State object to save
     */
    saveState(state) {
      try {
        const cacheData = {
          data: state,
          timestamp: Date.now()
        };
        
        localStorage.setItem(
          `${this.namespace}:state`, 
          JSON.stringify(cacheData)
        );
      } catch (error) {
        console.warn('Failed to save state to cache:', error);
      }
    }
  
    /**
     * Get state from localStorage
     * @returns {Object|null} Cached state or null if not found or expired
     */
    getState() {
      try {
        const cache = localStorage.getItem(`${this.namespace}:state`);
        
        if (!cache) {
          return null;
        }
        
        const { data, timestamp } = JSON.parse(cache);
        
        // Check if cache is expired
        if (Date.now() - timestamp > this.TTL) {
          this.clearState();
          return null;
        }
        
        return data;
      } catch (error) {
        console.warn('Failed to retrieve state from cache:', error);
        return null;
      }
    }
  
    /**
     * Clear cached state
     */
    clearState() {
      try {
        localStorage.removeItem(`${this.namespace}:state`);
      } catch (error) {
        console.warn('Failed to clear state cache:', error);
      }
    }
  
    /**
     * Cache search results
     * @param {Object} searchParams Search parameters
     * @param {Array} results Search results
     */
    cacheSearchResults(searchParams, results) {
      try {
        // Create a cache key based on search parameters
        const cacheKey = this.createCacheKey(searchParams);
        
        const cacheData = {
          results,
          timestamp: Date.now()
        };
        
        localStorage.setItem(
          `${this.namespace}:results:${cacheKey}`, 
          JSON.stringify(cacheData)
        );
      } catch (error) {
        console.warn('Failed to cache search results:', error);
      }
    }
  
    /**
     * Get cached search results
     * @param {Object} searchParams Search parameters
     * @returns {Array|null} Cached results or null if not found or expired
     */
    getCachedSearchResults(searchParams) {
      try {
        // Create a cache key based on search parameters
        const cacheKey = this.createCacheKey(searchParams);
        
        const cache = localStorage.getItem(`${this.namespace}:results:${cacheKey}`);
        
        if (!cache) {
          return null;
        }
        
        const { results, timestamp } = JSON.parse(cache);
        
        // Check if cache is expired
        if (Date.now() - timestamp > this.TTL) {
          localStorage.removeItem(`${this.namespace}:results:${cacheKey}`);
          return null;
        }
        
        return results;
      } catch (error) {
        console.warn('Failed to retrieve cached search results:', error);
        return null;
      }
    }
  
    /**
     * Create a cache key from search parameters
     * @param {Object} searchParams Search parameters
     * @returns {string} Cache key
     */
    createCacheKey(searchParams) {
      const normalized = {
        location: searchParams.location || '',
        category: searchParams.category || '',
        radius: searchParams.radius || '',
        minRating: searchParams.minRating || ''
      };
      
      return Object.values(normalized).join('|');
    }
  
    /**
     * Clear all cached data
     */
    clearAll() {
      try {
        const keys = [];
        
        // Find all cache keys
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key.startsWith(`${this.namespace}:`)) {
            keys.push(key);
          }
        }
        
        // Remove all cache keys
        keys.forEach(key => localStorage.removeItem(key));
      } catch (error) {
        console.warn('Failed to clear cache:', error);
      }
    }
  }