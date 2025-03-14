"""
Business data models
"""

from dataclasses import dataclass, field
from typing import List, Optional


@dataclass
class Review:
    """Review data model"""
    
    author: str
    rating: float
    comment: str
    date: Optional[str] = None


@dataclass
class Business:
    """Business data model"""
    
    id: str
    name: str
    category: str
    address: str
    city: Optional[str] = None
    country: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    website: Optional[str] = None
    rating: Optional[float] = None
    reviews_count: Optional[int] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    api_source: Optional[str] = None
    reviews: List[Review] = field(default_factory=list)
    
    @classmethod
    def from_dict(cls, data):
        """
        Create Business instance from dictionary
        
        Args:
            data: Dictionary with business data
            
        Returns:
            Business instance
        """
        return cls(
            id=data.get('id', ''),
            name=data.get('Business Name', ''),
            category=data.get('Category', ''),
            address=data.get('Address', ''),
            city=data.get('City'),
            country=data.get('Country'),
            phone=data.get('Phone Number'),
            email=data.get('Email'),
            website=data.get('Website'),
            rating=data.get('Google Rating'),
            reviews_count=data.get('Number of Reviews'),
            latitude=data.get('Latitude'),
            longitude=data.get('Longitude'),
            api_source=data.get('API Source')
        )
    
    def to_dict(self):
        """
        Convert Business instance to dictionary
        
        Returns:
            Dictionary with business data
        """
        return {
            'id': self.id,
            'Business Name': self.name,
            'Category': self.category,
            'Address': self.address,
            'City': self.city,
            'Country': self.country,
            'Phone Number': self.phone,
            'Email': self.email,
            'Website': self.website,
            'Google Rating': self.rating,
            'Number of Reviews': self.reviews_count,
            'Latitude': self.latitude,
            'Longitude': self.longitude,
            'API Source': self.api_source
        }