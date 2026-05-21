import { http } from "./http";

export type EmployeeStatus = "Active" | "Inactive" | "On Leave";

export interface Employee {
  _id: string;
  name: string;
  email: string;
  department: string;
  designation: string;
  status: EmployeeStatus;
  joiningDate: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface EmployeeFormData {
  name: string;
  email: string;
  department: string;
  designation: string;
  status: EmployeeStatus;
  joiningDate: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface EmployeesListResponse {
  employees: Employee[];
  pagination: PaginationMeta;
}

export interface EmployeeQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  department?: string;
  status?: string;
}

export interface AnalyticsData {
  totalEmployees: number;
  activeEmployees: number;
  inactiveEmployees: number;
  departmentWise: { department: string; count: number }[];
  statusDistribution: { status: string; count: number }[];
  monthlyJoined: { label: string; year: number; month: number; count: number }[];
}

export const DEPARTMENTS = [
  "Engineering",
  "Product",
  "Design",
  "Marketing",
  "Sales",
  "HR & Ops",
] as const;

export const STATUSES: EmployeeStatus[] = ["Active", "Inactive", "On Leave"];

export async function fetchEmployees(
  params: EmployeeQueryParams,
): Promise<EmployeesListResponse> {
  const { data } = await http.get<EmployeesListResponse>("/employees", { params });
  return data;
}

export async function fetchAnalytics(): Promise<AnalyticsData> {
  const { data } = await http.get<AnalyticsData>("/employees/analytics");
  return data;
}

export async function createEmployee(
  payload: EmployeeFormData,
): Promise<Employee> {
  const { data } = await http.post<Employee>("/employees", payload);
  return data;
}

export async function updateEmployee(
  id: string,
  payload: Partial<EmployeeFormData>,
): Promise<Employee> {
  const { data } = await http.put<Employee>(`/employees/${id}`, payload);
  return data;
}

export async function deleteEmployee(id: string): Promise<void> {
  await http.delete(`/employees/${id}`);
}
