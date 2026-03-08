import { Check, X, ShoppingCart } from "lucide-react";
import { Badge } from "../ui/badge";
import { ShoppingItem } from "../../context/PantryContext";

interface ShoppingListItemProps {
  item: ShoppingItem;
}

export function ShoppingListItem({ item }: ShoppingListItemProps) {
  return (
    <article className="flex items-center justify-between p-4 border rounded-lg bg-white">
      <div className="flex items-center gap-3 flex-1">
        <ShoppingCart className="size-5 text-gray-400" />
        <div className="flex-1">
          <h3 className="font-medium">{item.name}</h3>
          <p className="text-sm text-gray-600">
            {item.quantity} {item.unit}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {item.price && (
          <span className="font-semibold text-green-600">{item.price}</span>
        )}
        <Badge
          variant={item.available ? "default" : "secondary"}
          className={
            item.available
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }
        >
          {item.available ? (
            <span className="flex items-center gap-1">
              <Check className="size-3" />
              Available
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <X className="size-3" />
              Out of Stock
            </span>
          )}
        </Badge>
      </div>
    </article>
  );
}
