import { MapPin, Phone, Clock } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { DominosStore } from "../../utils/mockApi";

interface DominosStoreCardProps {
  store: DominosStore;
}

export function DominosStoreCard({ store }: DominosStoreCardProps) {
  const handleOrder = () => {
    // In a real app, this would integrate with Dominos API
    alert(`Redirecting to order from ${store.name}...`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{store.name}</CardTitle>
        <CardDescription className="flex items-center gap-1 mt-2">
          <MapPin className="size-4" />
          {store.distance} away
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-start gap-2 text-sm">
          <MapPin className="size-4 text-gray-400 mt-0.5 flex-shrink-0" />
          <address className="not-italic text-gray-600">{store.address}</address>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Phone className="size-4 text-gray-400" />
          <a href={`tel:${store.phone}`} className="text-gray-600 hover:text-blue-600">
            {store.phone}
          </a>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Clock className="size-4 text-gray-400" />
          <span className="text-green-600 font-medium">{store.hours}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleOrder} className="w-full">
          Order from this location
        </Button>
      </CardFooter>
    </Card>
  );
}
