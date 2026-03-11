"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  fetchIngredients,
  createIngredient,
  deleteIngredient,
  updateIngredient,
} from "../utils/api";

export interface Ingredient {
  id: string;
  name: string;
  quantity: string;
  unit: string;
  category: string;
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  ingredients: string[];
  missingIngredients: string[];
  prepTime: string;
  difficulty: string;
  servings: number;
  instructions: string[];
}

export interface ShoppingItem {
  id: string;
  name: string;
  quantity: string;
  unit: string;
  available: boolean;
  price?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface PantryContextType {
  ingredients: Ingredient[];
  loading: boolean;
  addIngredient: (ingredient: Omit<Ingredient, "id">) => Promise<void>;
  removeIngredient: (id: string) => Promise<void>;
  updateIngredient: (id: string, ingredient: Partial<Ingredient>) => Promise<void>;
  clearPantry: () => void;
  recipes: Recipe[];
  setRecipes: (recipes: Recipe[]) => void;
  selectedRecipe: Recipe | null;
  setSelectedRecipe: (recipe: Recipe | null) => void;
  shoppingList: ShoppingItem[];
  setShoppingList: (items: ShoppingItem[]) => void;
  chatHistory: ChatMessage[];
  addChatMessage: (message: ChatMessage) => void;
}

const PantryContext = createContext<PantryContextType | undefined>(undefined);

export function PantryProvider({ children }: { children: ReactNode }) {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  useEffect(() => {
    fetchIngredients()
      .then(setIngredients)
      .finally(() => setLoading(false));
  }, []);

  const addIngredient = async (ingredient: Omit<Ingredient, "id">) => {
    const created = await createIngredient(ingredient);
    setIngredients((prev) => [...prev, created]);
  };

  const removeIngredient = async (id: string) => {
    await deleteIngredient(id);
    setIngredients((prev) => prev.filter((item) => item.id !== id));
  };

  const updateIngredientFn = async (id: string, updates: Partial<Ingredient>) => {
    const updated = await updateIngredient(id, updates);
    setIngredients((prev) =>
      prev.map((item) => (item.id === id ? updated : item))
    );
  };

  const clearPantry = () => {
    setIngredients([]);
  };

  const addChatMessage = (message: ChatMessage) => {
    setChatHistory((prev) => [...prev, message]);
  };

  return (
    <PantryContext.Provider
      value={{
        ingredients,
        loading,
        addIngredient,
        removeIngredient,
        updateIngredient: updateIngredientFn,
        clearPantry,
        recipes,
        setRecipes,
        selectedRecipe,
        setSelectedRecipe,
        shoppingList,
        setShoppingList,
        chatHistory,
        addChatMessage,
      }}
    >
      {children}
    </PantryContext.Provider>
  );
}

export function usePantry() {
  const context = useContext(PantryContext);
  if (context === undefined) {
    throw new Error("usePantry must be used within a PantryProvider");
  }
  return context;
}
