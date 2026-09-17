import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { Employee } from '../types';

interface DeleteConfirmModalProps {
  employee: Employee | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (employee: Employee) => Promise<void>;
  isDeleting: boolean;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  employee,
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
}) => {
  if (!isOpen || !employee) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          disabled={isDeleting}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <h3 className="text-lg font-bold text-slate-900">Delete Employee Record</h3>
        <p className="text-sm text-slate-500 mt-2">
          Are you sure you want to delete employee{' '}
          <strong className="text-slate-900">{employee.full_name}</strong> (
          <code className="text-xs bg-slate-100 px-1 py-0.5 rounded text-rose-700">
            {employee.employee_id}
          </code>
          )?
        </p>

        <div className="mt-4 p-3 bg-rose-50 border border-rose-100 rounded-lg text-xs text-rose-800">
          This operation will issue a <code className="font-semibold">DELETE /api/employees/{employee.id}/</code> request to the Django backend and permanently delete this record from the SQLite database.
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            id="cancel-delete-btn"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            id="confirm-delete-btn"
            onClick={() => onConfirm(employee)}
            disabled={isDeleting}
            className="px-4 py-2 text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm transition-colors inline-flex items-center gap-2 disabled:opacity-50"
          >
            {isDeleting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                <span>Confirm & Delete</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
