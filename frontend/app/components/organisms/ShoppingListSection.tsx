"use client";

import { MapPin, Truck, X, AlertCircle, ShoppingBag, Package, UtensilsCrossed } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { Alert, AlertDescription } from "../ui/alert";
import { usePantry, KrogerStoreResult } from "../../context/PantryContext";
import { RestaurantCard } from "../molecules/RestaurantCard";

// --- Kroger Skeletons ---

function ProductRowSkeleton() {
  return (
    <div className="flex items-center gap-3 py-3 border-b last:border-0 animate-pulse">
      <div className="h-4 w-24 bg-gray-200 rounded shrink-0" />
      <div className="h-4 flex-1 bg-gray-200 rounded" />
      <div className="h-4 w-12 bg-gray-200 rounded shrink-0" />
      <div className="h-6 w-20 bg-gray-200 rounded-full shrink-0" />
    </div>
  );
}

function StoreCardSkeleton({ itemCount }: { itemCount: number }) {
  return (
    <Card className="animate-pulse">
      <CardHeader>
        <div className="h-5 w-40 bg-gray-200 rounded" />
        <div className="h-4 w-56 bg-gray-200 rounded mt-2" />
      </CardHeader>
      <CardContent>
        <div className="divide-y">
          {Array.from({ length: itemCount }).map((_, i) => (
            <ProductRowSkeleton key={i} />
          ))}
        </div>
        <div className="flex justify-between items-center pt-3 mt-1 border-t">
          <div className="h-4 w-28 bg-gray-200 rounded" />
          <div className="h-5 w-14 bg-gray-200 rounded" />
        </div>
      </CardContent>
    </Card>
  );
}

// --- Kroger Store Card ---

function StoreCard({ store }: { store: KrogerStoreResult }) {
  const total = store.products.reduce((sum, p) => sum + (p.price ?? 0), 0);
  const foundProducts = store.products.filter((p) => p.found);
  const allDeliverable =
    foundProducts.length > 0 && foundProducts.every((p) => p.delivery_eligible);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <CardTitle className="flex items-center gap-2 text-base">
              <MapPin className="size-4 text-blue-600 shrink-0" />
              <span className="truncate">{store.name}</span>
            </CardTitle>
            <CardDescription className="mt-1 text-xs leading-snug">
              {store.address}
            </CardDescription>
          </div>
          {allDeliverable && (
            <Badge className="bg-blue-100 text-blue-800 shrink-0 text-xs">
              <Truck className="size-3 mr-1" />
              All Deliverable
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="divide-y">
          {store.products.map((product) => (
            <div key={product.item_name} className="flex items-center gap-3 py-2.5">
              <span className="w-24 text-sm font-medium text-gray-700 capitalize shrink-0 truncate">
                {product.item_name}
              </span>
              <span className="flex-1 text-xs text-gray-500 truncate min-w-0">
                {product.found && product.product_name ? (
                  product.product_name
                ) : (
                  <span className="italic text-gray-400">Not available</span>
                )}
              </span>
              <span className="w-12 text-sm font-semibold text-right shrink-0">
                {product.price != null ? `$${product.price.toFixed(2)}` : "—"}
              </span>
              <div className="w-[88px] flex justify-end shrink-0">
                {product.found ? (
                  product.delivery_eligible ? (
                    <Badge className="bg-green-100 text-green-800 text-xs font-normal">
                      <Truck className="size-3 mr-1" />
                      Delivery
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-gray-100 text-gray-500 text-xs font-normal">
                      <X className="size-3 mr-1" />
                      No Delivery
                    </Badge>
                  )
                ) : (
                  <Badge variant="secondary" className="bg-red-50 text-red-500 text-xs font-normal">
                    Not Found
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
        {total > 0 && (
          <div className="flex items-center justify-between pt-3 mt-1 border-t">
            <span className="text-sm text-gray-500">Estimated Total</span>
            <span className="text-base font-bold text-green-600">${total.toFixed(2)}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// --- Restaurant carousel skeletons ---

function RestaurantCardSkeleton() {
  return (
    <div className="w-60 shrink-0 animate-pulse rounded-lg border bg-white p-4 flex flex-col gap-3">
      <div className="flex justify-between">
        <div className="h-5 w-14 bg-gray-200 rounded-full" />
        <div className="h-4 w-8 bg-gray-200 rounded" />
      </div>
      <div className="h-4 w-40 bg-gray-200 rounded" />
      <div className="h-3 w-36 bg-gray-200 rounded" />
      <div className="h-3 w-24 bg-gray-200 rounded mt-auto" />
    </div>
  );
}

// --- Main section ---

export function ShoppingListSection() {
  const {
    selectedRecipe,
    krogerResult,
    krogerLoading,
    krogerError,
    restaurants,
    restaurantsLoading,
  } = usePantry();

  if (!selectedRecipe) return null;
  if (!krogerLoading && !krogerResult && !krogerError && !restaurantsLoading && restaurants.length === 0) return null;

  const itemCount = selectedRecipe.missingIngredients.length;
  const showRestaurantSection = restaurantsLoading || restaurants.length > 0;

  return (
    <section id="shopping-list-section" className="space-y-8">
      {/* ── Kroger section ── */}
      <div className="space-y-5">
        <div className="flex items-center gap-2">
          <ShoppingBag className="size-6 text-blue-600" />
          <h2 className="text-2xl font-bold">
            Get Ingredients for {selectedRecipe.name}
          </h2>
        </div>

        {/* Error */}
        {krogerError && (
          <Alert className="bg-red-50 border-red-200">
            <AlertCircle className="size-4 text-red-600" />
            <AlertDescription className="ml-2 text-red-800">
              {krogerError}
            </AlertDescription>
          </Alert>
        )}

        {/* Loading skeleton */}
        {krogerLoading && (
          <div className="space-y-3">
            <p className="text-sm text-gray-400 animate-pulse">
              Finding nearby Kroger stores and checking availability…
            </p>
            <div className="grid gap-4 lg:grid-cols-3">
              <StoreCardSkeleton itemCount={itemCount} />
              <StoreCardSkeleton itemCount={itemCount} />
              <StoreCardSkeleton itemCount={itemCount} />
            </div>
          </div>
        )}

        {/* No stores found */}
        {krogerResult && krogerResult.stores.length === 0 && krogerResult.message && (
          <Alert className="bg-amber-50 border-amber-200">
            <Package className="size-4 text-amber-600" />
            <AlertDescription className="ml-2 text-amber-800">
              {krogerResult.message}
            </AlertDescription>
          </Alert>
        )}

        {/* Store results */}
        {krogerResult && krogerResult.stores.length > 0 && (
          <div className="grid gap-4 lg:grid-cols-3">
            {krogerResult.stores.map((store) => (
              <StoreCard key={store.location_id} store={store} />
            ))}
          </div>
        )}
      </div>

      {/* ── Restaurants carousel ── */}
      {showRestaurantSection && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <UtensilsCrossed className="size-5 text-orange-500" />
            <h3 className="text-xl font-semibold">Or just go out to eat</h3>
            <span className="text-sm text-gray-400">— top-rated spots near you</span>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-3 snap-x snap-mandatory">
            {restaurantsLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <RestaurantCardSkeleton key={i} />
                ))
              : restaurants.map((r, i) => (
                  <div key={i} className="snap-start">
                    <RestaurantCard restaurant={r} />
                  </div>
                ))}
          </div>
        </div>
      )}
    </section>
  );
}

export default ShoppingListSection;
