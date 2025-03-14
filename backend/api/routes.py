"""
API routes for the Business Finder application
"""

from flask import Blueprint, request, jsonify, current_app
import uuid

# Import services
from services.business_service import (
    get_businesses,
    get_business_details,
    get_categories,
    get_popular_locations
)

# Create API blueprint
api_blueprint = Blueprint('api', __name__)

@api_blueprint.route('/businesses', methods=['GET'])
def search_businesses():
    """
    Search for businesses based on query parameters
    
    Query parameters:
        location (str): City or country to search in
        category (str): Type of business (hotel, restaurant, etc.)
        radius (int): Search radius in kilometers
        minRating (float): Minimum rating threshold
        apiSource (str): API source to use (google, yelp, osm)
        page (int): Page number for pagination
        pageSize (int): Number of results per page
        
    Returns:
        JSON response with businesses array and metadata
    """
    try:
        # Get query parameters
        location = request.args.get('location', 'Italy')
        category = request.args.get('category', 'restaurant')
        radius = int(request.args.get('radius', 5))
        min_rating = float(request.args.get('minRating', 3.5))
        api_source = request.args.get('apiSource', current_app.config['DEFAULT_API_SOURCE'])
        page = int(request.args.get('page', 1))
        page_size = int(request.args.get('pageSize', current_app.config['DEFAULT_PAGE_SIZE']))
        
        # Get businesses from service
        businesses = get_businesses(
            location=location,
            category=category,
            radius_km=radius,
            min_rating=min_rating,
            api_source=api_source
        )
        
        # Add unique IDs for frontend reference
        for business in businesses:
            business['id'] = str(uuid.uuid4())
        
        # Apply pagination
        start_idx = (page - 1) * page_size
        end_idx = start_idx + page_size
        paginated_businesses = businesses[start_idx:end_idx]
        
        # Return results
        return jsonify({
            'results': paginated_businesses,
            'meta': {
                'count': len(businesses),
                'page': page,
                'pageSize': page_size,
                'totalPages': (len(businesses) + page_size - 1) // page_size,
                'api': api_source,
                'params': {
                    'location': location,
                    'category': category,
                    'radius': radius,
                    'minRating': min_rating
                }
            }
        })
    
    except Exception as e:
        return jsonify({
            'error': str(e),
            'message': 'Failed to search businesses'
        }), 500

@api_blueprint.route('/businesses/<business_id>', methods=['GET'])
def get_business_by_id(business_id):
    """
    Get detailed information about a specific business
    
    Args:
        business_id: Business ID
        
    Returns:
        JSON response with business details
    """
    try:
        # Get business details from service
        details = get_business_details(business_id)
        
        if not details:
            return jsonify({
                'error': 'Not Found',
                'message': f'Business with ID {business_id} not found'
            }), 404
        
        return jsonify(details)
    
    except Exception as e:
        return jsonify({
            'error': str(e),
            'message': 'Failed to get business details'
        }), 500

@api_blueprint.route('/categories', methods=['GET'])
def list_categories():
    """
    Get available business categories
    
    Returns:
        JSON response with categories array
    """
    try:
        # Get categories from service
        categories = get_categories()
        
        return jsonify(categories)
    
    except Exception as e:
        return jsonify({
            'error': str(e),
            'message': 'Failed to get categories'
        }), 500

@api_blueprint.route('/locations/popular', methods=['GET'])
def list_popular_locations():
    """
    Get popular Italian locations for search suggestions
    
    Returns:
        JSON response with locations array
    """
    try:
        # Get popular locations from service
        locations = get_popular_locations()
        
        return jsonify(locations)
    
    except Exception as e:
        return jsonify({
            'error': str(e),
            'message': 'Failed to get popular locations'
        }), 500