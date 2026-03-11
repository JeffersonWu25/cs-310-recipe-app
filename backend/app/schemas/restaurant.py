from pydantic import BaseModel
from typing import Optional


class RestaurantResult(BaseModel):
    name: str
    address: str
    rating: Optional[float] = None
    total_ratings: Optional[int] = None
    price_level: Optional[int] = None  # 0–4 ($ to $$$$)
    open_now: Optional[bool] = None
    maps_url: str
