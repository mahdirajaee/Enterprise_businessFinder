# Business Finder Application

A web application for finding and exploring businesses around the world.

## Features

- Search for businesses by location, category, and other criteria
- View results on an interactive map and in a sortable table
- Get detailed information about businesses
- Responsive design that works on desktop and mobile

## Tech Stack

### Frontend

- Vanilla JavaScript (ES6+)
- Leaflet.js for maps
- HTML5 & CSS3
- No external frameworks or libraries (except Leaflet)

### Backend

- Python with Flask
- RESTful API design
- Integration with multiple data sources:
  - Google Places API
  - Yelp Fusion API
  - OpenStreetMap API (free alternative)

## Getting Started

### Prerequisites

- Node.js (for frontend development tools)
- Python 3.8+
- API keys for Google Places and/or Yelp Fusion (optional)

### Backend Setup

1. Create a virtual environment:
   ```sh
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```sh
   pip install -r requirements.txt
   ```

3. Set environment variables:
   ```sh
   # Linux/macOS
   export FLASK_APP=app.py
   export FLASK_ENV=development
   export GOOGLE_API_KEY=your_google_api_key  # Optional
   export YELP_API_KEY=your_yelp_api_key      # Optional
   
   # Windows
   set FLASK_APP=app.py
   set FLASK_ENV=development
   set GOOGLE_API_KEY=your_google_api_key     # Optional
   set YELP_API_KEY=your_yelp_api_key         # Optional
   ```

4. Run the backend:
   ```sh
   flask run
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```sh
   cd frontend
   ```

2. Set up a local server:
   ```sh
   # Using Python's built-in HTTP server
   python -m http.server 8000
   
   # OR using Node.js
   npx serve
   ```

3. Open your browser and navigate to:
   ```
   http://localhost:8000
   ```

## Project Structure

```
business-finder/
├── frontend/              # Frontend files
│   ├── index.html        # Main HTML file
│   ├── css/              # Stylesheets
│   ├── js/               # JavaScript files
│   └── assets/           # Images and other assets
│
├── backend/              # Backend application
│   ├── app.py            # Main Flask application
│   ├── config.py         # Configuration settings
│   ├── api/              # API routes
│   ├── services/         # Business logic
│   └── models/           # Data models
│
├── requirements.txt      # Python dependencies
└── README.md             # Project documentation
```

## Deployment

### Frontend Deployment

The frontend can be deployed to any static hosting service:

- GitHub Pages
- Netlify
- Vercel
- Firebase Hosting

### Backend Deployment

The backend can be deployed to:

- Render
- Railway
- Heroku
- AWS Elastic Beanstalk
- Google Cloud Run

## Configuration

- Frontend configuration is located in `js/constants/ApiEndpoints.js`
- Backend configuration is located in `config.py`

## API Documentation

The API provides the following endpoints:

- `GET /api/businesses` - Search for businesses
- `GET /api/businesses/:id` - Get business details
- `GET /api/categories` - Get available categories
- `GET /api/locations/popular` - Get popular locations

For detailed documentation, see the API documentation in the backend code.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Leaflet.js](https://leafletjs.com/) for map functionality
- [OpenStreetMap](https://www.openstreetmap.org/) for free map data