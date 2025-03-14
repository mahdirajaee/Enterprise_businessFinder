/**
 * FilterPanel.js
 * 
 * Component for filtering and sorting business results
 */

import Component from '../Component.js';
import AppState from '../../store/AppState.js';

export default class FilterPanel extends Component {
  /**
   * Initialize filter panel component
   * @param {string|Element} container CSS selector or DOM element
   * @param {Object} options Component options
   */
  constructor(container, options) {
    super(container, options);
    
    // Store callback functions
    this.onFilter = options.onFilter || (() => {});
    this.onSort = options.onSort || (() => {});
    
    // Debounce filter input
    this.debouncedFilter = this.debounce(this.handleFilter.bind(this), 300);
    
    // Bind event handlers
    this.handleSortChange = this.handleSortChange.bind(this);
  }
  
  /**
   * Render filter panel HTML
   * Note: This component doesn't need to render HTML as it's already in index.html
   * We're just connecting event handlers
   */
  render() {
    // The container already has the necessary HTML elements from index.html
    // No need to render additional HTML
  }
  
  /**
   * Attach event listeners
   */
  attachEventListeners() {
    // Get references to elements
    this.filterInput = this.container.querySelector('#quick-filter');
    this.sortSelect = this.container.querySelector('#sort-by');
    
    // Attach event listeners
    if (this.filterInput) {
      this.filterInput.addEventListener('input', this.debouncedFilter);
    }
    
    if (this.sortSelect) {
      this.sortSelect.addEventListener('change', this.handleSortChange);
    }
    
    // Listen for state changes
    this.unsubscribe = AppState.subscribe(this.updateFromState.bind(this));
  }
  
  /**
   * Detach event listeners
   */
  detachEventListeners() {
    if (this.filterInput) {
      this.filterInput.removeEventListener('input', this.debouncedFilter);
    }
    
    if (this.sortSelect) {
      this.sortSelect.removeEventListener('change', this.handleSortChange);
    }
    
    // Unsubscribe from state changes
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }
  
  /**
   * Update component from state
   * @param {Object} state Current application state
   */
  updateFromState(state) {
    // Show or hide filter panel based on whether there are business results
    const hasBusinesses = state.businesses && state.businesses.length > 0;
    this.toggle(hasBusinesses);
    
    // Reset filter and sort when new search is performed
    if (hasBusinesses && !state.loading && state.businesses !== this.lastBusinesses) {
      this.resetFilters();
      this.lastBusinesses = state.businesses;
    }
  }
  
  /**
   * Reset filters and sorting
   */
  resetFilters() {
    if (this.filterInput) {
      this.filterInput.value = '';
    }
    
    if (this.sortSelect) {
      this.sortSelect.value = '';
    }
    
    // Update state
    AppState.setState({
      filterText: '',
      sortField: '',
      sortDirection: 'asc'
    });
  }
  
  /**
   * Handle filter input
   * @param {Event} event Input event
   */
  handleFilter(event) {
    const filterText = event.target.value.trim();
    
    // Update state
    AppState.setState({ filterText });
    
    // Call filter callback
    this.onFilter(filterText);
  }
  
  /**
   * Handle sort selection
   * @param {Event} event Change event
   */
  handleSortChange(event) {
    const sortValue = event.target.value;
    
    if (!sortValue) {
      // Reset to original order
      const state = AppState.getState();
      AppState.setState({ 
        filteredBusinesses: state.businesses,
        sortField: '',
        sortDirection: 'asc'
      });
      return;
    }
    
    // Parse sort value (format: field-direction)
    let [sortField, sortDirection] = sortValue.split('-');
    
    // Default direction is ascending
    if (!sortDirection) {
      sortDirection = 'asc';
    }
    
    // Update state
    AppState.setState({
      sortField,
      sortDirection
    });
    
    // Call sort callback
    this.onSort(sortField, sortDirection);
  }
  
  /**
   * Debounce function for preventing too many filter events
   * @param {Function} func Function to debounce
   * @param {number} wait Wait time in milliseconds
   * @returns {Function} Debounced function
   */
  debounce(func, wait) {
    let timeout;
    
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
}