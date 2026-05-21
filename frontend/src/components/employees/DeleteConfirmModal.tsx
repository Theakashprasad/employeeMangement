import { Loader2 } from "lucide-react";
import type { Employee } from "@/services/employee.service";

interface DeleteConfirmModalProps {
  employee: Employee | null;
  open: boolean;
  loading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteConfirmModal({
  employee,
  open,
  loading,
  onClose,
  onConfirm,
}: DeleteConfirmModalProps) {
  if (!open || !employee) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <h2 className="text-lg font-semibold text-[#18191C]">Delete Employee</h2>
        <p className="text-sm text-[#767F8C] mt-2">
          Are you sure you want to delete{" "}
          <strong className="text-[#18191C]">{employee.name}</strong>? This action
          cannot be undone.
        </p>
        <div className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-2.5 rounded-lg border border-[#E7E7E7] text-sm font-medium hover:bg-[#F7F8FA]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2.5 rounded-lg bg-red-500 text-white text-sm font-semibold hover:bg-red-600 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Deleting...
              </>
            ) : (
              "Delete"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
