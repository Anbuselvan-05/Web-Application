import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  Plus,
  LayoutGrid,
  Table as TableIcon,
  Download,
  AlertCircle,
  RefreshCw,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Briefcase,
  Calendar,
  Building2,
  Mail,
  Phone
} from 'lucide-react';
import { Employee, EmployeeFilterOptions } from '../types';
import { EmployeeCard } from './EmployeeCard';

interface EmployeeListProps {
  employees: Employee[];
  isLoading: boolean;
  error: string | null;
  onRefresh: () => void;
  onAddNew: () => void;
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
}

export const EmployeeList: React.FC<EmployeeListProps> = ({
  employees,
  isLoading,
  error,
  onRefresh,
  onAddNew,
  onEdit,
  onDelete,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [sortBy, setSortBy] = useState<'full_name' | 'date_of_joining' | 'salary' | 'employee_id'>('full_name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  // Extract unique departments
  const departments = useMemo(() => {
    const list = Array.from(new Set(employees.map((e) => e.department).filter(Boolean)));
    return ['All', ...list.sort()];
  }, [employees]);

  // Client-side filtering & sorting
  const filteredEmployees = useMemo(() => {
    return employees
      .filter((emp) => {
        // Search filter (Employee ID, Full Name, Email)
        const q = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !q ||
          emp.employee_id.toLowerCase().includes(q) ||
          emp.full_name.toLowerCase().includes(q) ||
          emp.email.toLowerCase().includes(q) ||
          emp.department.toLowerCase().includes(q) ||
          emp.designation.toLowerCase().includes(q);

        // Department filter
        const matchesDept =
          selectedDepartment === 'All' ||
          emp.department.toLowerCase() === selectedDepartment.toLowerCase();

        // Status filter
        const matchesStatus =
          selectedStatus === 'All' ||
          emp.status.toLowerCase() === selectedStatus.toLowerCase();

        return matchesSearch && matchesDept && matchesStatus;
      })
      .sort((a, b) => {
        let valA = a[sortBy];
        let valB = b[sortBy];

        if (typeof valA === 'string') valA = valA.toLowerCase();
        if (typeof valB === 'string') valB = valB.toLowerCase();

        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
  }, [employees, searchQuery, selectedDepartment, selectedStatus, sortBy, sortOrder]);

  const toggleSort = (field: 'full_name' | 'date_of_joining' | 'salary' | 'employee_id') => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  // Export to CSV helper
  const exportToCSV = () => {
    if (filteredEmployees.length === 0) return;

    const headers = [
      'Employee ID',
      'Full Name',
      'Email',
      'Phone',
      'Department',
      'Designation',
      'Salary',
      'Date of Joining',
      'Employment Type',
      'Status',
      'Address',
    ];

    const rows = filteredEmployees.map((e) => [
      e.employee_id,
      `"${e.full_name.replace(/"/g, '""')}"`,
      e.email,
      e.phone,
      e.department,
      `"${e.designation.replace(/"/g, '""')}"`,
      e.salary,
      e.date_of_joining,
      e.employment_type,
      e.status,
      `"${(e.address || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `employees_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-5">
      {/* Header & Primary Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Employee Directory</h1>
          <p className="text-xs text-slate-500 mt-1">
            Displaying {filteredEmployees.length} of {employees.length} records from SQLite database
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="emp-list-export-btn"
            onClick={exportToCSV}
            disabled={filteredEmployees.length === 0}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 transition-colors disabled:opacity-50"
            title="Download CSV table export"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>

          <button
            id="emp-list-refresh-btn"
            onClick={onRefresh}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 transition-colors"
            title="Refresh from API"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            id="emp-list-add-btn"
            onClick={onAddNew}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Employee</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search Box */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            id="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ID, Name, Email..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2 text-xs text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filters and View Toggle */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Department Filter */}
          <div className="flex items-center gap-1.5">
            <label htmlFor="dept-filter" className="text-xs text-slate-500 whitespace-nowrap">
              Dept:
            </label>
            <select
              id="dept-filter"
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white text-slate-700 focus:ring-indigo-500"
            >
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5">
            <label htmlFor="status-filter" className="text-xs text-slate-500 whitespace-nowrap">
              Status:
            </label>
            <select
              id="status-filter"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white text-slate-700 focus:ring-indigo-500"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-1.5">
            <label htmlFor="sort-select" className="text-xs text-slate-500 whitespace-nowrap">
              Sort:
            </label>
            <select
              id="sort-select"
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [f, o] = e.target.value.split('-') as [any, any];
                setSortBy(f);
                setSortOrder(o);
              }}
              className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white text-slate-700 focus:ring-indigo-500"
            >
              <option value="full_name-asc">Name (A-Z)</option>
              <option value="full_name-desc">Name (Z-A)</option>
              <option value="date_of_joining-desc">Joining Date (Newest)</option>
              <option value="date_of_joining-asc">Joining Date (Oldest)</option>
              <option value="salary-desc">Salary (Highest)</option>
              <option value="salary-asc">Salary (Lowest)</option>
              <option value="employee_id-asc">Employee ID</option>
            </select>
          </div>

          {/* Layout Toggle (Table vs Cards) */}
          <div className="border-l border-slate-200 pl-2 flex items-center gap-1">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'table'
                  ? 'bg-slate-200 text-slate-800'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Table view"
            >
              <TableIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'cards'
                  ? 'bg-slate-200 text-slate-800'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Card grid view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
          <button
            onClick={onRefresh}
            className="font-medium underline hover:text-rose-900"
          >
            Retry Fetch
          </button>
        </div>
      )}

      {/* Loading indicator */}
      {isLoading ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <div className="w-8 h-8 border-3 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
          <p className="mt-3 text-xs text-slate-500 font-medium">Fetching employee records from Django REST API...</p>
        </div>
      ) : filteredEmployees.length === 0 ? (
        /* Empty State */
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">No employees match your search</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {searchQuery || selectedDepartment !== 'All' || selectedStatus !== 'All'
              ? 'Try changing or clearing your search filters to find matching employee records.'
              : 'There are currently no employee records in the SQLite database.'}
          </p>
          <div className="mt-4 flex items-center justify-center gap-3">
            {(searchQuery || selectedDepartment !== 'All' || selectedStatus !== 'All') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedDepartment('All');
                  setSelectedStatus('All');
                }}
                className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 border border-slate-300 rounded-lg hover:bg-slate-50"
              >
                Reset Filters
              </button>
            )}
            <button
              onClick={onAddNew}
              className="px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
            >
              Add New Employee
            </button>
          </div>
        </div>
      ) : viewMode === 'cards' ? (
        /* Cards Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEmployees.map((employee) => (
            <EmployeeCard
              key={employee.id}
              employee={employee}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      ) : (
        /* Responsive Table View */
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 text-slate-600 uppercase font-semibold border-b border-slate-200">
                <tr>
                  <th
                    onClick={() => toggleSort('employee_id')}
                    className="px-4 py-3 cursor-pointer hover:bg-slate-100/70 transition-colors"
                  >
                    <div className="flex items-center gap-1">
                      <span>ID</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th
                    onClick={() => toggleSort('full_name')}
                    className="px-4 py-3 cursor-pointer hover:bg-slate-100/70 transition-colors"
                  >
                    <div className="flex items-center gap-1">
                      <span>Full Name & Contact</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="px-4 py-3">Department</th>
                  <th className="px-4 py-3">Designation</th>
                  <th className="px-4 py-3">Type</th>
                  <th
                    onClick={() => toggleSort('salary')}
                    className="px-4 py-3 cursor-pointer hover:bg-slate-100/70 transition-colors"
                  >
                    <div className="flex items-center gap-1">
                      <span>Salary</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th
                    onClick={() => toggleSort('date_of_joining')}
                    className="px-4 py-3 cursor-pointer hover:bg-slate-100/70 transition-colors"
                  >
                    <div className="flex items-center gap-1">
                      <span>Joining Date</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3 font-mono font-medium text-slate-800 text-xs">
                      {emp.employee_id}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-900">{emp.full_name}</div>
                      <div className="text-[11px] text-slate-500">{emp.email} • {emp.phone}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700">
                        {emp.department}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-700">{emp.designation}</td>
                    <td className="px-4 py-3 text-slate-600 text-[11px]">{emp.employment_type}</td>
                    <td className="px-4 py-3 font-medium text-slate-900">
                      ₹{Number(emp.salary).toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{emp.date_of_joining}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
                          emp.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}
                      >
                        {emp.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          id={`edit-btn-${emp.id}`}
                          onClick={() => onEdit(emp)}
                          className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-md transition-colors"
                          title="Edit Employee"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          id={`delete-btn-${emp.id}`}
                          onClick={() => onDelete(emp)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                          title="Delete Employee"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
