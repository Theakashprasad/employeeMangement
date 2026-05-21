import { Loader2 } from "lucide-react";

export default function LoadingSpinner({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <Loader2 className="animate-spin text-[#0A65CC]" size={32} />
      <p className="text-sm text-[#767F8C]">{label}</p>
    </div>
  );
}
