/**
 * ReviewsList.js
 * 
 * Component for displaying business reviews
 */

import Component from '../Component.js';

export default class ReviewsList extends Component {
  /**
   * Initialize reviews list component
   * @param {string|Element} container CSS selector or DOM element
   * @param {Object} options Component options
   */
  constructor(container, options) {
    super(container, options);
    
    // Store business data
    this.business = options.business || {};
    
    // Store API service reference
    this.apiService = options.apiService;
    
    // Reviews data
    this.reviews = [];
    
    // Loading state
    this.loading = false;
  }
  
  /**
   * Render reviews list HTML
   */
  render() {
    // Show loading state initially
    if (this.loading) {
      this.container.innerHTML = `
        <h3>Reviews</h3>
        <div class="reviews-loading">Loading reviews...</div>
      `;
      return;
    }
    
    // No reviews available
    if (!this.reviews || this.reviews.length === 0) {
      this.container.innerHTML = `
        <h3>Reviews</h3>
        <div class="no-reviews">No reviews available for this business.</div>
      `;
      return;
    }
    
    // Render reviews
    this.container.innerHTML = `
      <h3>Reviews</h3>
      <div class="reviews-list">
        ${this.reviews.map(review => `
          <div class="review-item">
            <div class="review-header">
              <div class="review-author">${review.author || 'Anonymous'}</div>
              <div class="review-rating">
                ${this.formatRating(review.rating)}
              </div>
            </div>
            <div class="review-comment">${review.comment || 'No comment'}</div>
            ${review.date ? `<div class="review-date">${review.date}</div>` : ''}
          </div>
        `).join('')}
      </div>
    `;
  }
  
  /**
   * Format rating as stars
   * @param {number} rating Rating value (0-5)
   * @returns {string} Star HTML
   */
  formatRating(rating) {
    if (!rating) return '';
    
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    return `
      <span class="rating-stars">
        ${'★'.repeat(fullStars)}
        ${halfStar ? '½' : ''}
        ${'☆'.repeat(emptyStars)}
      </span>
      <span class="rating-value">${parseFloat(rating).toFixed(1)}</span>
    `;
  }
  
  /**
   * Mount component and fetch reviews data
   */
  mount() {
    super.mount();
    this.fetchReviews();
  }
  
  /**
   * Attach event listeners
   */
  attachEventListeners() {
    // No event listeners needed for this component
  }
  
  /**
   * Detach event listeners
   */
  detachEventListeners() {
    // No event listeners to detach
  }
  
  /**
   * Fetch reviews from API
   */
  async fetchReviews() {
    if (!this.business || !this.business.id) return;
    
    this.loading = true;
    this.render();
    
    try {
      // Fetch business details (including reviews)
      const details = await this.apiService.getBusinessDetails(this.business.id);
      
      // Extract reviews
      this.reviews = details.details?.reviews || [];
      
      // If no reviews available, generate mock reviews for demonstration
      if (this.reviews.length === 0) {
        this.reviews = this.generateMockReviews();
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
      this.reviews = this.generateMockReviews();
    } finally {
      this.loading = false;
      this.update();
    }
  }
  
  /**
   * Generate mock reviews for demonstration
   * @returns {Array} Mock reviews
   */
  generateMockReviews() {
    const businessName = this.business['Business Name'] || 'this place';
    const category = this.business.Category?.toLowerCase() || 'business';
    
    return [
      {
        author: 'John D.',
        rating: 4.5,
        comment: `Great ${category}! I really enjoyed my visit to ${businessName}. The service was excellent and the prices were reasonable.`,
        date: '3 months ago'
      },
      {
        author: 'Maria S.',
        rating: 5,
        comment: `Best ${category} in the area! Highly recommended for anyone visiting ${this.business.City || 'the area'}.`,
        date: '6 months ago'
      },
      {
        author: 'Alex T.',
        rating: 3.5,
        comment: `Decent experience overall. The ${category} was good but could use some improvements in service.`,
        date: '1 year ago'
      }
    ];
  }
  
  /**
   * Update business data
   * @param {Object} business New business data
   */
  updateBusiness(business) {
    this.business = business;
    this.fetchReviews();
  }
}