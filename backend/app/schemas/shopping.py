from pydantic import BaseModel
from typing import Optional


class KrogerShoppingRequest(BaseModel):
    lat: float
    lon: float
    missing_items: list[str]


class ProductResult(BaseModel):
    item_name: str
    found: bool
    product_name: Optional[str] = None
    price: Optional[float] = None
    delivery_eligible: bool


class StoreResult(BaseModel):
    location_id: str
    name: str
    address: str
    products: list[ProductResult]


class KrogerShoppingResponse(BaseModel):
    stores: list[StoreResult]
    message: Optional[str] = None
