"""
Business Finder API
Main Flask application file
"""

from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
import os
import uuid
import csv
from datetime import datetime
import json
import time

# Import your business finder
from business_finder import (
    GooglePlacesAPI, 
    OpenStreetMapAPI, 
    YelpFusionAPI,
    filter_duplicate_businesses
)

# Import config
from config import configure_app

# Create Flask app
app = Flask(__name__)

# Configure app with settings
configure_app(app)

# Enable CORS for all routes
CORS(app)

# Store last search results for saving
last_search_results = []

# Root route (API info)
@app.route('/')
def index():
    """API information endpoint"""
    return jsonify({
        'name': 'Business Finder API',
        'version': '1.0.0',
        'description': 'API for finding and accessing business information'
    })

@app.route('/api/businesses', methods=['GET'])
def search_businesses():
    """Search for businesses endpoint"""
    global last_search_results
    try:
        # Get query parameters
        location = request.args.get('location', 'Italy')
        category = request.args.get('category', 'restaurant')
        radius = int(request.args.get('radius', 5))
        min_rating = float(request.args.get('minRating', 3.5))
        api_source = request.args.get('apiSource', app.config['DEFAULT_API_SOURCE'])
        
        # Select API based on source parameter
        if api_source == 'google' and app.config.get('GOOGLE_API_KEY'):
            api = GooglePlacesAPI(app.config['GOOGLE_API_KEY'])
        elif api_source == 'yelp' and app.config.get('YELP_API_KEY'):
            api = YelpFusionAPI(app.config['YELP_API_KEY'])
        else:
            # Fallback to free OpenStreetMap API
            api = OpenStreetMapAPI()
        
        businesses = []
        
        # Handle "all" category option
        if category.lower() == 'all':
            categories = ['hotel', 'restaurant', 'bar', 'cafe', 'bakery', 'nightclub']
            print(f"Searching all categories: {categories}")
            
            all_businesses = []
            
            # Search each category
            for cat in categories:
                print(f"Searching for {cat} businesses in {location}")
                cat_businesses = api.search_businesses(
                    location=location,
                    category=cat,
                    radius_km=radius,
                    min_rating=min_rating
                )
                
                print(f"Found {len(cat_businesses)} {cat} businesses")
                all_businesses.extend(cat_businesses)
                
                # Add a small delay to avoid rate limits
                time.sleep(0.5)
            
            # Filter duplicates from all categories
            businesses = filter_duplicate_businesses(all_businesses)
            print(f"After filtering duplicates: {len(businesses)} unique businesses")
        else:
            # Search for single category
            businesses = api.search_businesses(
                location=location,
                category=category,
                radius_km=radius,
                min_rating=min_rating
            )
        
        # Add unique IDs for frontend reference
        for business in businesses:
            business['id'] = str(uuid.uuid4())
        
        # Store results for potential saving
        last_search_results = businesses
        
        # Print for debugging
        print(f"Found total of {len(businesses)} businesses")
        
        # Return results
        return jsonify({
            'results': businesses,
            'meta': {
                'count': len(businesses),
                'api': api.get_api_name(),
                'params': {
                    'location': location,
                    'category': category,
                    'radius': radius,
                    'minRating': min_rating
                }
            }
        })
    
    except Exception as e:
        print(f"Error during search: {str(e)}")
        return jsonify({
            'error': str(e),
            'message': 'Failed to search businesses'
        }), 500

@app.route('/api/save', methods=['POST'])
def save_results():
    """Save search results to CSV file"""
    global last_search_results
    
    try:
        # Get data from request
        data = request.get_json()
        if not data:
            data = {}  # Default to empty dict if no data sent
            
        filename = data.get('filename', f'business_results_{datetime.now().strftime("%Y%m%d_%H%M%S")}.csv')
        
        # Ensure the filename ends with .csv
        if not filename.endswith('.csv'):
            filename += '.csv'
        
        # Debug print
        print(f"Attempting to save {len(last_search_results)} businesses to {filename}")
        
        # Create directory for saved files if it doesn't exist
        save_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'saved_files')
        os.makedirs(save_dir, exist_ok=True)
        
        # Full path for the file
        filepath = os.path.join(save_dir, filename)
        
        # Save to CSV
        save_to_csv(last_search_results, filepath)
        
        # Debug print
        print(f"Successfully saved to {filepath}")
        
        return jsonify({
            'success': True,
            'message': f'Successfully saved {len(last_search_results)} businesses to {filename}',
            'filename': filename,
            'path': filepath  # Include path for debugging
        })
    
    except Exception as e:
        print(f"Error during save: {str(e)}")
        return jsonify({
            'error': str(e),
            'message': 'Failed to save results'
        }), 500

@app.route('/api/download/<filename>', methods=['GET'])
def download_file(filename):
    """Download saved CSV file"""
    try:
        # Path to saved file
        save_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'saved_files')
        filepath = os.path.join(save_dir, filename)
        
        # Check if file exists
        if not os.path.exists(filepath):
            return jsonify({
                'error': 'File not found',
                'message': f'The file {filename} does not exist'
            }), 404
        
        # Send file as attachment
        return send_file(filepath, as_attachment=True)
    
    except Exception as e:
        return jsonify({
            'error': str(e),
            'message': 'Failed to download file'
        }), 500

@app.route('/api/categories', methods=['GET'])
def get_categories():
    """Get available business categories"""
    categories = [
        {'id': 'all', 'name': 'All Categories'},
        {'id': 'hotel', 'name': 'Hotels'},
        {'id': 'restaurant', 'name': 'Restaurants'},
        {'id': 'bar', 'name': 'Bars'},
        {'id': 'cafe', 'name': 'Cafes'},
        {'id': 'bakery', 'name': 'Bakeries'},
        {'id': 'nightclub', 'name': 'Nightclubs'}
    ]
    
    return jsonify(categories)

@app.route('/api/locations/popular', methods=['GET'])
def get_popular_locations():
    """Get popular Italian locations for search suggestions"""
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
    
    return jsonify(italian_cities)

# Error handlers
@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors"""
    return jsonify({
        'error': 'Not Found',
        'message': 'The requested resource was not found on the server.'
    }), 404

@app.errorhandler(500)
def server_error(error):
    """Handle 500 errors"""
    return jsonify({
        'error': 'Internal Server Error',
        'message': 'An unexpected error occurred. Please try again later.'
    }), 500

def save_to_csv(businesses, output_file):
    """
    Save business data to CSV file
    
    Args:
        businesses: List of business data dictionaries
        output_file: Path to output CSV file
    """
    if not businesses:
        raise ValueError("No businesses to save")
    
    fieldnames = [
        'Business Name', 'Category', 'Address', 'City', 'Country',
        'Phone Number', 'Email', 'Website', 'Google Rating',
        'Number of Reviews', 'Latitude', 'Longitude', 'API Source'
    ]
    
    with open(output_file, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(businesses)

if __name__ == '__main__':
    # Get port from environment or use default
    port = int(os.environ.get('PORT', 5000))
    
    # Run development server
    app.run(host='0.0.0.0', port=port, debug=True)