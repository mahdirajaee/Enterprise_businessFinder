"""
API utility functions
"""

import uuid
import time


def generate_unique_id():
    """
    Generate a unique ID for businesses
    
    Returns:
        Unique ID string
    """
    return str(uuid.uuid4())


def parse_api_error(error):
    """
    Parse error from external API and extract useful information
    
    Args:
        error: Exception or error response
        
    Returns:
        Dictionary with error information
    """
    # Extract error message
    if hasattr(error, 'response') and error.response:
        try:
            # Try to parse JSON response
            data = error.response.json()
            message = data.get('error', {}).get('message', str(error))
        except Exception:
            # Fall back to status code and reason
            message = f"{error.response.status_code}: {error.response.reason}"
    else:
        # Use string representation of error
        message = str(error)
    
    return {
        'message': message,
        'timestamp': int(time.time())
    }


def create_pagination_metadata(total_items, page, page_size):
    """
    Create pagination metadata
    
    Args:
        total_items: Total number of items
        page: Current page number
        page_size: Number of items per page
        
    Returns:
        Dictionary with pagination metadata
    """
    total_pages = (total_items + page_size - 1) // page_size if total_items > 0 else 1
    
    return {
        'page': page,
        'pageSize': page_size,
        'totalItems': total_items,
        'totalPages': total_pages,
        'hasNextPage': page < total_pages,
        'hasPrevPage': page > 1
    }