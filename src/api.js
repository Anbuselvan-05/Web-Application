/**
 * API client module for frontend communication with Django REST Framework backend.
 * Provides functions for all CRUD operations:
 * - getEmployees()
 * - getEmployeeById(id)
 * - createEmployee(data)
 * - updateEmployee(id, data)
 * - deleteEmployee(id)
 * - getDashboardStats()
 * - resetSampleData()
 */
export * from './api.ts';
