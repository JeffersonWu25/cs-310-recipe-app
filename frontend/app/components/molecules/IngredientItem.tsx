import { Trash2, Edit2 } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Ingredient } from "../../context/PantryContext";

interface IngredientItemProps {
  ingredient: Ingredient;
  onRemove: (id: string) => void;
  onEdit?: (id: string) => void;
}

export function IngredientItem({
  ingredient,
  onRemove,
  onEdit,
}: IngredientItemProps) {
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Protein: "bg-red-100 text-red-800",
      Vegetables: "bg-green-100 text-green-800",
      Grains: "bg-yellow-100 text-yellow-800",
      Dairy: "bg-blue-100 text-blue-800",
      Oils: "bg-amber-100 text-amber-800",
      Spices: "bg-purple-100 text-purple-800",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  return (
    <article className="flex items-center justify-between p-4 border rounded-lg bg-white hover:shadow-md transition-shadow">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-medium">{ingredient.name}</h3>
          <Badge className={getCategoryColor(ingredient.category)} variant="secondary">
            {ingredient.category}
          </Badge>
        </div>
        <p className="text-sm text-gray-600">
          {ingredient.quantity} {ingredient.unit}
        </p>
      </div>
      <div className="flex gap-2">
        {onEdit && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(ingredient.id)}
            aria-label={`Edit ${ingredient.name}`}
          >
            <Edit2 className="size-4" />
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRemove(ingredient.id)}
          aria-label={`Remove ${ingredient.name}`}
        >
          <Trash2 className="size-4 text-red-500" />
        </Button>
      </div>
    </article>
  );
}
