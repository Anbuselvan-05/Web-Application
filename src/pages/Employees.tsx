import React from 'react';
import { EmployeeList } from '../components/EmployeeList';
import { Employee } from '../types';

interface EmployeesPageProps {
  employees: Employee[];
  isLoading: boolean;
  error: string | null;
  onRefresh: () => void;
  onAddNew: () => void;
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
}

export const Employees: React.FC<EmployeesPageProps> = (props) => {
  return <EmployeeList {...props} />;
};
