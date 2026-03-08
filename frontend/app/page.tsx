"use client";

import { AppHeader } from "./components/molecules/AppHeader";
import { AppFooter } from "./components/molecules/AppFooter";
import { PantryManager } from "./components/organisms/PantryManager";
import { ChatInterface } from "./components/organisms/ChatInterface";
import { RecipeList } from "./components/organisms/RecipeList";
import { ShoppingListSection } from "./components/organisms/ShoppingListSection";
import { PantryStats } from "./components/molecules/PantryStats";
import { Separator } from "./components/ui/separator";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-orange-50">
      {/* Header */}
      <AppHeader />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Introduction */}
          <section className="text-center space-y-4">
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Discover delicious recipes based on ingredients you already have.
              Save time, reduce waste, and enjoy cooking!
            </p>
            <PantryStats />
          </section>

          <Separator />

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column: Pantry Management */}
            <div className="space-y-6">
              <PantryManager />
            </div>

            {/* Right Column: Chat Interface */}
            <div className="space-y-6">
              <ChatInterface />
            </div>
          </div>

          <Separator />

          {/* Recipe Results */}
          <RecipeList />

          {/* Shopping List & Dominos */}
          <ShoppingListSection />
        </div>
      </main>

      {/* Footer */}
      <AppFooter />
    </div>
  );
}
