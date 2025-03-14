"""
Pytest configuration file
"""

import pytest
from app import create_app

@pytest.fixture
def app():
    """Create and configure Flask application for testing"""
    app = create_app('testing')
    
    # Create test client
    with app.app_context():
        yield app

@pytest.fixture
def client(app):
    """Create a test client for the Flask application"""
    return app.test_client()