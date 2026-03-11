import { ExternalLink, Star } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { RestaurantResult } from "../../context/PantryContext";

interface RestaurantCardProps {
  restaurant: RestaurantResult;
}

function PriceLevel({ level }: { level: number | null }) {
  if (level == null) return null;
  return (
    <span className="text-sm text-gray-500">
      {"$".repeat(level) || "Free"}
    </span>
  );
}

function formatRatingCount(n: number | null): string {
  if (n == null) return "";
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
  return (
    <Card className="w-60 shrink-0 hover:shadow-md transition-shadow flex flex-col">
      <CardContent className="pt-4 flex flex-col gap-2 flex-1">
        {/* Open/closed badge */}
        <div className="flex items-center justify-between gap-1">
          {restaurant.open_now != null && (
            <Badge
              className={
                restaurant.open_now
                  ? "bg-green-100 text-green-800 text-xs font-normal"
                  : "bg-red-50 text-red-600 text-xs font-normal"
              }
            >
              {restaurant.open_now ? "Open" : "Closed"}
            </Badge>
          )}
          <PriceLevel level={restaurant.price_level} />
        </div>

        {/* Name */}
        <h3 className="font-semibold text-sm leading-snug line-clamp-2">
          {restaurant.name}
        </h3>

        {/* Address */}
        <p className="text-xs text-gray-500 line-clamp-2">{restaurant.address}</p>

        {/* Rating */}
        {restaurant.rating != null && (
          <div className="flex items-center gap-1 mt-auto">
            <Star className="size-3.5 fill-amber-400 text-amber-400" />
            <span className="text-sm font-medium">{restaurant.rating.toFixed(1)}</span>
            {restaurant.total_ratings != null && (
              <span className="text-xs text-gray-400">
                ({formatRatingCount(restaurant.total_ratings)})
              </span>
            )}
          </div>
        )}

        {/* Maps link */}
        <a
          href={restaurant.maps_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs text-blue-600 hover:underline mt-1"
        >
          View on Maps
          <ExternalLink className="size-3" />
        </a>
      </CardContent>
    </Card>
  );
}
