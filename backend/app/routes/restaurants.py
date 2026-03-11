from fastapi import APIRouter, HTTPException, Query
from app.schemas.restaurant import RestaurantResult
from app.services.restaurant_service import get_nearby_restaurants

router = APIRouter(prefix="/restaurants", tags=["restaurants"])


@router.get("/nearby", response_model=list[RestaurantResult])
def nearby_restaurants(lat: float = Query(...), lon: float = Query(...)):
    try:
        return get_nearby_restaurants(lat, lon)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
