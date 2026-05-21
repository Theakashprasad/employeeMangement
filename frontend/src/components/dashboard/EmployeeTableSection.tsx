import { useEffect, useState, useCallback } from "react";
import { Plus, Pencil, Trash2, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { useDebounce } from "@/hooks/useDebounce";
import {
  fetchEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  DEPARTMENTS,
  STATUSES,
  type Employee,
  type EmployeeFormData,
  type PaginationMeta,
} from "@/services/employee.service";
import EmployeeFormModal from "@/components/employees/EmployeeFormModal";
import DeleteConfirmModal from "@/components/employees/DeleteConfirmModal";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import EmptyState from "@/components/ui/EmptyState";
import ErrorAlert from "@/components/ui/ErrorAlert";

interface EmployeeTableSectionProps {
  refreshKey?: number;
  onEmployeesChanged?: () => void;
}

const STATUS_STYLES: Record<string, string> = {
  Active: "bg-green-50 text-green-700 border-green-100",
  Inactive: "bg-gray-100 text-gray-600 border-gray-200",
  "On Leave": "bg-amber-50 text-amber-700 border-amber-100",
};

export default function EmployeeTableSection({
  refreshKey = 0,
  onEmployeesChanged,
}: EmployeeTableSectionProps) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [page, setPage] = useState(1);
  const limit = 10;
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All");
  const [status, setStatus] = useState("All");
  const debouncedSearch = useDebounce(search);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Employee | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Employee | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadEmployees = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchEmployees({
        page,
        limit,
        search: debouncedSearch || undefined,
        department: department !== "All" ? department : undefined,
        status: status !== "All" ? status : undefined,
      });
      setEmployees(res.employees);
      setPagination(res.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load employees");
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedSearch, department, status]);

  useEffect(() => {
    loadEmployees();
  }, [loadEmployees, refreshKey]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, department, status]);

  const handleCreate = async (data: EmployeeFormData) => {
    await createEmployee(data);
    toast.success("Employee created successfully");
    onEmployeesChanged?.();
    await loadEmployees();
  };

  const handleUpdate = async (data: EmployeeFormData) => {
    if (!editing) return;
    await updateEmployee(editing._id, data);
    toast.success("Employee updated successfully");
    onEmployeesChanged?.();
    await loadEmployees();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteEmployee(deleteTarget._id);
      toast.success("Employee deleted");
      setDeleteTarget(null);
      onEmployeesChanged?.();
      await loadEmployees();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <div className="space-y-4" id="employees-section">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-[#18191C]">Employee Listing</h2>
          <p className="text-sm text-[#767F8C]">
            {pagination.total} employee{pagination.total !== 1 ? "s" : ""} total
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#0A65CC] text-white text-sm font-semibold hover:bg-[#0855B0]"
        >
          <Plus size={16} /> Add Employee
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1 relative">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A0A7B4]"
          />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-[#E7E7E7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A65CC]/20"
          />
        </div>
        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="px-3 py-2.5 text-sm border border-[#E7E7E7] rounded-lg bg-white"
        >
          <option value="All">All Departments</option>
          {DEPARTMENTS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="px-3 py-2.5 text-sm border border-[#E7E7E7] rounded-lg bg-white"
        >
          <option value="All">All Status</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white border border-[#E7E7E7] rounded-xl overflow-hidden">
        {error && (
          <div className="p-4">
            <ErrorAlert message={error} onRetry={loadEmployees} />
          </div>
        )}

        {loading ? (
          <LoadingSpinner label="Loading employees..." />
        ) : employees.length === 0 && !error ? (
          <EmptyState
            title="No employees found"
            description="Try adjusting filters or add a new employee."
            action={
              <button
                type="button"
                onClick={() => {
                  setEditing(null);
                  setFormOpen(true);
                }}
                className="text-sm font-semibold text-[#0A65CC] hover:underline"
              >
                Add Employee
              </button>
            }
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#F7F8FA] border-b border-[#E7E7E7]">
                    {[
                      "Employee Name",
                      "Email",
                      "Department",
                      "Designation",
                      "Status",
                      "Joining Date",
                      "Actions",
                    ].map((h) => (
                      <th
                        key={h}
                        className="text-left px-4 py-3 text-xs font-semibold text-[#767F8C] uppercase tracking-wide whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F7F7F8]">
                  {employees.map((emp) => (
                    <tr key={emp._id} className="hover:bg-[#F9FAFB]">
                      <td className="px-4 py-3 font-medium text-[#18191C] whitespace-nowrap">
                        {emp.name}
                      </td>
                      <td className="px-4 py-3 text-[#474C54]">{emp.email}</td>
                      <td className="px-4 py-3 text-[#474C54]">{emp.department}</td>
                      <td className="px-4 py-3 text-[#474C54]">{emp.designation}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex text-[11px] font-semibold px-2.5 py-1 rounded-full border ${
                            STATUS_STYLES[emp.status] ?? ""
                          }`}
                        >
                          {emp.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[#767F8C] whitespace-nowrap">
                        {formatDate(emp.joiningDate)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              setEditing(emp);
                              setFormOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-[#0A65CC] hover:bg-[#E8F1FB]"
                            title="Edit"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(emp)}
                            className="p-1.5 rounded-lg text-red-500 hover:bg-red-50"
                            title="Delete"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-[#E7E7E7]">
                <p className="text-xs text-[#767F8C]">
                  Page {pagination.page} of {pagination.totalPages}
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={pagination.page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="p-2 rounded-lg border border-[#E7E7E7] disabled:opacity-40 hover:bg-[#F7F8FA]"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    type="button"
                    disabled={pagination.page >= pagination.totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    className="p-2 rounded-lg border border-[#E7E7E7] disabled:opacity-40 hover:bg-[#F7F8FA]"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <EmployeeFormModal
        open={formOpen}
        employee={editing}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
        onSubmit={editing ? handleUpdate : handleCreate}
      />

      <DeleteConfirmModal
        open={Boolean(deleteTarget)}
        employee={deleteTarget}
        loading={deleting}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
