"""
Business service for accessing business data from various APIs
"""

from flask import current_app
import uuid

# Import your existing business finder classes
from business_finder import (
    GooglePlacesAPI, 
    OpenStreetMapAPI, 
    YelpFusionAPI,
    filter_duplicate_businesses
)

# Cache for storing API responses
_api_cache = {}

def get_businesses(location, category, radius_km, min_rating, api_source):
    """
    Search for businesses based on criteria
    
    Args:
        location: City or country to search in
        category: Type of business (hotel, restaurant, etc.)
        radius_km: Search radius in kilometers
        min_rating: Minimum rating threshold
        api_source: API source to use (google, yelp, osm)
        
    Returns:
        List of business dictionaries
    """
    # Create cache key
    cache_key = f"{api_source}:{location}:{category}:{radius_km}:{min_rating}"
    
    # Check cache first
    if cache_key in _api_cache:
        return _api_cache[cache_key]
    
    # Select API based on source parameter
    api = _get_api_instance(api_source)
    
    # Search for businesses
    businesses = api.search_businesses(
        location=location,
        category=category,
        radius_km=radius_km,
        min_rating=min_rating
    )
    
    # Remove duplicates
    filtered_businesses = filter_duplicate_businesses(businesses)
    
    # Cache results
    _api_cache[cache_key] = filtered_businesses
    
    return filtered_businesses

def get_business_details(business_id):
    """
    Get detailed information about a specific business
    
    Args:
        business_id: Business ID
        
    Returns:
        Business details dictionary or None if not found
    """
    # For demonstration, we'll return mock data
    # In a real implementation, you would fetch from a database
    # or make additional API calls to get detailed information
    
    return {
        'id': business_id,
        'details': {
            'description': 'Detailed business information would be here',
            'hours': {
                'Monday': '9:00 AM - 5:00 PM',
                'Tuesday': '9:00 AM - 5:00 PM',
                'Wednesday': '9:00 AM - 5:00 PM',
                'Thursday': '9:00 AM - 5:00 PM',
                'Friday': '9:00 AM - 5:00 PM',
                'Saturday': '10:00 AM - 3:00 PM',
                'Sunday': 'Closed'
            },
            'amenities': ['Wi-Fi', 'Parking', 'Air Conditioning'],
            'reviews': [
                {
                    'author': 'John Doe',
                    'rating': 4.5,
                    'comment': 'Great place, highly recommended!',
                    'date': '2 months ago'
                },
                {
                    'author': 'Jane Smith',
                    'rating': 5.0,
                    'comment': 'Excellent service and friendly staff.',
                    'date': '3 months ago'
                },
                {
                    'author': 'Robert Johnson',
                    'rating': 3.5,
                    'comment': 'Decent place but could use some improvements.',
                    'date': '6 months ago'
                }
            ]
        }
    }

def get_categories():
    """
    Get available business categories
    
    Returns:
        List of category dictionaries
    """
    categories = [
        {'id': 'hotel', 'name': 'Hotels', 'icon': '🏨'},
        {'id': 'restaurant', 'name': 'Restaurants', 'icon': '🍽️'},
        {'id': 'bar', 'name': 'Bars', 'icon': '🍸'},
        {'id': 'cafe', 'name': 'Cafes', 'icon': '☕'},
        {'id': 'bakery', 'name': 'Bakeries', 'icon': '🥐'},
        {'id': 'nightclub', 'name': 'Nightclubs', 'icon': '🎵'}
    ]
    
    return categories

def get_popular_locations():
    """
    Get popular Italian locations for search suggestions
    
    Returns:
        List of location dictionaries
    """
    italian_cities = [
        {'id': 'rome', 'name': 'Rome, Italy'},
        {'id': 'milan', 'name': 'Milan, Italy'},
        {'id': 'florence', 'name': 'Florence, Italy'},
        {'id': 'venice', 'name': 'Venice, Italy'},
        {'id': 'naples', 'name': 'Naples, Italy'},
        {'id': 'turin', 'name': 'Turin, Italy'},
        {'id': 'bologna', 'name': 'Bologna, Italy'},
        {'id': 'italy', 'name': 'Italy (All)'}
    ]
    
    return italian_cities

def _get_api_instance(api_source):
    """
    Get API instance based on source
    
    Args:
        api_source: API source name (google, yelp, osm)
        
    Returns:
        API instance
    """
    if api_source == 'google' and current_app.config.get('GOOGLE_API_KEY'):
        return GooglePlacesAPI(current_app.config['GOOGLE_API_KEY'])
    elif api_source == 'yelp' and current_app.config.get('YELP_API_KEY'):
        return YelpFusionAPI(current_app.config['YELP_API_KEY'])
    else:
        # Fallback to free OpenStreetMap API
        return OpenStreetMapAPI()