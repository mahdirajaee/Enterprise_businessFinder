"""
Validation utility functions
"""

def validate_search_params(params):
    """
    Validate search parameters
    
    Args:
        params: Dictionary with search parameters
        
    Returns:
        Tuple (is_valid, errors)
    """
    errors = {}
    
    # Validate location (required)
    if not params.get('location'):
        errors['location'] = 'Location is required'
    
    # Validate category (must be valid)
    category = params.get('category')
    valid_categories = ['hotel', 'restaurant', 'bar', 'cafe', 'bakery', 'nightclub']
    if category and category not in valid_categories and category != 'all':
        errors['category'] = f'Category must be one of: {", ".join(valid_categories)}, or "all"'
    
    # Validate radius (must be positive number)
    try:
        radius = int(params.get('radius_km', 5))
        if radius <= 0 or radius > 50:
            errors['radius'] = 'Radius must be between 1 and 50 km'
    except (ValueError, TypeError):
        errors['radius'] = 'Radius must be a positive number'
    
    # Validate min_rating (must be between 1 and 5)
    try:
        min_rating = float(params.get('min_rating', 3.5))
        if min_rating < 1 or min_rating > 5:
            errors['min_rating'] = 'Minimum rating must be between 1 and 5'
    except (ValueError, TypeError):
        errors['min_rating'] = 'Minimum rating must be a number between 1 and 5'
    
    # Validate api_source (must be valid)
    api_source = params.get('api_source', 'osm')
    valid_sources = ['google', 'yelp', 'osm']
    if api_source not in valid_sources:
        errors['api_source'] = f'API source must be one of: {", ".join(valid_sources)}'
    
    # Return validation result
    return (len(errors) == 0, errors)