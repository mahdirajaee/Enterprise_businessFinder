/**
 * AppState.js
 * 
 * Centralized state management with publish/subscribe pattern
 * Manages application state and notifies subscribers when state changes
 */

class AppState {
    constructor() {
      // Initial state
      this.state = {
        // Search parameters
        searchParams: {
          location: '',
          category: 'restaurant',
          radius: 5,
          minRating: 3.5
        },
        
        // API data
        businesses: [],             // Original data from API
        filteredBusinesses: [],     // Filtered/sorted data for display
        selectedBusiness: null,     // Currently selected business
        businessDetails: null,      // Detailed info for selected business
        
        // UI state
        loading: false,             // Loading indicator state
        error: null,                // Error message if any
        sortField: 'name',          // Current sort field
        sortDirection: 'asc',       // Current sort direction
        filterText: '',             // Current filter text
        activeTab: 'map'            // Current active tab
      };
      
      // Array of subscriber callback functions
      this.listeners = [];
    }
  
    /**
     * Get the current state
     * @returns {Object} Current state
     */
    getState() {
      return this.state;
    }
  
    /**
     * Update state and notify listeners
     * @param {Object} newState Partial state to merge with current state
     */
    setState(newState) {
      this.state = { ...this.state, ...newState };
      this.notifyListeners();
    }
  
    /**
     * Subscribe to state changes
     * @param {Function} listener Callback function to be called when state changes
     * @returns {Function} Unsubscribe function
     */
    subscribe(listener) {
      this.listeners.push(listener);
      
      // Return unsubscribe function
      return () => {
        this.listeners = this.listeners.filter(l => l !== listener);
      };
    }
  
    /**
     * Notify all listeners of state change
     */
    notifyListeners() {
      this.listeners.forEach(listener => listener(this.state));
    }
    
    /**
     * Reset state to initial values
     */
    resetState() {
      this.state = {
        searchParams: {
          location: '',
          category: 'restaurant',
          radius: 5,
          minRating: 3.5
        },
        businesses: [],
        filteredBusinesses: [],
        selectedBusiness: null,
        businessDetails: null,
        loading: false,
        error: null,
        sortField: 'name',
        sortDirection: 'asc',
        filterText: '',
        activeTab: 'map'
      };
      this.notifyListeners();
    }
  }
  
  // Create singleton instance
  const appState = new AppState();
  
  // Export singleton instance
  export default appState;