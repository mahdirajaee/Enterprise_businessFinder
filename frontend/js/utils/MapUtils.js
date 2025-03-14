/**
 * MapUtils.js
 * 
 * Utility functions for map operations using Leaflet
 */

/**
 * Create a custom marker icon
 * @param {string} text Text to display in marker
 * @param {string} color Marker color
 * @returns {L.DivIcon} Leaflet icon
 */
export function createCustomMarker(text, color = '#3498db') {
    return L.divIcon({
      className: 'custom-marker',
      html: `<div style="background-color: ${color};">${text}</div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [0, -16]
    });
  }
  
  /**
   * Create a marker with business data
   * @param {Object} business Business data
   * @param {Function} onBusinessSelect Callback for business selection
   * @returns {L.Marker|null} Leaflet marker or null if invalid coordinates
   */
  export function createBusinessMarker(business, onBusinessSelect) {
    // Skip if coordinates are missing
    if (!business.Latitude || !business.Longitude) {
      return null;
    }
    
    // Parse coordinates
    const lat = parseFloat(business.Latitude);
    const lng = parseFloat(business.Longitude);
    
    // Skip if invalid coordinates
    if (isNaN(lat) || isNaN(lng)) {
      return null;
    }
    
    // Get marker color based on category
    const category = business.Category || 'Other';
    const color = getCategoryColor(category);
    
    // Create marker
    const marker = L.marker([lat, lng], {
      icon: createCustomMarker(category.charAt(0), color)
    });
    
    // Add popup
    marker.bindPopup(createPopupContent(business));
    
    // Handle popup open
    marker.on('popupopen', () => {
      const viewDetailsBtn = document.querySelector(`.view-details-btn[data-id="${business.id}"]`);
      if (viewDetailsBtn) {
        viewDetailsBtn.addEventListener('click', () => {
          if (typeof onBusinessSelect === 'function') {
            onBusinessSelect(business);
          }
        });
      }
    });
    
    return marker;
  }
  
  /**
   * Create HTML content for marker popup
   * @param {Object} business Business data
   * @returns {string} HTML content
   */
  export function createPopupContent(business) {
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
   * Get color for business category
   * @param {string} category Business category
   * @returns {string} Color code
   */
  export function getCategoryColor(category) {
    const colors = {
      'Hotel': '#2ecc71',      // Green
      'Restaurant': '#3498db', // Blue
      'Bar': '#f39c12',        // Orange
      'Cafe': '#e74c3c',       // Red
      'Bakery': '#9b59b6',     // Purple
      'Nightclub': '#e67e22'   // Dark Orange
    };
    
    return colors[category] || '#34495e'; // Default dark gray
  }
  
  /**
   * Add markers for businesses to map
   * @param {L.Map} map Leaflet map
   * @param {Array} businesses Array of business objects
   * @param {Function} onBusinessSelect Callback for business selection
   * @returns {Array} Array of markers
   */
  export function addBusinessMarkers(map, businesses, onBusinessSelect) {
    if (!map || !businesses || !businesses.length) {
      return [];
    }
    
    const markers = [];
    const bounds = L.latLngBounds();
    
    businesses.forEach(business => {
      const marker = createBusinessMarker(business, onBusinessSelect);
      
      if (marker) {
        marker.addTo(map);
        markers.push(marker);
        
        // Extend bounds
        bounds.extend(marker.getLatLng());
      }
    });
    
    // Fit map to bounds if we have markers
    if (markers.length > 0) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
    
    return markers;
  }
  
  /**
   * Remove markers from map
   * @param {L.Map} map Leaflet map
   * @param {Array} markers Array of markers
   */
  export function removeMarkers(map, markers) {
    if (!map || !markers || !markers.length) {
      return;
    }
    
    markers.forEach(marker => {
      map.removeLayer(marker);
    });
  }
  
  /**
   * Geocode address to coordinates
   * @param {string} address Address to geocode
   * @returns {Promise<{lat: number, lng: number}>} Promise resolving to coordinates
   */
  export async function geocodeAddress(address) {
    // Using OSM Nominatim for geocoding
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'BusinessFinderApp/1.0'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Geocoding failed: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!data || !data.length) {
        throw new Error('No results found for address');
      }
      
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon)
      };
    } catch (error) {
      console.error('Geocoding error:', error);
      throw error;
    }
  }
  
  /**
   * Add map legend
   * @param {L.Map} map Leaflet map
   */
  export function addMapLegend(map) {
    if (!map) return;
    
    const legend = L.control({ position: 'bottomright' });
    
    legend.onAdd = () => {
      const div = L.DomUtil.create('div', 'map-legend');
      div.innerHTML = `
        <h4>Business Types</h4>
        <div class="legend-item">
          <div class="legend-color" style="background-color: #2ecc71;"></div>
          <span>Hotel</span>
        </div>
        <div class="legend-item">
          <div class="legend-color" style="background-color: #3498db;"></div>
          <span>Restaurant</span>
        </div>
        <div class="legend-item">
          <div class="legend-color" style="background-color: #f39c12;"></div>
          <span>Bar</span>
        </div>
        <div class="legend-item">
          <div class="legend-color" style="background-color: #e74c3c;"></div>
          <span>Cafe</span>
        </div>
        <div class="legend-item">
          <div class="legend-color" style="background-color: #9b59b6;"></div>
          <span>Bakery</span>
        </div>
        <div class="legend-item">
          <div class="legend-color" style="background-color: #e67e22;"></div>
          <span>Nightclub</span>
        </div>
      `;
      return div;
    };
    
    legend.addTo(map);
    return legend;
  }
  
  // Default export for all map utilities
  export default {
    createCustomMarker,
    createBusinessMarker,
    createPopupContent,
    getCategoryColor,
    addBusinessMarkers,
    removeMarkers,
    geocodeAddress,
    addMapLegend
  };