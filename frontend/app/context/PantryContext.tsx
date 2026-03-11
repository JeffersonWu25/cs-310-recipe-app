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

export interface KrogerProductResult {
  item_name: string;
  found: boolean;
  product_name: string | null;
  price: number | null;
  delivery_eligible: boolean;
}

export interface KrogerStoreResult {
  location_id: string;
  name: string;
  address: string;
  products: KrogerProductResult[];
}

export interface KrogerShoppingResult {
  stores: KrogerStoreResult[];
  message: string | null;
}

export interface RestaurantResult {
  name: string;
  address: string;
  rating: number | null;
  total_ratings: number | null;
  price_level: number | null;
  open_now: boolean | null;
  maps_url: string;
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
  krogerResult: KrogerShoppingResult | null;
  setKrogerResult: (r: KrogerShoppingResult | null) => void;
  krogerLoading: boolean;
  setKrogerLoading: (v: boolean) => void;
  krogerError: string | null;
  setKrogerError: (e: string | null) => void;
  restaurants: RestaurantResult[];
  setRestaurants: (r: RestaurantResult[]) => void;
  restaurantsLoading: boolean;
  setRestaurantsLoading: (v: boolean) => void;
  restaurantsError: string | null;
  setRestaurantsError: (e: string | null) => void;
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
  const [krogerResult, setKrogerResult] = useState<KrogerShoppingResult | null>(null);
  const [krogerLoading, setKrogerLoading] = useState(false);
  const [krogerError, setKrogerError] = useState<string | null>(null);
  const [restaurants, setRestaurants] = useState<RestaurantResult[]>([]);
  const [restaurantsLoading, setRestaurantsLoading] = useState(false);
  const [restaurantsError, setRestaurantsError] = useState<string | null>(null);
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
        krogerResult,
        setKrogerResult,
        krogerLoading,
        setKrogerLoading,
        krogerError,
        setKrogerError,
        restaurants,
        setRestaurants,
        restaurantsLoading,
        setRestaurantsLoading,
        restaurantsError,
        setRestaurantsError,
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
