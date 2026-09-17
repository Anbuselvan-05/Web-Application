export interface Employee {
  id: number;
  employee_id: string;
  full_name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  salary: number;
  date_of_joining: string;
  employment_type: 'Full-time' | 'Part-time' | 'Intern';
  address: string;
  status: 'Active' | 'Inactive';
  created_at: string;
}

export type EmployeeFormData = Omit<Employee, 'id' | 'created_at'>;

export interface EmployeeFilterOptions {
  search: string;
  department: string;
  status: string;
  employmentType?: string;
  sortBy: 'full_name' | 'date_of_joining' | 'salary' | 'employee_id' | 'department';
  sortOrder: 'asc' | 'desc';
}

export interface DepartmentSummary {
  name: string;
  count: number;
  activeCount: number;
  avgSalary: number;
}

export interface DashboardStats {
  totalEmployees: number;
  activeEmployees: number;
  inactiveEmployees: number;
  totalSalary: number;
  departments: DepartmentSummary[];
}

export interface ApiValidationError {
  [key: string]: string[] | string;
}

export interface TestCaseResult {
  id: string;
  description: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  endpoint: string;
  payload?: any;
  expectedResult: string;
  expectedStatus: number;
  actualStatus?: number;
  actualResponse?: any;
  status: 'PENDING' | 'PASS' | 'FAIL';
  executionTimeMs?: number;
}
