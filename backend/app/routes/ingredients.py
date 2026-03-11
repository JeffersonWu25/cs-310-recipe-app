from fastapi import APIRouter, HTTPException
from app.db import get_db
from app.schemas.ingredient import IngredientCreate, IngredientUpdate, IngredientResponse

router = APIRouter(prefix="/ingredients", tags=["ingredients"])


@router.get("", response_model=list[IngredientResponse])
def get_all_ingredients():
    db = get_db()
    try:
        with db.cursor() as cursor:
            cursor.execute("SELECT * FROM ingredients")
            return cursor.fetchall()
    finally:
        db.close()


@router.get("/{id}", response_model=IngredientResponse)
def get_ingredient(id: int):
    db = get_db()
    try:
        with db.cursor() as cursor:
            cursor.execute("SELECT * FROM ingredients WHERE id = %s", (id,))
            row = cursor.fetchone()
            if not row:
                raise HTTPException(status_code=404, detail="Ingredient not found")
            return row
    finally:
        db.close()


@router.post("", response_model=IngredientResponse, status_code=201)
def create_ingredient(body: IngredientCreate):
    db = get_db()
    try:
        with db.cursor() as cursor:
            cursor.execute(
                "INSERT INTO ingredients (ingredient_name, category, quantity, unit) VALUES (%s, %s, %s, %s)",
                (body.ingredient_name, body.category, body.quantity, body.unit)
            )
            db.commit()
            cursor.execute("SELECT * FROM ingredients WHERE id = %s", (cursor.lastrowid,))
            return cursor.fetchone()
    finally:
        db.close()


@router.put("/{id}", response_model=IngredientResponse)
def update_ingredient(id: int, body: IngredientUpdate):
    db = get_db()
    try:
        with db.cursor() as cursor:
            cursor.execute("SELECT * FROM ingredients WHERE id = %s", (id,))
            if not cursor.fetchone():
                raise HTTPException(status_code=404, detail="Ingredient not found")

            fields = {k: v for k, v in body.model_dump().items() if v is not None}
            if not fields:
                raise HTTPException(status_code=400, detail="No fields to update")

            set_clause = ", ".join(f"{k} = %s" for k in fields)
            cursor.execute(
                f"UPDATE ingredients SET {set_clause} WHERE id = %s",
                (*fields.values(), id)
            )
            db.commit()
            cursor.execute("SELECT * FROM ingredients WHERE id = %s", (id,))
            return cursor.fetchone()
    finally:
        db.close()


@router.delete("/{id}", status_code=204)
def delete_ingredient(id: int):
    db = get_db()
    try:
        with db.cursor() as cursor:
            cursor.execute("SELECT * FROM ingredients WHERE id = %s", (id,))
            if not cursor.fetchone():
                raise HTTPException(status_code=404, detail="Ingredient not found")
            cursor.execute("DELETE FROM ingredients WHERE id = %s", (id,))
            db.commit()
    finally:
        db.close()
