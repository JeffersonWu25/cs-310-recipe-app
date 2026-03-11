import { Ingredient } from "../context/PantryContext";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Maps backend shape → frontend Ingredient
function fromApi(row: {
  id: number;
  ingredient_name: string;
  category: string;
  quantity: number;
  unit: string;
}): Ingredient {
  return {
    id: String(row.id),
    name: row.ingredient_name,
    category: row.category,
    quantity: String(row.quantity),
    unit: row.unit,
  };
}

export async function fetchIngredients(): Promise<Ingredient[]> {
  const res = await fetch(`${BASE_URL}/ingredients`);
  if (!res.ok) throw new Error("Failed to fetch ingredients");
  const data = await res.json();
  return data.map(fromApi);
}

export async function createIngredient(
  ingredient: Omit<Ingredient, "id">
): Promise<Ingredient> {
  const res = await fetch(`${BASE_URL}/ingredients`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ingredient_name: ingredient.name,
      category: ingredient.category,
      quantity: parseInt(ingredient.quantity),
      unit: ingredient.unit,
    }),
  });
  if (!res.ok) throw new Error("Failed to create ingredient");
  return fromApi(await res.json());
}

export async function deleteIngredient(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/ingredients/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete ingredient");
}

export async function updateIngredient(
  id: string,
  updates: Partial<Omit<Ingredient, "id">>
): Promise<Ingredient> {
  const body: Record<string, unknown> = {};
  if (updates.name !== undefined) body.ingredient_name = updates.name;
  if (updates.category !== undefined) body.category = updates.category;
  if (updates.quantity !== undefined) body.quantity = parseInt(updates.quantity);
  if (updates.unit !== undefined) body.unit = updates.unit;

  const res = await fetch(`${BASE_URL}/ingredients/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("Failed to update ingredient");
  return fromApi(await res.json());
}
