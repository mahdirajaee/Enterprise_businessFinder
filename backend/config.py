"""
Configuration settings for the Business Finder API
"""

import os
from dataclasses import dataclass

@dataclass
class Config:
    """Base configuration"""
    DEBUG: bool = False
    TESTING: bool = False
    SECRET_KEY: str = os.environ.get('SECRET_KEY', 'dev-secret-key')
    GOOGLE_API_KEY: str = os.environ.get('GOOGLE_API_KEY', '')
    YELP_API_KEY: str = os.environ.get('YELP_API_KEY', '')
    DEFAULT_API_SOURCE: str = 'osm'  # Default to OpenStreetMap (free)
    DEFAULT_PAGE_SIZE: int = 50      # Default number of results per page
    CACHE_TIMEOUT: int = 3600        # Cache timeout in seconds (1 hour)

@dataclass
class ProductionConfig(Config):
    """Production configuration"""
    SECRET_KEY: str = os.environ.get('SECRET_KEY')  # Must be set in production
    DEFAULT_API_SOURCE: str = 'google'  # Use Google API in production

@dataclass
class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG: bool = True

@dataclass
class TestingConfig(Config):
    """Testing configuration"""
    TESTING: bool = True
    DEBUG: bool = True

# Configuration dictionary
config_dict = {
    'production': ProductionConfig,
    'development': DevelopmentConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}

def get_config(config_name=None):
    """
    Get configuration object based on environment
    
    Args:
        config_name: Configuration name to use
        
    Returns:
        Configuration object
    """
    if not config_name:
        config_name = os.environ.get('FLASK_ENV', 'default')
    
    return config_dict.get(config_name, config_dict['default'])()

def configure_app(app, config_name=None):
    """
    Configure Flask application with settings
    
    Args:
        app: Flask application
        config_name: Configuration name to use
    """
    config_obj = get_config(config_name)
    
    # Set all uppercase attributes on app.config
    for key in dir(config_obj):
        if key.isupper():
            app.config[key] = getattr(config_obj, key)