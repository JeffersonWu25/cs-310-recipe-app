import os
import httpx
from dotenv import load_dotenv
from app.schemas.restaurant import RestaurantResult

load_dotenv()

GOOGLE_PLACES_API_KEY = os.environ["GOOGLE_PLACES_API_KEY"]
PLACES_URL = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
RADIUS_METERS = 40234  # 25 miles


def get_nearby_restaurants(lat: float, lon: float) -> list[RestaurantResult]:
    response = httpx.get(
        PLACES_URL,
        params={
            "location": f"{lat},{lon}",
            "radius": RADIUS_METERS,
            "type": "restaurant",
            "key": GOOGLE_PLACES_API_KEY,
        },
    )
    response.raise_for_status()
    results = response.json().get("results", [])

    # Sort by rating desc, then total ratings as tiebreaker
    results.sort(
        key=lambda r: (r.get("rating", 0), r.get("user_ratings_total", 0)),
        reverse=True,
    )

    restaurants = []
    for place in results[:6]:
        opening_hours = place.get("opening_hours", {})
        restaurants.append(
            RestaurantResult(
                name=place.get("name", ""),
                address=place.get("vicinity", ""),
                rating=place.get("rating"),
                total_ratings=place.get("user_ratings_total"),
                price_level=place.get("price_level"),
                open_now=opening_hours.get("open_now"),
                maps_url=f"https://www.google.com/maps/place/?q=place_id:{place.get('place_id', '')}",
            )
        )

    return restaurants
