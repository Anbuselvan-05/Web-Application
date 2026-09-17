import React, { useState, useEffect } from 'react';
import {
  Save,
  X,
  RotateCcw,
  AlertCircle,
  CheckCircle2,
  Building2,
  User,
  Mail,
  Phone,
  DollarSign,
  Calendar,
  Briefcase,
  MapPin,
  ShieldAlert
} from 'lucide-react';
import { Employee, EmployeeFormData } from '../types';

interface EmployeeFormProps {
  initialData?: Employee | null;
  onSubmit: (data: EmployeeFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
  existingEmployees?: Employee[];
}

const DEPARTMENTS = [
  'Engineering',
  'Human Resources',
  'Finance',
  'Marketing',
  'Sales',
  'Design',
  'Operations',
];

const EMPLOYMENT_TYPES: Array<'Full-time' | 'Part-time' | 'Intern'> = [
  'Full-time',
  'Part-time',
  'Intern',
];

const INITIAL_STATE: EmployeeFormData = {
  employee_id: '',
  full_name: '',
  email: '',
  phone: '',
  department: 'Engineering',
  designation: '',
  salary: 50000,
  date_of_joining: new Date().toISOString().split('T')[0],
  employment_type: 'Full-time',
  address: '',
  status: 'Active',
};

export const EmployeeForm: React.FC<EmployeeFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting,
  existingEmployees = [],
}) => {
  const isEditing = !!initialData;
  const [formData, setFormData] = useState<EmployeeFormData>(INITIAL_STATE);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        employee_id: initialData.employee_id,
        full_name: initialData.full_name,
        email: initialData.email,
        phone: initialData.phone,
        department: initialData.department,
        designation: initialData.designation,
        salary: initialData.salary,
        date_of_joining: initialData.date_of_joining,
        employment_type: initialData.employment_type,
        address: initialData.address || '',
        status: initialData.status,
      });
    } else {
      // Auto generate a suggested next employee ID
      const count = existingEmployees.length + 1;
      const suggestedId = `EMP${count.toString().padStart(3, '0')}`;
      setFormData((prev) => ({
        ...prev,
        employee_id: suggestedId,
      }));
    }
  }, [initialData, existingEmployees.length]);

  const validate = (): boolean => {
    const errors: Record<string, string> = {};

    // 1. Employee ID
    if (!formData.employee_id.trim()) {
      errors.employee_id = 'Employee ID is required (e.g. EMP001).';
    } else {
      const dup = existingEmployees.find(
        (e) =>
          e.employee_id.toUpperCase() === formData.employee_id.trim().toUpperCase() &&
          e.id !== initialData?.id
      );
      if (dup) {
        errors.employee_id = 'This Employee ID is already assigned to another staff member.';
      }
    }

    // 2. Full Name
    if (!formData.full_name.trim()) {
      errors.full_name = 'Full Name is required.';
    } else if (formData.full_name.trim().length < 2) {
      errors.full_name = 'Full Name must be at least 2 characters.';
    }

    // 3. Email
    if (!formData.email.trim()) {
      errors.email = 'Email address is required.';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        errors.email = 'Please enter a valid email format (e.g. user@example.com).';
      } else {
        const dupEmail = existingEmployees.find(
          (e) =>
            e.email.toLowerCase() === formData.email.trim().toLowerCase() &&
            e.id !== initialData?.id
        );
        if (dupEmail) {
          errors.email = 'This email is already registered to another employee.';
        }
      }
    }

    // 4. Phone
    if (!formData.phone.trim()) {
      errors.phone = 'Contact phone number is required.';
    } else {
      const digits = formData.phone.replace(/[\s\-()]/g, '');
      if (!/^\+?[0-9]{7,15}$/.test(digits)) {
        errors.phone = 'Phone number must have between 7 and 15 digits.';
      }
    }

    // 5. Department
    if (!formData.department) {
      errors.department = 'Department is required.';
    }

    // 6. Designation
    if (!formData.designation.trim()) {
      errors.designation = 'Job designation / title is required.';
    }

    // 7. Salary
    if (!formData.salary || Number(formData.salary) <= 0) {
      errors.salary = 'Salary must be a positive number greater than 0.';
    }

    // 8. Date of Joining
    if (!formData.date_of_joining) {
      errors.date_of_joining = 'Date of Joining is required.';
    }

    // 9. Employment Type
    if (!formData.employment_type) {
      errors.employment_type = 'Employment type must be selected.';
    }

    // 10. Status
    if (!formData.status) {
      errors.status = 'Status must be selected.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'salary' ? (value === '' ? '' : Number(value)) : value,
    }));

    if (formErrors[name]) {
      setFormErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validate()) {
      return;
    }

    try {
      await onSubmit(formData);
    } catch (err: any) {
      if (err.data && typeof err.data === 'object') {
        const backendErrors: Record<string, string> = {};
        for (const [key, messages] of Object.entries(err.data)) {
          backendErrors[key] = Array.isArray(messages) ? messages.join(' ') : String(messages);
        }
        setFormErrors(backendErrors);
        setServerError('Validation failed. Please review the highlighted fields below.');
      } else {
        setServerError(err.message || 'An error occurred while saving employee record.');
      }
    }
  };

  const handleReset = () => {
    if (isEditing && initialData) {
      setFormData({
        employee_id: initialData.employee_id,
        full_name: initialData.full_name,
        email: initialData.email,
        phone: initialData.phone,
        department: initialData.department,
        designation: initialData.designation,
        salary: initialData.salary,
        date_of_joining: initialData.date_of_joining,
        employment_type: initialData.employment_type,
        address: initialData.address || '',
        status: initialData.status,
      });
    } else {
      setFormData(INITIAL_STATE);
    }
    setFormErrors({});
    setServerError(null);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm max-w-4xl mx-auto overflow-hidden">
      {/* Header */}
      <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            {isEditing ? `Edit Employee (${initialData.employee_id})` : 'Add New Employee'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {isEditing
              ? 'Update the fields below and submit to save changes to the SQLite database via REST API.'
              : 'Complete all required fields below to register a new employee in the company database.'}
          </p>
        </div>
        <button
          onClick={onCancel}
          className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200/60 transition-colors"
          title="Close Form"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Server Error Alert */}
      {serverError && (
        <div className="m-6 mb-0 p-4 bg-rose-50 border border-rose-200 rounded-lg flex items-start gap-3 text-rose-800 text-sm">
          <ShieldAlert className="w-5 h-5 shrink-0 text-rose-600 mt-0.5" />
          <div>
            <p className="font-semibold">Backend Error</p>
            <p className="text-xs text-rose-700 mt-0.5">{serverError}</p>
          </div>
        </div>
      )}

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Section 1: Identification & Personal Info */}
        <div>
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 pb-1 border-b border-slate-100 flex items-center gap-2">
            <User className="w-3.5 h-3.5 text-indigo-600" />
            1. Personal & Identification Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Employee ID */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Employee ID <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="employee_id"
                id="form-employee-id"
                value={formData.employee_id}
                onChange={handleChange}
                placeholder="e.g. EMP001"
                className={`w-full px-3 py-2 text-sm rounded-lg border font-mono uppercase ${
                  formErrors.employee_id
                    ? 'border-rose-400 focus:ring-rose-500 focus:border-rose-500 bg-rose-50/30'
                    : 'border-slate-300 focus:ring-indigo-500 focus:border-indigo-500'
                }`}
              />
              {formErrors.employee_id && (
                <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  {formErrors.employee_id}
                </p>
              )}
            </div>

            {/* Full Name */}
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="full_name"
                id="form-full-name"
                value={formData.full_name}
                onChange={handleChange}
                placeholder="e.g. Aarav Sharma"
                className={`w-full px-3 py-2 text-sm rounded-lg border ${
                  formErrors.full_name
                    ? 'border-rose-400 focus:ring-rose-500 focus:border-rose-500 bg-rose-50/30'
                    : 'border-slate-300 focus:ring-indigo-500 focus:border-indigo-500'
                }`}
              />
              {formErrors.full_name && (
                <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  {formErrors.full_name}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  name="email"
                  id="form-email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@company.com"
                  className={`w-full pl-9 pr-3 py-2 text-sm rounded-lg border ${
                    formErrors.email
                      ? 'border-rose-400 focus:ring-rose-500 focus:border-rose-500 bg-rose-50/30'
                      : 'border-slate-300 focus:ring-indigo-500 focus:border-indigo-500'
                  }`}
                />
              </div>
              {formErrors.email && (
                <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  {formErrors.email}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Contact Phone <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  name="phone"
                  id="form-phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="9876543210"
                  className={`w-full pl-9 pr-3 py-2 text-sm rounded-lg border ${
                    formErrors.phone
                      ? 'border-rose-400 focus:ring-rose-500 focus:border-rose-500 bg-rose-50/30'
                      : 'border-slate-300 focus:ring-indigo-500 focus:border-indigo-500'
                  }`}
                />
              </div>
              {formErrors.phone && (
                <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  {formErrors.phone}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Section 2: Role & Employment Details */}
        <div>
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 pb-1 border-b border-slate-100 flex items-center gap-2">
            <Briefcase className="w-3.5 h-3.5 text-indigo-600" />
            2. Department, Role & Compensation
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Department */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Department <span className="text-rose-500">*</span>
              </label>
              <select
                name="department"
                id="form-department"
                value={formData.department}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            {/* Designation */}
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Designation / Job Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="designation"
                id="form-designation"
                value={formData.designation}
                onChange={handleChange}
                placeholder="e.g. Senior Software Engineer"
                className={`w-full px-3 py-2 text-sm rounded-lg border ${
                  formErrors.designation
                    ? 'border-rose-400 focus:ring-rose-500 focus:border-rose-500 bg-rose-50/30'
                    : 'border-slate-300 focus:ring-indigo-500 focus:border-indigo-500'
                }`}
              />
              {formErrors.designation && (
                <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  {formErrors.designation}
                </p>
              )}
            </div>

            {/* Salary */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Salary (₹ Monthly / Annual) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="text-slate-400 absolute left-3 top-2 text-sm font-semibold">₹</span>
                <input
                  type="number"
                  name="salary"
                  id="form-salary"
                  min="1"
                  step="500"
                  value={formData.salary}
                  onChange={handleChange}
                  placeholder="50000"
                  className={`w-full pl-8 pr-3 py-2 text-sm rounded-lg border ${
                    formErrors.salary
                      ? 'border-rose-400 focus:ring-rose-500 focus:border-rose-500 bg-rose-50/30'
                      : 'border-slate-300 focus:ring-indigo-500 focus:border-indigo-500'
                  }`}
                />
              </div>
              {formErrors.salary && (
                <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  {formErrors.salary}
                </p>
              )}
            </div>

            {/* Date of Joining */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Date of Joining <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  name="date_of_joining"
                  id="form-date-of-joining"
                  value={formData.date_of_joining}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 text-sm rounded-lg border ${
                    formErrors.date_of_joining
                      ? 'border-rose-400 focus:ring-rose-500 focus:border-rose-500 bg-rose-50/30'
                      : 'border-slate-300 focus:ring-indigo-500 focus:border-indigo-500'
                  }`}
                />
              </div>
              {formErrors.date_of_joining && (
                <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  {formErrors.date_of_joining}
                </p>
              )}
            </div>

            {/* Employment Type */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Employment Type <span className="text-rose-500">*</span>
              </label>
              <select
                name="employment_type"
                id="form-employment-type"
                value={formData.employment_type}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
              >
                {EMPLOYMENT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Status & Address */}
        <div>
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 pb-1 border-b border-slate-100 flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-indigo-600" />
            3. Employment Status & Location
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Status */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Status <span className="text-rose-500">*</span>
              </label>
              <select
                name="status"
                id="form-status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              <p className="text-[11px] text-slate-400 mt-1">
                Active employees count towards current operational payroll.
              </p>
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Address
              </label>
              <textarea
                name="address"
                id="form-address"
                rows={2}
                value={formData.address}
                onChange={handleChange}
                placeholder="Residential address / city, state"
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-slate-200 flex flex-col-reverse sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            id="form-clear-btn"
            onClick={handleReset}
            disabled={isSubmitting}
            className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors inline-flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4 text-slate-400" />
            <span>{isEditing ? 'Revert Form' : 'Clear Form'}</span>
          </button>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              id="form-cancel-btn"
              onClick={onCancel}
              disabled={isSubmitting}
              className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="form-submit-btn"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-5 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors inline-flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving to SQLite...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{isEditing ? 'Update Employee' : 'Submit & Save Employee'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
