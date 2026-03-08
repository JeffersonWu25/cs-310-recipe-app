import { ChefHat } from "lucide-react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export function Logo({ size = "md", showText = true }: LogoProps) {
  const iconSizes = {
    sm: "size-6",
    md: "size-8",
    lg: "size-12",
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-3xl",
  };

  const paddingSizes = {
    sm: "p-1.5",
    md: "p-2",
    lg: "p-3",
  };

  return (
    <div className="flex items-center gap-3">
      <div
        className={`bg-gradient-to-br from-blue-600 to-green-600 ${paddingSizes[size]} rounded-lg`}
      >
        <ChefHat className={`${iconSizes[size]} text-white`} />
      </div>
      {showText && (
        <div>
          <h1 className={`${textSizes[size]} font-bold text-gray-900`}>
            Smart Pantry Chef
          </h1>
          <p className="text-sm text-gray-600">Cook smart with what you have</p>
        </div>
      )}
    </div>
  );
}
