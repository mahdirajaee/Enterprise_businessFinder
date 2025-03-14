/**
 * SearchForm.js
 * 
 * Search form component for finding businesses
 * Handles search form rendering and submission
 */

import Component from '../Component.js';
import AppState from '../../store/AppState.js';
import { CATEGORIES } from '../../constants/Categories.js';

export default class SearchForm extends Component {
  /**
   * Initialize search form component
   * @param {string|Element} container CSS selector or DOM element
   * @param {Object} options Component options
   */
  constructor(container, options) {
    super(container, options);
    
    // Store API service reference
    this.apiService = options.apiService;
    
    // Bind event handlers
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleRadiusChange = this.handleRadiusChange.bind(this);
    this.handleRatingChange = this.handleRatingChange.bind(this);
  }
  
  /**
   * Render search form HTML
   */
  render() {
    // Get current search parameters from state
    const { searchParams } = AppState.getState();
    
    this.container.innerHTML = `
      <form id="search-form" class="search-form">
        <div class="form-group">
          <label for="location">Location</label>
          <input type="text" id="location" name="location" 
                 placeholder="City, country..." 
                 value="${searchParams.location || ''}" required>
        </div>
        
        <div class="form-group">
          <label for="category">Category</label>
          <select id="category" name="category">
            ${CATEGORIES.map(cat => `
              <option value="${cat.id}" ${searchParams.category === cat.id ? 'selected' : ''}>
                ${cat.name}
              </option>
            `).join('')}
          </select>
        </div>
        
        <div class="form-group">
          <label for="radius">Radius: <span id="radius-value">${searchParams.radius || 5} km</span></label>
          <input type="range" id="radius" name="radius" 
                 min="1" max="50" step="1" 
                 value="${searchParams.radius || 5}">
        </div>
        
        <div class="form-group">
          <label for="minRating">Minimum Rating: <span id="rating-value">${searchParams.minRating || 3.5}</span></label>
          <input type="range" id="minRating" name="minRating" 
                 min="1" max="5" step="0.5" 
                 value="${searchParams.minRating || 3.5}">
        </div>
        
        <div class="form-group">
          <label for="apiSource">API Source</label>
          <select id="apiSource" name="apiSource">
            <option value="osm" ${searchParams.apiSource === 'osm' ? 'selected' : ''}>OpenStreetMap (Free)</option>
            <option value="google" ${searchParams.apiSource === 'google' ? 'selected' : ''}>Google Places API</option>
            <option value="yelp" ${searchParams.apiSource === 'yelp' ? 'selected' : ''}>Yelp Fusion API</option>
          </select>
        </div>
        
        <button type="submit" class="search-button">
          <span class="search-icon">🔍</span> Search Businesses
        </button>
      </form>
    `;
  }
  
  /**
   * Attach event listeners
   */
  attachEventListeners() {
    // Get form elements
    this.form = this.container.querySelector('#search-form');
    this.radiusInput = this.container.querySelector('#radius');
    this.radiusValue = this.container.querySelector('#radius-value');
    this.ratingInput = this.container.querySelector('#minRating');
    this.ratingValue = this.container.querySelector('#rating-value');
    
    // Attach events
    if (this.form) {
      this.form.addEventListener('submit', this.handleSubmit);
    }
    
    if (this.radiusInput) {
      this.radiusInput.addEventListener('input', this.handleRadiusChange);
    }
    
    if (this.ratingInput) {
      this.ratingInput.addEventListener('input', this.handleRatingChange);
    }
  }
  
  /**
   * Detach event listeners
   */
  detachEventListeners() {
    if (this.form) {
      this.form.removeEventListener('submit', this.handleSubmit);
    }
    
    if (this.radiusInput) {
      this.radiusInput.removeEventListener('input', this.handleRadiusChange);
    }
    
    if (this.ratingInput) {
      this.ratingInput.removeEventListener('input', this.handleRatingChange);
    }
  }
  
  /**
   * Handle form submission
   * @param {Event} event Submit event
   */
  async handleSubmit(event) {
    event.preventDefault();
    
    // Set loading state
    AppState.setState({ loading: true, error: null });
    
    try {
      // Get form data
      const formData = new FormData(this.form);
      
      // Create search parameters object
      const searchParams = {
        location: formData.get('location'),
        category: formData.get('category'),
        radius: Number(formData.get('radius')),
        minRating: Number(formData.get('minRating')),
        apiSource: formData.get('apiSource')
      };
      
      // Update state with search parameters
      AppState.setState({ searchParams });
      
      // Fetch businesses
      const businesses = await this.apiService.searchBusinesses(searchParams);
      
      // Update state with results
      AppState.setState({ 
        businesses, 
        filteredBusinesses: businesses,
        loading: false 
      });
    } catch (error) {
      // Update state with error
      AppState.setState({ 
        error: error.message, 
        loading: false 
      });
    }
  }
  
  /**
   * Handle radius input change
   * @param {Event} event Input event
   */
  handleRadiusChange(event) {
    const value = event.target.value;
    this.radiusValue.textContent = `${value} km`;
  }
  
  /**
   * Handle rating input change
   * @param {Event} event Input event
   */
  handleRatingChange(event) {
    const value = event.target.value;
    this.ratingValue.textContent = value;
  }
  
  /**
   * Populate form from state
   * @param {Object} searchParams Search parameters
   */
  populateFromState(searchParams) {
    const locationInput = this.container.querySelector('#location');
    const categorySelect = this.container.querySelector('#category');
    const radiusInput = this.container.querySelector('#radius');
    const ratingInput = this.container.querySelector('#minRating');
    const apiSourceSelect = this.container.querySelector('#apiSource');
    
    if (locationInput && searchParams.location) {
      locationInput.value = searchParams.location;
    }
    
    if (categorySelect && searchParams.category) {
      categorySelect.value = searchParams.category;
    }
    
    if (radiusInput && searchParams.radius) {
      radiusInput.value = searchParams.radius;
      this.radiusValue.textContent = `${searchParams.radius} km`;
    }
    
    if (ratingInput && searchParams.minRating) {
      ratingInput.value = searchParams.minRating;
      this.ratingValue.textContent = searchParams.minRating;
    }
    
    if (apiSourceSelect && searchParams.apiSource) {
      apiSourceSelect.value = searchParams.apiSource;
    }
  }
}