/**
 * Categories.js
 * 
 * Constants for business categories
 */

// Business categories
export const CATEGORIES = [
    { id: 'hotel', name: 'Hotel', icon: '🏨' },
    { id: 'restaurant', name: 'Restaurant', icon: '🍽️' },
    { id: 'bar', name: 'Bar', icon: '🍸' },
    { id: 'cafe', name: 'Cafe', icon: '☕' },
    { id: 'bakery', name: 'Bakery', icon: '🥐' },
    { id: 'nightclub', name: 'Nightclub', icon: '🎵' }
  ];
  
  // Category mapping for different APIs
  export const CATEGORY_MAPPING = {
    // Google Places API mapping
    google: {
      'hotel': 'lodging',
      'restaurant': 'restaurant',
      'bar': 'bar',
      'cafe': 'cafe',
      'bakery': 'bakery',
      'nightclub': 'night_club'
    },
    
    // OpenStreetMap API mapping
    osm: {
      'hotel': 'tourism=hotel',
      'restaurant': 'amenity=restaurant',
      'bar': 'amenity=bar',
      'cafe': 'amenity=cafe',
      'bakery': 'shop=bakery',
      'nightclub': 'amenity=nightclub'
    },
    
    // Yelp Fusion API mapping
    yelp: {
      'hotel': 'hotels',
      'restaurant': 'restaurants',
      'bar': 'bars',
      'cafe': 'cafes',
      'bakery': 'bakeries',
      'nightclub': 'nightlife'
    }
  };
  
  /**
   * Get category by ID
   * @param {string} id Category ID
   * @returns {Object|undefined} Category object or undefined if not found
   */
  export function getCategoryById(id) {
    return CATEGORIES.find(category => category.id === id);
  }
  
  /**
   * Get mapped category for specific API
   * @param {string} categoryId Original category ID
   * @param {string} apiType API type ('google', 'osm', or 'yelp')
   * @returns {string} Mapped category for the specified API
   */
  export function getMappedCategory(categoryId, apiType = 'google') {
    const mapping = CATEGORY_MAPPING[apiType] || {};
    return mapping[categoryId] || categoryId;
  }
  
  // Default export for all categories
  export default CATEGORIES;