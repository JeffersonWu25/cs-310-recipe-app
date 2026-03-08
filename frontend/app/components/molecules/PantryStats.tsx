"use client";

import { Package, Utensils, ShoppingBag } from "lucide-react";
import { StatCard } from "../atoms/StatCard";
import { usePantry } from "../../context/PantryContext";

export function PantryStats() {
  const { ingredients, recipes, shoppingList } = usePantry();

  const stats = [
    {
      icon: Package,
      label: "Ingredients",
      value: ingredients.length,
      iconColor: "text-blue-600",
    },
    {
      icon: Utensils,
      label: "Recipes Found",
      value: recipes.length,
      iconColor: "text-green-600",
    },
    {
      icon: ShoppingBag,
      label: "Shopping Items",
      value: shoppingList.length,
      iconColor: "text-orange-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          icon={stat.icon}
          label={stat.label}
          value={stat.value}
          iconColor={stat.iconColor}
        />
      ))}
    </div>
  );
}
