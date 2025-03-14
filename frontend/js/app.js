/**
 * Main application entry point
 * Initializes all components and sets up global event listeners
 */

import AppState from './store/AppState.js';
import ApiService from './services/ApiService.js';
import CacheService from './services/CacheService.js';
import { API_BASE_URL } from './constants/ApiEndpoints.js';

// Import components
import SearchForm from './components/search/SearchForm.js';
import FilterPanel from './components/search/FilterPanel.js';
import ResultsTable from './components/results/ResultsTable.js';
import ResultsMap from './components/results/ResultsMap.js';
import BusinessDetails from './components/details/BusinessDetails.js';

class App {
  constructor() {
    // Initialize services
    this.apiService = new ApiService(API_BASE_URL);
    this.cacheService = new CacheService('business-finder');
    
    // Initialize components
    this.initComponents();
    
    // Set up global event listeners
    this.setupGlobalEventListeners();
    
    // Set up state management
    this.setupStateListeners();
    
    // Try to restore state from cache if available
    this.restoreStateFromCache();
    
    console.log('Business Finder application initialized');
  }
  
  initComponents() {
    // Search form
    this.searchForm = new SearchForm('#search-container', {
      apiService: this.apiService
    });
    
    // Results components
    this.filterPanel = new FilterPanel('.filter-sort-controls', {
      onFilter: this.handleFilter.bind(this),
      onSort: this.handleSort.bind(this)
    });
    
    this.resultsTable = new ResultsTable('#results-table-container', {
      onBusinessSelect: this.handleBusinessSelect.bind(this)
    });
    
    this.resultsMap = new ResultsMap('#map-container', {
      onBusinessSelect: this.handleBusinessSelect.bind(this)
    });
    
    // Business details
    this.businessDetails = new BusinessDetails('#details-container', {
      apiService: this.apiService,
      onClose: this.handleDetailsClose.bind(this)
    });
    
    // Mount components
    this.searchForm.mount();
    this.filterPanel.mount();
    this.resultsTable.mount();
    this.resultsMap.mount();
    this.businessDetails.mount();
  }
  
  setupGlobalEventListeners() {
    // Tab switching
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
      button.addEventListener('click', () => {
        const tabName = button.getAttribute('data-tab');
        
        // Update active tab button
        tabButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        // Show active tab content
        tabContents.forEach(content => {
          content.classList.remove('active');
          if (content.id === `${tabName}-container`) {
            content.classList.add('active');
          }
        });
      });
    });
  }
  
  setupStateListeners() {
    // Listen for state changes
    AppState.subscribe(state => {
      // Show/hide loading indicator
      this.toggleLoading(state.loading);
      
      // Display error message if any
      this.displayError(state.error);
      
      // Handle state changes that should be cached
      if (!state.loading && !state.error) {
        // Cache important state for persistence
        this.cacheService.saveState({
          searchParams: state.searchParams,
          lastSearch: new Date().toISOString()
        });
      }
    });
  }
  
  toggleLoading(loading) {
    const loadingIndicator = document.getElementById('loading-indicator');
    if (loadingIndicator) {
      loadingIndicator.classList.toggle('hidden', !loading);
    }
  }
  
  displayError(error) {
    const errorContainer = document.getElementById('error-container');
    if (errorContainer) {
      if (error) {
        errorContainer.textContent = error;
        errorContainer.classList.remove('hidden');
      } else {
        errorContainer.classList.add('hidden');
      }
    }
  }
  
  restoreStateFromCache() {
    const cachedState = this.cacheService.getState();
    if (cachedState && cachedState.searchParams) {
      // Update form with cached search parameters
      this.searchForm.populateFromState(cachedState.searchParams);
    }
  }
  
  // Event handlers
  
  handleFilter(filterText) {
    const state = AppState.getState();
    
    if (!state.businesses || state.businesses.length === 0) {
      return;
    }
    
    if (!filterText) {
      AppState.setState({ filteredBusinesses: state.businesses });
      return;
    }
    
    const lowercaseFilter = filterText.toLowerCase();
    const filtered = state.businesses.filter(business => {
      return (
        business['Business Name']?.toLowerCase().includes(lowercaseFilter) ||
        business['Address']?.toLowerCase().includes(lowercaseFilter) ||
        business['City']?.toLowerCase().includes(lowercaseFilter)
      );
    });
    
    AppState.setState({ filteredBusinesses: filtered });
  }
  
  handleSort(sortField, sortDirection = 'asc') {
    const state = AppState.getState();
    
    if (!state.filteredBusinesses || state.filteredBusinesses.length === 0) {
      return;
    }
    
    // Map sort fields to actual business properties
    const fieldMap = {
      'name': 'Business Name',
      'rating': 'Google Rating',
      'reviews': 'Number of Reviews'
    };
    
    const actualField = fieldMap[sortField] || sortField;
    
    const sorted = [...state.filteredBusinesses].sort((a, b) => {
      const valueA = a[actualField] || '';
      const valueB = b[actualField] || '';
      
      // Handle numeric fields
      if (!isNaN(valueA) && !isNaN(valueB)) {
        return sortDirection === 'asc' 
          ? Number(valueA) - Number(valueB)
          : Number(valueB) - Number(valueA);
      }
      
      // Handle string fields
      const compareResult = String(valueA).localeCompare(String(valueB));
      return sortDirection === 'asc' ? compareResult : -compareResult;
    });
    
    AppState.setState({ filteredBusinesses: sorted });
  }
  
  handleBusinessSelect(business) {
    // Set selected business in state, which will trigger details view to show
    AppState.setState({ selectedBusiness: business });
    
    // Scroll to the details container
    document.getElementById('details-container').scrollIntoView({ 
      behavior: 'smooth' 
    });
    
    // Show the details container if hidden
    document.getElementById('details-container').classList.remove('hidden');
  }
  
  handleDetailsClose() {
    // Clear selected business and hide details section
    AppState.setState({ selectedBusiness: null });
    document.getElementById('details-container').classList.add('hidden');
  }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  try {
    window.app = new App();
  } catch (error) {
    console.error('Failed to initialize application:', error);
    document.body.innerHTML = `
      <div class="error-screen container">
        <h1>Application Error</h1>
        <p>${error.message}</p>
        <button onclick="location.reload()">Reload Page</button>
      </div>
    `;
  }
});