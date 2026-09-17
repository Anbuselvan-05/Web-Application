import React from 'react';
import {
  Mail,
  Phone,
  Building2,
  Calendar,
  Edit2,
  Trash2,
  MapPin,
  Clock,
  Briefcase
} from 'lucide-react';
import { Employee } from '../types';

interface EmployeeCardProps {
  employee: Employee;
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
  onViewDetails?: (employee: Employee) => void;
}

export const EmployeeCard: React.FC<EmployeeCardProps> = ({
  employee,
  onEdit,
  onDelete,
  onViewDetails,
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs hover:shadow-md hover:border-slate-300 transition-all p-5 flex flex-col justify-between">
      <div>
        {/* Card Header: ID and Status */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
            {employee.employee_id}
          </span>
          <span
            className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${
              employee.status === 'Active'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-rose-50 text-rose-700 border-rose-200'
            }`}
          >
            {employee.status}
          </span>
        </div>

        {/* Name and Designation */}
        <h3
          onClick={() => onViewDetails && onViewDetails(employee)}
          className="text-base font-bold text-slate-900 hover:text-indigo-600 cursor-pointer transition-colors"
        >
          {employee.full_name}
        </h3>
        <p className="text-xs font-medium text-slate-500 mt-0.5">{employee.designation}</p>

        {/* Key Info Badges */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-medium">
            <Building2 className="w-3 h-3" />
            {employee.department}
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
            <Briefcase className="w-3 h-3" />
            {employee.employment_type}
          </span>
        </div>

        {/* Details list */}
        <div className="mt-4 space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-3">
          <div className="flex items-center gap-2 truncate">
            <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <a
              href={`mailto:${employee.email}`}
              className="hover:text-indigo-600 truncate"
              title={employee.email}
            >
              {employee.email}
            </a>
          </div>

          <div className="flex items-center gap-2 truncate">
            <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{employee.phone}</span>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>Joined: {employee.date_of_joining}</span>
          </div>

          {employee.address && (
            <div className="flex items-start gap-2 text-slate-500">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
              <span className="line-clamp-1 text-[11px]">{employee.address}</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer with Salary & Action Buttons */}
      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
        <div>
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Salary</span>
          <span className="text-sm font-bold text-slate-900">
            ₹{Number(employee.salary).toLocaleString('en-IN')}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onEdit(employee)}
            className="p-1.5 rounded-md hover:bg-slate-100 text-slate-600 hover:text-indigo-600 transition-colors"
            title="Edit Employee"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(employee)}
            className="p-1.5 rounded-md hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors"
            title="Delete Employee"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
