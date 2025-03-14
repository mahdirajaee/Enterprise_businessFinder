"""
WSGI entry point for the Business Finder API
"""

from app import create_app

# Create the application instance
application = create_app()

if __name__ == "__main__":
    application.run()