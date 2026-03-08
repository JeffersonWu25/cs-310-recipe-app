import { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  iconColor?: string;
}

export function StatCard({
  icon: Icon,
  label,
  value,
  iconColor = "text-blue-600",
}: StatCardProps) {
  return (
    <article className="flex items-center gap-3 p-4 bg-white rounded-lg border shadow-sm">
      <div className="flex-shrink-0">
        <Icon className={`size-8 ${iconColor}`} />
      </div>
      <div className="flex-1">
        <p className="text-sm text-gray-600">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </article>
  );
}
