import { Users } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export default function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-14 h-14 rounded-full bg-[#E8F1FB] flex items-center justify-center mb-4">
        <Users className="text-[#0A65CC]" size={28} />
      </div>
      <h3 className="text-sm font-semibold text-[#18191C]">{title}</h3>
      {description && (
        <p className="text-xs text-[#767F8C] mt-1 max-w-sm">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
