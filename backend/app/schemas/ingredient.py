from pydantic import BaseModel
from typing import Literal

CategoryEnum = Literal["Protein", "Vegetables", "Grains", "Dairy", "Oils", "Spices", "Other"]
UnitEnum = Literal["pieces", "lbs", "oz", "cups", "tbsp", "tsp", "box", "bottle", "can"]


class IngredientCreate(BaseModel):
    ingredient_name: str
    category: CategoryEnum
    quantity: int
    unit: UnitEnum


class IngredientUpdate(BaseModel):
    ingredient_name: str | None = None
    category: CategoryEnum | None = None
    quantity: int | None = None
    unit: UnitEnum | None = None


class IngredientResponse(BaseModel):
    id: int
    ingredient_name: str
    category: str
    quantity: int
    unit: str
