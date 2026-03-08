"use client";

import { ChefHat, Loader2 } from "lucide-react";
import { RecipeCard } from "../molecules/RecipeCard";
import { SectionHeader } from "../atoms/SectionHeader";
import { usePantry } from "../../context/PantryContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { useState } from "react";
import { Recipe } from "../../context/PantryContext";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";

export function RecipeList() {
  const { recipes, setSelectedRecipe, setShoppingList } = usePantry();
  const [detailsDialog, setDetailsDialog] = useState<Recipe | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSelectRecipe = async (recipe: Recipe) => {
    setIsGenerating(true);
    setSelectedRecipe(recipe);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const { generateShoppingList } = await import("../../utils/mockApi");
    const shoppingList = await generateShoppingList(recipe.missingIngredients);
    setShoppingList(shoppingList);

    setIsGenerating(false);

    const shoppingSection = document.getElementById("shopping-list-section");
    if (shoppingSection) {
      shoppingSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleViewDetails = (recipe: Recipe) => {
    setDetailsDialog(recipe);
  };

  if (recipes.length === 0) {
    return null;
  }

  return (
    <>
      <section className="space-y-4">
        <SectionHeader
          icon={ChefHat}
          title="Recipe Suggestions"
          iconColor="text-green-600"
        />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onSelect={handleSelectRecipe}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>

        {isGenerating && (
          <div className="flex items-center justify-center gap-2 p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <Loader2 className="size-5 animate-spin text-blue-600" />
            <span className="text-blue-700 font-medium">
              Generating shopping list...
            </span>
          </div>
        )}
      </section>

      {/* Recipe Details Dialog */}
      <Dialog open={!!detailsDialog} onOpenChange={() => setDetailsDialog(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {detailsDialog && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{detailsDialog.name}</DialogTitle>
                <DialogDescription>{detailsDialog.description}</DialogDescription>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                <div className="flex gap-4">
                  <Badge variant="outline">{detailsDialog.difficulty}</Badge>
                  <Badge variant="outline">{detailsDialog.prepTime}</Badge>
                  <Badge variant="outline">{detailsDialog.servings} servings</Badge>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold text-lg mb-3">Ingredients</h3>
                  <ul className="space-y-2">
                    {detailsDialog.ingredients.map((ingredient, index) => {
                      const isMissing =
                        detailsDialog.missingIngredients.includes(ingredient);
                      return (
                        <li
                          key={index}
                          className={`flex items-center gap-2 ${
                            isMissing ? "text-amber-700" : "text-gray-700"
                          }`}
                        >
                          <span
                            className={`size-2 rounded-full ${
                              isMissing ? "bg-amber-500" : "bg-green-500"
                            }`}
                          />
                          {ingredient}
                          {isMissing && (
                            <Badge
                              variant="outline"
                              className="ml-2 bg-amber-50 text-amber-700 border-amber-300"
                            >
                              Missing
                            </Badge>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold text-lg mb-3">Instructions</h3>
                  <ol className="space-y-3">
                    {detailsDialog.instructions.map((instruction, index) => (
                      <li key={index} className="flex gap-3">
                        <span className="flex-shrink-0 flex items-center justify-center size-6 rounded-full bg-green-100 text-green-700 font-semibold text-sm">
                          {index + 1}
                        </span>
                        <p className="text-gray-700 pt-0.5">{instruction}</p>
                      </li>
                    ))}
                  </ol>
                </div>

                {detailsDialog.missingIngredients.length > 0 && (
                  <div className="flex gap-2">
                    <Button
                      onClick={() => {
                        handleSelectRecipe(detailsDialog);
                        setDetailsDialog(null);
                      }}
                      className="flex-1"
                    >
                      Get Missing Ingredients
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default RecipeList;
