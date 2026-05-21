import { AlertCircle } from "lucide-react";

export default function ErrorAlert({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex items-start gap-3 p-4 rounded-lg bg-red-50 border border-red-200">
      <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={18} />
      <div className="flex-1">
        <p className="text-sm text-red-700">{message}</p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="text-xs font-semibold text-red-600 hover:underline mt-1"
          >
            Try again
          </button>
        )}
      </div>
    </div>
  );
}
