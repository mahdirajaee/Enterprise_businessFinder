"""
API endpoint tests
"""

import json

def test_index_route(client):
    """Test the index route"""
    response = client.get('/')
    data = json.loads(response.data)
    
    assert response.status_code == 200
    assert 'name' in data
    assert 'version' in data
    assert 'endpoints' in data

def test_search_businesses_route(client):
    """Test the search businesses route"""
    response = client.get('/api/businesses?location=Rome&category=restaurant')
    data = json.loads(response.data)
    
    assert response.status_code == 200
    assert 'results' in data
    assert 'meta' in data
    assert isinstance(data['results'], list)

def test_categories_route(client):
    """Test the categories route"""
    response = client.get('/api/categories')
    data = json.loads(response.data)
    
    assert response.status_code == 200
    assert isinstance(data, list)
    assert len(data) > 0
    assert 'id' in data[0]
    assert 'name' in data[0]

def test_popular_locations_route(client):
    """Test the popular locations route"""
    response = client.get('/api/locations/popular')
    data = json.loads(response.data)
    
    assert response.status_code == 200
    assert isinstance(data, list)
    assert len(data) > 0
    assert 'id' in data[0]
    assert 'name' in data[0]

def test_404_error_handler(client):
    """Test the 404 error handler"""
    response = client.get('/api/nonexistent')
    data = json.loads(response.data)
    
    assert response.status_code == 404
    assert 'error' in data
    assert 'message' in data