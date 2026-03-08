"use client";

import { createContext, useContext, useState, ReactNode } from "react";

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
  addIngredient: (ingredient: Omit<Ingredient, "id">) => void;
  removeIngredient: (id: string) => void;
  updateIngredient: (id: string, ingredient: Partial<Ingredient>) => void;
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
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    {
      id: "1",
      name: "Chicken Breast",
      quantity: "2",
      unit: "lbs",
      category: "Protein",
    },
    {
      id: "2",
      name: "Pasta",
      quantity: "1",
      unit: "box",
      category: "Grains",
    },
    {
      id: "3",
      name: "Tomatoes",
      quantity: "5",
      unit: "pieces",
      category: "Vegetables",
    },
    {
      id: "4",
      name: "Garlic",
      quantity: "6",
      unit: "cloves",
      category: "Vegetables",
    },
    {
      id: "5",
      name: "Olive Oil",
      quantity: "1",
      unit: "bottle",
      category: "Oils",
    },
  ]);

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  const addIngredient = (ingredient: Omit<Ingredient, "id">) => {
    const newIngredient: Ingredient = {
      ...ingredient,
      id: Date.now().toString(),
    };
    setIngredients((prev) => [...prev, newIngredient]);
  };

  const removeIngredient = (id: string) => {
    setIngredients((prev) => prev.filter((item) => item.id !== id));
  };

  const updateIngredient = (id: string, updates: Partial<Ingredient>) => {
    setIngredients((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
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
        addIngredient,
        removeIngredient,
        updateIngredient,
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
