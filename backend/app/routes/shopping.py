from fastapi import APIRouter, HTTPException
from app.schemas.shopping import KrogerShoppingRequest, KrogerShoppingResponse
from app.services.shopping_service import get_kroger_shopping

router = APIRouter(prefix="/shopping", tags=["shopping"])


@router.post("/kroger", response_model=KrogerShoppingResponse)
def kroger_shopping(body: KrogerShoppingRequest):
    try:
        return get_kroger_shopping(body)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
