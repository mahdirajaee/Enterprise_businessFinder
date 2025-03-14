/**
 * ContactInfo.js
 * 
 * Component for displaying business contact information
 */

import Component from '../Component.js';

export default class ContactInfo extends Component {
  /**
   * Initialize contact info component
   * @param {string|Element} container CSS selector or DOM element
   * @param {Object} options Component options
   */
  constructor(container, options) {
    super(container, options);
    
    // Store business data
    this.business = options.business || {};
  }
  
  /**
   * Render contact info HTML
   */
  render() {
    const phone = this.business['Phone Number'];
    const email = this.business['Email'];
    const website = this.business['Website'];
    
    // Check if any contact info is available
    const hasContactInfo = phone || email || website;
    
    if (!hasContactInfo) {
      this.container.innerHTML = `
        <h3>Contact Information</h3>
        <p class="no-contact-info">No contact information available for this business.</p>
      `;
      return;
    }
    
    this.container.innerHTML = `
      <h3>Contact Information</h3>
      <div class="contact-info">
        ${phone ? `
          <div class="contact-item">
            <span class="icon">📞</span>
            <a href="tel:${phone.replace(/[^0-9+]/g, '')}" class="phone-link">
              ${phone}
            </a>
          </div>
        ` : ''}
        
        ${email ? `
          <div class="contact-item">
            <span class="icon">✉️</span>
            <a href="mailto:${email}" class="email-link">
              ${email}
            </a>
          </div>
        ` : ''}
        
        ${website ? `
          <div class="contact-item">
            <span class="icon">🌐</span>
            <a href="${this.ensureHttpPrefix(website)}" target="_blank" rel="noopener noreferrer" class="website-link">
              ${this.formatWebsiteUrl(website)}
            </a>
          </div>
        ` : ''}
      </div>
      
      ${this.renderBusinessHours()}
    `;
  }
  
  /**
   * Render business hours section
   * @returns {string} HTML for business hours
   */
  renderBusinessHours() {
    // In a real application, business hours would come from the API
    // Here we'll just show placeholder content
    
    return `
      <div class="business-hours">
        <h4>Business Hours</h4>
        <div class="hours-disclaimer">Hours may vary. Please contact the business to confirm.</div>
      </div>
    `;
  }
  
  /**
   * Ensure URL has http/https prefix
   * @param {string} url Website URL
   * @returns {string} URL with http/https prefix
   */
  ensureHttpPrefix(url) {
    if (!url) return '';
    
    // If URL doesn't start with http:// or https://, add https://
    if (!url.match(/^https?:\/\//i)) {
      return `https://${url}`;
    }
    
    return url;
  }
  
  /**
   * Format website URL for display
   * @param {string} url Website URL
   * @returns {string} Formatted URL
   */
  formatWebsiteUrl(url) {
    if (!url) return '';
    
    // Remove http(s):// and trailing slash for display
    return url.replace(/^https?:\/\//i, '').replace(/\/$/, '');
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
   * Update business data
   * @param {Object} business New business data
   */
  updateBusiness(business) {
    this.business = business;
    this.update();
  }
}