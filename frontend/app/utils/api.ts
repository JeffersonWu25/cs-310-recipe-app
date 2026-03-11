import { Ingredient, Recipe, ChatMessage, KrogerShoppingResult } from "../context/PantryContext";

export interface ChatApiResponse {
  response: string;
  recipes: {
    name: string;
    description: string;
    difficulty: string;
    time: number;
    servings: number;
    have_ingredients: string[];
    missing_ingredients: string[];
    instructions: string[];
  }[] | null;
}

export async function sendChat(
  query: string,
  messages: ChatMessage[],
  ingredients: Ingredient[]
): Promise<{ response: string; recipes: Recipe[] | null }> {
  const res = await fetch(`${BASE_URL}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
      ingredients: ingredients.map((ing) => ({
        id: parseInt(ing.id),
        ingredient_name: ing.name,
        category: ing.category,
        quantity: parseInt(ing.quantity),
        unit: ing.unit,
      })),
    }),
  });
  if (!res.ok) throw new Error("Failed to send chat");
  const data: ChatApiResponse = await res.json();

  const recipes: Recipe[] | null = data.recipes
    ? data.recipes.map((r, i) => ({
        id: `recipe-${i}`,
        name: r.name,
        description: r.description,
        ingredients: r.have_ingredients,
        missingIngredients: r.missing_ingredients,
        prepTime: `${r.time} mins`,
        difficulty: r.difficulty,
        servings: r.servings,
        instructions: r.instructions,
      }))
    : null;

  return { response: data.response, recipes };
}

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

export async function fetchKrogerShopping(
  lat: number,
  lon: number,
  missingItems: string[]
): Promise<KrogerShoppingResult> {
  const res = await fetch(`${BASE_URL}/shopping/kroger`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ lat, lon, missing_items: missingItems }),
  });
  if (!res.ok) throw new Error("Failed to fetch Kroger shopping data");
  return res.json();
}
