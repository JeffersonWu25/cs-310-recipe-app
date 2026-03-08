import { Clock, Users, ChefHat, AlertCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Recipe } from "../../context/PantryContext";

interface RecipeCardProps {
  recipe: Recipe;
  onSelect: (recipe: Recipe) => void;
  onViewDetails: (recipe: Recipe) => void;
}

export function RecipeCard({ recipe, onSelect, onViewDetails }: RecipeCardProps) {
  const getDifficultyColor = (difficulty: string) => {
    const colors: Record<string, string> = {
      Easy: "bg-green-100 text-green-800",
      Medium: "bg-yellow-100 text-yellow-800",
      Hard: "bg-red-100 text-red-800",
    };
    return colors[difficulty] || "bg-gray-100 text-gray-800";
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle>{recipe.name}</CardTitle>
            <CardDescription className="mt-2">{recipe.description}</CardDescription>
          </div>
          <Badge className={getDifficultyColor(recipe.difficulty)}>
            {recipe.difficulty}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 mb-4">
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Clock className="size-4" />
            <span>{recipe.prepTime}</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Users className="size-4" />
            <span>{recipe.servings} servings</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <ChefHat className="size-4" />
            <span>{recipe.ingredients.length} ingredients</span>
          </div>
        </div>

        {recipe.missingIngredients.length > 0 && (
          <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <AlertCircle className="size-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-amber-800">
                Missing {recipe.missingIngredients.length} ingredient
                {recipe.missingIngredients.length !== 1 ? "s" : ""}:
              </p>
              <p className="text-sm text-amber-700 mt-1">
                {recipe.missingIngredients.join(", ")}
              </p>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button onClick={() => onViewDetails(recipe)} className="flex-1">
          View Recipe
        </Button>
        {recipe.missingIngredients.length > 0 && (
          <Button onClick={() => onSelect(recipe)} variant="outline">
            Get Missing Items
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
