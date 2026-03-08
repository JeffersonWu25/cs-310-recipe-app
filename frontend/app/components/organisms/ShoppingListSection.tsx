"use client";

import { useState, useEffect } from "react";
import { ShoppingCart, Pizza, Loader2, ExternalLink } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { ShoppingListItem } from "../molecules/ShoppingListItem";
import { DominosStoreCard } from "../molecules/DominosStoreCard";
import { usePantry } from "../../context/PantryContext";
import { getNearbyDominosStores, DominosStore } from "../../utils/mockApi";
import { Alert, AlertDescription } from "../ui/alert";

export function ShoppingListSection() {
  const { selectedRecipe, shoppingList } = usePantry();
  const [dominosStores, setDominosStores] = useState<DominosStore[]>([]);
  const [showDominos, setShowDominos] = useState(false);
  const [isLoadingStores, setIsLoadingStores] = useState(false);

  useEffect(() => {
    // Auto-show Dominos if more than 2 ingredients are missing
    if (selectedRecipe && selectedRecipe.missingIngredients.length > 2) {
      loadDominosStores();
    }
  }, [selectedRecipe]);

  const loadDominosStores = async () => {
    setIsLoadingStores(true);
    setShowDominos(true);
    try {
      const stores = await getNearbyDominosStores();
      setDominosStores(stores);
    } catch (error) {
      console.error("Failed to load Dominos stores:", error);
    } finally {
      setIsLoadingStores(false);
    }
  };

  const handleCheckoutInstacart = () => {
    alert("Redirecting to Instacart checkout with your shopping list...");
  };

  const calculateTotal = () => {
    return shoppingList.reduce((total, item) => {
      if (item.price) {
        const price = parseFloat(item.price.replace("$", ""));
        return total + price;
      }
      return total;
    }, 0);
  };

  if (!selectedRecipe || shoppingList.length === 0) {
    return null;
  }

  const shouldShowDominosAlert = selectedRecipe.missingIngredients.length > 2;

  return (
    <section id="shopping-list-section" className="space-y-6">
      {/* Shopping List */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <ShoppingCart className="size-6 text-blue-600" />
            <div className="flex-1">
              <CardTitle>Shopping List for {selectedRecipe.name}</CardTitle>
              <CardDescription>
                {shoppingList.length} item{shoppingList.length !== 1 ? "s" : ""} needed
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {shoppingList.map((item) => (
            <ShoppingListItem key={item.id} item={item} />
          ))}
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <div className="flex items-center justify-between w-full">
            <span className="text-lg font-semibold">Estimated Total:</span>
            <span className="text-2xl font-bold text-green-600">
              ${calculateTotal().toFixed(2)}
            </span>
          </div>
          <Button onClick={handleCheckoutInstacart} className="w-full" size="lg">
            <ShoppingCart className="size-4 mr-2" />
            Checkout with Instacart
            <ExternalLink className="size-4 ml-2" />
          </Button>
        </CardFooter>
      </Card>

      {/* Dominos Fallback Alert */}
      {shouldShowDominosAlert && !showDominos && (
        <Alert className="bg-orange-50 border-orange-200">
          <Pizza className="size-4 text-orange-600" />
          <AlertDescription className="ml-2">
            <div className="flex items-center justify-between">
              <span className="text-orange-800">
                Missing {selectedRecipe.missingIngredients.length} ingredients? Why not
                order pizza instead?
              </span>
              <Button
                onClick={loadDominosStores}
                variant="outline"
                size="sm"
                className="ml-4 border-orange-300 text-orange-700 hover:bg-orange-100"
              >
                <Pizza className="size-4 mr-2" />
                View Nearby Stores
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Dominos Stores Section */}
      {showDominos && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Pizza className="size-6 text-orange-600" />
              <h3 className="text-xl font-semibold">
                Or Order from Domino&apos;s Nearby
              </h3>
            </div>
            {dominosStores.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDominos(false)}
              >
                Hide
              </Button>
            )}
          </div>

          {isLoadingStores ? (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="size-8 animate-spin text-orange-600" />
                  <p className="text-gray-600">Finding nearby Domino&apos;s stores...</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {dominosStores.map((store) => (
                <DominosStoreCard key={store.id} store={store} />
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}

export default ShoppingListSection;
