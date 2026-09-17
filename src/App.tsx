import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { EmployeeList } from './components/EmployeeList';
import { EmployeeForm } from './components/EmployeeForm';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { PostmanTestSuite } from './components/PostmanTestSuite';
import { ProjectReportViewer } from './components/ProjectReportViewer';
import { DjangoCodeViewer } from './components/DjangoCodeViewer';
import {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getDashboardStats,
  resetSampleData,
} from './api';
import { Employee, EmployeeFormData, DashboardStats } from './types';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [apiError, setApiError] = useState<string | null>(null);

  // Form editing state
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [isSubmittingForm, setIsSubmittingForm] = useState<boolean>(false);

  // Deletion modal state
  const [deletingEmployee, setDeletingEmployee] = useState<Employee | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Resetting state
  const [isResetting, setIsResetting] = useState<boolean>(false);

  // Toast notification state
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Fetch employees and stats
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setApiError(null);
    try {
      const [empData, statsData] = await Promise.all([
        getEmployees(),
        getDashboardStats().catch(() => null),
      ]);
      setEmployees(empData);
      setStats(statsData);
    } catch (err: any) {
      console.error('API fetch error:', err);
      setApiError(err.message || 'Failed to connect to backend REST API.');
      showToast('Could not connect to Django backend. Check connection.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle Add Employee (CREATE)
  const handleCreate = async (formData: EmployeeFormData) => {
    setIsSubmittingForm(true);
    try {
      const newEmp = await createEmployee(formData);
      showToast(`Employee ${newEmp.full_name} (${newEmp.employee_id}) created successfully!`);
      await fetchData();
      setCurrentTab('employees');
    } finally {
      setIsSubmittingForm(false);
    }
  };

  // Handle Edit Employee (UPDATE)
  const handleUpdate = async (formData: EmployeeFormData) => {
    if (!editingEmployee) return;
    setIsSubmittingForm(true);
    try {
      const updated = await updateEmployee(editingEmployee.id, formData);
      showToast(`Employee ${updated.full_name} updated successfully!`);
      setEditingEmployee(null);
      await fetchData();
      setCurrentTab('employees');
    } finally {
      setIsSubmittingForm(false);
    }
  };

  // Handle Delete Employee (DELETE)
  const handleDeleteConfirm = async (emp: Employee) => {
    setIsDeleting(true);
    try {
      await deleteEmployee(emp.id);
      showToast(`Employee ${emp.full_name} (${emp.employee_id}) removed from database.`);
      setIsDeleteModalOpen(false);
      setDeletingEmployee(null);
      await fetchData();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete employee.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // Trigger Edit from Table or Card
  const handleStartEdit = (emp: Employee) => {
    setEditingEmployee(emp);
    setCurrentTab('edit');
  };

  // Trigger Delete Modal
  const handleStartDelete = (emp: Employee) => {
    setDeletingEmployee(emp);
    setIsDeleteModalOpen(true);
  };

  // Reset database to sample records
  const handleReset = async () => {
    setIsResetting(true);
    try {
      const res = await resetSampleData();
      showToast(res.message || 'Database reset to sample records.');
      await fetchData();
    } catch (err: any) {
      showToast('Error resetting database.', 'error');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 animate-in slide-in-from-bottom-5 fade-in duration-200">
          <div
            className={`flex items-center gap-2.5 px-4 py-3 rounded-lg shadow-lg border text-sm font-medium ${
              toast.type === 'success'
                ? 'bg-emerald-900 text-white border-emerald-700'
                : 'bg-rose-900 text-white border-rose-700'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span>{toast.message}</span>
            <button
              onClick={() => setToast(null)}
              className="ml-2 text-slate-400 hover:text-white p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Primary Top Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onResetData={handleReset}
        isResetting={isResetting}
      />

      {/* Main Layout: Sidebar + Viewport */}
      <div className="flex-1 flex flex-col lg:flex-row max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 gap-6">
        {/* Navigation Sidebar */}
        <Sidebar
          currentTab={currentTab}
          setCurrentTab={(tab) => {
            if (tab === 'add') {
              setEditingEmployee(null);
            }
            setCurrentTab(tab);
          }}
          employeeCount={employees.length}
        />

        {/* Dynamic Main Workspace View */}
        <main className="flex-1 min-w-0">
          {currentTab === 'dashboard' && (
            <Dashboard
              stats={stats}
              employees={employees}
              isLoading={isLoading}
              onNavigate={(tab) => {
                if (tab === 'add') setEditingEmployee(null);
                setCurrentTab(tab);
              }}
              onSelectEmployee={handleStartEdit}
            />
          )}

          {currentTab === 'employees' && (
            <EmployeeList
              employees={employees}
              isLoading={isLoading}
              error={apiError}
              onRefresh={fetchData}
              onAddNew={() => {
                setEditingEmployee(null);
                setCurrentTab('add');
              }}
              onEdit={handleStartEdit}
              onDelete={handleStartDelete}
            />
          )}

          {currentTab === 'add' && (
            <EmployeeForm
              initialData={null}
              onSubmit={handleCreate}
              onCancel={() => setCurrentTab('employees')}
              isSubmitting={isSubmittingForm}
              existingEmployees={employees}
            />
          )}

          {currentTab === 'edit' && (
            <EmployeeForm
              initialData={editingEmployee}
              onSubmit={handleUpdate}
              onCancel={() => {
                setEditingEmployee(null);
                setCurrentTab('employees');
              }}
              isSubmitting={isSubmittingForm}
              existingEmployees={employees}
            />
          )}

          {currentTab === 'tests' && <PostmanTestSuite />}

          {currentTab === 'report' && <ProjectReportViewer />}

          {currentTab === 'code' && <DjangoCodeViewer />}
        </main>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        employee={deletingEmployee}
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingEmployee(null);
        }}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />
    </div>
  );
}
