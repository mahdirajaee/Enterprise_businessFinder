/**
 * Pagination.js
 * 
 * Component for paginating through business results
 */

import Component from '../Component.js';
import AppState from '../../store/AppState.js';

export default class Pagination extends Component {
  /**
   * Initialize pagination component
   * @param {string|Element} container CSS selector or DOM element
   * @param {Object} options Component options
   */
  constructor(container, options) {
    super(container, options);
    
    // Store callback for page change
    this.onPageChange = options.onPageChange || (() => {});
    
    // Pagination state
    this.currentPage = 1;
    this.totalPages = 1;
    this.pageSize = options.pageSize || 10;
    
    // Bind event handlers
    this.handlePageClick = this.handlePageClick.bind(this);
  }
  
  /**
   * Render pagination HTML
   */
  render() {
    const { currentPage, totalPages } = this;
    
    // Don't render pagination if only one page
    if (totalPages <= 1) {
      this.container.innerHTML = '';
      return;
    }
    
    // Calculate page ranges to display
    const pages = this.getPageRange(currentPage, totalPages);
    
    this.container.innerHTML = `
      <div class="pagination">
        <button class="pagination-button" data-page="prev" ${currentPage === 1 ? 'disabled' : ''}>
          &laquo; Previous
        </button>
        
        ${pages.map(page => `
          <button class="pagination-button ${page === currentPage ? 'active' : ''}" 
                  data-page="${page}">
            ${page}
          </button>
        `).join('')}
        
        <button class="pagination-button" data-page="next" ${currentPage === totalPages ? 'disabled' : ''}>
          Next &raquo;
        </button>
      </div>
    `;
  }
  
  /**
   * Get page range to display
   * @param {number} currentPage Current page
   * @param {number} totalPages Total pages
   * @returns {Array} Array of page numbers to display
   */
  getPageRange(currentPage, totalPages) {
    // Maximum number of page buttons to show
    const maxButtons = 5;
    
    // If total pages is less than max buttons, show all pages
    if (totalPages <= maxButtons) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    
    // Calculate start and end page
    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let endPage = startPage + maxButtons - 1;
    
    // Adjust if end page exceeds total pages
    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxButtons + 1);
    }
    
    // Generate page range
    return Array.from(
      { length: endPage - startPage + 1 }, 
      (_, i) => startPage + i
    );
  }
  
  /**
   * Attach event listeners
   */
  attachEventListeners() {
    // Listen for pagination button clicks
    this.container.addEventListener('click', this.handlePageClick);
    
    // Subscribe to state changes
    this.unsubscribe = AppState.subscribe(state => {
      // Update pagination based on results
      if (state.businesses !== this.lastBusinesses) {
        this.updatePagination(state.businesses?.length || 0);
        this.lastBusinesses = state.businesses;
      }
    });
  }
  
  /**
   * Detach event listeners
   */
  detachEventListeners() {
    this.container.removeEventListener('click', this.handlePageClick);
    
    // Unsubscribe from state
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }
  
  /**
   * Handle page button click
   * @param {Event} event Click event
   */
  handlePageClick(event) {
    const button = event.target.closest('.pagination-button');
    
    if (!button || button.disabled) {
      return;
    }
    
    const page = button.getAttribute('data-page');
    
    // Handle prev/next buttons
    if (page === 'prev') {
      this.goToPage(this.currentPage - 1);
    } else if (page === 'next') {
      this.goToPage(this.currentPage + 1);
    } else {
      this.goToPage(parseInt(page, 10));
    }
  }
  
  /**
   * Go to specific page
   * @param {number} page Page number
   */
  goToPage(page) {
    // Validate page number
    if (page < 1 || page > this.totalPages || page === this.currentPage) {
      return;
    }
    
    // Update current page
    this.currentPage = page;
    
    // Update UI
    this.update();
    
    // Call page change callback
    this.onPageChange(page, this.pageSize);
  }
  
  /**
   * Update pagination based on total items
   * @param {number} totalItems Total number of items
   */
  updatePagination(totalItems) {
    this.totalPages = Math.max(1, Math.ceil(totalItems / this.pageSize));
    this.currentPage = 1;
    this.update();
  }
  
  /**
   * Set page size
   * @param {number} pageSize Number of items per page
   */
  setPageSize(pageSize) {
    this.pageSize = pageSize;
    this.updatePagination(AppState.getState().businesses?.length || 0);
  }
}