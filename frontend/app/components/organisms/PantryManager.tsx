"use client";

import { useState } from "react";
import { Plus, Package } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { IngredientItem } from "../molecules/IngredientItem";
import { SectionHeader } from "../atoms/SectionHeader";
import { EmptyState } from "../atoms/EmptyState";
import { usePantry } from "../../context/PantryContext";

export function PantryManager() {
  const { ingredients, addIngredient, removeIngredient } = usePantry();
  const [isAdding, setIsAdding] = useState(false);
  const [newIngredient, setNewIngredient] = useState({
    name: "",
    quantity: "",
    unit: "pieces",
    category: "Vegetables",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newIngredient.name && newIngredient.quantity) {
      addIngredient(newIngredient);
      setNewIngredient({
        name: "",
        quantity: "",
        unit: "pieces",
        category: "Vegetables",
      });
      setIsAdding(false);
    }
  };

  const categories = ["Protein", "Vegetables", "Grains", "Dairy", "Oils", "Spices", "Other"];
  const units = ["pieces", "lbs", "oz", "cups", "tbsp", "tsp", "box", "bottle", "can"];

  return (
    <section className="space-y-4">
      <SectionHeader
        icon={Package}
        title="My Pantry"
        iconColor="text-blue-600"
        action={
          <Button onClick={() => setIsAdding(!isAdding)}>
            <Plus className="size-4 mr-2" />
            Add Ingredient
          </Button>
        }
      />

      {isAdding && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Ingredient</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="ingredient-name">Ingredient Name</Label>
                  <Input
                    id="ingredient-name"
                    value={newIngredient.name}
                    onChange={(e) =>
                      setNewIngredient({ ...newIngredient, name: e.target.value })
                    }
                    placeholder="e.g., Chicken Breast"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="ingredient-category">Category</Label>
                  <Select
                    value={newIngredient.category}
                    onValueChange={(value) =>
                      setNewIngredient({ ...newIngredient, category: value })
                    }
                  >
                    <SelectTrigger id="ingredient-category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="ingredient-quantity">Quantity</Label>
                  <Input
                    id="ingredient-quantity"
                    type="number"
                    step="0.1"
                    value={newIngredient.quantity}
                    onChange={(e) =>
                      setNewIngredient({ ...newIngredient, quantity: e.target.value })
                    }
                    placeholder="e.g., 2"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="ingredient-unit">Unit</Label>
                  <Select
                    value={newIngredient.unit}
                    onValueChange={(value) =>
                      setNewIngredient({ ...newIngredient, unit: value })
                    }
                  >
                    <SelectTrigger id="ingredient-unit">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {units.map((unit) => (
                        <SelectItem key={unit} value={unit}>
                          {unit}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit">Add to Pantry</Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAdding(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {ingredients.length === 0 ? (
        <Card>
          <CardContent className="p-0">
            <EmptyState
              icon={Package}
              title="Your pantry is empty"
              description="Add ingredients to get started and discover what you can cook!"
              actionLabel="Add First Ingredient"
              onAction={() => setIsAdding(true)}
            />
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {ingredients.map((ingredient) => (
            <IngredientItem
              key={ingredient.id}
              ingredient={ingredient}
              onRemove={removeIngredient}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default PantryManager;
