/**
 * ResultsTable.js
 * 
 * Component for displaying business results in a table
 * Supports sorting and filtering
 */

import Component from '../Component.js';
import AppState from '../../store/AppState.js';

export default class ResultsTable extends Component {
  /**
   * Initialize results table component
   * @param {string|Element} container CSS selector or DOM element
   * @param {Object} options Component options
   */
  constructor(container, options) {
    super(container, options);
    
    // Store callback function for business selection
    this.onBusinessSelect = options.onBusinessSelect || (() => {});
    
    // Columns to display
    this.columns = [
      { key: 'Business Name', label: 'Name', sortable: true },
      { key: 'Category', label: 'Category', sortable: true },
      { key: 'Address', label: 'Address', sortable: false },
      { key: 'City', label: 'City', sortable: true },
      { key: 'Google Rating', label: 'Rating', sortable: true },
      { key: 'Phone Number', label: 'Phone', sortable: false }
    ];
    
    // Bind event handlers
    this.handleRowClick = this.handleRowClick.bind(this);
    this.handleHeaderClick = this.handleHeaderClick.bind(this);
  }
  
  /**
   * Render results table HTML
   */
  render() {
    const { filteredBusinesses, loading } = AppState.getState();
    
    // Create table HTML
    let html = '';
    
    if (loading) {
      html = '<div class="loading-message">Loading businesses...</div>';
    } else if (!filteredBusinesses || filteredBusinesses.length === 0) {
      html = '<div class="no-results">No businesses found. Try adjusting your search criteria.</div>';
    } else {
      html = `
        <table class="results-table">
          <thead>
            <tr>
              ${this.columns.map(column => `
                <th data-key="${column.key}" class="${column.sortable ? 'sortable' : ''}">
                  ${column.label}
                </th>
              `).join('')}
            </tr>
          </thead>
          <tbody>
            ${filteredBusinesses.map(business => `
              <tr data-id="${business.id}">
                ${this.columns.map(column => `
                  <td>${this.formatValue(business[column.key])}</td>
                `).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    }
    
    // Set container HTML
    this.container.innerHTML = html;
    
    // Update sort indicators
    this.updateSortIndicators();
  }
  
  /**
   * Format cell value for display
   * @param {*} value Cell value
   * @returns {string} Formatted value
   */
  formatValue(value) {
    if (value === undefined || value === null || value === '') {
      return '-';
    }
    
    // Format rating with stars
    if (typeof value === 'number' && value >= 0 && value <= 5) {
      const stars = '★'.repeat(Math.floor(value)) + '☆'.repeat(5 - Math.floor(value));
      return `${value.toFixed(1)} ${stars}`;
    }
    
    return String(value);
  }
  
  /**
   * Update sort indicators in table headers
   */
  updateSortIndicators() {
    const { sortField, sortDirection } = AppState.getState();
    
    // Remove all sort classes
    const headers = this.container.querySelectorAll('th');
    headers.forEach(header => {
      header.classList.remove('sort-asc', 'sort-desc');
    });
    
    // Add sort class to active header
    if (sortField) {
      const activeHeader = this.container.querySelector(`th[data-key="${sortField}"]`);
      if (activeHeader) {
        activeHeader.classList.add(sortDirection === 'asc' ? 'sort-asc' : 'sort-desc');
      }
    }
  }
  
  /**
   * Attach event listeners
   */
  attachEventListeners() {
    // Listen for row clicks
    this.container.addEventListener('click', this.handleRowClick);
    
    // Listen for header clicks (sorting)
    const headers = this.container.querySelectorAll('th.sortable');
    headers.forEach(header => {
      header.addEventListener('click', this.handleHeaderClick);
    });
    
    // Subscribe to state changes
    this.unsubscribe = AppState.subscribe(state => {
      // Only update if businesses or filtered businesses change
      const needsUpdate = 
        state.filteredBusinesses !== this.lastFilteredBusinesses ||
        state.loading !== this.lastLoading ||
        state.sortField !== this.lastSortField ||
        state.sortDirection !== this.lastSortDirection;
      
      if (needsUpdate) {
        this.update();
        
        // Store reference to current state for comparison
        this.lastFilteredBusinesses = state.filteredBusinesses;
        this.lastLoading = state.loading;
        this.lastSortField = state.sortField;
        this.lastSortDirection = state.sortDirection;
      }
    });
  }
  
  /**
   * Detach event listeners
   */
  detachEventListeners() {
    // Remove row click listener
    this.container.removeEventListener('click', this.handleRowClick);
    
    // Remove header click listeners
    const headers = this.container.querySelectorAll('th.sortable');
    headers.forEach(header => {
      header.removeEventListener('click', this.handleHeaderClick);
    });
    
    // Unsubscribe from state
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }
  
  /**
   * Handle table row click
   * @param {Event} event Click event
   */
  handleRowClick(event) {
    // Find closest row element
    const row = event.target.closest('tr[data-id]');
    
    if (row) {
      const businessId = row.getAttribute('data-id');
      const state = AppState.getState();
      
      // Find selected business
      const selectedBusiness = state.filteredBusinesses.find(
        business => business.id === businessId
      );
      
      if (selectedBusiness) {
        // Call selection callback
        this.onBusinessSelect(selectedBusiness);
      }
    }
  }
  
  /**
   * Handle table header click for sorting
   * @param {Event} event Click event
   */
  handleHeaderClick(event) {
    const header = event.currentTarget;
    const key = header.getAttribute('data-key');
    
    if (!key) return;
    
    const state = AppState.getState();
    
    // Determine sort direction
    let sortDirection = 'asc';
    
    // If already sorting by this field, toggle direction
    if (state.sortField === key) {
      sortDirection = state.sortDirection === 'asc' ? 'desc' : 'asc';
    }
    
    // Update state with new sort parameters
    AppState.setState({
      sortField: key,
      sortDirection
    });
    
    // Sort the businesses
    this.sortBusinesses(key, sortDirection);
  }
  
  /**
   * Sort businesses by field
   * @param {string} field Field to sort by
   * @param {string} direction Sort direction ('asc' or 'desc')
   */
  sortBusinesses(field, direction) {
    const state = AppState.getState();
    
    if (!state.filteredBusinesses) return;
    
    // Sort copy of filtered businesses
    const sorted = [...state.filteredBusinesses].sort((a, b) => {
      const valueA = a[field] || '';
      const valueB = b[field] || '';
      
      // Numeric sort for ratings and reviews
      if (field === 'Google Rating' || field === 'Number of Reviews') {
        const numA = parseFloat(valueA) || 0;
        const numB = parseFloat(valueB) || 0;
        return direction === 'asc' ? numA - numB : numB - numA;
      }
      
      // String sort for other fields
      const compareResult = String(valueA).localeCompare(String(valueB));
      return direction === 'asc' ? compareResult : -compareResult;
    });
    
    // Update state with sorted businesses
    AppState.setState({ filteredBusinesses: sorted });
  }
}