import os
import base64
import time
import httpx
from dotenv import load_dotenv
from app.schemas.shopping import (
    KrogerShoppingRequest,
    KrogerShoppingResponse,
    StoreResult,
    ProductResult,
)

load_dotenv()

KROGER_CLIENT_ID = os.environ["KROGER_CLIENT_ID"]
KROGER_CLIENT_SECRET = os.environ["KROGER_CLIENT_SECRET"]
KROGER_BASE_URL = "https://api.kroger.com/v1"

# In-memory token cache
_token_cache: dict = {
    "access_token": None,
    "expires_at": 0.0,
}


def _get_access_token() -> str:
    now = time.time()
    if _token_cache["access_token"] and now < _token_cache["expires_at"] - 60:
        return _token_cache["access_token"]

    credentials = base64.b64encode(
        f"{KROGER_CLIENT_ID}:{KROGER_CLIENT_SECRET}".encode()
    ).decode()

    response = httpx.post(
        f"{KROGER_BASE_URL}/connect/oauth2/token",
        headers={
            "Authorization": f"Basic {credentials}",
            "Content-Type": "application/x-www-form-urlencoded",
        },
        data={
            "grant_type": "client_credentials",
            "scope": "product.compact",
        },
    )
    response.raise_for_status()
    data = response.json()

    _token_cache["access_token"] = data["access_token"]
    _token_cache["expires_at"] = now + data["expires_in"]
    return _token_cache["access_token"]


def _find_stores(token: str, lat: float, lon: float) -> list[dict]:
    response = httpx.get(
        f"{KROGER_BASE_URL}/locations",
        headers={"Authorization": f"Bearer {token}"},
        params={
            "filter.latLong.near": f"{lat},{lon}",
            "filter.radiusInMiles": 40,
            "filter.limit": 3,
        },
    )
    response.raise_for_status()
    raw = response.json().get("data", [])
    # Guard: API returns a list for the locations endpoint
    if isinstance(raw, dict):
        raw = [raw]
    return raw


def _search_product(token: str, location_id: str, item: str) -> ProductResult:
    response = httpx.get(
        f"{KROGER_BASE_URL}/products",
        headers={"Authorization": f"Bearer {token}"},
        params={
            "filter.term": item,
            "filter.locationId": location_id,
            "filter.limit": 1,
        },
    )
    response.raise_for_status()
    data = response.json().get("data", [])

    if not data:
        return ProductResult(
            item_name=item,
            found=False,
            product_name=None,
            price=None,
            delivery_eligible=False,
        )

    product = data[0]
    items = product.get("items", [])

    if not items:
        return ProductResult(
            item_name=item,
            found=True,
            product_name=product.get("description"),
            price=None,
            delivery_eligible=False,
        )

    item_data = items[0]
    fulfillment = item_data.get("fulfillment", {})
    price_data = item_data.get("price", {})

    return ProductResult(
        item_name=item,
        found=True,
        product_name=product.get("description"),
        price=price_data.get("regular"),
        delivery_eligible=fulfillment.get("delivery", False),
    )


def get_kroger_shopping(request: KrogerShoppingRequest) -> KrogerShoppingResponse:
    token = _get_access_token()
    stores_raw = _find_stores(token, request.lat, request.lon)

    if not stores_raw:
        return KrogerShoppingResponse(
            stores=[],
            message="No Kroger stores found within 40 miles of your location.",
        )

    stores = []
    for store in stores_raw:
        location_id = store["locationId"]
        addr = store.get("address", {})
        address_str = ", ".join(
            filter(
                None,
                [
                    addr.get("addressLine1"),
                    addr.get("city"),
                    addr.get("state"),
                    addr.get("zipCode"),
                ],
            )
        )

        products = [
            _search_product(token, location_id, item)
            for item in request.missing_items
        ]

        stores.append(
            StoreResult(
                location_id=location_id,
                name=store.get("name", "Kroger"),
                address=address_str,
                products=products,
            )
        )

    return KrogerShoppingResponse(stores=stores, message=None)
