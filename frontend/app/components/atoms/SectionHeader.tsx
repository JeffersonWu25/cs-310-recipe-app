import { LucideIcon } from "lucide-react";

interface SectionHeaderProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  iconColor?: string;
  action?: React.ReactNode;
}

export function SectionHeader({
  icon: Icon,
  title,
  description,
  iconColor = "text-blue-600",
  action,
}: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Icon className={`size-6 ${iconColor}`} />
        <div>
          <h2 className="text-2xl font-semibold">{title}</h2>
          {description && (
            <p className="text-sm text-gray-600 mt-0.5">{description}</p>
          )}
        </div>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
