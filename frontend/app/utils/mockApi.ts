import {
  Recipe,
  ShoppingItem,
} from "../context/PantryContext";

// Mock ChatGPT API for recipe generation
export async function generateRecipes(
  ingredients: string[],
): Promise<Recipe[]> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Mock response based on ingredients
  return [
    {
      id: "1",
      name: "Garlic Butter Chicken Pasta",
      description:
        "A creamy, savory pasta dish with tender chicken and a rich garlic butter sauce.",
      ingredients: [
        "Chicken Breast",
        "Pasta",
        "Garlic",
        "Butter",
        "Heavy Cream",
        "Parmesan Cheese",
        "Olive Oil",
      ],
      missingIngredients: [
        "Butter",
        "Heavy Cream",
        "Parmesan Cheese",
      ],
      prepTime: "30 mins",
      difficulty: "Easy",
      servings: 4,
      instructions: [
        "Cook pasta according to package directions",
        "Season and cook chicken breast in olive oil until golden",
        "Sauté garlic in butter until fragrant",
        "Add heavy cream and parmesan cheese",
        "Toss cooked pasta with sauce and sliced chicken",
        "Garnish with fresh parsley and serve hot",
      ],
    },
    {
      id: "2",
      name: "Fresh Tomato Basil Pasta",
      description:
        "A light and fresh pasta with ripe tomatoes, garlic, and basil.",
      ingredients: [
        "Pasta",
        "Tomatoes",
        "Garlic",
        "Olive Oil",
        "Fresh Basil",
        "Salt",
        "Pepper",
      ],
      missingIngredients: ["Fresh Basil"],
      prepTime: "20 mins",
      difficulty: "Easy",
      servings: 4,
      instructions: [
        "Boil pasta until al dente",
        "Dice tomatoes and mince garlic",
        "Heat olive oil and sauté garlic",
        "Add tomatoes and cook until softened",
        "Toss with pasta and fresh basil",
        "Season with salt and pepper to taste",
      ],
    },
    {
      id: "3",
      name: "Herb-Roasted Chicken",
      description:
        "Juicy roasted chicken with aromatic herbs and garlic.",
      ingredients: [
        "Chicken Breast",
        "Garlic",
        "Olive Oil",
        "Rosemary",
        "Thyme",
        "Lemon",
      ],
      missingIngredients: ["Rosemary", "Thyme", "Lemon"],
      prepTime: "45 mins",
      difficulty: "Medium",
      servings: 4,
      instructions: [
        "Preheat oven to 400°F",
        "Rub chicken with olive oil, garlic, and herbs",
        "Place in roasting pan with lemon slices",
        "Roast for 35-40 minutes until golden",
        "Let rest for 5 minutes before serving",
      ],
    },
  ];
}

// Mock Instacart API for shopping list
export async function generateShoppingList(
  missingIngredients: string[],
): Promise<ShoppingItem[]> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const mockPrices: Record<string, string> = {
    Butter: "$4.99",
    "Heavy Cream": "$3.49",
    "Parmesan Cheese": "$6.99",
    "Fresh Basil": "$2.99",
    Rosemary: "$3.49",
    Thyme: "$3.49",
    Lemon: "$0.89",
  };

  return missingIngredients.map((ingredient, index) => ({
    id: `shopping-${index}`,
    name: ingredient,
    quantity: "1",
    unit: "pack",
    available: true,
    price: mockPrices[ingredient] || "$2.99",
  }));
}

// Mock Dominos API for pizza ordering
export interface DominosStore {
  id: string;
  name: string;
  address: string;
  distance: string;
  phone: string;
  hours: string;
}

export async function getNearbyDominosStores(): Promise<
  DominosStore[]
> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  return [
    {
      id: "1",
      name: "Domino's Pizza - Main St",
      address: "123 Main Street, College Town, ST 12345",
      distance: "0.8 miles",
      phone: "(555) 123-4567",
      hours: "Open until 11:00 PM",
    },
    {
      id: "2",
      name: "Domino's Pizza - University Ave",
      address: "456 University Ave, College Town, ST 12345",
      distance: "1.2 miles",
      phone: "(555) 234-5678",
      hours: "Open until 12:00 AM",
    },
    {
      id: "3",
      name: "Domino's Pizza - Campus Plaza",
      address: "789 Campus Plaza, College Town, ST 12345",
      distance: "1.5 miles",
      phone: "(555) 345-6789",
      hours: "Open until 1:00 AM",
    },
  ];
}

// Mock conversational chat response
export async function getChatResponse(
  message: string,
  ingredients: string[],
): Promise<string> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1200));

  const lowerMessage = message.toLowerCase();

  if (
    lowerMessage.includes("what can i make") ||
    lowerMessage.includes("recipe")
  ) {
    return `Based on your pantry (${ingredients.join(", ")}), I can suggest several delicious recipes! You have great ingredients for pasta dishes, chicken-based meals, and fresh vegetable sides. Would you like me to show you specific recipes?`;
  }

  if (
    lowerMessage.includes("quick") ||
    lowerMessage.includes("easy")
  ) {
    return "For quick and easy meals, I recommend the Fresh Tomato Basil Pasta - it takes only 20 minutes and you're missing just one ingredient (Fresh Basil). The Garlic Butter Chicken Pasta is also straightforward at 30 minutes prep time.";
  }

  if (
    lowerMessage.includes("healthy") ||
    lowerMessage.includes("light")
  ) {
    return "For healthy options, the Herb-Roasted Chicken is perfect - it's high in protein and uses minimal oil. The Fresh Tomato Basil Pasta is also a lighter option with fresh vegetables and simple ingredients.";
  }

  if (
    lowerMessage.includes("dinner") ||
    lowerMessage.includes("main")
  ) {
    return "For a satisfying dinner, I'd recommend the Garlic Butter Chicken Pasta or the Herb-Roasted Chicken. Both are hearty main courses that will serve 4 people.";
  }

  return "I can help you find recipes based on your ingredients! Try asking me 'What can I make for dinner?' or 'Show me quick recipes'. I can also help identify missing ingredients and create shopping lists.";
}
