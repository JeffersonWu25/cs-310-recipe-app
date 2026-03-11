from fastapi import APIRouter, HTTPException
from app.schemas.chat import ChatRequest, ChatResponse
from app.services.recipe_service import run_chat

router = APIRouter(prefix="/chat", tags=["chat"])


@router.post("", response_model=ChatResponse)
def chat(body: ChatRequest):
    try:
        return run_chat(body.messages, body.query, body.ingredients)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
