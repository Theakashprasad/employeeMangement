import { useEffect, useState } from "react";
import { X, Loader2 } from "lucide-react";
import {
  DEPARTMENTS,
  STATUSES,
  type Employee,
  type EmployeeFormData,
  type EmployeeStatus,
} from "@/services/employee.service";

interface EmployeeFormModalProps {
  open: boolean;
  employee?: Employee | null;
  onClose: () => void;
  onSubmit: (data: EmployeeFormData) => Promise<void>;
}

const emptyForm: EmployeeFormData = {
  name: "",
  email: "",
  department: DEPARTMENTS[0],
  designation: "",
  status: "Active",
  joiningDate: new Date().toISOString().split("T")[0],
};

export default function EmployeeFormModal({
  open,
  employee,
  onClose,
  onSubmit,
}: EmployeeFormModalProps) {
  const [form, setForm] = useState<EmployeeFormData>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (employee) {
      setForm({
        name: employee.name,
        email: employee.email,
        department: employee.department,
        designation: employee.designation,
        status: employee.status,
        joiningDate: employee.joiningDate.split("T")[0],
      });
    } else {
      setForm(emptyForm);
    }
    setErrors({});
  }, [employee, open]);

  if (!open) return null;

  const validate = () => {
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = "Name is required";
    if (!form.email.trim()) next.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      next.email = "Invalid email";
    if (!form.department) next.department = "Department is required";
    if (!form.designation.trim()) next.designation = "Designation is required";
    if (!form.joiningDate) next.joiningDate = "Joining date is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await onSubmit(form);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E7E7E7]">
          <h2 className="text-lg font-semibold text-[#18191C]">
            {employee ? "Edit Employee" : "Add Employee"}
          </h2>
          <button type="button" onClick={onClose} className="text-[#767F8C] hover:text-[#18191C]">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
          <Field label="Employee Name" error={errors.name}>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={inputClass(errors.name)}
            />
          </Field>

          <Field label="Email" error={errors.email}>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={inputClass(errors.email)}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Department" error={errors.department}>
              <select
                value={form.department}
                onChange={(e) => setForm({ ...form, department: e.target.value })}
                className={inputClass(errors.department)}
              >
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Status" error={errors.status}>
              <select
                value={form.status}
                onChange={(e) =>
                  setForm({ ...form, status: e.target.value as EmployeeStatus })
                }
                className={inputClass()}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Designation" error={errors.designation}>
            <input
              value={form.designation}
              onChange={(e) => setForm({ ...form, designation: e.target.value })}
              className={inputClass(errors.designation)}
            />
          </Field>

          <Field label="Joining Date" error={errors.joiningDate}>
            <input
              type="date"
              value={form.joiningDate}
              onChange={(e) => setForm({ ...form, joiningDate: e.target.value })}
              className={inputClass(errors.joiningDate)}
            />
          </Field>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg border border-[#E7E7E7] text-sm font-medium text-[#474C54] hover:bg-[#F7F8FA]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-2.5 rounded-lg bg-[#0A65CC] text-white text-sm font-semibold hover:bg-[#0855B0] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Saving...
                </>
              ) : employee ? (
                "Update"
              ) : (
                "Create"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-[#474C54] mb-1.5">{label}</label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

function inputClass(error?: string) {
  return `w-full border rounded-lg px-3 py-2.5 text-sm text-[#18191C] focus:outline-none focus:ring-2 focus:ring-[#0A65CC]/20 focus:border-[#0A65CC] ${
    error ? "border-red-300" : "border-[#E7E7E7]"
  }`;
}
