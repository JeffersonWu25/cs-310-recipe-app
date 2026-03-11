from pydantic import BaseModel
from typing import Optional


class ChatMessage(BaseModel):
    role: str  # "user" or "assistant"
    content: str


class IngredientIn(BaseModel):
    id: int
    ingredient_name: str
    category: str
    quantity: int
    unit: str


class RecipeResult(BaseModel):
    name: str
    description: str
    difficulty: str
    time: int
    servings: int
    have_ingredients: list[str]
    missing_ingredients: list[str]
    instructions: list[str]


class ChatRequest(BaseModel):
    query: str
    messages: list[ChatMessage]
    ingredients: list[IngredientIn]


class ChatResponse(BaseModel):
    response: str
    recipes: Optional[list[RecipeResult]] = None
