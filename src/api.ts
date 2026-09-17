import { Employee, EmployeeFormData, EmployeeFilterOptions, DashboardStats } from './types';

const API_BASE_URL = '/api';

/**
 * Handle API error responses from Django REST Framework.
 * DRF typically returns:
 * - 400 Bad Request: { field_name: ["Error message 1", ...], ... } or { detail: "..." }
 * - 404 Not Found: { detail: "Not found." }
 * - 500 Internal Server Error
 */
export async function handleApiResponse<T>(response: Response): Promise<T> {
  if (response.status === 204) {
    return {} as T;
  }

  const contentType = response.headers.get('content-type');
  const isJson = contentType && contentType.includes('application/json');
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const error: any = new Error(
      (data && typeof data === 'object' && (data.detail || data.message)) ||
      `HTTP error! status: ${response.status}`
    );
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data as T;
}

/**
 * Fetch all employees with optional query filters (search, department, status, ordering).
 * Corresponds to: GET /api/employees/
 */
export async function getEmployees(filters?: Partial<EmployeeFilterOptions>): Promise<Employee[]> {
  const params = new URLSearchParams();
  if (filters?.search) params.append('search', filters.search);
  if (filters?.department && filters.department !== 'All') params.append('department', filters.department);
  if (filters?.status && filters.status !== 'All') params.append('status', filters.status);
  if (filters?.sortBy) {
    const prefix = filters.sortOrder === 'desc' ? '-' : '';
    params.append('ordering', `${prefix}${filters.sortBy}`);
  }

  const queryString = params.toString() ? `?${params.toString()}` : '';
  const response = await fetch(`${API_BASE_URL}/employees/${queryString}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  });

  return handleApiResponse<Employee[]>(response);
}

/**
 * Fetch a single employee by their auto-incremented primary key.
 * Corresponds to: GET /api/employees/{id}/
 */
export async function getEmployeeById(id: number): Promise<Employee> {
  const response = await fetch(`${API_BASE_URL}/employees/${id}/`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  });

  return handleApiResponse<Employee>(response);
}

/**
 * Create a new employee record.
 * Corresponds to: POST /api/employees/
 */
export async function createEmployee(data: EmployeeFormData): Promise<Employee> {
  const response = await fetch(`${API_BASE_URL}/employees/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(data),
  });

  return handleApiResponse<Employee>(response);
}

/**
 * Update an existing employee record completely.
 * Corresponds to: PUT /api/employees/{id}/
 */
export async function updateEmployee(id: number, data: EmployeeFormData): Promise<Employee> {
  const response = await fetch(`${API_BASE_URL}/employees/${id}/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(data),
  });

  return handleApiResponse<Employee>(response);
}

/**
 * Delete an employee record from the database.
 * Corresponds to: DELETE /api/employees/{id}/
 */
export async function deleteEmployee(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/employees/${id}/`, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
    },
  });

  return handleApiResponse<void>(response);
}

/**
 * Fetch aggregated statistics for the HR dashboard summary cards.
 * Corresponds to: GET /api/stats/
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  const response = await fetch(`${API_BASE_URL}/stats/`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  });

  return handleApiResponse<DashboardStats>(response);
}

/**
 * Reset database to default sample records (useful for viva demonstration).
 * Corresponds to: POST /api/reset-sample-data/
 */
export async function resetSampleData(): Promise<{ message: string; count: number }> {
  const response = await fetch(`${API_BASE_URL}/reset-sample-data/`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
    },
  });

  return handleApiResponse<{ message: string; count: number }>(response);
}
