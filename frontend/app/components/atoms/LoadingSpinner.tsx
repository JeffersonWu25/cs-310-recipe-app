import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
}

export function LoadingSpinner({
  size = "md",
  text,
  className = "",
}: LoadingSpinnerProps) {
  const sizes = {
    sm: "size-4",
    md: "size-6",
    lg: "size-8",
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Loader2
        className={`${sizes[size]} animate-spin text-blue-600`}
      />
      {text && (
        <span className="text-sm text-gray-600">{text}</span>
      )}
    </div>
  );
}
