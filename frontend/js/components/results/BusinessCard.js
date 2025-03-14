/**
 * BusinessCard.js
 * 
 * Component for displaying a business card in the list view
 * Used for a more visual alternative to the table view
 */

import Component from '../Component.js';

export default class BusinessCard extends Component {
  /**
   * Initialize business card component
   * @param {string|Element} container CSS selector or DOM element
   * @param {Object} options Component options
   */
  constructor(container, options) {
    super(container, options);
    
    // Store business data
    this.business = options.business || {};
    
    // Store callback function for business selection
    this.onBusinessSelect = options.onBusinessSelect || (() => {});
    
    // Bind event handlers
    this.handleDetailsClick = this.handleDetailsClick.bind(this);
  }
  
  /**
   * Render business card HTML
   */
  render() {
    // Format rating as stars
    const rating = parseFloat(this.business['Google Rating']) || 0;
    const ratingStars = this.formatRatingStars(rating);
    
    // Get business address components
    const address = this.business.Address || 'No address available';
    const city = this.business.City || '';
    const country = this.business.Country || '';
    
    // Format category with icon
    const categoryIcon = this.getCategoryIcon(this.business.Category);
    
    this.container.innerHTML = `
      <div class="business-card" data-id="${this.business.id}">
        <h3 class="business-name">${this.business['Business Name'] || 'Unnamed Business'}</h3>
        
        <div class="business-meta">
          <span class="business-category">
            ${categoryIcon} ${this.business.Category || 'Unknown'}
          </span>
          
          ${rating > 0 ? `
            <div class="rating">
              <span class="rating-value">${rating.toFixed(1)}</span>
              <span class="rating-stars">${ratingStars}</span>
              <span class="reviews-count">(${this.business['Number of Reviews'] || 0})</span>
            </div>
          ` : '<div class="no-rating">No ratings yet</div>'}
        </div>
        
        <div class="business-location">
          <div class="address">
            <span class="icon">📍</span> ${address}
          </div>
          <div class="city-country">
            ${city}${city && country ? ', ' : ''}${country}
          </div>
        </div>
        
        ${this.business['Phone Number'] ? `
          <div class="business-phone">
            <span class="icon">📞</span> ${this.business['Phone Number']}
          </div>
        ` : ''}
        
        ${this.business.Website ? `
          <div class="business-website">
            <span class="icon">🌐</span> 
            <a href="${this.business.Website}" target="_blank">Website</a>
          </div>
        ` : ''}
        
        <button class="details-button" data-id="${this.business.id}">
          View Details
        </button>
      </div>
    `;
  }
  
  /**
   * Format rating as stars
   * @param {number} rating Rating value (0-5)
   * @returns {string} Star HTML
   */
  formatRatingStars(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    return `
      ${'★'.repeat(fullStars)}
      ${halfStar ? '½' : ''}
      ${'☆'.repeat(emptyStars)}
    `;
  }
  
  /**
   * Get icon for business category
   * @param {string} category Business category
   * @returns {string} Icon HTML
   */
  getCategoryIcon(category) {
    const icons = {
      'Hotel': '🏨',
      'Restaurant': '🍽️',
      'Bar': '🍸',
      'Cafe': '☕',
      'Bakery': '🥐',
      'Nightclub': '🎵'
    };
    
    return icons[category] || '🏢';
  }
  
  /**
   * Attach event listeners
   */
  attachEventListeners() {
    // Get details button
    const detailsButton = this.container.querySelector('.details-button');
    
    if (detailsButton) {
      detailsButton.addEventListener('click', this.handleDetailsClick);
    }
    
    // Make entire card clickable except for links
    const card = this.container.querySelector('.business-card');
    
    if (card) {
      card.addEventListener('click', (event) => {
        // Don't trigger if clicking on a link or button
        if (event.target.tagName === 'A' || event.target.tagName === 'BUTTON') {
          return;
        }
        
        this.handleDetailsClick(event);
      });
    }
  }
  
  /**
   * Detach event listeners
   */
  detachEventListeners() {
    // Get details button
    const detailsButton = this.container.querySelector('.details-button');
    
    if (detailsButton) {
      detailsButton.removeEventListener('click', this.handleDetailsClick);
    }
    
    // Remove card click handler
    const card = this.container.querySelector('.business-card');
    
    if (card) {
      card.removeEventListener('click', this.handleDetailsClick);
    }
  }
  
  /**
   * Handle details button click
   * @param {Event} event Click event
   */
  handleDetailsClick(event) {
    event.preventDefault();
    
    // Call selection callback
    this.onBusinessSelect(this.business);
  }
  
  /**
   * Update business data
   * @param {Object} business New business data
   */
  updateBusiness(business) {
    this.business = business;
    this.update();
  }
}