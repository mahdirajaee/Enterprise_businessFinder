/**
 * ResultsMap.js
 * 
 * Component for displaying business results on a map
 * Uses Leaflet.js for mapping
 */

import Component from '../Component.js';
import AppState from '../../store/AppState.js';
import MapUtils from '../../utils/MapUtils.js';

export default class ResultsMap extends Component {
  /**
   * Initialize map component
   * @param {string|Element} container CSS selector or DOM element
   * @param {Object} options Component options
   */
  constructor(container, options) {
    super(container, options);
    
    // Store callback function for business selection
    this.onBusinessSelect = options.onBusinessSelect || (() => {});
    
    // Map and marker references
    this.map = null;
    this.markers = new Map(); // Map of business ID -> marker
    
    // Default map center (Italy)
    this.defaultCenter = [41.9028, 12.4964];
    this.defaultZoom = 5;
    
    // Category colors for markers
    this.categoryColors = {
      'Hotel': '#2ecc71',      // Green
      'Restaurant': '#3498db', // Blue
      'Bar': '#f39c12',        // Orange
      'Cafe': '#e74c3c',       // Red
      'Bakery': '#9b59b6',     // Purple
      'Nightclub': '#e67e22'   // Dark Orange
    };
  }
  
  /**
   * Render map container HTML
   */
  render() {
    // Create a map container div
    this.container.innerHTML = `
      <div id="business-map" style="width: 100%; height: 500px;"></div>
    `;
  }
  
  /**
   * Initialize map after component is mounted
   */
  initializeMap() {
    // Create Leaflet map
    this.map = L.map('business-map').setView(this.defaultCenter, this.defaultZoom);
    
    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    }).addTo(this.map);
    
    // Add map legend
    this.addMapLegend();
  }
  
  /**
   * Add map legend
   */
  addMapLegend() {
    const legend = L.control({ position: 'bottomright' });
    
    legend.onAdd = () => {
      const div = L.DomUtil.create('div', 'map-legend');
      div.innerHTML = `
        <h4>Business Types</h4>
        ${Object.entries(this.categoryColors).map(([category, color]) => `
          <div class="legend-item">
            <div class="legend-color ${category.toLowerCase()}" style="background-color: ${color};"></div>
            <span>${category}</span>
          </div>
        `).join('')}
      `;
      return div;
    };
    
    legend.addTo(this.map);
  }
  
  /**
   * Attach event listeners
   */
  attachEventListeners() {
    // Initialize map after render
    setTimeout(() => {
      this.initializeMap();
    }, 0);
    
    // Subscribe to state changes
    this.unsubscribe = AppState.subscribe(state => {
      // Only update markers if businesses or filtered businesses change
      if (state.filteredBusinesses !== this.lastFilteredBusinesses) {
        this.updateMarkers(state.filteredBusinesses);
        this.lastFilteredBusinesses = state.filteredBusinesses;
      }
    });
  }
  
  /**
   * Detach event listeners
   */
  detachEventListeners() {
    // Unsubscribe from state
    if (this.unsubscribe) {
      this.unsubscribe();
    }
    
    // Clean up map
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  }
  
  /**
   * Update map markers based on filtered businesses
   * @param {Array} businesses Array of business objects
   */
  updateMarkers(businesses) {
    if (!this.map) return;
    
    // Clear existing markers
    this.markers.forEach(marker => {
      marker.remove();
    });
    this.markers.clear();
    
    // Nothing to show
    if (!businesses || businesses.length === 0) {
      this.map.setView(this.defaultCenter, this.defaultZoom);
      return;
    }
    
    // Bounds to fit all markers
    const bounds = L.latLngBounds();
    
    // Add markers for each business with valid coordinates
    businesses.forEach(business => {
      // Skip if coordinates are missing
      if (!business.Latitude || !business.Longitude) return;
      
      // Parse coordinates
      const lat = parseFloat(business.Latitude);
      const lng = parseFloat(business.Longitude);
      
      // Skip if invalid coordinates
      if (isNaN(lat) || isNaN(lng)) return;
      
      // Get marker color based on category
      const category = business.Category || 'Other';
      const color = this.categoryColors[category] || '#34495e';
      
      // Create custom marker
      const marker = L.marker([lat, lng], {
        icon: MapUtils.createCustomMarker(category.charAt(0), color)
      });
      
      // Add popup
      marker.bindPopup(this.createPopupContent(business));
      
      // Handle popup open
      marker.on('popupopen', () => {
        const viewDetailsBtn = document.querySelector(`.view-details-btn[data-id="${business.id}"]`);
        if (viewDetailsBtn) {
          viewDetailsBtn.addEventListener('click', () => {
            this.onBusinessSelect(business);
          });
        }
      });
      
      // Add marker to map
      marker.addTo(this.map);
      
      // Store marker reference
      this.markers.set(business.id, marker);
      
      // Extend bounds
      bounds.extend([lat, lng]);
    });
    
    // Fit map to bounds if we have markers
    if (this.markers.size > 0) {
      this.map.fitBounds(bounds, { padding: [50, 50] });
    }
  }
  
  /**
   * Create HTML content for marker popup
   * @param {Object} business Business data
   * @returns {string} HTML content
   */
  createPopupContent(business) {
    return `
      <div class="map-popup">
        <h3>${business['Business Name'] || 'Unnamed Business'}</h3>
        <p><strong>Category:</strong> ${business.Category || 'Unknown'}</p>
        <p><strong>Address:</strong> ${business.Address || 'No address available'}</p>
        ${business['Google Rating'] ? `
          <p><strong>Rating:</strong> ${business['Google Rating']} / 5
            (${business['Number of Reviews'] || 0} reviews)
          </p>
        ` : ''}
        <button class="view-details-btn" data-id="${business.id}">View Details</button>
      </div>
    `;
  }
  
  /**
   * Select a business and highlight it on the map
   * @param {Object} business Business to highlight
   */
  highlightBusiness(business) {
    if (!this.map || !business || !business.id) return;
    
    // Get marker
    const marker = this.markers.get(business.id);
    
    if (marker) {
      // Center map on marker
      this.map.setView(marker.getLatLng(), 15);
      
      // Open popup
      marker.openPopup();
    }
  }
}